"use client";

import { useEffect, useMemo, useState } from "react";
import { DayTabs } from "@/components/shared/DayTabs";
import { OfficialTimetableGrid } from "@/components/editor/OfficialTimetableGrid";
import { MyTimetablePreview } from "@/components/editor/MyTimetablePreview";
import { FoodAreaPicker } from "@/components/editor/FoodAreaPicker";
import { ReloadButton } from "@/components/editor/ReloadButton";
import {
  FOOD_AREA_SECTION_ID,
  ScrollToFoodAreaLink,
} from "@/components/editor/ScrollToFoodAreaLink";
import { BackToTopButton } from "@/components/editor/BackToTopButton";
import { fetchFoodAreas, fetchStages, fetchTimetableDay } from "@/lib/data/fetchStaticData";
import {
  addFoodPlan,
  addLiveSelection,
  listAllForDay,
  removeFoodPlan,
  removeLiveSelection,
} from "@/lib/db/myTimetable";
import { parseTimeToMinutes, type TimeRange } from "@/lib/time";
import type {
  FestivalDay,
  FoodArea,
  StagesData,
  TimetableDay,
  TimetableEvent,
} from "@/lib/data/types";
import type { MyFoodPlan, MyLiveSelection } from "@/lib/db/schema";
import styles from "./EditorPageClient.module.css";

type MyDayData = { lives: MyLiveSelection[]; foodPlans: MyFoodPlan[] };

export function EditorPageClient() {
  const [activeDay, setActiveDay] = useState<FestivalDay>(1);
  const [stages, setStages] = useState<StagesData>({});
  const [foodAreas, setFoodAreas] = useState<FoodArea[]>([]);
  // undefined = not yet fetched, null = fetch failed
  const [timetableByDay, setTimetableByDay] = useState<
    Partial<Record<FestivalDay, TimetableDay | null>>
  >({});
  const [myDataByDay, setMyDataByDay] = useState<Partial<Record<FestivalDay, MyDayData>>>({});
  const [picker, setPicker] = useState<{ open: boolean; range: TimeRange | null; token: number }>({
    open: false,
    range: null,
    token: 0,
  });

  useEffect(() => {
    fetchStages()
      .then(setStages)
      .catch(() => setStages({}));
    fetchFoodAreas()
      .then(setFoodAreas)
      .catch(() => setFoodAreas([]));
  }, []);

  useEffect(() => {
    if (timetableByDay[activeDay] !== undefined) return;
    let cancelled = false;
    fetchTimetableDay(activeDay)
      .then((data) => {
        if (cancelled) return;
        setTimetableByDay((prev) => ({ ...prev, [activeDay]: data }));
      })
      .catch(() => {
        if (cancelled) return;
        setTimetableByDay((prev) => ({ ...prev, [activeDay]: null }));
      });
    return () => {
      cancelled = true;
    };
  }, [activeDay, timetableByDay]);

  useEffect(() => {
    if (myDataByDay[activeDay]) return;
    let cancelled = false;
    listAllForDay(activeDay).then((result) => {
      if (cancelled) return;
      setMyDataByDay((prev) => ({ ...prev, [activeDay]: result }));
    });
    return () => {
      cancelled = true;
    };
  }, [activeDay, myDataByDay]);

  const timetableDay = timetableByDay[activeDay];
  const myData = myDataByDay[activeDay];
  const lives = useMemo(() => myData?.lives ?? [], [myData]);
  const foodPlans = myData?.foodPlans ?? [];
  const selectedEventKeys = useMemo(() => new Set(lives.map((l) => l.eventKey)), [lives]);

  const refreshMyData = (day: FestivalDay) =>
    listAllForDay(day).then((result) => setMyDataByDay((prev) => ({ ...prev, [day]: result })));

  const handleToggleLive = async (event: TimetableEvent) => {
    const id = `${activeDay}-${event.eventKey}`;
    if (selectedEventKeys.has(event.eventKey)) {
      await removeLiveSelection(id);
    } else {
      await addLiveSelection(event, activeDay);
    }
    await refreshMyData(activeDay);
  };

  const handleReload = () =>
    fetchTimetableDay(activeDay, { cache: "no-store" })
      .then((data) => setTimetableByDay((prev) => ({ ...prev, [activeDay]: data })))
      .catch(() => setTimetableByDay((prev) => ({ ...prev, [activeDay]: null })));

  const handleGapClick = (range: TimeRange) =>
    setPicker((prev) => ({ open: true, range, token: prev.token + 1 }));
  const closePicker = () => setPicker((prev) => ({ ...prev, open: false }));

  const handleConfirmFoodPlan = async (input: {
    area: FoodArea;
    startRaw: string;
    endRaw: string;
  }) => {
    await addFoodPlan({
      day: activeDay,
      foodArea: input.area,
      startRaw: input.startRaw,
      endRaw: input.endRaw,
      startMinutes: parseTimeToMinutes(input.startRaw),
      endMinutes: parseTimeToMinutes(input.endRaw),
    });
    closePicker();
    await refreshMyData(activeDay);
  };

  const handleDeleteFoodPlan = async (id: string) => {
    await removeFoodPlan(id);
    await refreshMyData(activeDay);
  };

  return (
    <div className={styles.page}>
      <DayTabs activeDay={activeDay} onChange={setActiveDay} />
      <ScrollToFoodAreaLink />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>公式タイムテーブル</h2>
          <ReloadButton onReload={handleReload} />
        </div>
        {timetableDay === undefined ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : timetableDay ? (
          <OfficialTimetableGrid
            timetableDay={timetableDay}
            stages={stages}
            selectedEventKeys={selectedEventKeys}
            onToggle={handleToggleLive}
          />
        ) : (
          <p className={styles.loading}>タイムテーブルを読み込めませんでした。</p>
        )}
      </section>

      <section id={FOOD_AREA_SECTION_ID} className={styles.section}>
        <h2>フードエリア</h2>
        <MyTimetablePreview
          lives={lives}
          foodPlans={foodPlans}
          stages={stages}
          onDeleteFoodPlan={handleDeleteFoodPlan}
          onGapClick={handleGapClick}
        />
      </section>

      <FoodAreaPicker
        open={picker.open}
        sessionToken={picker.token}
        foodAreas={foodAreas}
        suggestedRange={picker.range}
        onClose={closePicker}
        onConfirm={handleConfirmFoodPlan}
      />
      <BackToTopButton />
    </div>
  );
}
