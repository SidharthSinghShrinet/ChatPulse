/**
 * Compares two date objects or ISO strings to check if they belong to the same calendar day.
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Formats a timestamp into friendly chat date separators:
 * - "Today"
 * - "Yesterday"
 * - Day name ("Monday", "Tuesday", etc.) if within the last 7 days
 * - "DD/MM/YYYY" for older dates (matches WhatsApp/Telegram style)
 */
export const formatChatDate = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();

  // Reset hours to compare pure calendar dates
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = startOfToday.getTime() - startOfTarget.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  // Within last 7 days: show day name (e.g. Monday)
  if (diffDays < 7 && diffDays > 1) {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  }

  // Older dates: format as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formats a lastSeen timestamp into "Last seen today at 4:15 PM" or "Last seen yesterday at 10:00 AM"
 */
export const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Offline';

  const date = new Date(timestamp);
  const now = new Date();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Today
  if (date.toDateString() === now.toDateString()) {
    return `Last seen today at ${timeStr}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Last seen yesterday at ${timeStr}`;
  }

  // Older than yesterday
  const dateStr = date.toLocaleDateString([], { day: '2-digit', month: 'short' });
  return `Last seen on ${dateStr} at ${timeStr}`;
};
