import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/shared/NavBar";

export const metadata: Metadata = {
  title: {
    default: "フジロック マイタイムテーブル",
    template: "%s | フジロック マイタイムテーブル",
  },
  description:
    "フジロック当日までの計画をたててマイタイムテーブルを作成し、当日スムーズに移動を行う",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
