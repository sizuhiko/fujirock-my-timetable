import { buildArtistUrl } from "@/lib/external-links";
import { formatMinutesToDisplay } from "@/lib/time";
import { stageBackgroundColor, stageBorderColor } from "@/lib/stageColor";
import styles from "./LiveBlock.module.css";

export function LiveBlock({
  artistName,
  contentId,
  startMinutes,
  endMinutes,
  colorHsl,
}: {
  artistName: string;
  contentId: string;
  startMinutes: number;
  endMinutes: number;
  colorHsl: string | undefined;
}) {
  return (
    <a
      href={buildArtistUrl(contentId)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.block}
      style={{
        backgroundColor: stageBackgroundColor(colorHsl),
        borderColor: stageBorderColor(colorHsl),
      }}
    >
      <div className={styles.time}>
        {formatMinutesToDisplay(startMinutes)}–{formatMinutesToDisplay(endMinutes)}
      </div>
      <div className={styles.name}>{artistName}</div>
    </a>
  );
}
