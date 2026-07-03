"use client";

import { useState } from "react";
import { ReloadIcon } from "@/components/shared/icons/ReloadIcon";
import styles from "./ReloadButton.module.css";

export function ReloadButton({ onReload }: { onReload: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onReload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick} disabled={loading}>
      <ReloadIcon />
      {loading ? "更新中..." : "最新の情報に更新"}
    </button>
  );
}
