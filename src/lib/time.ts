/**
 * Fuji Rock's official timetable uses "festival time": times past midnight are
 * written as 24:00, 25:30, etc. rather than wrapping back to 00:00, 01:30.
 * We keep that convention end-to-end (never modulo 24h) so ordering and
 * duration math stay correct without special-casing midnight.
 */

export interface TimeRange {
  startMinutes: number;
  endMinutes: number;
}

const TIME_PATTERN = /^\d{1,2}:\d{2}$/;

export function isValidTimeString(raw: string): boolean {
  if (!TIME_PATTERN.test(raw)) return false;
  const minutesPart = raw.split(":")[1];
  return Number(minutesPart) < 60;
}

export function parseTimeToMinutes(raw: string): number {
  const [hours, minutes] = raw.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function durationMinutes(startRaw: string, endRaw: string): number {
  return Math.max(0, parseTimeToMinutes(endRaw) - parseTimeToMinutes(startRaw));
}

export function sortByStart<T extends TimeRange>(items: T[]): T[] {
  return [...items].sort((a, b) => a.startMinutes - b.startMinutes);
}

export function computeGaps(sorted: TimeRange[], minGapMinutes = 10): TimeRange[] {
  const gaps: TimeRange[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapStart = sorted[i].endMinutes;
    const gapEnd = sorted[i + 1].startMinutes;
    if (gapEnd - gapStart >= minGapMinutes) {
      gaps.push({ startMinutes: gapStart, endMinutes: gapEnd });
    }
  }
  return gaps;
}
