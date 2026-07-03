"use client";

import { isValidTimeString } from "@/lib/time";
import styles from "./FoodTimeRangePicker.module.css";

export function FoodTimeRangePicker({
  startRaw,
  endRaw,
  onChangeStart,
  onChangeEnd,
}: {
  startRaw: string;
  endRaw: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
}) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>
        開始時刻
        <input
          type="text"
          inputMode="numeric"
          placeholder="例: 15:30"
          value={startRaw}
          onChange={(e) => onChangeStart(e.target.value)}
          className={
            startRaw === "" || isValidTimeString(startRaw) ? styles.input : styles.inputError
          }
        />
      </label>
      <label className={styles.label}>
        終了時刻
        <input
          type="text"
          inputMode="numeric"
          placeholder="例: 16:00"
          value={endRaw}
          onChange={(e) => onChangeEnd(e.target.value)}
          className={endRaw === "" || isValidTimeString(endRaw) ? styles.input : styles.inputError}
        />
      </label>
      <p className={styles.note}>
        日をまたぐ時刻は「24:30」のように24時以降の表記で入力してください。
      </p>
    </div>
  );
}
