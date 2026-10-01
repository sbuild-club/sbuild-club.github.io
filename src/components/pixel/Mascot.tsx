import { gridToRects, type PixelRect } from "./grid";
import styles from "./Mascot.module.css";

// Static class names so Tailwind can see them.
const tones: Record<string, string> = {
  p: "fill-paper",
  s: "fill-signal",
  a: "fill-amber",
  k: "fill-ink",
  g: "fill-phosphor",
};

// A small CRT-headed bot on a 16×16 grid. The upper body (rows 0–12) has two frames;
// the legs (rows 13–15) stay put.
const frameA = gridToRects([
  ".......aa.......",
  ".......pp.......",
  "...pppppppppp...",
  "...pkkkkkkkkp...",
  "...pkggkkggkp...",
  "...pkggkkggkp...",
  "...pkkkkkkkkp...",
  "...pppppppppp...",
  "......pppp......",
  "..ssssssssssss..",
  "..s.ssaassss.s..",
  "..s.ssssssss.s..",
  "..a.ssssssss.a..",
]);

// Blink, antenna tilt; drawn 1px lower so the body squashes onto the legs.
const frameB = gridToRects([
  "........aa......",
  ".......pp.......",
  "...pppppppppp...",
  "...pkkkkkkkkp...",
  "...pkkkkkkkkp...",
  "...pkggkkggkp...",
  "...pkkkkkkkkp...",
  "...pppppppppp...",
  "......pppp......",
  "..ssssssssssss..",
  "..s.ssaassss.s..",
  "..s.ssssssss.s..",
  "..a.ssssssss.a..",
]);

const legs = gridToRects([
  "....ss....ss....",
  "....ss....ss....",
  "...aaa....aaa...",
]);

function Pixels({ rects }: { rects: PixelRect[] }) {
  return rects.map((r, i) => (
    <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} className={tones[r.tone]} />
  ));
}

export function Mascot() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={64}
      height={64}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className="block"
    >
      <g transform="translate(0 13)">
        <Pixels rects={legs} />
      </g>
      <g className={styles.frameA}>
        <Pixels rects={frameA} />
      </g>
      <g className={styles.frameB} transform="translate(0 1)">
        <Pixels rects={frameB} />
      </g>
    </svg>
  );
}
