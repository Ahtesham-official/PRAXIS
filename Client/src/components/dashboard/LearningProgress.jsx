import React from 'react';

const courses = [
  { name: "Introduction to Python", progress: 75, color: "bg-violet-600" },
  { name: "Data Structures & Algorithms", progress: 60, color: "bg-violet-600" },
  { name: "Web Development Basics", progress: 40, color: "bg-violet-600" },
  { name: "Database Management", progress: 30, color: "bg-violet-600" }
];

export default function LearningProgress({ theme }) {
  return (
    <div className={`p-6 rounded-2xl border h-full flex flex-col justify-between transition-colors ${
      theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      <div>
        <h2 className="text-base font-black tracking-tight mb-6">Past Learning</h2>
        <div className="space-y-5">
          {courses.map((course, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{course.name}</span>
                <span className="text-slate-400">{course.progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${course.color}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="text-xs font-bold text-violet-500 hover:text-violet-400 transition-colors mt-6 text-left inline-flex items-center gap-1 cursor-pointer">
        View all courses →
      </button>
    </div>
  );
}