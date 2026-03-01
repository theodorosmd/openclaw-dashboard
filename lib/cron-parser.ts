/**
 * Simple cron schedule parser
 * Determines if a job runs on a specific date
 */

export function jobRunsOnDate(schedule: string, date: Date): boolean {
  // This is a simplified parser
  // Full cron parsing would require a library like node-cron
  
  const parts = schedule.split(' ');
  if (parts.length < 5) return false;
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  
  // Check day of month
  if (dayOfMonth !== '*' && dayOfMonth !== '?') {
    const targetDay = parseInt(dayOfMonth);
    if (date.getDate() !== targetDay) return false;
  }
  
  // Check day of week (0-6, Sunday = 0)
  if (dayOfWeek !== '*' && dayOfWeek !== '?') {
    const targetDayOfWeek = parseInt(dayOfWeek);
    if (date.getDay() !== targetDayOfWeek) return false;
  }
  
  // If we made it here, job likely runs today
  return dayOfMonth !== '*' || dayOfWeek !== '*';
}

export function getNextRunTime(schedule: string, now: Date = new Date()): Date | null {
  // Simplified - would need proper cron parser for accuracy
  const parts = schedule.split(' ');
  if (parts.length < 5) return null;
  
  const [minute, hour] = parts;
  
  const next = new Date(now);
  
  // Set time
  if (hour !== '*') next.setHours(parseInt(hour));
  if (minute !== '*') next.setMinutes(parseInt(minute));
  next.setSeconds(0);
  next.setMilliseconds(0);
  
  // If time has passed today, move to tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}
