import React from 'react';
import { Clock } from 'lucide-react';

export default function WatchTimeMetrics({ theme, dashboardData }) {
  const data = dashboardData || { totalWatchMinutes: 0 };
  const h = Math.floor(data.totalWatchMinutes / 60);
  const m = data.totalWatchMinutes % 60;
  
  const limits = [
    { label: "Overall Watch Time", value: `${h}h ${m}m`, progress: Math.min((data.totalWatchMinutes / 600) * 100, 100), color: "bg-violet-600" },
    { label: "Topics Completion", value: `${dashboardData?.totalTopicsCount || 0} topics`, progress: Math.min(((dashboardData?.totalTopicsCount || 0) / 50) * 100, 100), color: "bg-emerald-500" }
  ];


  return (
    <div className="w-full space-y-3">
      <h2 className="text-xs font-bold tracking-wider font-mono text-slate-400 uppercase">// AVERAGE WATCH TIME</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {limits.map((l, i) => (
          <div key={i} className={`p-5 rounded-2xl border flex items-center gap-4 transition-colors ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold text-slate-500">{l.label}</span>
                <span className="text-lg font-black tracking-tight">{l.value}</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${l.color}`}
                  style={{ width: `${l.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}