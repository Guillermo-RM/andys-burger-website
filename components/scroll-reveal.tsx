"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const sectionSelector = [
  "main > header",
  "main section",
  ".site-footer section",
].join(",");

const cardSelector = [
  "main article",
  ".contact-social__links > a",
].join(",");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(sectionSelector),
      ).filter((element) => !element.closest(".order-cart"));
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(cardSelector),
      ).filter((element) => !element.closest(".order-cart"));

      sections.forEach((element) => {
        element.classList.add("scroll-reveal");
      });

      cards.forEach((element, index) => {
        element.classList.add("scroll-reveal", "scroll-reveal--card");
        element.style.setProperty(
          "--reveal-delay",
          `${(index % 4) * 70}ms`,
        );
      });

      const elements = Array.from(new Set([...sections, ...cards]));

      if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        {
          threshold: 0,
          rootMargin: "0px 0px -4% 0px",
        },
      );

      elements.forEach((element) => observer?.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
