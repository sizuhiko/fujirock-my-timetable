import { ArrowDownIcon } from "@/components/shared/icons/ArrowDownIcon";
import styles from "./ScrollToFoodAreaLink.module.css";

export const FOOD_AREA_SECTION_ID = "food-area";

export function ScrollToFoodAreaLink() {
  return (
    <a href={`#${FOOD_AREA_SECTION_ID}`} className={styles.link}>
      <ArrowDownIcon />
      フードエリアへ
    </a>
  );
}
