import type { Metadata } from "next";
import { TentPageClient } from "@/components/tent/TentPageClient";

export const metadata: Metadata = {
  title: "マイテント",
  description: "テント位置を登録して、Google Mapで徒歩ナビゲーションできます。",
};

export default function Page() {
  return <TentPageClient />;
}
