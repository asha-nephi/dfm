"use client";

import { useFormStatus } from "react-dom";

// Same disable-while-pending behavior as SubmitButton, plus a native
// confirm() gate before the form actually submits — for actions that
// permanently delete or otherwise can't be undone from the UI.
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  pendingText = "Removing...",
  className,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
