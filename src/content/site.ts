import type { ProjectIconName } from "@/components/art/ProjectIcon";

type Link = { label: string; href: string };
type Pillar = { label: string; text: string };
type Program = { number: string; name: string; description: string };
type Project = { name: string; tags: string[]; icon: ProjectIconName };
type ClubEvent = { date: string; name: string; location: string };
type Member = { name: string; role: string; initials: string };

export type Site = {
  name: string;
  tagline: string;
  /** `cta.shortLabel` replaces `cta.label` below `lg`, where the full label does not fit beside the brand, menu button and links. */
  nav: { links: [Link, Link, Link, Link]; cta: Link & { shortLabel: string } };
  hero: {
    pillars: [Pillar, Pillar, Pillar];
    mission: string;
    primaryCta: Link;
    secondaryCta: Link;
  };
  manifesto: { statements: [string, string, string, string] };
  programs: [Program, Program, Program];
  projects: Project[];
  /** Shown in the projects section while `projects` is empty. */
  projectsNote: string;
  events: ClubEvent[];
  team: [Member, Member, Member, Member];
  /** The e-board seat that is open. Shown in the events section, with a link to its application form, while `events` is empty. */
  openRole: { title: string; cta: Link };
  join: { headline: string; body: string; ctaLabel: string; ctaHref: string };
  footer: { newsletter: Link; socials: [Link, Link, Link, Link]; email: string };
  /** Generic interface copy for the 404 page (not club facts). */
  notFound: { code: string; heading: string; ctaLabel: string; ctaHref: string };
};

export const site: Site = {
  name: "sbuild",
  tagline: "SBU's First Tech Entrepreneurship Club",
  nav: {
    links: [
      { label: "programs", href: "#programs" },
      { label: "cohort program", href: "#projects" },
      // Reads "open role" while the events section holds the application; back to "events" once events exist.
      { label: "open role", href: "#events" },
      { label: "team", href: "#team" },
    ],
    cta: { label: "interest signup", shortLabel: "signup", href: "#join" },
  },
  hero: {
    pillars: [
      { label: "Build", text: "Turn your ideas into real projects." },
      { label: "Community", text: "Find your co-founders." },
      { label: "Founding", text: "Create your own startup." },
    ],
    mission: "Dream it. Build it. Own it.",
    // Both jump down the page: to the newsletter button in the footer and to the open-role slip.
    primaryCta: { label: "sign up for our newsletter", href: "#newsletter" },
    secondaryCta: { label: "Open Eboard applications", href: "#events" },
  },
  manifesto: {
    statements: ["[STATEMENT_1]", "[STATEMENT_2]", "[STATEMENT_3]", "[STATEMENT_4]"],
  },
  programs: [
    { number: "01", name: "[PROGRAM_1]", description: "[PROGRAM_1_DESCRIPTION]" },
    { number: "02", name: "[PROGRAM_2]", description: "[PROGRAM_2_DESCRIPTION]" },
    { number: "03", name: "[PROGRAM_3]", description: "[PROGRAM_3_DESCRIPTION]" },
  ],
  // Empty until the first projects ship: the section then shows `projectsNote` instead of tiles.
  projects: [],
  projectsNote: "coming soon...",
  // Empty for now: the events section then shows the open role (`openRole`) instead of slips.
  events: [],
  team: [
    { name: "[MEMBER_1]", role: "[MEMBER_1_ROLE]", initials: "[A]" },
    { name: "[MEMBER_2]", role: "[MEMBER_2_ROLE]", initials: "[B]" },
    { name: "[MEMBER_3]", role: "[MEMBER_3_ROLE]", initials: "[C]" },
    { name: "[MEMBER_4]", role: "[MEMBER_4_ROLE]", initials: "[D]" },
  ],
  openRole: {
    title: "Chief of Marketing",
    cta: { label: "apply", href: "https://forms.gle/Yx4GFUrt3EgmdHLH6" },
  },
  join: {
    headline: "[JOIN_HEADLINE]",
    body: "[JOIN_BODY]",
    ctaLabel: "interest signup",
    ctaHref: "https://forms.gle/nKBExRyn9YWgY2Tu8",
  },
  footer: {
    newsletter: { label: "sign up for our newsletter", href: "https://forms.gle/m8qa27jo8YkKS9nk6" },
    socials: [
      { label: "instagram", href: "[INSTAGRAM_URL]" },
      { label: "linkedin", href: "[LINKEDIN_URL]" },
      { label: "discord", href: "[DISCORD_URL]" },
      { label: "github", href: "[GITHUB_URL]" },
    ],
    email: "clubsbuild@gmail.com",
  },
  notFound: {
    code: "404",
    heading: "page not found",
    ctaLabel: "back to the homepage",
    ctaHref: "/",
  },
};
