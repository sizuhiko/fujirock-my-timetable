export type StageId = string; // "1".."18", matches the official site's data-event suffix

export interface StageInfo {
  id: StageId;
  name: string;
  colorHsl: string; // e.g. "hsl(81, 47%, 91%)"
}

export type StagesData = Record<StageId, StageInfo>;

export interface TimetableEvent {
  eventKey: string; // stable id: `${day}-${stageId}-${contentId}-${startRaw}`
  stageId: StageId;
  contentId: string; // official site's data-content, used to build the artist detail URL
  artistName: string;
  startRaw: string; // "HH:MM", can exceed 24:00 for after-midnight slots
  endRaw: string;
  startMinutes: number;
  endMinutes: number;
}

export type FestivalDay = 1 | 2 | 3;

export interface TimetableDay {
  day: FestivalDay;
  sourceUrl: string;
  scrapedAt: string; // ISO timestamp
  eventsByStage: Record<StageId, TimetableEvent[]>;
}

export interface FoodArea {
  id: string; // "food01".."food11"
  name: string;
  imageUrl: string;
  detailUrl: string;
}

export type FoodAreasData = FoodArea[];
