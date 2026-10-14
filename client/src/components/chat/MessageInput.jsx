import React from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

const MessageInput = ({
  value = '',
  onChange = () => { },
  onSubmit = () => { },
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shrink-0 transition-colors duration-200">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        {/* Attachment & Emoji actions */}
        <div className="flex items-center text-slate-400">
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Attach file"
            tabIndex={-1}
          >
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Insert emoji"
            tabIndex={-1}
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-11 px-4 text-sm font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all cursor-pointer shrink-0"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
