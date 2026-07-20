import React from 'react';
import { Sliders, RefreshCw, Layers } from 'lucide-react';

const steps = [
  { icon: <Sliders />, label: "01 / PIPELINE INGESTION", title: "Target the Source", desc: "Submit your system streaming endpoint. Our ingestion systems securely tap raw audio profiles." },
  { icon: <RefreshCw />, label: "02 / DATA DECONSTRUCT", title: "Generate Context Pools", desc: "AI models run transcript checks, chunk timing nodes, and structure matching documentation schemas." },
  { icon: <Layers />, label: "03 / MOUNT PLAYGROUND", title: "Launch Custom Workspace", desc: "Step inside your live generated environment complete with custom runtime task lists." }
];

export default function WorkflowTimeline({ theme }) {
  return (
    <section className={`scroll-reveal py-32 border-t transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-slate-100 border-slate-200'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-xs font-mono tracking-widest text-cyan-500 font-bold uppercase">// CORE AUTOMATION INTERFACE</span>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Operational Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className={`border p-8 rounded-2xl relative group transition-all ${
              theme === 'dark' ? 'bg-slate-900/20 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}>
              <div className={`w-8 h-8 mb-6 stroke-[1.5] ${theme === 'dark' ? 'text-cyan-400' : 'text-black'}`}>
                {step.icon}
              </div>
              <span className="text-[10px] font-mono tracking-widest font-bold text-slate-400">{step.label}</span>
              <h3 className={`text-xl font-bold tracking-tight mt-2 mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}