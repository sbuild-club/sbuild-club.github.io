import { Bungee, Fredoka, Nunito } from "next/font/google";

// Three families (docs/CONTRACT.md, "Tokens"): display, label, body.
// Fredoka and Nunito are variable fonts, so every weight the type styles use is available.
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const fontVariables = [bungee, fredoka, nunito].map((font) => font.variable).join(" ");
