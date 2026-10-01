import styles from "./GridFloor.module.css";

// Faint perspective grid in the lower half of the hero. The parent (Hero's section) is
// `relative isolate overflow-hidden`, so -z-10 keeps it behind the hero content.
export function GridFloor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 -z-10 overflow-hidden">
      <div className={styles.viewport}>
        <div className={styles.plane}>
          <div className={styles.lines} />
        </div>
      </div>
    </div>
  );
}
