import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({
  message = '',
  createdAt = new Date(),
  isOutgoing = false,
  status = 'sent',
}) => {
  // Format timestamp helper
  const formatTime = (time) => {
    try {
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`flex w-full mb-3 ${
        isOutgoing ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words relative transition-all ${
          isOutgoing
            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-xs shadow-indigo-950/20'
            : 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700/50 shadow-xs dark:shadow-slate-950/40'
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message}</p>

        <div
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 select-none ${
            isOutgoing ? 'text-indigo-200/80' : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <span>{formatTime(createdAt)}</span>

          {isOutgoing && (
            <span>
              {status === 'read' ? (
                <CheckCheck size={13} className="text-sky-300" />
              ) : status === 'delivered' ? (
                <CheckCheck size={13} />
              ) : (
                <Check size={13} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
