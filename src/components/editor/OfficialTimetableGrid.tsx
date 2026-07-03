"use client";

import { stageBackgroundColor, stageBorderColor } from "@/lib/stageColor";
import { formatMinutesToDisplay } from "@/lib/time";
import type { StagesData, TimetableDay, TimetableEvent } from "@/lib/data/types";
import styles from "./OfficialTimetableGrid.module.css";

const PIXELS_PER_MINUTE = 1.6;
const HOUR_STEP = 60;

export function OfficialTimetableGrid({
  timetableDay,
  stages,
  selectedEventKeys,
  onToggle,
}: {
  timetableDay: TimetableDay;
  stages: StagesData;
  selectedEventKeys: Set<string>;
  onToggle: (event: TimetableEvent) => void;
}) {
  const stageIds = Object.keys(timetableDay.eventsByStage).sort((a, b) => Number(a) - Number(b));
  const allEvents = stageIds.flatMap((id) => timetableDay.eventsByStage[id]);

  if (allEvents.length === 0) {
    return <p className={styles.empty}>この日のタイムテーブルはまだありません。</p>;
  }

  const rawStart = Math.min(...allEvents.map((e) => e.startMinutes));
  const rawEnd = Math.max(...allEvents.map((e) => e.endMinutes));
  const dayStart = Math.floor(rawStart / HOUR_STEP) * HOUR_STEP;
  const dayEnd = Math.ceil(rawEnd / HOUR_STEP) * HOUR_STEP;
  const totalHeight = (dayEnd - dayStart) * PIXELS_PER_MINUTE;

  const hourMarks: number[] = [];
  for (let m = dayStart; m <= dayEnd; m += HOUR_STEP) hourMarks.push(m);

  return (
    <div className={styles.wrapper}>
      <div className={styles.timeAxis} style={{ height: totalHeight }}>
        {hourMarks.map((m) => (
          <div
            key={m}
            className={styles.hourMark}
            style={{ top: (m - dayStart) * PIXELS_PER_MINUTE }}
          >
            {formatMinutesToDisplay(m)}
          </div>
        ))}
      </div>
      <div className={styles.columns}>
        {stageIds.map((stageId) => (
          <div key={stageId} className={styles.column}>
            <div className={styles.stageHeader}>{stages[stageId]?.name ?? `STAGE ${stageId}`}</div>
            <div className={styles.stageBody} style={{ height: totalHeight }}>
              {timetableDay.eventsByStage[stageId].map((event) => {
                const selected = selectedEventKeys.has(event.eventKey);
                const colorHsl = stages[stageId]?.colorHsl;
                return (
                  <button
                    type="button"
                    key={event.eventKey}
                    aria-pressed={selected}
                    className={selected ? styles.cellSelected : styles.cell}
                    style={{
                      top: (event.startMinutes - dayStart) * PIXELS_PER_MINUTE,
                      height: Math.max(
                        (event.endMinutes - event.startMinutes) * PIXELS_PER_MINUTE,
                        20,
                      ),
                      backgroundColor: stageBackgroundColor(colorHsl),
                      borderColor: selected ? stageBorderColor(colorHsl) : "transparent",
                    }}
                    onClick={() => onToggle(event)}
                  >
                    <span className={styles.cellTime}>
                      {event.startRaw}-{event.endRaw}
                    </span>
                    <span className={styles.cellName}>{event.artistName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
