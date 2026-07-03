"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/shared/icons/PlusIcon";
import styles from "./AddTentButton.module.css";

export function AddTentButton({ onSave }: { onSave: (lat: number, lng: number) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!("geolocation" in navigator)) {
      setError("この端末では位置情報を利用できません。");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onSave(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setError(`現在地の取得に失敗しました: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button} onClick={handleClick} disabled={loading}>
        <PlusIcon />
        <span>{loading ? "現在地を取得中..." : "現在地をマイテントとして登録"}</span>
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
