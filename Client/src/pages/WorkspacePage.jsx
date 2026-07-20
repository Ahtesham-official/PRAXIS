import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Lock, Unlock, Mic, MicOff, Play, Pause, ArrowLeft, 
  CheckCircle2, AlertCircle, HelpCircle, LayoutDashboard, RefreshCw 
} from 'lucide-react';

// Map known shorthand route params to real YouTube IDs.
// For all 11-char YouTube IDs, pass them through as-is.
const getVideoConfig = (id) => {
  if (id === "py-cli")    return { ytId: "t8pPdKYpowI", fallbackTitle: "Python for Beginners: CLI Personal Finance" };
  if (id === "dsa-avl")   return { ytId: "YLq5sV_Zg6U", fallbackTitle: "Data Structures: AVL Tree Self-Balancing" };
  if (id === "web-kanban") return { ytId: "hQcFE0RD0cQ", fallbackTitle: "React & Tailwind CSS: Interactive Kanban Board" };
  if (id === "db-schema")  return { ytId: "7S_tz1z_5bA", fallbackTitle: "PostgreSQL Database Admin: ER Schemas" };
  if (!id || id === "default-video" || id.length !== 11) {
    return { ytId: "rfscVS0vtbw", fallbackTitle: "Introduction to Software Engineering Core" };
  }
  // Real 11-char YouTube ID from a user-generated workspace
  return { ytId: id, fallbackTitle: "Custom Video Tutorial" };
};



