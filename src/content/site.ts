import type { PixelIconName } from "@/components/pixel/PixelIcon";

type Link = { label: string; href: string };
type Program = { number: string; name: string; description: string };
type Project = { name: string; tags: string[]; icon: PixelIconName };
type ClubEvent = { date: string; name: string; location: string };
type Member = { name: string; role: string; initials: string };

export type Site = {
  name: string;
  nav: { links: [Link, Link, Link, Link]; cta: Link };
  hero: {
    headlineLines: [string, string, string];
    mission: string;
    primaryCta: Link;
    secondaryCta: Link;
  };
  manifesto: { statements: [string, string, string, string] };
  programs: [Program, Program, Program];
  projects: [Project, Project, Project, Project, Project, Project];
  events: [ClubEvent, ClubEvent, ClubEvent, ClubEvent];
  team: [Member, Member, Member, Member, Member, Member];
  join: { headline: string; body: string; ctaLabel: string; ctaHref: string };
  footer: { socials: [Link, Link, Link, Link]; email: string };
};

export const site: Site = {
  name: "sbuild",
  nav: {
    links: [
      { label: "programs", href: "#programs" },
      { label: "projects", href: "#projects" },
      { label: "events", href: "#events" },
      { label: "team", href: "#team" },
    ],
    cta: { label: "join", href: "#join" },
  },
  hero: {
    headlineLines: ["[HEADLINE_LINE_1]", "[HEADLINE_LINE_2]", "[HEADLINE_LINE_3]"],
    mission: "[MISSION]",
    primaryCta: { label: "[PRIMARY_CTA]", href: "#join" },
    secondaryCta: { label: "[SECONDARY_CTA]", href: "#programs" },
  },
  manifesto: {
    statements: ["[STATEMENT_1]", "[STATEMENT_2]", "[STATEMENT_3]", "[STATEMENT_4]"],
  },
  programs: [
    { number: "01", name: "[PROGRAM_1]", description: "[PROGRAM_1_DESCRIPTION]" },
    { number: "02", name: "[PROGRAM_2]", description: "[PROGRAM_2_DESCRIPTION]" },
    { number: "03", name: "[PROGRAM_3]", description: "[PROGRAM_3_DESCRIPTION]" },
  ],
  projects: [
    { name: "[PROJECT_1]", tags: ["[P1_TAG_1]", "[P1_TAG_2]"], icon: "rocket" },
    { name: "[PROJECT_2]", tags: ["[P2_TAG_1]", "[P2_TAG_2]"], icon: "wrench" },
    { name: "[PROJECT_3]", tags: ["[P3_TAG_1]", "[P3_TAG_2]"], icon: "lightbulb" },
    { name: "[PROJECT_4]", tags: ["[P4_TAG_1]", "[P4_TAG_2]"], icon: "chip" },
    { name: "[PROJECT_5]", tags: ["[P5_TAG_1]", "[P5_TAG_2]"], icon: "terminal" },
    { name: "[PROJECT_6]", tags: ["[P6_TAG_1]", "[P6_TAG_2]"], icon: "satellite" },
  ],
  events: [
    { date: "[EVENT_1_DATE]", name: "[EVENT_1]", location: "[EVENT_1_LOCATION]" },
    { date: "[EVENT_2_DATE]", name: "[EVENT_2]", location: "[EVENT_2_LOCATION]" },
    { date: "[EVENT_3_DATE]", name: "[EVENT_3]", location: "[EVENT_3_LOCATION]" },
    { date: "[EVENT_4_DATE]", name: "[EVENT_4]", location: "[EVENT_4_LOCATION]" },
  ],
  team: [
    { name: "[MEMBER_1]", role: "[MEMBER_1_ROLE]", initials: "[A]" },
    { name: "[MEMBER_2]", role: "[MEMBER_2_ROLE]", initials: "[B]" },
    { name: "[MEMBER_3]", role: "[MEMBER_3_ROLE]", initials: "[C]" },
    { name: "[MEMBER_4]", role: "[MEMBER_4_ROLE]", initials: "[D]" },
    { name: "[MEMBER_5]", role: "[MEMBER_5_ROLE]", initials: "[E]" },
    { name: "[MEMBER_6]", role: "[MEMBER_6_ROLE]", initials: "[F]" },
  ],
  join: {
    headline: "[JOIN_HEADLINE]",
    body: "[JOIN_BODY]",
    ctaLabel: "[JOIN_CTA]",
    ctaHref: "[JOIN_URL]",
  },
  footer: {
    socials: [
      { label: "instagram", href: "[INSTAGRAM_URL]" },
      { label: "linkedin", href: "[LINKEDIN_URL]" },
      { label: "discord", href: "[DISCORD_URL]" },
      { label: "github", href: "[GITHUB_URL]" },
    ],
    email: "[EMAIL]",
  },
};
