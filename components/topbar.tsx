"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brandNavigation } from "@/lib/brand";

export function Topbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link className="topbar__brand" href="/" aria-label="Andy&apos;s Burger, ir al inicio">
          <h2 className="topbar__title">
            Andy&apos;s <span className="topbar__title-accent">Burger</span>
          </h2>
        </Link>

        <button
          className="topbar__menu-button"
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="topbar__menu-icon" aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className="topbar__nav"
          aria-label="Navegación principal"
          data-open={isMenuOpen}
        >
          {brandNavigation.map((item) => (
            <Link
              key={item.href}
              className="topbar__link"
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
