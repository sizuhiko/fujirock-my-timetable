"use client";

import type { FestivalDay } from "@/lib/data/types";
import styles from "./DayTabs.module.css";

const DAYS: FestivalDay[] = [1, 2, 3];

export function DayTabs({
  activeDay,
  onChange,
}: {
  activeDay: FestivalDay;
  onChange: (day: FestivalDay) => void;
}) {
  return (
    <div className={styles.tabs} role="tablist">
      {DAYS.map((day) => (
        <button
          key={day}
          type="button"
          role="tab"
          aria-selected={day === activeDay}
          className={day === activeDay ? styles.activeTab : styles.tab}
          onClick={() => onChange(day)}
        >
          {day}日目
        </button>
      ))}
    </div>
  );
}
