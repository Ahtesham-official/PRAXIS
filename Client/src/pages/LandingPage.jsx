import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from '../components/Navbar';
import UrlForm from '../components/UrlForm';
import FeaturesGrid from '../components/FeaturesGrid';
import WorkflowTimeline from '../components/WorkflowTimeline';
import Footer from '../components/Footer';
import PipelineModal from '../components/PipelineModal';
import AuthModal from '../components/AuthModal';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ authView, setAuthView, showPassword, setShowPassword, theme, toggleTheme, session }) {
  console.log("Supabase Connected:", supabase);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const backendReadyRef = useRef(false);
  const derivedIdRef = useRef('');
  
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const pipelineSteps = [
    "Triggering YouTube iFrame API...",
    "Extracting Video Context & Telemetry...",
    "Fetching Transcript Records...",
    "AI Layer: Generating Learning Modules...",
    "AI Layer: Compiling Checkpoint Questions...",
    "Success! Loading Workspace Suite..."
  ];

  // Pipeline execution loop tracker
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < pipelineSteps.length - 1) {
            return prev + 1;
          } else {
            if (backendReadyRef.current) {
              clearInterval(interval);
              setTimeout(() => {
                setIsProcessing(false);
                setVideoUrl('');
                navigate(`/workspace/${derivedIdRef.current}`);
              }, 800);
            }
            return prev;
          }
        });
      }, 1200); 
    }
    return () => clearInterval(interval);
  }, [isProcessing, videoUrl, navigate, pipelineSteps.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    const reveals = gsap.utils.toArray('.scroll-reveal');
    reveals.forEach((element) => {
      gsap.fromTo(element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [theme] });

  return (
    <div 
      ref={containerRef} 
      className={`relative min-h-screen font-sans transition-colors duration-500 selection:bg-cyan-500/30 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100 selection:text-cyan-200' : 'bg-slate-50 text-slate-900 selection:text-cyan-900'
      }`}
    >
      {/* Dynamic Cursor Aura follow glow */}
      <div 
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[130px] transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"
        style={{
          left: 'var(--cursor-x, -1000px)',
          top: 'var(--cursor-y, -1000px)',
        }}
      />

      {/* Background Matrix Mesh Layer */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none animate-grid-drift`}
        style={{ '--grid-color': theme === 'dark' ? '#0f172a' : '#e2e8f0' }}
      />

      <div className={`transition-all duration-700 ${authView || isProcessing ? 'blur-2xl scale-[0.98] pointer-events-none' : ''}`}>
        <Navbar setAuthView={setAuthView} theme={theme} toggleTheme={toggleTheme} session={session} />
        <UrlForm 
          videoUrl={videoUrl} 
          setVideoUrl={setVideoUrl} 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if(videoUrl.trim()) { 
              setCurrentStep(0); 
              setIsProcessing(true); 
              backendReadyRef.current = false;

              let derivedId = "default-video"; 
              try {
                if (videoUrl.includes("v=")) {
                  derivedId = videoUrl.split("v=")[1].split("&")[0];
                } else if (videoUrl.includes("youtu.be/")) {
                  derivedId = videoUrl.split("youtu.be/")[1].split("?")[0];
                }
              } catch (err) {
                console.error("Error parsing video ID", err);
              }
              derivedIdRef.current = derivedId;

              const getUserId = async () => {
                const { data } = await supabase.auth.getSession();
                return data?.session?.user?.id || 'anonymous';
              };

              getUserId().then(userId => {
                fetch('/api/ai/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sessionId: derivedId, youtubeUrl: videoUrl, userId })
                })
                .then(res => res.json())
                .then(data => {
                  if(data.success) {
                    backendReadyRef.current = true;
                  } else {
                    console.error(data.error);
                    alert("Error processing video: " + data.error);
                    setIsProcessing(false);
                  }
                })
                .catch(err => {
                  console.error(err);
                  alert("Failed to connect to the server.");
                  setIsProcessing(false);
                });
              });
            } 
          }} 
          theme={theme} 
        />
        <FeaturesGrid theme={theme} />
        <WorkflowTimeline theme={theme} />
        
        {/* Dynamic Contextual CTA Block */}
        <section className={`scroll-reveal py-32 px-6 relative flex flex-col items-center justify-center text-center border-t transition-colors duration-500 ${
          theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'
        }`}>
          {theme === 'dark' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />}
          <h2 className={`text-4xl md:text-6xl font-black tracking-tight leading-none max-w-2xl ${
            theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500' : 'text-slate-900'
          }`}>
            Transform Passive Content Into Native Repos.
          </h2>
          <p className={`mt-6 text-lg max-w-md font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Stop watching endlessly. Start shipping live runtime components right inside our workspace.
          </p>
          <button 
            onClick={() => setAuthView('signup')}
            className={`mt-10 px-8 py-4 font-bold text-base rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              theme === 'dark' 
                ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-cyan-400 hover:shadow-cyan-500/20' 
                : 'bg-black text-white shadow-black/10 hover:bg-slate-800'
            }`}
          >
            Create Your Free Account
          </button>
        </section>

        <Footer theme={theme} />
      </div>

      {isProcessing && <PipelineModal currentStep={currentStep} pipelineSteps={pipelineSteps} />}
      {authView && <AuthModal authView={authView} setAuthView={setAuthView} showPassword={showPassword} setShowPassword={setShowPassword} theme={theme} />}
    </div>
  );
}