"use client";

import { useState } from "react";

export function PasswordInput() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        id="password"
        name="password"
        type={visible ? "text" : "password"}
        aria-label="Contraseña"
        placeholder="Contraseña"
        autoComplete="current-password"
        maxLength={256}
        required
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-controls="password"
        onClick={() => setVisible((current) => !current)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.5" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </div>
  );
}
