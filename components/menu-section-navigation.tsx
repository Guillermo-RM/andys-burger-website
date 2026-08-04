"use client";

import { useEffect, useState } from "react";

type MenuSectionNavigationProps = {
  items: ReadonlyArray<{
    id: string;
    name: string;
  }>;
};

export function MenuSectionNavigation({ items }: MenuSectionNavigationProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveItem = () => {
      const readingLine = window.innerHeight * 0.45;
      let currentId = items[0]?.id ?? "";

      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= readingLine) {
          currentId = item.id;
        }
      }

      setActiveId(currentId);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveItem);
    };

    updateActiveItem();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [items]);

  return (
    <nav className="menu-section-nav" aria-label="Navegación entre hamburguesas">
      {items.map((item, index) => {
        const isActive = activeId === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-label={`${String(index + 1).padStart(2, "0")} · ${item.name}`}
            aria-label={`Ir a la hamburguesa ${item.name}`}
            aria-current={isActive ? "location" : undefined}
          >
            <span className="sr-only">{item.name}</span>
          </a>
        );
      })}
    </nav>
  );
}
