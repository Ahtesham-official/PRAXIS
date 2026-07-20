import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import { getYoutubeTitle, generateCourseTopics, evaluateStudentAnswer } from './ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 1. GET /api/progress/:videoId ────────────────────────────────────────────
// Retrieve topics and milestones for a workspace course.
// If the course doesn't exist yet, generates it from the YouTube video title.
app.get('/api/progress/:videoId', async (req, res) => {
  const { videoId } = req.params;
  try {
    let course = db.getCourse(videoId);

    if (!course) {
      console.log(`Course not found for videoId: ${videoId}. Auto-generating...`);
      const title = await getYoutubeTitle(videoId);
      const topics = await generateCourseTopics(videoId, title);
      course = db.saveCourse(videoId, { title, topics });
    }

    res.json({
      success: true,
      data: {
        videoId: course.videoId,
        title: course.title,
        topics: course.topics
      }
    });
  } catch (error) {
    console.error("Error in GET /api/progress/:videoId:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 2. POST /api/ai/generate ─────────────────────────────────────────────────
// Triggered when a user enters a YouTube link on the dashboard.
// Generates a new course workspace and initializes the user's session.
app.post('/api/ai/generate', async (req, res) => {
  const { sessionId, youtubeUrl, userId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, error: "Missing sessionId (videoId)" });
  }

  const activeUserId = userId || 'anonymous';

  try {
    console.log(`[generate] Generating course for videoId: ${sessionId}, user: ${activeUserId}`);
    const title = await getYoutubeTitle(sessionId);
    console.log(`[generate] Video title resolved: "${title}"`);
    const topics = await generateCourseTopics(sessionId, title);
    console.log(`[generate] Generated ${topics.length} topics.`);

    // Persist course
    db.saveCourse(sessionId, { title, topics });

    // Initialize user session for this course
    db.saveUserSession(activeUserId, sessionId, {
      title,
      duration: '0m',
      totalWatchMinutes: 0,
      capstoneScore: 0,
      completedMilestones: []
    });

    res.json({ success: true, title, topicsCount: topics.length });
  } catch (error) {
    console.error("Error in POST /api/ai/generate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 3. PATCH /api/ai/:videoId/topics/:topicName/answer ───────────────────────
// Submit and grade a student's text or voice (Feynman) answer.
app.patch('/api/ai/:videoId/topics/:topicName/answer', async (req, res) => {
  const { videoId, topicName } = req.params;
  const { studentAnswer, questionType, userId } = req.body;

  if (!studentAnswer || typeof studentAnswer !== 'string' || !studentAnswer.trim()) {
    return res.status(400).json({ success: false, error: "Missing or empty studentAnswer" });
  }

  const decodedTopicName = decodeURIComponent(topicName);

  try {
    const course = db.getCourse(videoId);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found. Please generate the course first." });
    }

    // Find the topic & the appropriate question text
    const topic = course.topics.find(t => t.topicName === decodedTopicName);
    if (!topic) {
      console.warn(`Topic "${decodedTopicName}" not found in course ${videoId}. Available: ${course.topics.map(t => t.topicName).join(', ')}`);
      return res.status(404).json({ success: false, error: `Topic "${decodedTopicName}" not found in course` });
    }

    const questionText = questionType === 'feynman'
      ? (topic.feynmanQuestionText || topic.description)
      : (topic.textQuestionText || topic.description);

    console.log(`[answer] Evaluating ${questionType} answer for video: ${videoId}, topic: "${decodedTopicName}"`);
    const grading = await evaluateStudentAnswer(questionText, studentAnswer.trim(), questionType);
    console.log(`[answer] Score: ${grading.score}`);

    // Determine which users to update (prefer the requesting user, then scan all)
    const targetUserIds = userId ? [userId] : db.getUsersForVideo(videoId);

    // Save quiz attempt and update progress for all target users
    targetUserIds.forEach(uid => {
      db.saveQuizAttempt(uid, videoId, decodedTopicName, questionType, grading.score);

      // Only update milestone progress on passing score (>= 50)
      if (grading.score >= 50) {
        const userSessions = db.getUserSessions(uid);
        const session = userSessions.find(s => s.videoId === videoId);

        if (session) {
          let completed = session.completedMilestones || [];
          const topicIndex = course.topics.findIndex(t => t.topicName === decodedTopicName);

          if (topicIndex > -1 && !completed.includes(topicIndex)) {
            completed = [...completed, topicIndex];
          }

          const totalTopics = course.topics.length || 1;
          const capstoneScore = Math.floor((completed.length / totalTopics) * 100);
          // 15 minutes watch time per milestone passed
          const totalWatchMinutes = completed.length * 15;

          db.saveUserSession(uid, videoId, {
            completedMilestones: completed,
            capstoneScore,
            totalWatchMinutes
          });
        } else {
          // Create a session entry for this user if it doesn't exist yet
          db.saveUserSession(uid, videoId, {
            title: course.title || 'Video Tutorial',
            duration: '0m',
            totalWatchMinutes: 15,
            capstoneScore: Math.floor((1 / (course.topics.length || 1)) * 100),
            completedMilestones: [course.topics.findIndex(t => t.topicName === decodedTopicName)].filter(i => i > -1)
          });
        }
      }
    });

    res.json({
      success: true,
      score: grading.score,
      feedback: grading.feedback
    });
  } catch (error) {
    console.error("Error grading answer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 4. GET /api/dashboard/user/:userId ───────────────────────────────────────
// Retrieve aggregated user stats and metrics for the dashboard page.
app.get('/api/dashboard/user/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const sessions = db.getUserSessions(userId);
    const quizzes = db.getUserQuizzes(userId);

    // Aggregate metrics
    let totalWatchMinutes = 0;
    let totalTopicsCount = 0;
    let capstoneScoreSum = 0;

    sessions.forEach(s => {
      totalWatchMinutes += s.totalWatchMinutes || 0;
      totalTopicsCount += (s.completedMilestones || []).length;
      capstoneScoreSum += s.capstoneScore || 0;
    });

    let totalScoreSum = 0;
    quizzes.forEach(q => { totalScoreSum += q.score; });

    const quizCount = quizzes.length;
    const averageScore = quizCount > 0 ? Math.floor(totalScoreSum / quizCount) : 0;
    const avgOverallCompetency = sessions.length > 0 ? Math.floor(capstoneScoreSum / sessions.length) : 0;

    // Build chart data from quiz attempts (last 7, chronological)
    const chartData = quizzes
      .map(q => ({ date: q.date, score: q.score, topicName: q.topicName }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);

    res.json({
      success: true,
      data: {
        totalWatchMinutes,
        averageScore,
        totalTopicsCount,
        avgOverallCompetency,
        recentSessions: sessions,
        chartData
      }
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/user/:userId:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Praxis Backend Server running at http://localhost:${PORT}`);
  console.log(`   MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? '✅ configured' : '❌ MISSING'}`);
  console.log(`   GROQ_API_KEY:    ${process.env.GROQ_API_KEY ? '✅ configured' : '❌ MISSING'}\n`);
});
