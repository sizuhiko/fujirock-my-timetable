import type { DBSchema } from "idb";
import type { FestivalDay } from "@/lib/data/types";

export interface MyLiveSelection {
  id: string; // `${day}-${eventKey}`
  day: FestivalDay;
  eventKey: string;
  stageId: string;
  contentId: string;
  artistName: string;
  startRaw: string;
  endRaw: string;
  startMinutes: number;
  endMinutes: number;
  addedAt: string;
}

export interface MyFoodPlan {
  id: string;
  day: FestivalDay;
  foodAreaId: string;
  foodAreaName: string;
  foodAreaDetailUrl: string;
  startRaw: string;
  endRaw: string;
  startMinutes: number;
  endMinutes: number;
  addedAt: string;
}

export interface TentLocation {
  id: "tent";
  lat: number;
  lng: number;
  savedAt: string;
}

export interface MyTimetableDB extends DBSchema {
  liveSelections: {
    key: string;
    value: MyLiveSelection;
    indexes: { "by-day": number };
  };
  foodPlans: {
    key: string;
    value: MyFoodPlan;
    indexes: { "by-day": number };
  };
  tent: {
    key: string;
    value: TentLocation;
  };
}

export const DB_NAME = "fuji-rock-my-timetable";
export const DB_VERSION = 1;
