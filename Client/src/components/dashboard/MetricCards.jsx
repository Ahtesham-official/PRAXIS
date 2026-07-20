import React from 'react';
import { Play, CheckCircle2, TrendingUp } from 'lucide-react';

export default function MetricCards({ theme, dashboardData }) {
  const data = dashboardData || { totalWatchMinutes: 0, averageScore: 0, totalTopicsCount: 0, avgOverallCompetency: 0 };
  
  const cards = [
    { title: "Watch Time", sub: "Total", value: Math.floor(data.totalWatchMinutes / 60) + "h " + (data.totalWatchMinutes % 60) + "m", unit: "time", stroke: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: <Play className="w-4 h-4 text-blue-500 fill-blue-500/20" />, path: "M5 12 Q20 5 40 15 T80 5 T120 10" },
    { title: "Topics Completed", sub: "Total", value: data.totalTopicsCount, unit: "topics", stroke: "#10b981", bg: "rgba(16,185,129,0.1)", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, path: "M5 15 Q25 18 50 8 T100 12 T120 4" },
    { title: "Average Quiz Score", sub: "Overall", value: data.averageScore + "%", unit: "average", stroke: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: <CheckCircle2 className="w-4 h-4 text-violet-500" />, path: "M5 18 Q30 2 60 14 T100 8 T120 2" },
    { title: "Capstone Competency", sub: "Average", value: data.avgOverallCompetency + "%", unit: "average", stroke: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <TrendingUp className="w-4 h-4 text-amber-500" />, path: "M5 10 Q20 12 40 5 T80 15 T120 8" }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((c, i) => (
        <div key={i} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold tracking-tight text-slate-400">{c.title}</h3>
                <span className="text-[10px] font-semibold text-slate-500">{c.sub}</span>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                {c.icon}
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight">{c.value}</span>
              <span className="text-xs font-bold text-slate-500">{c.unit}</span>
            </div>
          </div>

          {/* Tiny Native Inline SVG Sparkline Vector */}
          <div className="w-full h-10 mt-3 opacity-80">
            <svg viewBox="0 0 120 20" className="w-full h-full" preserveAspectRatio="none">
              <path d={c.path} fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}