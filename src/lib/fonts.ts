import { IBM_Plex_Mono, IBM_Plex_Sans, Silkscreen, Unbounded } from "next/font/google";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
const silkscreen = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-silkscreen", display: "swap" });

export const fontVariables = [unbounded, plexSans, plexMono, silkscreen].map((font) => font.variable).join(" ");
