import { scrapeStages } from "./scrapeStages";
import { scrapeTimetable } from "./scrapeTimetable";
import { scrapeFoodAreas } from "./scrapeFoodAreas";
import { writeJson } from "./writeJson";
import type { FestivalDay } from "../../src/lib/data/types";

const DAYS: FestivalDay[] = [1, 2, 3];

async function run(): Promise<void> {
  // Each source is scraped and written independently: if one source fails,
  // its previously committed JSON file is left untouched rather than
  // overwritten with empty/partial data.
  const results = await Promise.allSettled([
    scrapeStages().then((data) => writeJson("stages.json", data)),
    ...DAYS.map((day) =>
      scrapeTimetable(day).then((data) => writeJson(`timetable-day${day}.json`, data)),
    ),
    scrapeFoodAreas().then((data) => writeJson("food-areas.json", data)),
  ]);

  let successCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      successCount++;
    } else {
      console.error(
        "scrape source failed (keeping previously committed data for it):",
        result.reason,
      );
    }
  }

  console.log(`Scrape complete: ${successCount}/${results.length} sources succeeded.`);

  if (successCount === 0) {
    console.error("All scrape sources failed.");
    process.exit(1);
  }
}

run();
