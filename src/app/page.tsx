import type { Metadata } from "next";
import { ViewerPageClient } from "@/components/viewer/ViewerPageClient";

export const metadata: Metadata = {
  title: "マイタイムテーブル閲覧",
  description: "保存済みのマイタイムテーブルを日付ごとに確認できます。",
};

export default function Page() {
  return <ViewerPageClient />;
}
