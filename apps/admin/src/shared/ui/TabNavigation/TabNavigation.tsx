import { memo } from "react";

import { Link } from "@tanstack/react-router";

import type { TabNavigationItem } from "@/shared/config/profile/profileTabs";
import { cn } from "@/shared/lib/utils";

import styles from "./TabNavigation.module.scss";

export interface TabNavigationProps {
  items: TabNavigationItem[];
  className?: string;
}

export const TabNavigation = memo(({ items, className }: TabNavigationProps) => {
  return (
    <nav className={cn(styles.container, className)}>
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.route}
          className={styles.item}
          activeProps={{
            className: styles.active,
          }}
          activeOptions={{ exact: false }}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
});

TabNavigation.displayName = "TabNavigation";
