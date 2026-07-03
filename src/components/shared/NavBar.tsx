"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

const LINKS = [
  { href: "/", label: "マイタイムテーブル" },
  { href: "/edit", label: "編集" },
  { href: "/tent", label: "マイテント" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>フジロック マイタイムテーブル</h1>
      <div className={styles.links}>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? styles.activeLink : styles.link}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
