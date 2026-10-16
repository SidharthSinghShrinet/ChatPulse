import React from 'react';
import { MessageSquareCode, Sparkles } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600/10 via-violet-600/10 to-fuchsia-600/10 dark:from-indigo-600/20 dark:via-violet-600/20 dark:to-fuchsia-600/20 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center shadow-lg dark:shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <MessageSquareCode size={36} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="absolute -top-1 -right-1 p-1.5 rounded-full bg-indigo-500 text-white shadow-md shadow-indigo-500/30">
          <Sparkles size={14} />
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
        Welcome to Txtro
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        Select a conversation from the sidebar to start chatting in real time with end-to-end WebSocket connection.
      </p>

      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Connected and ready for messages</span>
      </div>
    </div>
  );
};

export default NoChatSelected;
