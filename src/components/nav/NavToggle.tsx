"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const PANEL_ID = "primary-menu";

type NavToggleProps = {
  /** Server-rendered link list. Always in the DOM; only its visibility is toggled below md. */
  children: ReactNode;
};

/**
 * Mobile disclosure for the primary nav: the cut-key menu button (48px) and the panel that wraps
 * the server-rendered links. From md up the button is hidden and the panel shows inline.
 * Closes on link click, on a click outside the panel, on Escape (focus returns to the button)
 * and when focus leaves the panel. Without JS the panel stays collapsed below md.
 */
export function NavToggle({ children }: NavToggleProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      // The button toggles itself.
      if (buttonRef.current?.contains(target)) return;
      const insidePanel = panel?.contains(target) ?? false;
      if (!insidePanel || target.closest("a")) setOpen(false);
    }

    // Tabbing out of the panel (on to "join") closes it, so it never covers the next focus target.
    function onFocusOut(event: FocusEvent) {
      const next = event.relatedTarget;
      if (next instanceof Node && (panel?.contains(next) || buttonRef.current?.contains(next))) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    panel?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      panel?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((value) => !value)}
        className="group relative inline-flex size-12 shrink-0 cursor-pointer items-center justify-center text-cream md:hidden"
      >
        {/* The cut is on a child, so the focus ring on the button stays whole. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-teal cut-key group-hover:bg-navy group-aria-expanded:bg-navy"
        />
        <svg
          viewBox="0 0 24 24"
          width={24}
          height={24}
          aria-hidden="true"
          focusable="false"
          className="relative block group-active:translate-y-0.5 motion-safe:transition-transform"
        >
          <path
            d={open ? "M5 5 L19 19 M19 5 L5 19" : "M3 6 L21 5 M3 12 L21 12 M3 18 L21 19"}
            strokeWidth="3"
            strokeLinecap="round"
            className="fill-none stroke-current"
          />
        </svg>
      </button>

      <div
        ref={panelRef}
        id={PANEL_ID}
        data-open={open}
        className="absolute inset-x-0 top-full hidden max-h-[calc(100svh-4rem)] overflow-y-auto bg-cream px-4 pt-1 pb-4 data-[open=true]:block sm:px-6 md:static md:block md:max-h-none md:overflow-visible md:bg-transparent md:p-0"
      >
        {children}
      </div>
    </>
  );
}
