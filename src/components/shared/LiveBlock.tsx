"use client";

import { buildArtistUrl, openInNewTab } from "@/lib/external-links";
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
  const handleOpen = () => openInNewTab(buildArtistUrl(contentId));

  return (
    <div
      className={styles.block}
      style={{
        backgroundColor: stageBackgroundColor(colorHsl),
        borderColor: stageBorderColor(colorHsl),
      }}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleOpen();
      }}
    >
      <div className={styles.time}>
        {formatMinutesToDisplay(startMinutes)}–{formatMinutesToDisplay(endMinutes)}
      </div>
      <div className={styles.name}>{artistName}</div>
    </div>
  );
}
