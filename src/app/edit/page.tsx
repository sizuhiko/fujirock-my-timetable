import type { Metadata } from "next";
import { EditorPageClient } from "@/components/editor/EditorPageClient";

export const metadata: Metadata = {
  title: "マイタイムテーブル編集",
  description: "公式タイムテーブルからライブを選んでマイタイムテーブルを編集します。",
};

export default function Page() {
  return <EditorPageClient />;
}
