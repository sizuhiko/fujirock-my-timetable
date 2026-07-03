"use client";

import { buildGoogleMapsWalkingUrl, openInNewTab } from "@/lib/external-links";
import { NavigateIcon } from "@/components/shared/icons/NavigateIcon";
import styles from "./NavigateButton.module.css";

export function NavigateButton({ lat, lng }: { lat: number; lng: number }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => openInNewTab(buildGoogleMapsWalkingUrl(lat, lng))}
    >
      <NavigateIcon />
      <span>テントまでナビゲーション</span>
    </button>
  );
}
