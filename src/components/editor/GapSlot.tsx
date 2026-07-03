"use client";

import { formatMinutesToDisplay, type TimeRange } from "@/lib/time";
import styles from "./GapSlot.module.css";

export function GapSlot({
  gap,
  onClick,
  label,
}: {
  gap: TimeRange;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button type="button" className={styles.slot} onClick={onClick}>
      <span>
        {label ??
          `空き時間 ${formatMinutesToDisplay(gap.startMinutes)}–${formatMinutesToDisplay(gap.endMinutes)}`}
      </span>
      <span className={styles.hint}>タップしてフードエリアを追加</span>
    </button>
  );
}