export default function WorkspacePage({ theme }) {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { ytId, fallbackTitle } = getVideoConfig(videoId);
  const [backendTitle, setBackendTitle] = useState('');
  const [currentUserId, setCurrentUserId] = useState('anonymous');
  // Display backend-fetched title if available, otherwise use fallback mapping
  const title = backendTitle || fallbackTitle;

  const [playerReady, setPlayerReady] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);

  // Locking system
  const [locked, setLocked] = useState(false);
  const [lockedMilestoneIndex, setLockedMilestoneIndex] = useState(-1);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Quiz Inputs
  const [textInput, setTextInput] = useState("");
  const [voiceInput, setVoiceInput] = useState("");
  const [textError, setTextError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [backendTopics, setBackendTopics] = useState([]);

  // Fetch current user ID once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data?.session?.user?.id || 'anonymous');
    });
  }, []);

  const playerRef = useRef(null);
  const trackerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Reset all workspace states on videoId change
  useEffect(() => {
    setPlayerReady(false);
    setMilestones([]);
    setVideoPlaying(false);
    setCurrentTimeState(0);
    setDuration(0);
    setLocked(false);
    setLockedMilestoneIndex(-1);
    setCompletedMilestones([]);
    setCurrentQuestionIndex(0);
    setTextInput("");
    setVoiceInput("");
    setTextError("");
    setVoiceError("");
    setSuccessMsg("");
    setBackendTopics([]);
  }, [videoId]);

  // Fetch backend topics and title
  useEffect(() => {
    setBackendTitle('');
    fetch(`/api/progress/${videoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.topics) setBackendTopics(data.data.topics);
          if (data.data.title) setBackendTitle(data.data.title);
        }
      })
      .catch(err => console.error("Failed to fetch topics:", err));
  }, [videoId]);

  // Generate dynamic milestones based on backend topics
  useEffect(() => {
    if (playerReady && duration > 0 && milestones.length === 0 && backendTopics.length > 0) {
      const intervalSec = 900;
      const newMilestones = [];
      let currentMs = intervalSec;
      let index = 0;

      while (currentMs < duration) {
        const topic = backendTopics[index % backendTopics.length];
        if (!topic) break;

        newMilestones.push({
          time: currentMs,
          topicName: topic.topicName,
          questions: [
            { type: 'text', question: topic.textQuestionText || topic.description, hint: topic.description },
            { type: 'voice', question: topic.feynmanQuestionText || topic.description, hint: topic.description }
          ]
        });
        currentMs += intervalSec;
        index++;
      }

      if (newMilestones.length === 0 && duration > 10) {
        const topic = backendTopics[0];
        if (topic) {
          newMilestones.push({
            time: Math.floor(duration / 2),
            topicName: topic.topicName,
            questions: [
              { type: 'text', question: topic.textQuestionText || topic.description, hint: topic.description },
              { type: 'voice', question: topic.feynmanQuestionText || topic.description, hint: topic.description }
            ]
          });
        }
      }
      setMilestones(newMilestones);
    }
  }, [playerReady, duration, milestones.length, backendTopics]);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    // Check speech support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    return () => {
      if (trackerRef.current) clearInterval(trackerRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Could not destroy player safely", e);
        }
      }
    };
  }, [videoId]);

  const initPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
    }

    playerRef.current = new window.YT.Player('youtube-player-element', {
      videoId: ytId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        disablekb: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          setPlayerReady(true);
          const dur = event.target.getDuration() || 300;
          setDuration(dur);
        },
        onStateChange: (event) => {
          // Play state: 1 (Playing)
          if (event.data === 1) {
            setVideoPlaying(true);
          } else {
            setVideoPlaying(false);
          }
        }
      }
    });
  };

  // Playback monitor loop
  useEffect(() => {
    let interval = null;
    if (videoPlaying && playerReady && playerRef.current && !locked) {
      interval = setInterval(() => {
        if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
        const currentTime = playerRef.current.getCurrentTime();
        setCurrentTimeState(currentTime);

        // Evaluate milestones
        milestones.forEach((m, idx) => {
          if (currentTime >= m.time && !completedMilestones.includes(idx)) {
            // Lock video
            playerRef.current.pauseVideo();
            setVideoPlaying(false);
            setLocked(true);
            setLockedMilestoneIndex(idx);
            setCurrentQuestionIndex(0);
            setTextError("");
            setVoiceError("");
            setSuccessMsg("");
          }
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoPlaying, playerReady, completedMilestones, milestones, locked]);

  // Voice speech synthesis
  const startSpeechListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    setVoiceError("");
    setVoiceInput("");
    setSuccessMsg("");

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setVoiceInput(transcript.trim());
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
          setVoiceError("Microphone access denied. Please verify settings or type answer manually below.");
        } else {
          setVoiceError("Could not recognize speech. Please try again or type answer.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setVoiceError("Initialization failed. Please type answer instead.");
      setIsListening(false);
    }
  };

  // Submit handlers
  const submitTextAnswer = (e) => {
    e.preventDefault();
    setTextError("");
    setSuccessMsg("");

    const activeM = milestones[lockedMilestoneIndex];
    if (!activeM) return;
    const currentQ = activeM.questions[currentQuestionIndex];

    const normalizedInput = textInput.toLowerCase().trim();
    if (!normalizedInput) {
      setTextError("Please enter an answer.");
      return;
    }

    fetch(`/api/ai/${videoId}/topics/${encodeURIComponent(activeM.topicName)}/answer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentAnswer: normalizedInput, questionType: 'text', userId: currentUserId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.score >= 50) {
        setSuccessMsg(`Correct! Score: ${data.score}/100. ${data.feedback}`);
        setTimeout(() => {
          if (currentQuestionIndex + 1 < activeM.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTextInput("");
            setSuccessMsg("");
          } else {
            setCompletedMilestones(prev => [...prev, lockedMilestoneIndex]);
            setLocked(false);
            setLockedMilestoneIndex(-1);
            setCurrentQuestionIndex(0);
            setTextInput("");
            setSuccessMsg("");
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          }
        }, 3000);
      } else {
        setTextError(`Needs improvement (Score: ${data?.score || 0}/100). ${data?.feedback || 'Try again.'}`);
      }
    })
    .catch(err => {
      console.error(err);
      setTextError("Network error. Please try again.");
    });
  };

  const submitVoiceAnswer = () => {
    setVoiceError("");
    setSuccessMsg("");

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    }

    const activeM = milestones[lockedMilestoneIndex];
    if (!activeM) return;
    const currentQ = activeM.questions[currentQuestionIndex];

    const normalizedInput = voiceInput.toLowerCase().trim();
    if (!normalizedInput) {
      setVoiceError("Please speak your answer first.");
      return;
    }

    fetch(`/api/ai/${videoId}/topics/${encodeURIComponent(activeM.topicName)}/answer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentAnswer: normalizedInput, questionType: 'feynman', userId: currentUserId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.score >= 50) {
        setSuccessMsg(`Excellent! Score: ${data.score}/100. ${data.feedback}`);
        setTimeout(() => {
          if (currentQuestionIndex + 1 < activeM.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setVoiceInput("");
            setSuccessMsg("");
          } else {
            setCompletedMilestones(prev => [...prev, lockedMilestoneIndex]);
            setLocked(false);
            setLockedMilestoneIndex(-1);
            setCurrentQuestionIndex(0);
            setVoiceInput("");
            setSuccessMsg("");
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          }
        }, 3000);
      } else {
        setVoiceError(`Needs improvement (Score: ${data?.score || 0}/100). ${data?.feedback || 'Try again.'}`);
      }
    })
    .catch(err => {
      console.error(err);
      setVoiceError("Network error. Please try again.");
    });
  };

  const skipMilestone = () => {
    // Quick escape handle for testing
    setCompletedMilestones(prev => [...prev, lockedMilestoneIndex]);
    setLocked(false);
    setLockedMilestoneIndex(-1);
    setCurrentQuestionIndex(0);
    setTextInput("");
    setVoiceInput("");
    setSuccessMsg("");
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  // Derived current active milestone and question for simpler rendering
  const activeMilestone = milestones[lockedMilestoneIndex];
  const currentQuestion = activeMilestone?.questions?.[currentQuestionIndex];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 relative select-none ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Mesh grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none`}
        style={{ '--grid-color': theme === 'dark' ? '#0f172a' : '#e2e8f0' }}
      />

      {/* Navigation Header */}
      <header className={`px-6 py-4 border-b flex justify-between items-center z-10 ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/80 backdrop-blur-md' : 'border-slate-200 bg-white/85 shadow-sm backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-black tracking-tight">{title}</h1>
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              WORKSPACE ID: {ytId}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98 ${
            theme === 'dark' 
              ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' 
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      {/* Main split dashboard workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-10 items-stretch z-10 w-full overflow-hidden">
        {/* 70% Left Pane: YouTube Player & lock screen (lg:col-span-7) */}
        <section className={`lg:col-span-7 flex flex-col justify-center p-6 border-r relative ${
          theme === 'dark' ? 'border-slate-900 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-900 bg-black">
            <div id="youtube-player-element" className="w-full h-full absolute inset-0 z-0 pointer-events-auto" />

            {/* Lock Screen overlay */}
            {locked && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4 animate-pulse">
                  <Lock className="w-8 h-8 text-violet-400" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white mb-2">Workspace Segment Locked</h2>
                <p className="text-slate-300 text-xs max-w-sm font-medium mb-6">
                  This segment of the tutorial has been paused. Please answer the quiz checkpoint questions in the right pane to unlock and resume watching.
                </p>
                <div className="w-full max-w-sm bg-slate-800 rounded-full h-2 mb-2 overflow-hidden relative">
                   <div 
                     className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                     style={{ width: `${(currentTimeState / (duration || 1)) * 100}%` }}
                   />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider mb-6 block">
                  {Math.floor((currentTimeState / (duration || 1)) * 100)}% Video Completed
                </span>
                <button 
                  onClick={skipMilestone} 
                  className="text-[10px] text-slate-500 hover:text-slate-400 font-mono font-bold uppercase underline tracking-wider cursor-pointer"
                >
                  [ Bypass Milestone for Testing ]
                </button>
              </div>
            )}

            {/* Player Loading Placeholder */}
            {!playerReady && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 z-10">
                <RefreshCw className="w-8 h-8 animate-spin mb-3 text-violet-500" />
                <span className="text-xs font-mono font-bold">SPAWNING INTERACTIVE FRAME PLAYER API...</span>
              </div>
            )}
          </div>

          {/* Timeline visualization controls */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>{Math.floor(currentTimeState / 60)}:{( '0' + Math.floor(currentTimeState % 60) ).slice(-2)}</span>
              <span>{Math.floor(duration / 60)}:{( '0' + Math.floor(duration % 60) ).slice(-2)}</span>
            </div>
            
            {/* Custom Interactive Track Progress Bar */}
            <div className={`relative h-2 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${(currentTimeState / (duration || 1)) * 100}%` }}
              />
              {/* Checkpoint Indicators */}
              {milestones.map((m, idx) => {
                if (idx !== completedMilestones.length) return null;
                const percent = (m.time / (duration || 1)) * 100;
                return (
                  <div 
                    key={idx} 
                    className="absolute -top-1 w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2 cursor-help"
                    style={{ left: `${percent}%` }}
                    title={`Milestone ${idx+1}: ${m.questions.length} questions at ${m.time}s`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      lockedMilestoneIndex === idx 
                        ? 'bg-violet-500 scale-150 animate-ping' 
                        : 'bg-violet-500 border border-white'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 30% Right Pane: Quiz Engine (lg:col-span-3) */}
        <section className={`lg:col-span-3 flex flex-col p-6 overflow-y-auto ${
          theme === 'dark' ? 'bg-slate-900/40' : 'bg-white shadow-inner'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-black tracking-tight">Checkpoint Quiz Engine</h2>
          </div>

          {/* Locked State Quiz Interface */}
          {locked && lockedMilestoneIndex !== -1 ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5 animate-slideUp">
                {/* Milestone Badge header */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold font-mono text-violet-500 uppercase tracking-widest">
                      Milestone {lockedMilestoneIndex + 1} Check
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                      Question {currentQuestionIndex + 1} of {activeMilestone?.questions?.length || 0}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    currentQuestion?.type === 'voice'
                      ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
                      : 'text-violet-400 bg-violet-400/10 border-violet-400/20'
                  }`}>
                    {currentQuestion?.type === 'voice' ? <Mic className="w-2.5 h-2.5" /> : null}
                    {currentQuestion?.type?.toUpperCase() || ''} FORMAT
                  </span>
                </div>

                {/* Question */}
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-900' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">
                    {currentQuestion?.question}
                  </p>
                </div>

                {/* TEXT QUIZ INPUT FORM */}
                {currentQuestion?.type === 'text' && (
                  <form onSubmit={submitTextAnswer} className="space-y-4">
                    {/* Render multiple-choice options if provided by backend */}
                    {currentQuestion?.options && currentQuestion.options.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                          OPTIONS
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {currentQuestion.options.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setTextInput(opt)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                textInput === opt ? 'border-violet-500 bg-violet-500/10' : 'border-slate-200 bg-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                        YOUR ANSWER
                      </label>
                      <input 
                        type="text" 
                        required
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type answer here..."
                        className={`w-full h-11 px-4 text-xs font-bold rounded-xl border outline-none transition-all ${
                          theme === 'dark'
                            ? 'border-slate-800 bg-slate-950 text-white focus:border-violet-500'
                            : 'border-slate-200 bg-white text-black focus:border-violet-500'
                        }`}
                      />
                    </div>

                    {textError && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{textError} (Hint: {currentQuestion?.hint})</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!!successMsg}
                      className={`w-full h-11 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer hover:scale-[1.02] active:scale-98 ${
                        successMsg ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      Verify Answer
                    </button>
                  </form>
                )}

                {/* VOICE QUIZ INPUT INTERFACE */}
                {currentQuestion?.type === 'voice' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                        SPEECH REC INPUT
                      </label>

                      {/* Microphone layout */}
                      <div className="flex flex-col items-center justify-center p-6 border rounded-xl border-dashed border-slate-800 bg-slate-950/20">
                        {isListening ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setIsListening(false);
                                if (recognitionRef.current) {
                                  try { recognitionRef.current.stop(); } catch (e) {}
                                }
                              }}
                              className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white cursor-pointer shadow-lg animate-pulse"
                            >
                              <Mic className="w-6 h-6" />
                            </button>
                            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                              RECORDING SPEECH... SPEAK NOW
                            </span>
                            {/* Pulse Sound Waveform */}
                            <div className="flex items-center gap-1 mt-1">
                              <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce" />
                              <span className="w-1 h-6 bg-cyan-400 rounded-full animate-bounce delay-75" />
                              <span className="w-1 h-8 bg-cyan-400 rounded-full animate-bounce delay-150" />
                              <span className="w-1 h-5 bg-cyan-400 rounded-full animate-bounce delay-75" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <button
                              onClick={startSpeechListening}
                              className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-950 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all cursor-pointer shadow-md"
                            >
                              <Mic className="w-6 h-6" />
                            </button>
                            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                              CLICK MIC TO ANSWER BY VOICE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Speech Transcript Output Area */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                        Voice Transcript Preview
                      </label>
                      <textarea
                        value={voiceInput}
                        onChange={(e) => setVoiceInput(e.target.value)}
                        placeholder="Your speech transcript will render here. Or, type manually to simulate voice."
                        rows={3}
                        className={`w-full p-3 text-xs font-medium rounded-xl border outline-none transition-all resize-none ${
                          theme === 'dark'
                            ? 'border-slate-800 bg-slate-950 text-white focus:border-cyan-500'
                            : 'border-slate-200 bg-white text-black focus:border-cyan-500'
                        }`}
                      />
                    </div>

                    {voiceError && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{voiceError}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <button
                      onClick={submitVoiceAnswer}
                      disabled={!!successMsg || !voiceInput.trim()}
                      className={`w-full h-11 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all cursor-pointer hover:scale-[1.02] active:scale-98 ${
                        successMsg || !voiceInput.trim() ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      Submit Voice Answer
                    </button>
                  </div>
                )}
              </div>

              {/* Hint badge */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300">Milestone Hint:</span> {currentQuestion?.hint}
                </div>
              </div>
            </div>
          ) : (
            /* Idle / Waiting state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
              <Unlock className="w-8 h-8 text-emerald-500 mb-3 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-200">Playback Unlocked</h3>
              <p className="text-[10px] text-slate-400 font-medium max-w-[200px] mt-1.5 leading-normal">
                Resume video playback. Playback auto-locks at checkpoints to trigger questions.
              </p>

              {/* Checkpoints summary list */}
              <div className="w-full mt-6 space-y-2">
                <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block text-left">
                  NEXT TARGET CHECKPOINT
                </span>
                {completedMilestones.length === milestones.length && milestones.length > 0 ? (
                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All milestones completed!</span>
                  </div>
                ) : (
                  milestones.map((m, idx) => {
                    if (idx !== completedMilestones.length) return null;
                    return (
                      <div 
                        key={idx} 
                        className="p-3 rounded-xl border border-slate-900 bg-slate-950/20 flex items-center justify-between text-[10px] font-bold text-slate-400"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Checkpoint {idx+1} at {m.time}s</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase font-semibold">{m.questions.length} QUESTIONS</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}