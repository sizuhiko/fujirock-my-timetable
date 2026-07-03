"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/basePath";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(withBasePath("/sw.js")).catch(() => {});
  }, []);

  return null;
}
