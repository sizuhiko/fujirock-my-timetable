import { getDb } from "./index";
import type { MyFoodPlan, MyLiveSelection } from "./schema";
import type { FestivalDay, FoodArea, TimetableEvent } from "@/lib/data/types";

export async function listLiveSelectionsForDay(day: FestivalDay): Promise<MyLiveSelection[]> {
  const db = await getDb();
  return db.getAllFromIndex("liveSelections", "by-day", day);
}

export async function addLiveSelection(event: TimetableEvent, day: FestivalDay): Promise<void> {
  const db = await getDb();
  const record: MyLiveSelection = {
    id: `${day}-${event.eventKey}`,
    day,
    eventKey: event.eventKey,
    stageId: event.stageId,
    contentId: event.contentId,
    artistName: event.artistName,
    startRaw: event.startRaw,
    endRaw: event.endRaw,
    startMinutes: event.startMinutes,
    endMinutes: event.endMinutes,
    addedAt: new Date().toISOString(),
  };
  await db.put("liveSelections", record);
}

export async function removeLiveSelection(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("liveSelections", id);
}

export async function listFoodPlansForDay(day: FestivalDay): Promise<MyFoodPlan[]> {
  const db = await getDb();
  return db.getAllFromIndex("foodPlans", "by-day", day);
}

export async function addFoodPlan(input: {
  day: FestivalDay;
  foodArea: FoodArea;
  startRaw: string;
  endRaw: string;
  startMinutes: number;
  endMinutes: number;
}): Promise<void> {
  const db = await getDb();
  const record: MyFoodPlan = {
    id: crypto.randomUUID(),
    day: input.day,
    foodAreaId: input.foodArea.id,
    foodAreaName: input.foodArea.name,
    foodAreaDetailUrl: input.foodArea.detailUrl,
    startRaw: input.startRaw,
    endRaw: input.endRaw,
    startMinutes: input.startMinutes,
    endMinutes: input.endMinutes,
    addedAt: new Date().toISOString(),
  };
  await db.put("foodPlans", record);
}

export async function removeFoodPlan(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("foodPlans", id);
}

export async function listAllForDay(
  day: FestivalDay,
): Promise<{ lives: MyLiveSelection[]; foodPlans: MyFoodPlan[] }> {
  const [lives, foodPlans] = await Promise.all([
    listLiveSelectionsForDay(day),
    listFoodPlansForDay(day),
  ]);
  return { lives, foodPlans };
}
