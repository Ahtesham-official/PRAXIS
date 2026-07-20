import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Terminal, ArrowRight, Sparkles } from 'lucide-react';
import Pipeline3D from './Pipeline3D';

export default function UrlForm({ videoUrl, setVideoUrl, onSubmit, theme }) {
  const scopeRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const leftCardBobRef = useRef(null);
  const rightCardBobRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hero-heading', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out' }, '-=0.4')
      .from('.hero-desc', { opacity: 0, y: 15, duration: 0.6 }, '-=0.3')
      .from('.hero-input-box', { scale: 0.97, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.2')
      .from('.hero-pipeline', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .from('.floating-card-left', { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.floating-card-right', { x: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    // Gentle idle bobbing motion on wrappers
    gsap.to(leftCardBobRef.current, {
      y: '+=12',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to(rightCardBobRef.current, {
      y: '-=12',
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4
    });
  }, { scope: scopeRef });

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1

      // Subtle 3D parallax transforms
      if (leftCardRef.current) {
        gsap.to(leftCardRef.current, {
          x: x * 25,
          y: y * 25,
          rotationX: -y * 12,
          rotationY: x * 12,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (rightCardRef.current) {
        gsap.to(rightCardRef.current, {
          x: -x * 25,
          y: -y * 25,
          rotationX: y * 12,
          rotationY: -x * 12,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  return (
    <div ref={scopeRef} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {theme === 'dark' ? (
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
      ) : (
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
      )}
      
      {/* Decorative Floating Left Card */}
      <div ref={leftCardBobRef} className="floating-card-left absolute left-[4%] top-[25%] hidden xl:block pointer-events-none z-0">
        <div 
          ref={leftCardRef} 
          className={`w-64 p-5 rounded-2xl border backdrop-blur-md shadow-2xl transition-colors duration-500 ${
            theme === 'dark' 
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' 
              : 'bg-white/70 border-slate-200 text-slate-700'
          }`}
          style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="space-y-2.5 font-mono text-[11px] text-left mt-3">
            <div className="flex items-center gap-1.5 text-cyan-500 font-semibold">
              <span>📂</span> <span>src/components</span>
            </div>
            <div className="flex items-center gap-1.5 pl-4 text-emerald-500">
              <span>📄</span> <span>AuthModal.jsx</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10">100%</span>
            </div>
            <div className="flex items-center gap-1.5 pl-4 text-slate-400">
              <span>📄</span> <span>UrlForm.jsx</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10">ACTIVE</span>
            </div>
            <div className={`h-[1px] my-2 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-500">compiled: 12ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Floating Right Card */}
      <div ref={rightCardBobRef} className="floating-card-right absolute right-[4%] bottom-[25%] hidden xl:block pointer-events-none z-0">
        <div 
          ref={rightCardRef} 
          className={`w-64 p-5 rounded-2xl border backdrop-blur-md shadow-2xl transition-colors duration-500 ${
            theme === 'dark' 
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' 
              : 'bg-white/70 border-slate-200 text-slate-700'
          }`}
          style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
        >
          <div className="space-y-3 text-left">
            <div className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">// TELEMETRY FEED</div>
            <div className={`text-xs font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>Active Retention</div>
            <div className="relative pt-1">
              <div className="flex mb-1.5 items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold inline-block py-0.5 px-2 rounded-full bg-cyan-500/10 text-cyan-400 uppercase">
                    Competency
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-cyan-400">
                    88%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-800/30">
                <div style={{ width: "88%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-400"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-2 font-mono text-[10px]">
              <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
                <div className="text-[8px] text-slate-400">TIME SAVED</div>
                <div className="font-bold text-cyan-400">4.2 Hrs</div>
              </div>
              <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
                <div className="text-[8px] text-slate-400">MODULES</div>
                <div className="font-bold text-cyan-400">12 Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`hero-badge inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider mb-6 transition-colors shadow-inner ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-cyan-400' : 'bg-slate-200/50 border-slate-300 text-slate-700'
      }`}>
        {theme === 'dark' ? <Terminal className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-600" />} 
        PRAXIS COMPLIANCE PLATFORM
      </div>

      <h1 className={`hero-heading text-6xl md:text-8xl font-black tracking-tight text-center leading-none ${
        theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400' : 'text-black'
      }`}>
        Learn Less.
      </h1>
      <h1 className={`hero-heading text-5xl md:text-7xl font-extrabold tracking-tight text-center mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        Build More.
      </h1>

      <p className={`hero-desc font-medium text-base md:text-lg mt-6 text-center max-w-md leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        Converting passive learning into native repos.
      </p>

      <form onSubmit={onSubmit} className='hero-input-box relative mt-10 w-full max-w-2xl px-2 group'>
        <div className={`absolute inset-0 rounded-3xl blur-md opacity-20 group-focus-within:opacity-40 transition-all duration-300 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-black'}`} />
        <input 
          type="url" 
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={`relative h-16 w-full rounded-2xl outline-none border p-5 pr-20 text-base shadow-2xl transition-all ${
            theme === 'dark' 
              ? 'border-slate-800 bg-slate-900/80 text-white focus:border-cyan-500 focus:bg-slate-950' 
              : 'border-slate-200 bg-white text-black focus:border-black'
          }`} 
          placeholder='Paste your YouTube video link here...' 
        />
        <button 
          type="submit" 
          className={`absolute right-4 top-[15%] h-11 w-14 flex items-center justify-center rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg ${
            theme === 'dark' ? 'bg-white text-black hover:bg-cyan-400' : 'bg-black text-white hover:bg-slate-800'
          }`}
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* 3D Isometric Pipeline Vector Animation */}
      <div className="hero-pipeline w-full mt-4 max-w-4xl relative z-10">
        <Pipeline3D theme={theme} />
      </div>
    </div>
  );
}