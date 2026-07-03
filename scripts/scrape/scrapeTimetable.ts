import * as cheerio from "cheerio";
import { fetchText } from "./fetchHtml";
import { parseTimeToMinutes } from "../../src/lib/time";
import type { FestivalDay, TimetableDay, TimetableEvent } from "../../src/lib/data/types";

const TIMETABLE_URLS: Record<FestivalDay, string> = {
  1: "https://www.fujirockfestival.com/artist/timetable/24",
  2: "https://www.fujirockfestival.com/artist/timetable/25",
  3: "https://www.fujirockfestival.com/artist/timetable/26",
};

const STAGE_NUMBER_PATTERN = /stage(\d+)\.gif/;

export async function scrapeTimetable(day: FestivalDay): Promise<TimetableDay> {
  const sourceUrl = TIMETABLE_URLS[day];
  const html = await fetchText(sourceUrl);
  const $ = cheerio.load(html);

  const eventsByStage: Record<string, TimetableEvent[]> = {};

  $("li.cd-schedule__group").each((_, group) => {
    const stageImgSrc = $(group).find(".cd-schedule__top-info img").attr("src") ?? "";
    const stageMatch = stageImgSrc.match(STAGE_NUMBER_PATTERN);
    if (!stageMatch) {
      console.warn(
        `day${day}: could not determine stage number from "${stageImgSrc}", skipping group`,
      );
      return;
    }
    const stageId = stageMatch[1];
    const events: TimetableEvent[] = [];

    $(group)
      .find("li.cd-schedule__event > a")
      .each((__, anchor) => {
        const a = $(anchor);
        const startRaw = a.attr("data-start");
        const endRaw = a.attr("data-end");
        const contentId = a.attr("data-content");

        const nameEl = a.find(".cd-schedule__name");
        const contents = nameEl.contents().toArray();
        const brIndex = contents.findIndex((node) => node.type === "tag" && node.name === "br");
        const artistName = (
          brIndex >= 0
            ? contents
                .slice(brIndex + 1)
                .map((node) => $(node).text())
                .join("")
            : nameEl.text()
        ).trim();

        if (!startRaw || !endRaw || !contentId || !artistName) {
          console.warn(`day${day} stage${stageId}: skipping malformed event`, {
            startRaw,
            endRaw,
            contentId,
            artistName,
          });
          return;
        }

        events.push({
          eventKey: `${day}-${stageId}-${contentId}-${startRaw}`,
          stageId,
          contentId,
          artistName,
          startRaw,
          endRaw,
          startMinutes: parseTimeToMinutes(startRaw),
          endMinutes: parseTimeToMinutes(endRaw),
        });
      });

    if (events.length > 0) {
      eventsByStage[stageId] = events;
    }
  });

  if (Object.keys(eventsByStage).length === 0) {
    throw new Error(`day${day}: parsed zero stage groups — markup may have changed`);
  }

  return {
    day,
    sourceUrl,
    scrapedAt: new Date().toISOString(),
    eventsByStage,
  };
}
