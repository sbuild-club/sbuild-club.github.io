import type { ProjectIconName } from "@/components/art/ProjectIcon";

type Link = { label: string; href: string };
type Pillar = { label: string; text: string };
type Program = { number: string; name: string; description: string };
type Project = { name: string; tags: string[]; icon: ProjectIconName };
type ClubEvent = { date: string; name: string; location: string };
type Member = {
  name: string;
  role: string;
  /** Shown on the avatar when there is no photo. */
  initials: string;
  /**
   * Optional photo, served from public/team/: "/team/name.jpg". Square, about 600×600, a JPG
   * under ~150 KB, face centred (the avatar is a circle). See docs/CODE-GUIDE.md §9.
   */
  photo?: string;
  /** Optional personal site or profile. The photo and name become one link (new tab) with a ↗ badge. */
  href?: string;
};

export type Site = {
  name: string;
  tagline: string;
  /** `cta.shortLabel` replaces `cta.label` below `lg`, where the full label does not fit beside the brand, menu button and links. */
  nav: {
    /** The words beside the badge, read as "name: descriptor" (the nav adds the colon on one-line layouts). */
    brand: { name: string; descriptor: string };
    /** Three while the programs section is hidden; back to four (`#programs` first) when it returns. */
    links: [Link, Link, Link];
    cta: Link & { shortLabel: string };
  };
  hero: {
    pillars: [Pillar, Pillar, Pillar];
    mission: string;
    primaryCta: Link;
    secondaryCta: Link;
  };
  /**
   * The mission block right under the hero: a display heading over short paragraphs. `lead` is set
   * in bold and runs straight into the first paragraph; the last paragraph is the call-out.
   */
  manifesto: { heading: string; lead: string; paragraphs: [string, ...string[]] };
  programs: [Program, Program, Program];
  projects: Project[];
  /** Shown in the projects section while `projects` is empty. */
  projectsNote: string;
  events: ClubEvent[];
  team: [Member, Member, Member, Member];
  /** The e-board seat that is open. Shown in the events section, with a link to its application form, while `events` is empty. */
  openRole: { title: string; cta: Link };
  /** `body` is optional: leave it out (or comment it out) and the join section shows just the headline and button. */
  join: { headline: string; body?: string; ctaLabel: string; ctaHref: string };
  footer: { newsletter: Link; socials: [Link, Link, Link, Link]; email: string };
  /** Generic interface copy for the 404 page (not club facts). */
  notFound: { code: string; heading: string; ctaLabel: string; ctaHref: string };
};

/** The newsletter sign-up form: the footer's newsletter button and the nav's signup button both open it. */
const newsletterForm = "https://forms.gle/m8qa27jo8YkKS9nk6";

export const site: Site = {
  name: "sbuild",
  tagline: "SBU's First Tech Entrepreneurship Club",
  nav: {
    brand: { name: "Sbuild", descriptor: "Innovators & Founders Community" },
    links: [
      // Hidden with the programs section (see page.tsx); restore both together.
      // { label: "programs", href: "#programs" },
      { label: "cohort program", href: "#projects" },
      // Reads "open role" while the events section holds the application; back to "events" once events exist.
      { label: "open role", href: "#events" },
      { label: "team", href: "#team" },
    ],
    cta: { label: "interest signup", shortLabel: "signup", href: newsletterForm },
  },
  hero: {
    pillars: [
      { label: "Founding", text: "Create your own startup" },
      { label: "Community", text: "Grow entrepreneurship connections" },
      { label: "Innovate", text: "Turn your ideas into useful products" },
    ],
    mission: "Dream it. Build it. Own it.",
    // Both jump down the page: to the newsletter button in the footer and to the open-role slip.
    primaryCta: { label: "sign up for our newsletter", href: "#newsletter" },
    secondaryCta: { label: "Open Eboard applications", href: "#events" },
  },
  manifesto: {
    heading: "Mission",
    lead: "Sbuild: Innovators & Founders Community",
    paragraphs: [
      "provides support, resources and community to launch ideas into something useful for people and find cofounders.",
      "If you don't have ideas, join the community that incubates ideas and innovation, gain exposure to tech startups!",
    ],
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
    {
      name: "Xiang Liu",
      role: "President",
      initials: "XL",
      photo: "/team/xiang.jpg",
      href: "https://xiang1103.github.io/",
    },
    { name: "[MEMBER_2]", role: "[MEMBER_2_ROLE]", initials: "[B]" },
    { name: "[MEMBER_3]", role: "[MEMBER_3_ROLE]", initials: "[C]" },
    { name: "[MEMBER_4]", role: "[MEMBER_4_ROLE]", initials: "[D]" },
  ],
  openRole: {
    title: "Chief of Marketing",
    cta: { label: "apply", href: "https://forms.gle/Yx4GFUrt3EgmdHLH6" },
  },
  join: {
    headline: "LAUNCHING IN SPRING 2027",
    // Hidden for now; uncomment to show a paragraph under the headline.
    // body: "[JOIN_BODY]",
    ctaLabel: "interest signup",
    ctaHref: "https://forms.gle/nKBExRyn9YWgY2Tu8",
  },
  footer: {
    newsletter: { label: "sign up for our newsletter", href: newsletterForm },
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
