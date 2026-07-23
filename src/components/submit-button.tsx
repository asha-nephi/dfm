"use client";

import { useFormStatus } from "react-dom";

// Drop-in replacement for <button type="submit">. Disables itself while the
// enclosing form's action is in flight, so a second click (or double-tap on
// mobile) can't fire a duplicate request before the first one's redirect
// lands — e.g. posting the same comment twice.
export function SubmitButton({
  children,
  pendingText = "Sending...",
  className,
  disabled,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  /** Extra condition to stay disabled for even when not pending (e.g. "no rating picked yet"). */
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
