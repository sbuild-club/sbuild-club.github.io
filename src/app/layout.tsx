import type { Metadata, Viewport } from "next";
import { Intro } from "@/components/intro/Intro";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sbuild-club.github.io"),
  title: site.name,
  description: site.tagline,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
  },
};

// Browser UI colour = the cream token (--cream in globals.css). Metadata cannot read CSS variables.
export const viewport: Viewport = {
  themeColor: "#f8efd6",
};

// Runs before first paint. data-intro: "pending" shows the intro overlay, "done" skips it.
// data-intro-shown: when the page was first visible (performance.now() ms). A page Chrome prerenders
// (it does for sites typed into the address bar) or one opened in a background tab runs this unseen,
// so the timeline and the 8 s failsafe wait for that moment.
// --scrollbar-width: the classic scrollbar's width (0 for overlay scrollbars); globals.css pads the
// page by it while the intro covers the window, in place of the scrollbar gutter.
// No JS leaves data-intro absent, so the overlay never shows.
const introGate = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("sbuild:intro")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="done";return}var p=document.createElement("div"),c=document.createElement("div");p.style.cssText="position:absolute;visibility:hidden;overflow:scroll;width:99px;height:99px";p.appendChild(c);d.appendChild(p);d.style.setProperty("--scrollbar-width",p.getBoundingClientRect().width-c.getBoundingClientRect().width+"px");d.removeChild(p);d.dataset.intro="pending";var shown=function(){if(document.prerendering||document.visibilityState!=="visible"||d.dataset.introShown)return;d.dataset.introShown=String(Math.round(performance.now()));setTimeout(function(){if(d.dataset.intro==="pending")d.dataset.intro="done"},8000)};document.addEventListener("visibilitychange",shown);document.addEventListener("prerenderingchange",shown);shown()}catch(e){d.dataset.intro="done"}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
      </head>
      <body className="bg-cream font-body text-navy antialiased">
        <Intro />
        {children}
      </body>
    </html>
  );
}
