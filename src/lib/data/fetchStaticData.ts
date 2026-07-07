import { withBasePath } from "@/lib/basePath";
import type { FestivalDay, FoodAreasData, StagesData, TimetableDay } from "./types";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(withBasePath(path), init);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Static data rarely changes, but every page mounts its own copy of these
// components, so without a shared cache each navigation re-fetches and
// re-parses the same JSON. Cache by key so concurrent/repeat callers share
// one in-flight (or resolved) promise; `cache: "no-store"` callers (manual
// reload) bypass and refresh the shared entry for subsequent callers too.
const requestCache = new Map<string, Promise<unknown>>();

function fetchJsonCached<T>(key: string, path: string, init?: RequestInit): Promise<T> {
  if (init?.cache === "no-store") {
    const promise = fetchJson<T>(path, init);
    requestCache.set(key, promise);
    return promise;
  }
  const cached = requestCache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = fetchJson<T>(path, init).catch((error: unknown) => {
    requestCache.delete(key);
    throw error;
  });
  requestCache.set(key, promise);
  return promise;
}

export function fetchStages(init?: RequestInit): Promise<StagesData> {
  return fetchJsonCached("stages", "/data/stages.json", init);
}

export function fetchTimetableDay(day: FestivalDay, init?: RequestInit): Promise<TimetableDay> {
  return fetchJsonCached(`timetable-day${day}`, `/data/timetable-day${day}.json`, init);
}

export function fetchFoodAreas(init?: RequestInit): Promise<FoodAreasData> {
  return fetchJsonCached("food-areas", "/data/food-areas.json", init);
}
