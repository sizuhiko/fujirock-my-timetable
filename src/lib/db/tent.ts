import { getDb } from "./index";
import type { TentLocation } from "./schema";

const TENT_KEY = "tent";

export async function getTentLocation(): Promise<TentLocation | null> {
  const db = await getDb();
  const record = await db.get("tent", TENT_KEY);
  return record ?? null;
}

export async function saveTentLocation(lat: number, lng: number): Promise<void> {
  const db = await getDb();
  await db.put("tent", { id: TENT_KEY, lat, lng, savedAt: new Date().toISOString() });
}

export async function deleteTentLocation(): Promise<void> {
  const db = await getDb();
  await db.delete("tent", TENT_KEY);
}
