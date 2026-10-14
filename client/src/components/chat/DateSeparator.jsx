import React from 'react';
import { formatChatDate } from '../../utils/date';

/**
 * Reusable Date Separator Badge for chat streams.
 * Formats timestamps into "Today", "Yesterday", day names, or "DD/MM/YYYY".
 *
 * @param {string | Date} date - The timestamp of the message
 * @param {string} [label] - Optional direct label override
 * @param {string} [className] - Optional custom CSS classes
 */
const DateSeparator = ({ date, label, className = '' }) => {
  const displayLabel = label || formatChatDate(date);

  if (!displayLabel) return null;

  return (
    <div className={`flex items-center justify-center my-4 select-none ${className}`}>
      <span className="px-3.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-xs dark:shadow-slate-950/40 backdrop-blur-md uppercase tracking-wider transition-all">
        {displayLabel}
      </span>
    </div>
  );
};

export default DateSeparator;
