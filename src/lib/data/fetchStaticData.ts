import { withBasePath } from "@/lib/basePath";
import type { FestivalDay, FoodAreasData, StagesData, TimetableDay } from "./types";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(withBasePath(path), init);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchStages(init?: RequestInit): Promise<StagesData> {
  return fetchJson("/data/stages.json", init);
}

export function fetchTimetableDay(day: FestivalDay, init?: RequestInit): Promise<TimetableDay> {
  return fetchJson(`/data/timetable-day${day}.json`, init);
}

export function fetchFoodAreas(init?: RequestInit): Promise<FoodAreasData> {
  return fetchJson("/data/food-areas.json", init);
}
