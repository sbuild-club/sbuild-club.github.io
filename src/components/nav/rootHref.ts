/**
 * Turns an in-page hash from site content ("#programs") into a root-relative link ("/#programs").
 * Nav and Footer also render on the 404 page, where a bare hash would resolve against the unknown
 * path and go nowhere. On the homepage "/#programs" is still a same-document jump (no reload, the
 * CSS smooth scroll applies). Anything else (mailto:, absolute URLs, placeholders) passes through.
 * Content keeps the bare hashes: sections look their headings up by `href === "#programs"`.
 */
export function rootHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}
