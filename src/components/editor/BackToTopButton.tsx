"use client";

import { ArrowUpIcon } from "@/components/shared/icons/ArrowUpIcon";
import styles from "./BackToTopButton.module.css";

export function BackToTopButton() {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="ページの先頭に戻る"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpIcon />
    </button>
  );
}
