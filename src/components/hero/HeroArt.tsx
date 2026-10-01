import { Mascot } from "@/components/pixel/Mascot";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import styles from "./Hero.module.css";

const BAR_CELLS = 10;
const BAR_FILLED = 7;

/**
 * The hero's pixel illustration: a framed "screen" holding one PixelIcon, with the Mascot
 * perched across its top border and a stepped boot-progress bar. Purely decorative.
 */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="relative border-2 border-paper bg-ink p-5 shadow-[6px_6px_0_var(--signal)] sm:p-6">
      {/* Breaks the frame: sits across the top border. */}
      <div className="absolute -top-9 right-5 sm:right-8">
        <Mascot />
      </div>

      {/* Pixel stars. */}
      <span className="absolute top-6 left-[46%] size-2 bg-amber" />
      <span className="absolute top-16 left-[62%] size-1 bg-paper" />
      <span className="absolute top-[45%] right-6 size-2 bg-paper" />
      <span className="absolute top-[38%] left-[54%] size-1 bg-amber" />

      <div className={styles.float}>
        <PixelIcon name="rocket" size={128} className="text-signal" />
      </div>

      <div className="mt-6 grid grid-cols-10 gap-1">
        {Array.from({ length: BAR_CELLS }, (_, i) =>
          i < BAR_FILLED ? (
            <span key={i} className="h-3 bg-signal" />
          ) : i === BAR_FILLED ? (
            <span key={i} className="h-3 bg-amber intro-done:motion-safe:animate-blink" />
          ) : (
            <span key={i} className="h-3 border border-paper/40" />
          ),
        )}
      </div>
    </div>
  );
}
