import * as cheerio from "cheerio";
import { fetchText } from "./fetchHtml";
import type { StagesData } from "../../src/lib/data/types";

// Stage colors/names live in the timetable page's own stylesheet, whose URL
// contains a yearly-changing path segment (e.g. /2026/...). Rather than
// hardcode the year, discover the real <link> href from a timetable page.
const TIMETABLE_URL_FOR_DISCOVERY = "https://www.fujirockfestival.com/artist/timetable/24";
const SITE_ORIGIN = "https://www.fujirockfestival.com";

const STAGE_COLOR_PATTERN =
  /--cd-color-event-(\d+):\s*hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)\s*;\s*\/\*\s*\d+\.(.*?)\s*\*\//g;

export async function scrapeStages(): Promise<StagesData> {
  const html = await fetchText(TIMETABLE_URL_FOR_DISCOVERY);
  const $ = cheerio.load(html);

  const cssHref = $('link[rel="stylesheet"][href*="timetable/css/style.css"]').attr("href");
  if (!cssHref) {
    throw new Error("Could not locate the timetable stylesheet <link> for stage color discovery");
  }
  const cssUrl = cssHref.startsWith("http") ? cssHref : `${SITE_ORIGIN}${cssHref}`;
  const css = await fetchText(cssUrl);

  const stages: StagesData = {};
  for (const match of css.matchAll(STAGE_COLOR_PATTERN)) {
    const [, id, h, s, l, name] = match;
    stages[id] = {
      id,
      name: name.trim(),
      colorHsl: `hsl(${h}, ${s}%, ${l}%)`,
    };
  }

  if (Object.keys(stages).length === 0) {
    throw new Error("Parsed zero stage colors from stylesheet — markup may have changed");
  }

  return stages;
}
