"use client";

import { useEffect, useState } from "react";
import { DayTabs } from "@/components/shared/DayTabs";
import { MyTimetableDay } from "@/components/viewer/MyTimetableDay";
import { fetchStages } from "@/lib/data/fetchStaticData";
import { listAllForDay } from "@/lib/db/myTimetable";
import type { FestivalDay, StagesData } from "@/lib/data/types";
import type { MyFoodPlan, MyLiveSelection } from "@/lib/db/schema";
import styles from "./ViewerPageClient.module.css";

type DayData = { lives: MyLiveSelection[]; foodPlans: MyFoodPlan[] };

export function ViewerPageClient() {
  const [activeDay, setActiveDay] = useState<FestivalDay>(1);
  const [stages, setStages] = useState<StagesData>({});
  const [dataByDay, setDataByDay] = useState<Partial<Record<FestivalDay, DayData>>>({});

  useEffect(() => {
    fetchStages()
      .then(setStages)
      .catch(() => setStages({}));
  }, []);

  useEffect(() => {
    if (dataByDay[activeDay]) return;
    let cancelled = false;
    listAllForDay(activeDay).then((result) => {
      if (cancelled) return;
      setDataByDay((prev) => ({ ...prev, [activeDay]: result }));
    });
    return () => {
      cancelled = true;
    };
  }, [activeDay, dataByDay]);

  const dayData = dataByDay[activeDay];

  return (
    <div className={styles.page}>
      <DayTabs activeDay={activeDay} onChange={setActiveDay} />
      {!dayData ? (
        <p className={styles.loading}>読み込み中...</p>
      ) : (
        <MyTimetableDay lives={dayData.lives} foodPlans={dayData.foodPlans} stages={stages} />
      )}
    </div>
  );
}
