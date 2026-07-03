import * as cheerio from "cheerio";
import { fetchText } from "./fetchHtml";
import type { FoodAreasData } from "../../src/lib/data/types";

const FOOD_PAGE_URL = "https://www.fujirockfestival.com/news/feat07";
const SITE_ORIGIN = "https://www.fujirockfestival.com";
const MIN_EXPECTED_AREAS = 5;

export async function scrapeFoodAreas(): Promise<FoodAreasData> {
  const html = await fetchText(FOOD_PAGE_URL);
  const $ = cheerio.load(html);

  const areas: FoodAreasData = [];
  const seen = new Set<string>();

  $('a[href*="/news/feat07/food"]').each((_, el) => {
    const a = $(el);
    const href = a.attr("href");
    if (!href) return;
    const idMatch = href.match(/food(\d+)/);
    if (!idMatch) return;
    const id = `food${idMatch[1]}`;
    if (seen.has(id)) return; // the same area can be linked from both the image map and the card

    const imageSrc = a.find("img").attr("src");
    const name = a.find("p strong").text().trim();
    if (!imageSrc || !name) return;

    seen.add(id);
    areas.push({
      id,
      name,
      imageUrl: imageSrc,
      detailUrl: href.startsWith("http") ? href : `${SITE_ORIGIN}${href}`,
    });
  });

  if (areas.length < MIN_EXPECTED_AREAS) {
    throw new Error(`Parsed only ${areas.length} food areas — markup may have changed`);
  }

  areas.sort((a, b) => a.id.localeCompare(b.id));
  return areas;
}
