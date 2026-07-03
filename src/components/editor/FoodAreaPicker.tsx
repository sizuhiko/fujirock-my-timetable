"use client";

import { useEffect, useRef } from "react";
import { formatMinutesToDisplay, type TimeRange } from "@/lib/time";
import type { FoodArea } from "@/lib/data/types";
import { FoodAreaPickerContent } from "./FoodAreaPickerContent";
import styles from "./FoodAreaPicker.module.css";

export function FoodAreaPicker({
  open,
  sessionToken,
  foodAreas,
  suggestedRange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  sessionToken: number;
  foodAreas: FoodArea[];
  suggestedRange: TimeRange | null;
  onClose: () => void;
  onConfirm: (input: { area: FoodArea; startRaw: string; endRaw: string }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <FoodAreaPickerContent
        key={sessionToken}
        foodAreas={foodAreas}
        initialStartRaw={suggestedRange ? formatMinutesToDisplay(suggestedRange.startMinutes) : ""}
        initialEndRaw={suggestedRange ? formatMinutesToDisplay(suggestedRange.endMinutes) : ""}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </dialog>
  );
}
