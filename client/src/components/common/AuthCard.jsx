import React from 'react';
import { MessageSquareCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthCard = ({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/25 border border-indigo-400/30 mb-4 group cursor-default">
            <MessageSquareCode className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400 uppercase rounded-full bg-indigo-950/60 border border-indigo-800/40 mb-2">
            Real-Time Chat
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-400 max-w-xs">{subtitle}</p>
          )}
        </div>

        {/* Card Body with Glassmorphism */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/60">
          {children}

          {footerPrompt && footerLinkTo && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-sm text-slate-400">
                {footerPrompt}{' '}
                <Link
                  to={footerLinkTo}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
