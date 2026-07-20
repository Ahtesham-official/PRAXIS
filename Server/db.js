import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initial empty DB structure
const initialData = {
  courses: {},
  sessions: {}, // userId -> [ { videoId, title, duration, watchedAt, capstoneScore, totalWatchMinutes, completedMilestones: [] } ]
  quizzes: {}   // userId -> [ { videoId, topicName, questionType, score, date } ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return JSON.parse(JSON.stringify(initialData)); // deep clone
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Ensure all required top-level keys exist (handles old DB files)
    return {
      courses: parsed.courses || {},
      sessions: parsed.sessions || {},
      quizzes: parsed.quizzes || {}
    };
  } catch (err) {
    console.error("Error reading database file, returning default structure:", err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
}

export const db = {
  // Course Management
  getCourse(videoId) {
    const data = readDb();
    return data.courses[videoId] || null;
  },

  saveCourse(videoId, courseData) {
    const data = readDb();
    data.courses[videoId] = {
      videoId,
      ...courseData,
      updatedAt: new Date().toISOString()
    };
    writeDb(data);
    return data.courses[videoId];
  },

  // Sessions Management (Recent sessions on dashboard)
  getUserSessions(userId) {
    const data = readDb();
    return data.sessions[userId] || [];
  },

  // Find all user IDs who have a session for a specific videoId
  getUsersForVideo(videoId) {
    const data = readDb();
    const userIds = [];
    for (const uid of Object.keys(data.sessions)) {
      const hasSession = data.sessions[uid].some(s => s.videoId === videoId);
      if (hasSession) userIds.push(uid);
    }
    // Always include 'anonymous' as a safety fallback
    if (!userIds.includes('anonymous')) userIds.push('anonymous');
    return userIds;
  },

  saveUserSession(userId, videoId, sessionUpdate) {
    const data = readDb();
    if (!data.sessions[userId]) {
      data.sessions[userId] = [];
    }

    const sessionIdx = data.sessions[userId].findIndex(s => s.videoId === videoId);
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (sessionIdx > -1) {
      data.sessions[userId][sessionIdx] = {
        ...data.sessions[userId][sessionIdx],
        ...sessionUpdate,
        videoId,
        watchedAt: now
      };
    } else {
      data.sessions[userId].push({
        videoId,
        title: sessionUpdate.title || 'Dynamic Video Tutorial',
        duration: sessionUpdate.duration || '0m',
        watchedAt: now,
        capstoneScore: sessionUpdate.capstoneScore || 0,
        totalWatchMinutes: sessionUpdate.totalWatchMinutes || 0,
        completedMilestones: sessionUpdate.completedMilestones || [],
        ...sessionUpdate
      });
    }

    writeDb(data);
    return data.sessions[userId];
  },

  // Quiz Grades Management
  getUserQuizzes(userId) {
    const data = readDb();
    return data.quizzes[userId] || [];
  },

  saveQuizAttempt(userId, videoId, topicName, questionType, score) {
    const data = readDb();
    if (!data.quizzes[userId]) {
      data.quizzes[userId] = [];
    }

    data.quizzes[userId].push({
      videoId,
      topicName,
      questionType,
      score,
      date: new Date().toISOString()
    });

    writeDb(data);
    return data.quizzes[userId];
  }
};
