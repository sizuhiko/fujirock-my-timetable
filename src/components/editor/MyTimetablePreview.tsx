"use client";

import { computeGaps, formatMinutesToDisplay, sortByStart, type TimeRange } from "@/lib/time";
import { LiveBlock } from "@/components/shared/LiveBlock";
import { FoodPlanBlock } from "@/components/shared/FoodPlanBlock";
import { GapSlot } from "./GapSlot";
import type { StagesData } from "@/lib/data/types";
import type { MyFoodPlan, MyLiveSelection } from "@/lib/db/schema";
import styles from "./MyTimetablePreview.module.css";

type Entry =
  | ({ kind: "live"; data: MyLiveSelection } & TimeRange)
  | ({ kind: "food"; data: MyFoodPlan } & TimeRange);

type RenderItem =
  | { type: "entry"; startMinutes: number; entry: Entry }
  | { type: "gap"; startMinutes: number; gap: TimeRange; label?: string };

// Default suggested window shown before the first entry / after the last
// entry of the day, since there's no natural adjacent item to bound it.
const EDGE_SUGGESTION_MINUTES = 60;

export function MyTimetablePreview({
  lives,
  foodPlans,
  stages,
  onDeleteFoodPlan,
  onGapClick,
}: {
  lives: MyLiveSelection[];
  foodPlans: MyFoodPlan[];
  stages: StagesData;
  onDeleteFoodPlan: (id: string) => void;
  onGapClick: (gap: TimeRange) => void;
}) {
  const entries = sortByStart<Entry>([
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
      <p className={styles.empty}>
        まだ選択したライブがありません。上のタイムテーブルからライブを選んでください。
      </p>
    );
  }

  const first = entries[0];
  const last = entries[entries.length - 1];
  const beforeFirstGap: TimeRange = {
    startMinutes: Math.max(0, first.startMinutes - EDGE_SUGGESTION_MINUTES),
    endMinutes: first.startMinutes,
  };
  const afterLastGap: TimeRange = {
    startMinutes: last.endMinutes,
    endMinutes: last.endMinutes + EDGE_SUGGESTION_MINUTES,
  };

  const gaps = computeGaps(entries);

  const items: RenderItem[] = [
    ...entries.map((entry) => ({
      type: "entry" as const,
      startMinutes: entry.startMinutes,
      entry,
    })),
    ...gaps.map((gap) => ({ type: "gap" as const, startMinutes: gap.startMinutes, gap })),
    {
      type: "gap" as const,
      startMinutes: beforeFirstGap.startMinutes,
      gap: beforeFirstGap,
      label: `${formatMinutesToDisplay(first.startMinutes)}より前`,
    },
    {
      type: "gap" as const,
      startMinutes: afterLastGap.startMinutes,
      gap: afterLastGap,
      label: `${formatMinutesToDisplay(last.endMinutes)}より後`,
    },
  ].sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className={styles.list}>
      {items.map((item, index) =>
        item.type === "gap" ? (
          <GapSlot
            key={`gap-${item.gap.startMinutes}-${index}`}
            gap={item.gap}
            label={item.label}
            onClick={() => onGapClick(item.gap)}
          />
        ) : item.entry.kind === "live" ? (
          <LiveBlock
            key={item.entry.data.id}
            artistName={item.entry.data.artistName}
            contentId={item.entry.data.contentId}
            startMinutes={item.entry.data.startMinutes}
            endMinutes={item.entry.data.endMinutes}
            colorHsl={stages[item.entry.data.stageId]?.colorHsl}
          />
        ) : (
          <FoodPlanBlock
            key={item.entry.data.id}
            name={item.entry.data.foodAreaName}
            detailUrl={item.entry.data.foodAreaDetailUrl}
            startMinutes={item.entry.data.startMinutes}
            endMinutes={item.entry.data.endMinutes}
            onDelete={() => onDeleteFoodPlan(item.entry.data.id)}
          />
        ),
      )}
    </div>
  );
}
