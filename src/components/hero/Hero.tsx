import { site } from "@/content/site";

// Stub: the shell lane replaces this. Keep #wordmark[data-intro-target] (see docs/CONTRACT.md).
export function Hero() {
  return (
    <section id="top">
      <h1 id="wordmark" data-intro-target className="font-display text-6xl font-bold tracking-tighter lowercase">
        {site.name}
      </h1>
      <div className="border-2 border-dashed border-paper/40 p-8 font-mono text-sm text-paper/70">Hero</div>
    </section>
  );
}
