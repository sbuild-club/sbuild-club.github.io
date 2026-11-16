/** Joins static class strings, dropping empty ones. Never use it to build class names from parts. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
