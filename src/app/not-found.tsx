import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <p>ページが見つかりませんでした。</p>
      <Link href="/" className={styles.homeLink}>
        マイタイムテーブルへ戻る
      </Link>
    </div>
  );
}
