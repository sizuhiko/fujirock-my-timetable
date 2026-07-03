"use client";

import Link from "next/link";
import { sortByStart } from "@/lib/time";
import { LiveBlock } from "@/components/shared/LiveBlock";
import { FoodPlanBlock } from "@/components/shared/FoodPlanBlock";
import type { StagesData } from "@/lib/data/types";
import type { MyFoodPlan, MyLiveSelection } from "@/lib/db/schema";
import styles from "./MyTimetableDay.module.css";

type Entry =
  | { kind: "live"; startMinutes: number; data: MyLiveSelection }
  | { kind: "food"; startMinutes: number; data: MyFoodPlan };

export function MyTimetableDay({
  lives,
  foodPlans,
  stages,
}: {
  lives: MyLiveSelection[];
  foodPlans: MyFoodPlan[];
  stages: StagesData;
}) {
  const entries = sortByStart<Entry & { endMinutes: number }>([
    ...lives.map((data) => ({
      kind: "live" as const,
      data,
      startMinutes: data.startMinutes,
      endMinutes: data.endMinutes,
    })),
    ...foodPlans.map((data) => ({
      kind: "food" as const,
      data,
      startMinutes: data.startMinutes,
      endMinutes: data.endMinutes,
    })),
  ]);

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>この日の予定はまだありません。</p>
        <Link href="/edit" className={styles.emptyLink}>
          編集画面でライブを選んでみましょう
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {entries.map((entry) =>
        entry.kind === "live" ? (
          <LiveBlock
            key={entry.data.id}
            artistName={entry.data.artistName}
            contentId={entry.data.contentId}
            startMinutes={entry.data.startMinutes}
            endMinutes={entry.data.endMinutes}
            colorHsl={stages[entry.data.stageId]?.colorHsl}
          />
        ) : (
          <FoodPlanBlock
            key={entry.data.id}
            name={entry.data.foodAreaName}
            detailUrl={entry.data.foodAreaDetailUrl}
            startMinutes={entry.data.startMinutes}
            endMinutes={entry.data.endMinutes}
          />
        ),
      )}
    </div>
  );
}
