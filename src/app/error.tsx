"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <p>問題が発生しました。</p>
      <p className={styles.message}>ページを再読み込みするか、しばらくしてからお試しください。</p>
      <div className={styles.actions}>
        <button type="button" className={styles.retryButton} onClick={reset}>
          もう一度試す
        </button>
        <Link href="/" className={styles.homeLink}>
          マイタイムテーブルへ戻る
        </Link>
      </div>
    </div>
  );
}
