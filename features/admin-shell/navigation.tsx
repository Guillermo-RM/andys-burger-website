"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "./icon";
import { modules } from "./modules";

export function AdminNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="rail-navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="rail-menu-toggle"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="admin-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d={open ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <div id="admin-menu" className="rail-menu" data-open={open}>
        <nav aria-label="Módulos">
          {modules.map(({ id, href, title }) => (
            <Link
              key={id}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <Icon name={id} />
              {title}
            </Link>
          ))}
        </nav>
        <form className="rail-logout" action="/admin/api/auth/logout" method="post">
          <button type="submit" className="logout">Cerrar sesión</button>
        </form>
      </div>
    </div>
  );
}
