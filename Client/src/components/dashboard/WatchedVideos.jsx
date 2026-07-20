import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, ArrowRight, Code, BookOpen, Layers } from 'lucide-react';

const watchedTutorialsMock = [
  {
    id: "py-cli",
    title: "Python for Beginners",
    duration: "2h 45m",
    watchedAt: "June 15, 2026",
    emoji: "🐍",
    capstone: {
      title: "CLI Personal Finance Manager",
      difficulty: "Medium",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      description: "Build a Command Line Interface (CLI) application that helps users track income, expenses, and monthly budgets, storing data in a structured format.",
      tasks: [
        "Create an interactive command menu",
        "Implement JSON/CSV data persistence",
        "Generate weekly expense summaries",
        "Add category search & budget alerts"
      ]
    }
  },
  {
    id: "dsa-avl",
    title: "Data Structures Masterclass",
    duration: "6h 15m",
    watchedAt: "June 12, 2026",
    emoji: "📊",
    capstone: {
      title: "Self-Balancing Tree Visualizer",
      difficulty: "Hard",
      badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      description: "Develop a visualization tool for AVL Trees or Red-Black Trees. Implement insertions, deletions, and show tree balancing rotations in real-time.",
      tasks: [
        "Implement AVL Tree node rotation logic",
        "Build SVG-based tree structure renderer",
        "Animate traversal routes step-by-step",
        "Integrate node lookup metrics visualizer"
      ]
    }
  },
  {
    id: "web-kanban",
    title: "Modern React & Tailwind CSS",
    duration: "4h 10m",
    watchedAt: "June 08, 2026",
    emoji: "⚛️",
    capstone: {
      title: "Collaborative Kanban Board",
      difficulty: "Medium",
      badgeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      description: "Construct a dynamic Kanban board interface supporting drag-and-drop operations, user-defined labels, column customization, and local storage state persistence.",
      tasks: [
        "Implement HTML5 Drag & Drop event system",
        "Create status columns and task details modal",
        "Synchronize changes with browser storage",
        "Add filter tags for task search"
      ]
    }
  },
  {
    id: "db-schema",
    title: "PostgreSQL Database Admin",
    duration: "3h 30m",
    watchedAt: "June 02, 2026",
    emoji: "🗄️",
    capstone: {
      title: "E-Commerce Database Schema",
      difficulty: "Medium",
      badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      description: "Model a transactional database schema for a high-traffic storefront. Write complex queries, indexes, and stored procedures to handle orders and inventories.",
      tasks: [
        "Design schema normalized to 3NF",
        "Write transactions with ACID constraints",
        "Create triggers for auto-updating stock",
        "Build indexing rules for catalog search"
      ]
    }
  }
];

export default function WatchedVideos({ theme, dashboardData }) {
  const navigate = useNavigate();
  const rawSessions = dashboardData?.recentSessions || [];

  // Merge static metadata (emojis, tasks) with dynamic backend session progress
  const watchedTutorials = rawSessions.map((session) => {
    const staticInfo = watchedTutorialsMock.find((t) => t.id === session.videoId);
    return {
      ...session,
      emoji: staticInfo ? staticInfo.emoji : "💻",
      tasks: staticInfo ? staticInfo.capstone.tasks : [
        "Complete the quiz checkpoint questions",
        "Submit all topic explanations",
        "Improve your overall competency"
      ]
    };
  });

  const [selectedId, setSelectedId] = React.useState(null);

  // Auto-select first tutorial when list loads
  React.useEffect(() => {
    if (watchedTutorials.length > 0 && !selectedId) {
      setSelectedId(watchedTutorials[0].id);
    }
  }, [watchedTutorials, selectedId]);

  const activeTutorial = watchedTutorials.find(t => t.id === selectedId);

  return (
    <div className={`p-6 rounded-2xl border transition-colors duration-500 flex flex-col ${
      theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-violet-500" />
        <h2 className="text-base font-black tracking-tight">Watched Videos & Capstones</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1 min-h-[380px]">
        {/* Left column: Watched Videos List (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
            SELECT A COMPLETED VIDEO
          </span>
          <div className="space-y-2 overflow-y-auto pr-1 max-h-[340px] custom-scrollbar">
            {watchedTutorials.map((tutorial) => {
              const isActive = tutorial.id === selectedId;
              return (
                <button
                  key={tutorial.id}
                  onClick={() => setSelectedId(tutorial.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-violet-500/10 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                        : 'bg-violet-50 border-violet-200 shadow-sm'
                      : theme === 'dark'
                        ? 'bg-slate-950/20 border-slate-900 hover:bg-slate-900/60'
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0 ${
                    theme === 'dark' ? 'bg-slate-950' : 'bg-white'
                  }`}>
                    {tutorial.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs font-bold truncate ${
                      isActive
                        ? theme === 'dark' ? 'text-violet-400' : 'text-violet-700'
                        : theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {tutorial.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-slate-400">
                      <span>{tutorial.duration}</span>
                      <span>•</span>
                      <span>{tutorial.watchedAt}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Capstone Project Card (7 cols) */}
        <div className="md:col-span-7">
          {activeTutorial ? (
            <div className={`h-full flex flex-col p-5 rounded-2xl border transition-all duration-500 animate-fadeIn overflow-y-auto custom-scrollbar ${
              theme === 'dark'
                ? 'bg-slate-950/50 border-slate-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'
                : 'bg-slate-50/60 border-slate-100 shadow-sm'
            }`}>
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-violet-500 uppercase tracking-wider">
                      CAPSTONE PROJECT
                    </span>
                    <h4 className="text-sm font-black tracking-tight mt-0.5">
                      {activeTutorial.title} Capstone
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 text-emerald-500 bg-emerald-500/10 border-emerald-500/20`}>
                    Score: {activeTutorial.capstoneScore}%
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-5">
                  Complete the dynamically generated topics for this video tutorial to increase your overall competency score.
                </p>

                {/* Checklist */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    TASKS GIVEN BY MENTOR
                  </span>
                  <ul className="space-y-2">
                    {activeTutorial.tasks && activeTutorial.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-[11px] font-bold text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 font-bold">
              <Layers className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
              <p className="text-xs">Select a tutorial from the left list to review its Capstone project card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
