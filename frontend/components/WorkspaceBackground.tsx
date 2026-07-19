'use client';

import React from 'react';

export default function WorkspaceBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#FDFBF7] to-[#E5DDD0]/50">
      
      {/* 1. Sunlight rays coming from top right */}
      <div 
        className="absolute top-0 right-0 w-[90%] h-[120%] bg-gradient-to-br from-white/30 via-white/5 to-transparent blur-[30px] pointer-events-none"
        style={{
          clipPath: 'polygon(100% 0, 100% 70%, 15% 100%, 0 100%, 80% 0)',
        }}
      />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-radial-gradient from-white/40 via-[#D89A3E]/10 to-transparent blur-3xl opacity-60" />

      {/* 2. Framed Minimalist Abstract Artwork */}
      <div className="absolute left-[20%] top-[10%] w-28 h-36 bg-white rounded-lg shadow-sm border-2 border-[#D89A3E]/60 p-2 flex items-center justify-center">
        <div className="w-full h-full bg-[#FDFBF7] rounded border border-[#E5DDD0] relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#D89A3E]/30 absolute top-[15%]" />
          <svg viewBox="0 0 100 100" className="w-12 h-14 text-[#C17817]/40 absolute bottom-0" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M 20 100 A 30 30 0 0 1 80 100" fill="currentColor" fillOpacity="0.05" />
            <path d="M 30 100 A 20 20 0 0 1 70 100" />
          </svg>
        </div>
      </div>

      {/* 3. Desk slab */}
      <div className="absolute bottom-0 left-0 w-full h-[18vh] bg-[#E5DDD0]/40 border-t border-[#E5DDD0] flex items-start">
        <div className="w-full h-px bg-[#E5DDD0]/60 mt-1" />
      </div>

      {/* 4. Ceramic Vase & Dried Pampas Grass (To the left of the card) */}
      <div className="absolute left-[5%] bottom-[12vh] w-28 h-64 flex flex-col items-center justify-end z-10">
        <svg viewBox="0 0 200 400" className="w-24 h-52 text-[#D89A3E]" fill="currentColor">
          <path d="M 100 350 Q 70 200 45 110 Q 35 90 25 70 Q 30 68 37 74 Q 45 90 55 120 T 80 220" fill="none" stroke="#D89A3E" strokeWidth="2" />
          <circle cx="25" cy="65" r="4.5" className="text-[#D89A3E]/85" />
          <circle cx="30" cy="75" r="6.5" className="text-[#D89A3E]/75" />
          <circle cx="36" cy="90" r="7" className="text-[#D89A3E]/65" />
          
          <path d="M 100 350 Q 100 170 95 70 Q 93 50 90 30 Q 97 28 102 35 Q 105 55 105 90 T 100 200" fill="none" stroke="#C17817" strokeWidth="2.5" />
          <circle cx="90" cy="25" r="5" className="text-[#C17817]" />
          <circle cx="95" cy="40" r="7" className="text-[#C17817]/85" />
          <circle cx="98" cy="55" r="8" className="text-[#C17817]/75" />
          
          <path d="M 100 350 Q 130 210 155 130 Q 165 110 175 90 Q 180 88 173 96 Q 160 115 150 145 T 120 230" fill="none" stroke="#D89A3E" strokeWidth="2" />
          <circle cx="177" cy="88" r="4.5" className="text-[#D89A3E]/85" />
          <circle cx="171" cy="98" r="6.5" className="text-[#D89A3E]/75" />
          <circle cx="163" cy="112" r="7" className="text-[#D89A3E]/65" />
        </svg>
        <svg viewBox="0 0 100 150" className="w-12 h-20 text-[#F3E3C9] drop-shadow-sm mt-[-15px]">
          <path d="M 40 20 C 40 20 40 10 50 10 C 60 10 60 20 60 20 L 58 40 C 75 60 85 90 85 120 C 85 140 75 148 50 148 C 25 148 15 140 15 120 C 15 90 25 60 42 40 Z" fill="currentColor" stroke="#E5DDD0" strokeWidth="1" />
          <path d="M 50 10 C 55 10 60 20 60 20 L 58 40 C 75 60 85 90 85 120 C 85 140 75 148 50 148" fill="#FFFFFF" fillOpacity="0.3" />
        </svg>
      </div>

      {/* 5. Stacked Books (Slightly left of center bottom) */}
      <div className="absolute left-[35%] bottom-[14.5vh] w-24 h-8 z-10 flex flex-col justify-end">
        <div className="w-24 h-3.5 bg-[#EDE4D8] rounded-sm shadow-sm border border-[#E5DDD0] relative flex items-center justify-center">
          <span className="text-[5.5px] font-extrabold uppercase tracking-widest text-[#6B6258]">LIVE WELL</span>
        </div>
        <div className="w-20 h-3 bg-[#FDFBF7] rounded-sm shadow-sm border border-[#E5DDD0] relative flex items-center justify-center mb-0.5 ml-2">
          <span className="text-[5.5px] font-bold uppercase tracking-wider text-[#1F1B16]">KINFOLK</span>
          <div className="absolute left-0.5 top-0 bottom-0 w-0.5 bg-[#C17817]" />
        </div>
      </div>

      {/* 6. Coffee Mug (To the right of the card) */}
      <div className="absolute right-[5%] bottom-[14vh] w-10 h-8 z-10">
        <svg viewBox="0 0 80 70" className="w-8 h-7 text-[#FDFBF7] drop-shadow-sm">
          <path d="M 50 15 C 65 15, 65 45, 50 45" fill="none" stroke="#E5DDD0" strokeWidth="6" strokeLinecap="round" />
          <path d="M 15 10 L 48 10 C 50 45, 45 58, 32 58 C 18 58, 13 45, 15 10 Z" fill="currentColor" stroke="#E5DDD0" strokeWidth="1" />
          <ellipse cx="31.5" cy="10" rx="16.5" ry="3" fill="#E5DDD0" />
        </svg>
      </div>

    </div>
  );
}
