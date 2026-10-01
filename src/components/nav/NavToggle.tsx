"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const PANEL_ID = "primary-menu";

type NavToggleProps = {
  /** Server-rendered link list. Always in the DOM; only its visibility is toggled below md. */
  children: ReactNode;
};

/**
 * Mobile disclosure for the primary nav. Renders the toggle button and the panel that wraps the
 * server-rendered links. From md up the button is hidden and the panel is always shown inline.
 * Closes on link click, on a click outside the panel, on Escape and when focus leaves the panel.
 */
export function NavToggle({ children }: NavToggleProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

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
      const insidePanel = panelRef.current?.contains(target) ?? false;
      if (!insidePanel || target.closest("a")) setOpen(false);
    }

    // Tabbing out of the panel (e.g. on to "join") closes it, so it never covers the next focus target.
    function onFocusOut(event: FocusEvent) {
      const next = event.relatedTarget;
      if (next instanceof Node && (panel?.contains(next) || buttonRef.current?.contains(next))) return;
      setOpen(false);
    }

    const panel = panelRef.current;
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
        className="inline-flex size-10 shrink-0 items-center justify-center border-2 border-paper hover:border-amber hover:bg-amber hover:text-ink aria-expanded:bg-paper aria-expanded:text-ink md:hidden"
      >
        <svg
          viewBox="0 0 16 16"
          width={16}
          height={16}
          shapeRendering="crispEdges"
          fill="currentColor"
          aria-hidden="true"
        >
          {open ? (
            <>
              <rect x="2" y="2" width="2" height="2" />
              <rect x="4" y="4" width="2" height="2" />
              <rect x="6" y="6" width="4" height="4" />
              <rect x="10" y="10" width="2" height="2" />
              <rect x="12" y="12" width="2" height="2" />
              <rect x="12" y="2" width="2" height="2" />
              <rect x="10" y="4" width="2" height="2" />
              <rect x="4" y="10" width="2" height="2" />
              <rect x="2" y="12" width="2" height="2" />
            </>
          ) : (
            <>
              <rect x="1" y="3" width="14" height="2" />
              <rect x="1" y="7" width="14" height="2" />
              <rect x="1" y="11" width="10" height="2" />
            </>
          )}
        </svg>
      </button>

      <div
        ref={panelRef}
        id={PANEL_ID}
        data-open={open}
        className="absolute inset-x-0 top-[calc(100%+2px)] hidden max-h-[calc(100svh-4rem)] overflow-y-auto border-b-2 border-paper bg-ink px-4 pt-2 pb-6 data-[open=true]:block sm:px-6 md:static md:block md:max-h-none md:overflow-visible md:border-0 md:bg-transparent md:p-0"
      >
        {children}
      </div>
    </>
  );
}
