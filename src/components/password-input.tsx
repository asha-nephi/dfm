"use client";

import { useState } from "react";

export function PasswordInput({
  id,
  name,
  required,
  minLength,
  autoComplete,
  className,
}: {
  id: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className={`${className ?? ""} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-navy-black/40 hover:text-navy-black/70"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.2A10.6 10.6 0 0112 5c5 0 9 4 10.5 7-.6 1.2-1.5 2.5-2.7 3.6M6.2 6.2C4 7.7 2.4 9.7 1.5 12c1.5 3 5.5 7 10.5 7 1.4 0 2.7-.3 3.9-.8"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
            />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
