import React from 'react';

export default function PerformanceChart({ theme, dashboardData }) {
  const chartData = dashboardData?.chartData || [];
  
  // Format dates for labels
  const points = chartData.map(c => ({
    label: new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: c.score || 0,
    avg: 50 // Placeholder average for reference
  }));

  // Fallback if no data
  if (points.length === 0) {
    points.push({ label: "N/A", score: 0, avg: 0 });
  }

  const svgWidth = 600;
  const svgHeight = 160;
  
  const generatePolyline = (dataPoints) => {
    if (dataPoints.length === 1) return `0,${svgHeight - (dataPoints[0].score * (svgHeight / 100))} 600,${svgHeight - (dataPoints[0].score * (svgHeight / 100))}`;
    const step = svgWidth / (dataPoints.length - 1);
    return dataPoints.map((p, i) => {
      const x = i * step;
      const y = svgHeight - (p.score * (svgHeight / 100));
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className={`p-6 rounded-2xl border flex flex-col justify-between w-full min-w-0 transition-colors ${
      theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-black tracking-tight">Past Performance</h2>
        <div className="flex items-center gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-slate-400">Scores (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400">Average (%)</span>
          </div>
        </div>
      </div>

      {/* Render Chart Coordinate Grid */}
      <div className="relative w-full h-48 flex items-end justify-between px-4 pb-2 group">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono font-bold text-slate-400">
          {['100%', '75%', '50%', '25%', '0%'].map((val, i) => (
            <div key={i} className="w-full flex items-center gap-2 h-0">
              <span className="w-8 text-right">{val}</span>
              <div className={`flex-1 h-[1px] border-b border-dashed ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`} />
            </div>
          ))}
        </div>

        <svg viewBox="0 0 600 160" className="absolute inset-x-4 bottom-6 w-[calc(100%-2rem)] h-36 overflow-visible pointer-events-none">
          {/* User Score Polyline */}
          <polyline points={generatePolyline(points)} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {points.map((p, i) => {
            const step = points.length === 1 ? 0 : 600 / (points.length - 1);
            const cx = i * step;
            const cy = 160 - (p.score * 1.6);
            return <circle key={i} cx={cx} cy={cy} r="4" fill="#8b5cf6" />;
          })}
        </svg>

        {points.map((p, i) => (
          <div key={i} className="flex flex-col items-center flex-1 z-10 relative">
            <div className="text-[10px] font-bold space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-12 text-center">
              <div className="text-violet-500">{p.score}%</div>
              <div className="text-amber-500">{p.avg}%</div>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-2">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}