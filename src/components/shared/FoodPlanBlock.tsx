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
  return (
    <div className={styles.block}>
      <a href={detailUrl} target="_blank" rel="noopener noreferrer" className={styles.info}>
        <div className={styles.time}>
          {formatMinutesToDisplay(startMinutes)}–{formatMinutesToDisplay(endMinutes)}
        </div>
        <div className={styles.name}>フードエリア: {name}</div>
      </a>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          aria-label="この予定を削除"
          onClick={onDelete}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
