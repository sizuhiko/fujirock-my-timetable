"use client";

import { useState } from "react";
import Image from "next/image";
import { isValidTimeString, parseTimeToMinutes } from "@/lib/time";
import type { FoodArea } from "@/lib/data/types";
import { FoodTimeRangePicker } from "./FoodTimeRangePicker";
import styles from "./FoodAreaPicker.module.css";

export function FoodAreaPickerContent({
  foodAreas,
  initialStartRaw,
  initialEndRaw,
  onClose,
  onConfirm,
}: {
  foodAreas: FoodArea[];
  initialStartRaw: string;
  initialEndRaw: string;
  onClose: () => void;
  onConfirm: (input: { area: FoodArea; startRaw: string; endRaw: string }) => void;
}) {
  const [selectedArea, setSelectedArea] = useState<FoodArea | null>(null);
  const [startRaw, setStartRaw] = useState(initialStartRaw);
  const [endRaw, setEndRaw] = useState(initialEndRaw);

  const canConfirm =
    selectedArea !== null &&
    isValidTimeString(startRaw) &&
    isValidTimeString(endRaw) &&
    parseTimeToMinutes(endRaw) > parseTimeToMinutes(startRaw);

  const handleConfirm = () => {
    if (!canConfirm || !selectedArea) return;
    onConfirm({ area: selectedArea, startRaw, endRaw });
  };

  if (!selectedArea) {
    return (
      <>
        <h2 className={styles.title}>行くフードエリアを選択</h2>
        <div className={styles.grid}>
          {foodAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              className={styles.areaCard}
              onClick={() => setSelectedArea(area)}
            >
              <div className={styles.areaImageWrapper}>
                <Image
                  src={area.imageUrl}
                  alt={area.name}
                  fill
                  sizes="(max-width: 560px) 33vw, 180px"
                  className={styles.areaImage}
                />
              </div>
              <span>{area.name}</span>
            </button>
          ))}
        </div>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          キャンセル
        </button>
      </>
    );
  }

  return (
    <>
      <h2 className={styles.title}>{selectedArea.name} へ行く時間</h2>
      <FoodTimeRangePicker
        startRaw={startRaw}
        endRaw={endRaw}
        onChangeStart={setStartRaw}
        onChangeEnd={setEndRaw}
      />
      <div className={styles.actions}>
        <button type="button" className={styles.backButton} onClick={() => setSelectedArea(null)}>
          戻る
        </button>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={!canConfirm}
        >
          追加
        </button>
      </div>
    </>
  );
}
