import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Header from '../components/dashboard/Header.jsx';
import MetricCards from '../components/dashboard/MetricCards.jsx';
import WatchedVideos from '../components/dashboard/WatchedVideos.jsx';
import PerformanceChart from '../components/dashboard/PerformanceChart.jsx';
import WatchTimeMetrics from '../components/dashboard/WatchTimeMetrics.jsx';
import PipelineModal from '../components/PipelineModal';

export default function DashboardPage({ theme, toggleTheme }) {
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const backendReadyRef = useRef(false);
  const derivedIdRef = useRef(''); 

  const pipelineSteps = [
    "Triggering YouTube iFrame API...",
    "Extracting Video Context & Telemetry...",
    "Fetching Transcript Records...",
    "AI Layer: Generating Learning Modules...",
    "AI Layer: Compiling Checkpoint Questions...",
    "Success! Loading Workspace Suite..."
  ];

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
  }, [isProcessing, navigate]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
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
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Server error ${res.status}: ${text}`);
          }
          return res.json();
        })
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
          alert("Failed to connect to the server: " + err.message);
          setIsProcessing(false);
        });
      });
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let uid = null;
        if (session && session.user) {
          setUserName(session.user.user_metadata?.full_name || "Guest User");
          setUserEmail(session.user.email || "");
          uid = session.user.id;
        } else {
          uid = 'anonymous';
        }

        const res = await fetch(`/api/dashboard/user/${uid}`);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error(`Dashboard fetch failed: ${res.status} ${text}`);
          throw new Error(`Dashboard fetch failed: ${res.status}`);
        }
        const json = await res.json();
        
        if (json.success) {
          setDashboardData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  return (
    <div className={`min-h-screen flex w-full overflow-x-hidden relative transition-colors duration-500 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Matrix Mesh Layer calibrated precisely to match your Landing Page style */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none`}
        style={{ '--grid-color': theme === 'dark' ? '#0f172a' : '#e2e8f0' }}
      />

      <Sidebar theme={theme} userName={userName} userEmail={userEmail} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 lg:p-8 space-y-6 z-10">
        <Header theme={theme} toggleTheme={toggleTheme} userName={userName} />
        
        <form onSubmit={handleGenerate} className={`flex items-center gap-2 p-2 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/80 shadow-sm'}`}>
          <input 
            type="url" 
            required 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste your YouTube video link here to generate a new workspace..." 
            className={`flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium ${theme === 'dark' ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
          />
          <button type="submit" className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95 ${theme === 'dark' ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-violet-600 text-white hover:bg-violet-500'}`}>
            Generate Course
          </button>
        </form>

        {isProcessing && (
          <PipelineModal 
            currentStep={currentStep}
            pipelineSteps={pipelineSteps}
          />
        )}

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Loading metrics...</div>
        ) : (
          <>
            <MetricCards theme={theme} dashboardData={dashboardData} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch w-full min-w-0">
              <WatchedVideos theme={theme} dashboardData={dashboardData} />
              <PerformanceChart theme={theme} dashboardData={dashboardData} />
            </div>

            <WatchTimeMetrics theme={theme} dashboardData={dashboardData} />
          </>
        )}
      </div>
    </div>
  );
}