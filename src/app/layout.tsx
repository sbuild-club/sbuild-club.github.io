import type { Metadata } from "next";
import { Intro } from "@/components/intro/Intro";
import { Scanlines } from "@/components/pixel/Scanlines";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.hero.mission,
};

// Runs before first paint: "pending" shows the intro overlay, "done" skips it.
// No JS leaves data-intro absent, so the overlay never shows.
const introGate = `(function(){var d=document.documentElement;try{d.dataset.intro=(sessionStorage.getItem("sbuild:intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)?"done":"pending";setTimeout(function(){if(d.dataset.intro==="pending")d.dataset.intro="done"},8000)}catch(e){d.dataset.intro="done"}})()`;

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
      <body className="bg-ink font-body text-paper antialiased">
        <Intro />
        {children}
        <Scanlines />
      </body>
    </html>
  );
}
