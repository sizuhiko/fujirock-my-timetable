"use client";

import styles from "./DeleteTentButton.module.css";

export function DeleteTentButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button type="button" className={styles.button} onClick={onDelete}>
      登録位置を削除
    </button>
  );
}
