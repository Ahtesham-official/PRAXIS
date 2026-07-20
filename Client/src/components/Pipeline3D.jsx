import React from 'react';

export default function Pipeline3D({ theme }) {
  const isDark = theme === 'dark';

  // Neo-brutalist / cartoon theme color configurations
  const strokeColor = isDark ? '#f8fafc' : '#0f172a'; // White in dark, near-black in light
  const shadowColor = isDark ? '#020617' : '#1e293b';
  
  const videoFill = '#ff7e95';      // Pastel Rose
  const aiFill = '#67e8f9';         // Pastel Cyan
  const repoFill = '#34d399';       // Pastel Emerald
  const accentYellow = '#fde047';   // Accent Yellow

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 relative select-none">
      {/* Visual Ambient Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-cyan-500/5 to-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      <svg 
        viewBox="0 0 800 360" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-auto"
      >
        {/* ----------------- CONNECTION TRACKS (CARTOON DOTS & LINES) ----------------- */}
        {/* Left Curve Track */}
        <path 
          id="path-left" 
          d="M 180 180 C 230 110, 310 110, 400 150" 
          stroke={strokeColor} 
          strokeWidth="4" 
          strokeDasharray="6,12"
          fill="none" 
        />
        <path 
          d="M 180 180 C 230 110, 310 110, 400 150" 
          stroke={shadowColor} 
          strokeWidth="4" 
          strokeDasharray="6,12"
          fill="none" 
          transform="translate(3, 3)"
          opacity="0.3"
        />

        {/* Right Curve Track */}
        <path 
          id="path-right" 
          d="M 400 150 C 490 220, 560 220, 620 180" 
          stroke={strokeColor} 
          strokeWidth="4" 
          strokeDasharray="6,12"
          fill="none" 
        />
        <path 
          d="M 400 150 C 490 220, 560 220, 620 180" 
          stroke={shadowColor} 
          strokeWidth="4" 
          strokeDasharray="6,12"
          fill="none" 
          transform="translate(3, 3)"
          opacity="0.3"
        />

        {/* ----------------- CARTOON DATA STREAM PARTICLES ----------------- */}
        {/* Play Icon Flowing Left to Mid */}
        <g stroke={strokeColor} strokeWidth="3" fill={accentYellow}>
          <polygon points="-6,-9 9,0 -6,9">
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 180 180 C 230 110, 310 110, 400 150" />
          </polygon>
        </g>
        
        {/* Question Mark Flowing Left to Mid */}
        <g stroke={strokeColor} strokeWidth="2.5" fill="#a5b4fc" transform="scale(0.8)">
          <text x="0" y="0" fontSize="18" fontWeight="black" fontFamily="sans-serif">
            ?
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 180 180 C 230 110, 310 110, 400 150" begin="1.2s" />
          </text>
        </g>

        {/* Code Document Flowing Mid to Right */}
        <g stroke={strokeColor} strokeWidth="3" fill="#ffffff" transform="translate(-10, -10)">
          <rect width="18" height="20" rx="3" fill="#ffffff" />
          <line x1="4" y1="6" x2="14" y2="6" stroke={strokeColor} strokeWidth="2" />
          <line x1="4" y1="10" x2="14" y2="10" stroke={strokeColor} strokeWidth="2" />
          <line x1="4" y1="14" x2="10" y2="14" stroke={strokeColor} strokeWidth="2" />
          <animateMotion dur="3s" repeatCount="indefinite" path="M 400 150 C 490 220, 560 220, 620 180" />
        </g>

        {/* Checkmark Badge Flowing Mid to Right */}
        <g stroke={strokeColor} strokeWidth="2.5" fill={repoFill}>
          <circle r="9" />
          <path d="M-4,0 L-1,3 L4,-3" fill="none" stroke={isDark ? '#0f172a' : '#ffffff'} strokeWidth="2" strokeLinecap="round" />
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 400 150 C 490 220, 560 220, 620 180" begin="1.5s" />
        </g>

        {/* ----------------- NODE 1: PLAYFUL VIDEO MONITOR (LEFT) ----------------- */}
        <g className="cursor-pointer group origin-[180px_180px]">
          {/* Isometric Ground Shadow */}
          <ellipse cx="180" cy="225" rx="55" ry="15" fill={shadowColor} opacity={isDark ? '0.6' : '0.2'} />

          {/* Cartoon TV Neck */}
          <rect x="172" y="195" width="16" height="20" fill={strokeColor} rx="4" />
          <rect x="162" y="210" width="36" height="8" fill={accentYellow} stroke={strokeColor} strokeWidth="3" rx="4" />

          {/* Isometric TV Screen Body */}
          {/* 3D solid shadow block */}
          <rect x="135" y="125" width="90" height="75" rx="16" fill={shadowColor} />
          {/* Main frame */}
          <rect x="130" y="120" width="90" height="75" rx="16" fill={videoFill} stroke={strokeColor} strokeWidth="4" />
          
          {/* Screen Inner */}
          <rect x="140" y="130" width="70" height="50" rx="8" fill={isDark ? '#1e293b' : '#ffffff'} stroke={strokeColor} strokeWidth="3" />
          
          {/* Cute Face & Play Button on Screen */}
          <polygon points="170,145 170,165 188,155" fill={videoFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
          {/* Smiling Face details */}
          <circle cx="150" cy="142" r="2.5" fill={strokeColor} />
          <circle cx="200" cy="142" r="2.5" fill={strokeColor} />
          <path d="M 171 173 C 171 178, 179 178, 179 173" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Two Cute Antennae */}
          <line x1="160" y1="120" x2="145" y2="95" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="145" cy="95" r="6" fill={accentYellow} stroke={strokeColor} strokeWidth="3" />
          <line x1="190" y1="120" x2="205" y2="95" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="205" cy="95" r="6" fill={videoFill} stroke={strokeColor} strokeWidth="3" />

          {/* Label Card */}
          <g transform="translate(180, 245)">
            <rect x="-65" y="-12" width="130" height="24" rx="8" fill={isDark ? '#1e293b' : '#ffffff'} stroke={strokeColor} strokeWidth="3" />
            <text 
              x="0" 
              y="4" 
              fill={strokeColor} 
              fontSize="9" 
              fontWeight="black" 
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              01 / TUTORIAL SOURCE
            </text>
          </g>
        </g>

        {/* ----------------- NODE 2: AI BUBBLING COMPILER (MIDDLE) ----------------- */}
        <g className="cursor-pointer group origin-[400px_150px]">
          {/* Ground Shadow */}
          <ellipse cx="400" cy="195" rx="70" ry="18" fill={shadowColor} opacity={isDark ? '0.6' : '0.2'} />

          {/* Cartoon Beaker Stand */}
          <line x1="370" y1="185" x2="430" y2="185" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          
          {/* Beaker Body */}
          {/* 3D solid shadow block */}
          <path d="M 373 175 L 393 115 L 413 115 L 433 175 Z" fill={shadowColor} transform="translate(5, 5)" />
          {/* Main beaker */}
          <path 
            d="M 370 175 L 390 115 L 415 115 L 435 175 Z" 
            fill={aiFill} 
            stroke={strokeColor} 
            strokeWidth="4" 
            strokeLinejoin="round" 
          />

          {/* Bubbles floating inside the beaker */}
          <circle cx="395" cy="155" r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="2">
            <animate attributeName="cy" values="160;120" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="410" cy="165" r="4" fill={accentYellow} stroke={strokeColor} strokeWidth="2">
            <animate attributeName="cy" values="165;125" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="388" cy="168" r="3" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5">
            <animate attributeName="cy" values="168;130" dur="3s" repeatCount="indefinite" begin="1s" />
            <animate attributeName="opacity" values="1;0" dur="3s" repeatCount="indefinite" begin="1s" />
          </circle>

          {/* Beaker Rim */}
          <ellipse cx="402.5" cy="115" rx="14" ry="4" fill={accentYellow} stroke={strokeColor} strokeWidth="3" />

          {/* Bubbling Steam above Beaker */}
          <path d="M400,100 Q395,90 405,80 T400,65" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" className="animate-pulse" />
          <path d="M410,105 Q415,95 408,88 T412,75" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" className="animate-pulse" />

          {/* Label Card */}
          <g transform="translate(400, 215)">
            <rect x="-65" y="-12" width="130" height="24" rx="8" fill={isDark ? '#1e293b' : '#ffffff'} stroke={strokeColor} strokeWidth="3" />
            <text 
              x="0" 
              y="4" 
              fill={strokeColor} 
              fontSize="9" 
              fontWeight="black" 
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              02 / CHALLENGE GATES
            </text>
          </g>
        </g>

        {/* ----------------- NODE 3: CODE TREASURE CHEST (RIGHT) ----------------- */}
        <g className="cursor-pointer group origin-[620px_180px]">
          {/* Ground Shadow */}
          <ellipse cx="620" cy="225" rx="55" ry="15" fill={shadowColor} opacity={isDark ? '0.6' : '0.2'} />

          {/* 3D solid shadow block */}
          <rect x="575" y="125" width="90" height="75" rx="14" fill={shadowColor} />
          {/* Chest main box body */}
          <rect x="570" y="120" width="90" height="75" rx="14" fill={repoFill} stroke={strokeColor} strokeWidth="4" />
          
          {/* Chest Locks / Hinges */}
          <rect x="605" y="145" width="20" height="15" fill={accentYellow} stroke={strokeColor} strokeWidth="3" rx="4" />
          <circle cx="615" cy="152.5" r="2.5" fill={strokeColor} />
          
          {/* Wood Panel accents */}
          <line x1="570" y1="135" x2="660" y2="135" stroke={strokeColor} strokeWidth="3.5" />
          <line x1="570" y1="175" x2="660" y2="175" stroke={strokeColor} strokeWidth="3.5" />

          {/* Rising Code Gem / Tag */}
          <g transform="translate(620, 100) scale(0.9)" className="transition-transform duration-500 group-hover:-translate-y-2">
            {/* Tag background */}
            <polygon points="0,-18 20,0 -20,0" fill={accentYellow} stroke={strokeColor} strokeWidth="3" />
            <polygon points="20,0 0,18 -20,0" fill={accentYellow} stroke={strokeColor} strokeWidth="3" />
            {/* Brackets inside */}
            <text 
              x="0" 
              y="4" 
              fill={strokeColor} 
              fontSize="12" 
              fontWeight="black" 
              fontFamily="monospace" 
              textAnchor="middle"
            >
              &lt;/&gt;
            </text>
          </g>

          {/* Label Card */}
          <g transform="translate(620, 245)">
            <rect x="-65" y="-12" width="130" height="24" rx="8" fill={isDark ? '#1e293b' : '#ffffff'} stroke={strokeColor} strokeWidth="3" />
            <text 
              x="0" 
              y="4" 
              fill={strokeColor} 
              fontSize="9" 
              fontWeight="black" 
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              03 / COMPILED REPOS
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
