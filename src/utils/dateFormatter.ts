/**
 * Format date as relative time (e.g., "Today", "Yesterday", "3 days ago")
 * For use in cards and lists
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatRelativeDate = (date: Date, t: (key: string, options?: any) => string): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return t('date.today');
  } else if (diffDays === 1) {
    return t('date.yesterday');
  } else if (diffDays < 7) {
    return diffDays === 1 ? t('date.oneDayAgo') : t('date.daysAgo', { count: diffDays });
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? t('date.oneWeekAgo') : t('date.weeksAgo', { count: weeks });
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? t('date.oneMonthAgo') : t('date.monthsAgo', { count: months });
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? t('date.oneYearAgo') : t('date.yearsAgo', { count: years });
  }
};

/**
 * Format date as full date with time (e.g., "Nov 15, 2025 at 14:30")
 * For use in details/preview views
 */
export const formatFullDate = (date: Date): string => {
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${dateStr} at ${timeStr}`;
};
