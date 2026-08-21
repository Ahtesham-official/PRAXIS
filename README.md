# PRAXIS 🎓

### AI-Powered Interactive Learning from YouTube Videos

**PRAXIS** is an AI-powered web platform developed by **Team Zenova** that transforms passive YouTube learning into an **interactive, checkpoint-based learning experience**.

Instead of simply watching an educational video from start to finish, PRAXIS understands the video's content, identifies important learning checkpoints, pauses the video at meaningful moments, and actively tests the learner's understanding through **AI-generated questions in both text and voice formats**.

> **Watch less passively. Learn more actively.**

---

## 🚀 What is PRAXIS?

Students frequently use YouTube as a primary source for learning, but conventional video platforms encourage passive consumption. A learner can watch an entire lecture without actually understanding or remembering the concepts covered.

PRAXIS solves this problem by creating an **AI learning layer on top of YouTube videos**.

The workflow is simple:

```text
YouTube Video
      ↓
Video Transcript Generation
      ↓
AI Content Understanding
      ↓
Topic & Concept Extraction
      ↓
Intelligent Checkpoint Generation
      ↓
Video Automatically Pauses
      ↓
AI Generates Questions
      ↓
Text + Voice Interaction
      ↓
Learner Responds
      ↓
AI Evaluates Understanding
      ↓
Continue Learning
```

---

## ✨ Key Features

### 🎥 YouTube-Based Learning

Users can paste a YouTube video link and use the video as an interactive learning resource.

PRAXIS is designed for:

* Lectures
* Tutorials
* Programming videos
* Educational explainers
* Technical courses
* Revision videos
* Concept-based learning content

---

### 📝 AI-Powered Transcript Generation

Once a video is provided, PRAXIS generates or retrieves its transcript and processes the textual content using AI.

The transcript becomes the foundation for understanding:

* Topics
* Subtopics
* Concepts
* Important explanations
* Examples
* Definitions
* Key learning points

---

### 🧠 Intelligent Checkpoint Generation

PRAXIS doesn't simply divide a video into fixed time intervals.

Instead, the AI analyzes the transcript and identifies **meaningful learning checkpoints** based on the concepts being taught.

For example:

```text
00:00 → Introduction
04:35 → Variables
09:20 → Data Types
15:10 → Conditional Statements
23:40 → Loops
```

When the learner reaches a checkpoint, PRAXIS automatically pauses the video.

This creates a natural **learn → pause → recall → continue** cycle.

---

### ⏸️ Automatic Video Pausing

At every generated checkpoint:

```text
Video Playing
     ↓
Checkpoint Reached
     ↓
Video Pauses
     ↓
AI Question Appears
```

The learner must interact with the checkpoint before continuing.

This helps prevent the common habit of watching long educational videos without actively processing the information.

---

### 🤖 AI-Generated Questions

PRAXIS dynamically generates questions based on **only the concepts covered up to the current checkpoint**.

For example, if the video has covered:

> Variables → Data Types → Operators

the AI will generate questions related to these concepts rather than asking about topics that haven't been taught yet.

Possible question types include:

* Conceptual questions
* Multiple-choice questions
* Short-answer questions
* Application-based questions
* Scenario-based questions
* Recall questions

---

### 🎙️ Voice-Based Interaction

PRAXIS supports an interactive voice learning experience.

The AI can **ask questions through voice**, allowing learners to respond without relying entirely on traditional text-based interaction.

This makes the learning process more conversational and engaging.

---

### 💬 Text-Based Interaction

Users can also interact with PRAXIS through text.

The system can:

* Ask questions
* Accept answers
* Evaluate responses
* Provide feedback
* Explain concepts
* Continue the learning session

---

### 📊 Understanding-Based Learning

PRAXIS focuses on **active recall and continuous understanding** rather than simply measuring video completion.

The core philosophy is:

```text
Consume → Recall → Evaluate → Understand → Continue
```

---

## 🧩 Core Architecture

A simplified architecture of PRAXIS:

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ YouTube Video    │
                    │      URL         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Transcript       │
                    │ Generation       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ AI Content       │
                    │ Analysis         │
                    └────────┬─────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Topic Extraction│   │ Key Concepts    │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                  ┌────────────────────┐
                  │ Checkpoint Engine  │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Video Automatically│
                  │      Pauses         │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Question Generator │
                  └─────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Text Interaction│   │ Voice Interaction│
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                  ┌────────────────────┐
                  │ Answer Evaluation  │
                  │    & Feedback      │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Resume Video       │
                  └────────────────────┘
```

---

## 🧠 How PRAXIS Works

### 1. User Provides a Video

The learner pastes a YouTube URL into PRAXIS.

### 2. Transcript is Generated

The video's spoken content is converted into text.

### 3. AI Understands the Content

The transcript is analyzed to identify:

* Topics
* Subtopics
* Concepts
* Important explanations
* Concept boundaries

### 4. Checkpoints are Created

The AI determines appropriate points where the learner should be tested.

These checkpoints are associated with timestamps and concepts.

### 5. Video Plays

The learner watches the video normally.

### 6. Checkpoint is Reached

When the video reaches an AI-generated checkpoint:

```text
▶ Playing
   ↓
⏸ Checkpoint
   ↓
🧠 Question
   ↓
🎙️ / 💬 Answer
   ↓
🤖 AI Evaluation
   ↓
