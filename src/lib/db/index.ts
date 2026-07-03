import { openDB, type IDBPDatabase } from "idb";
import { DB_NAME, DB_VERSION, type MyTimetableDB } from "./schema";

let dbPromise: Promise<IDBPDatabase<MyTimetableDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<MyTimetableDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MyTimetableDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const liveStore = db.createObjectStore("liveSelections", { keyPath: "id" });
        liveStore.createIndex("by-day", "day");

        const foodStore = db.createObjectStore("foodPlans", { keyPath: "id" });
        foodStore.createIndex("by-day", "day");

        db.createObjectStore("tent", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}
