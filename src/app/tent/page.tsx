"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AddTentButton } from "@/components/tent/AddTentButton";
import { DeleteTentButton } from "@/components/tent/DeleteTentButton";
import { NavigateButton } from "@/components/tent/NavigateButton";
import { deleteTentLocation, getTentLocation, saveTentLocation } from "@/lib/db/tent";
import type { TentLocation } from "@/lib/db/schema";
import styles from "./page.module.css";

const TentMap = dynamic(() => import("@/components/tent/TentMap"), { ssr: false });

export default function TentPage() {
  const [tent, setTent] = useState<TentLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTentLocation().then((result) => {
      setTent(result);
      setLoading(false);
    });
  }, []);

  const handleSave = async (lat: number, lng: number) => {
    await saveTentLocation(lat, lng);
    setTent(await getTentLocation());
  };

  const handleDelete = async () => {
    await deleteTentLocation();
    setTent(null);
  };

  return (
    <div className={styles.page}>
      {loading ? (
        <p className={styles.loading}>読み込み中...</p>
      ) : tent ? (
        <div className={styles.registered}>
          <TentMap lat={tent.lat} lng={tent.lng} />
          <div className={styles.actions}>
            <NavigateButton lat={tent.lat} lng={tent.lng} />
            <DeleteTentButton onDelete={handleDelete} />
          </div>
        </div>
      ) : (
        <AddTentButton onSave={handleSave} />
      )}
    </div>
  );
}
