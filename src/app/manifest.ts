import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "フジロック マイタイムテーブル",
    short_name: "マイタイムテーブル",
    description:
      "フジロック当日までの計画をたててマイタイムテーブルを作成し、当日スムーズに移動を行う",
    start_url: ".",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2b6cb0",
  };
}
