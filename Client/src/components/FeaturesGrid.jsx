import React from 'react';
import { Eye, ShieldCheck, Cpu, Database } from 'lucide-react';

const features = [
  { icon: <Eye />, title: "Contextual Telemetry", desc: "Perfect video playback positioning mapped alongside your custom active compiler track." },
  { icon: <ShieldCheck />, title: "Automated Sandbox", desc: "Write runtime logic components that evaluate and pass assertions instantly." },
  { icon: <Cpu />, title: "AI Checkpoints", desc: "Adaptive validation triggers analyze logic block structures to check user retention maps." },
  { icon: <Database />, title: "Compiling Workspace", desc: "Access code blocks, file structure layouts, and interactive terminals inside one integrated space." }
];

export default function FeaturesGrid({ theme }) {
  const handleMouseMove = (e) => {
    if (theme !== 'dark') return;
    const cards = document.getElementsByClassName('glow-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <section onMouseMove={handleMouseMove} className="scroll-reveal py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-mono tracking-widest text-cyan-500 font-bold uppercase">// CAPABILITIES DECK</span>
        <h2 className={`text-3xl md:text-5xl font-black tracking-tight mt-1 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Supercharged for core engineers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, i) => (
          <div 
            key={i} 
            className={`glow-card relative border p-8 rounded-2xl transition-all duration-300 overflow-hidden ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-slate-800 before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:bg-[radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(34,211,238,0.06),transparent_40%)]' 
                : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 border rounded-xl flex items-center justify-center mb-6 transition-all ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200 text-black'
            }`}>
              {React.cloneElement(feat.icon, { className: 'w-5 h-5' })}
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h3>
            <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}