▶ Continue
```

### 7. AI Evaluates the Learner

The learner's response is analyzed against the concepts already taught.

The AI can provide feedback and clarification where appropriate.

### 8. Learning Continues

After the interaction is completed, the learner can continue watching the video until the next checkpoint.

---

## 💡 Problem PRAXIS Solves

Traditional video-based learning has several limitations:

| Traditional Learning                  | PRAXIS                        |
| ------------------------------------- | ----------------------------- |
| Passive video consumption             | Active learning               |
| Fixed video experience                | Adaptive checkpoints          |
| No understanding verification         | AI-powered questioning        |
| Questions usually come after learning | Questions during learning     |
| Manual note-taking                    | AI understands the transcript |
| Text-only learning tools              | Text + Voice interaction      |
| Completion-focused                    | Understanding-focused         |

The major idea behind PRAXIS is:

> **Don't wait until the end of a lecture to discover that you didn't understand it.**

---

## 🎯 Target Users

PRAXIS can be useful for:

* 👨‍🎓 College students
* 🧑‍💻 Programming learners
* 📚 Competitive exam aspirants
* 🧑‍🏫 Self-learners
* 🔬 Technical learners
* 🌐 Online course learners
* 📖 Students preparing for examinations

---

## 🌟 Why PRAXIS?

YouTube already provides an enormous amount of educational content.

The problem isn't the **lack of content**.

The problem is the **lack of active engagement with that content**.

PRAXIS bridges this gap by converting:

```text
YouTube Video
      +
AI Understanding
      +
Active Recall
      +
Voice Interaction
      +
Real-Time Checkpoints
```

into an **interactive learning experience**.

---

## 🛠️ Technology Stack

> Update this section according to the technologies actually used in your implementation.

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Tailwind CSS

### Backend

* Node.js
* Express.js

### AI / ML

* Large Language Model (LLM)
* AI-powered transcript analysis
* AI question generation
* AI answer evaluation
* Speech-to-Text
* Text-to-Speech

### APIs / Services

* YouTube integration
* Transcript processing
* AI APIs
* Voice processing APIs

### Database

* MongoDB

---

## 📁 Project Structure

```text
PRAXIS/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ahtesham-official/PRAXIS.git
cd PRAXIS
```

### 2. Install Dependencies

```bash
cd Client
npm install
```

```bash
cd ../Server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MISTRAL_API_KEY= enter_your_mistral_api_key
GROQ_API_KEY=enter_your_groq_api_key
```

### 4. Start the Backend

```bash
npm run dev
```

### 5. Start the Frontend

```bash
cd ../Client
npm run dev
```

Open the local development URL displayed by Vite.

---

## 🔄 Example User Journey

```text
User opens PRAXIS
        ↓
Pastes YouTube lecture URL
        ↓
PRAXIS processes the transcript
        ↓
AI identifies learning topics
        ↓
AI creates checkpoints
        ↓
User starts watching
        ↓
Checkpoint #1 reached
        ↓
Video pauses
        ↓
AI asks a question
        ↓
User answers through voice/text
        ↓
AI evaluates response
        ↓
Feedback is provided
        ↓
Video resumes
        ↓
Checkpoint #2
        ↓
      ...
        ↓
Video completed
```

---

## 🧪 Example

Suppose a student enters a YouTube video titled:

> **"Introduction to Java Programming"**

The AI may understand the transcript as:

```text
Topic 1 → Java Introduction
Topic 2 → Variables
Topic 3 → Data Types
Topic 4 → Operators
Topic 5 → Conditional Statements
```

PRAXIS could generate checkpoints such as:

```text
Checkpoint 1
Timestamp: 05:20
Covered Topics:
- Java Introduction

Question:
"What is Java primarily used for?"

        ↓

Checkpoint 2
Timestamp: 12:45
Covered Topics:
- Java Introduction
- Variables
- Data Types

Question:
"What is the difference between a variable and a data type?"

        ↓

Checkpoint 3
Timestamp: 21:30
Covered Topics:
- Java Introduction
- Variables
- Data Types
- Operators

Question:
"How would you use an operator to compare two values?"
```

This ensures that questions remain aligned with the **learning progress of the video**.

---

## 🔮 Future Scope

PRAXIS can be extended beyond YouTube-based learning.

Potential future features include:

* 📈 Personalized learner analytics
* 🧠 Adaptive difficulty
* 🎯 Weak-topic detection
* 📊 Learning progress dashboards
* 📝 Automatic notes generation
* 📑 AI-generated summaries
* 🃏 Flashcard generation
* 🔁 Spaced repetition
* 🏆 Gamification and learning streaks
* 👥 Classroom and teacher dashboards
* 🌍 Multi-language learning
* 📱 Mobile application
* 🤖 Personalized AI tutor
* 📚 Integration with online courses and educational platforms

---

## 🏆 Vision

PRAXIS aims to change the way students consume educational videos.

Instead of:

> **Watch → Finish → Forget**

we want learners to experience:

> **Watch → Think → Recall → Respond → Understand → Continue**

Our vision is to make every educational video feel less like a lecture and more like a **personal interactive classroom**.

---

## 👥 Team Zenova

**PRAXIS** is developed by **Team Zenova** with the goal of building technology that makes digital learning more engaging, interactive, and effective.

### Team Members

* **Adityapratap Singh** — *Frontend Developer and UI/UX Designer*
* **Ahtesham Shaikh** — *[Role]*
* **Rajdeep Yadav** — *[Role]*

---

## 🤝 Contributing

Contributions, suggestions, and ideas are welcome.

If you would like to contribute:

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push the branch
git push origin feature/your-feature

# Create a Pull Request
```

---

## 📜 License

This project is currently developed as an educational/academic project by **Team Zenova**.

Add an appropriate open-source license here if the project is later released under one.

---

<p align="center">

### PRAXIS — Learn. Interact. Understand.

**Built with ❤️ by Team Zenova**

</p>
