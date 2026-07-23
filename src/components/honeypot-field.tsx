import { HONEYPOT_FIELD_NAME } from "@/lib/spam-protection";

// Invisible to real users, catnip for bots that auto-fill every field.
// Positioned off-screen rather than display:none — some bots skip hidden
// fields entirely, fewer skip ones that are merely off-canvas.
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label>
        Leave this field blank
        <input type="text" name={HONEYPOT_FIELD_NAME} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
