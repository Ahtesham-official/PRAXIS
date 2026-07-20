import React from 'react';
import { Calendar, Sun, Moon } from 'lucide-react';

export default function Header({ theme, toggleTheme, userName }) {
  // Dynamically derive and format the current real-time date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          Welcome back, {userName ? userName.split(' ')[0] : 'Guest'}! <span className="animate-bounce">👋</span>
        </h1>
        <p className={`text-sm font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Keep learning, keep growing.
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Unified Dynamic Active Theme Controller */}
        <button 
          onClick={toggleTheme} 
          className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900 text-amber-400' : 'border-slate-200 bg-white text-indigo-950 shadow-sm'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Dynamic Live Date Node Badge */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-mono transition-colors ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
        </div>
      </div>
    </header>
  );
}