import React, { useEffect, useState } from 'react';

const SplashScreen = ({ isReady, onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Small delay to ensure pleasant viewing of the logo animation
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 700);

      // Complete unmount after fade transition finishes
      const removeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#020617] text-slate-100 select-none overflow-hidden transition-all duration-500 ease-out ${
        fading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-hidden="true"
    >
      {/* Background radial glow */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-3xl bg-radial from-indigo-500/40 via-purple-600/20 to-transparent blur-xl splash-pulse-glow" />
        
        {/* Animated Favicon/Logo Card */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-white/15 to-white/5 border border-white/10 shadow-2xl shadow-indigo-500/30 splash-logo-breathe flex items-center justify-center">
          <img
            src="/android-chrome-192x192.png"
            alt="Txtro Logo"
            className="w-full h-full rounded-[14px] object-cover shadow-inner"
          />
        </div>
      </div>

      {/* Title & Tagline */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
        Txtro
      </h1>
      <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wider uppercase mt-1">
        Real-Time Messenger
      </p>

      {/* Subtle loader pill at bottom */}
      <div className="absolute bottom-12 w-12 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 splash-loader-bar" />
      </div>
    </div>
  );
};

export default SplashScreen;
