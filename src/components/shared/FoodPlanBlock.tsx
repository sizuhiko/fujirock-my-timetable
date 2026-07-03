"use client";

import { openInNewTab } from "@/lib/external-links";
import { formatMinutesToDisplay } from "@/lib/time";
import { TrashIcon } from "./icons/TrashIcon";
import styles from "./FoodPlanBlock.module.css";

export function FoodPlanBlock({
  name,
  detailUrl,
  startMinutes,
  endMinutes,
  onDelete,
}: {
  name: string;
  detailUrl: string;
  startMinutes: number;
  endMinutes: number;
  onDelete?: () => void;
}) {
  const handleOpen = () => openInNewTab(detailUrl);

  return (
    <div
      className={styles.block}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleOpen();
      }}
    >
      <div className={styles.info}>
        <div className={styles.time}>
          {formatMinutesToDisplay(startMinutes)}–{formatMinutesToDisplay(endMinutes)}
        </div>
        <div className={styles.name}>フードエリア: {name}</div>
      </div>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          aria-label="この予定を削除"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
