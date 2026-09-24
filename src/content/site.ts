/**
 * Editable site content model.
 * The whole site (pages, sections, text, images, nav, footer) is described by
 * this document. The admin panel at /secret-admin edits it and stores it in the
 * database; the public pages render from it with these values as the fallback.
 */

export type Theme = "carbon" | "ink" | "bone" | "surface";

export type MediaImage = {
  src: string;
  fallback?: string;
  alt: string;
  width: number;
  height: number;
};

export type LinkItem = { label: string; target: string };
export type CardItem = { name: string; mark: string; use: string; copy: string };
export type PairItem = { label: string; copy: string };

export type SectionType =
  | "hero"
  | "ticker"
  | "listFlow"
  | "compare"
  | "cardsExplorer"
  | "techExplorer"
  | "voice"
  | "split"
  | "stepsFlow"
  | "panelSteps"
  | "stats"
  | "cta"
  | "richText";

export type Section = {
  id: string;
  type: SectionType;
  anchor?: string;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  body?: string;
  extraTitle?: string;
  extraBody?: string;
  note?: string;
  primary?: LinkItem;
  secondary?: LinkItem;
  image?: MediaImage;
  imageSide?: "left" | "right";
  items?: string[];
  tags?: string[];
  cards?: CardItem[];
  pairs?: PairItem[];
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: string[];
  rightItems?: string[];
};

export type Page = {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  sections: Section[];
};

export type FooterColumn = { title: string; links: LinkItem[] };

export type SiteSettings = {
  brandPrimary: string;
  brandSecondary: string;
  nav: LinkItem[];
  headerCta: LinkItem;
  footerTagline: string;
  footerColumns: FooterColumn[];
  footerLeft: string;
  footerRight: string;
};

export type SiteContent = { settings: SiteSettings; pages: Page[] };

/* ---------- admin form descriptors ---------- */

export type FieldKind =
  | "text"
  | "textarea"
  | "image"
  | "list"
  | "cards"
  | "pairs"
  | "link"
  | "theme"
  | "side";

export type Field = { key: keyof Section; label: string; kind: FieldKind };

const F = {
  anchor: { key: "anchor", label: "Anchor id (used by menu links)", kind: "text" } as Field,
  theme: { key: "theme", label: "Background style", kind: "theme" } as Field,
  eyebrow: { key: "eyebrow", label: "Small label above title", kind: "text" } as Field,
  title: { key: "title", label: "Title", kind: "textarea" } as Field,
  body: { key: "body", label: "Paragraph", kind: "textarea" } as Field,
  extraTitle: { key: "extraTitle", label: "Second title", kind: "textarea" } as Field,
  extraBody: { key: "extraBody", label: "Second paragraph", kind: "textarea" } as Field,
  note: { key: "note", label: "Small note", kind: "textarea" } as Field,
  primary: { key: "primary", label: "Main button", kind: "link" } as Field,
  secondary: { key: "secondary", label: "Second button", kind: "link" } as Field,
  image: { key: "image", label: "Image", kind: "image" } as Field,
  imageSide: { key: "imageSide", label: "Image position", kind: "side" } as Field,
  items: { key: "items", label: "List items", kind: "list" } as Field,
  tags: { key: "tags", label: "Tags", kind: "list" } as Field,
  cards: { key: "cards", label: "Cards", kind: "cards" } as Field,
  pairs: { key: "pairs", label: "Items", kind: "pairs" } as Field,
  leftTitle: { key: "leftTitle", label: "Left column title", kind: "text" } as Field,
  leftItems: { key: "leftItems", label: "Left column items", kind: "list" } as Field,
  rightTitle: { key: "rightTitle", label: "Right column title", kind: "text" } as Field,
  rightItems: { key: "rightItems", label: "Right column items", kind: "list" } as Field,
};

export const sectionTypes: { type: SectionType; label: string; fields: Field[] }[] = [
  {
    type: "hero",
    label: "Hero (big opening screen)",
    fields: [F.anchor, F.eyebrow, F.title, F.body, F.primary, F.secondary, F.note, F.image, F.tags],
  },
  { type: "ticker", label: "Scrolling word strip", fields: [F.items] },
  {
    type: "listFlow",
    label: "Title with numbered flow list",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.items],
  },
  {
    type: "compare",
    label: "Two column comparison",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.leftTitle, F.leftItems, F.rightTitle, F.rightItems, F.note],
  },
  {
    type: "cardsExplorer",
    label: "Interactive card explorer",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.cards, F.image, F.primary],
  },
  {
    type: "techExplorer",
    label: "Interactive technology picker",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.image, F.pairs],
  },
  {
    type: "voice",
    label: "Voice section with animated bars",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.items, F.note],
  },
  {
    type: "split",
    label: "Text next to an image",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.extraTitle, F.extraBody, F.tags, F.image, F.imageSide],
  },
  {
    type: "stepsFlow",
    label: "Horizontal step flow",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.items],
  },
  {
    type: "panelSteps",
    label: "Text with numbered panel",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.extraTitle, F.items],
  },
  {
    type: "stats",
    label: "Three column highlights",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.pairs],
  },
  {
    type: "cta",
    label: "Closing call to action",
    fields: [F.anchor, F.theme, F.eyebrow, F.title, F.body, F.primary, F.secondary, F.image],
  },
  { type: "richText", label: "Simple title and text", fields: [F.anchor, F.theme, F.title, F.body] },
];

export function fieldsFor(type: SectionType): Field[] {
  return sectionTypes.find((entry) => entry.type === type)?.fields ?? [];
}

export function labelFor(type: SectionType): string {
  return sectionTypes.find((entry) => entry.type === type)?.label ?? type;
}

export function newId(prefix = "s"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function blankSection(type: SectionType): Section {
  const base: Section = { id: newId(), type, theme: "surface" };
  const fields = fieldsFor(type).map((f) => f.key);
  if (fields.includes("title")) base.title = "New section title";
  if (fields.includes("body")) base.body = "Describe this section here.";
  if (fields.includes("eyebrow")) base.eyebrow = "Label";
  if (fields.includes("items")) base.items = ["First item", "Second item"];
  if (fields.includes("cards")) base.cards = [{ name: "Card", mark: "01", use: "Purpose", copy: "What this card does." }];
  if (fields.includes("pairs")) base.pairs = [{ label: "Item", copy: "Description of the item." }];
  if (fields.includes("leftItems")) {
    base.leftTitle = "Option A";
    base.leftItems = ["Point one"];
    base.rightTitle = "Option B";
    base.rightItems = ["Point one"];
  }
  if (fields.includes("primary")) base.primary = { label: "Learn more", target: "#contact" };
  if (type === "hero") base.theme = "carbon";
  return base;
}

/* ---------- default content (the current site) ---------- */

const asset = "/images/agi-cards";

const img = (
  name: string,
  alt: string,
  width: number,
  height: number,
  fallback?: string,
): MediaImage => ({ src: `${asset}/${name}`, alt, width, height, ...(fallback ? { fallback: `${asset}/${fallback}` } : {}) });

export const defaultContent: SiteContent = {
  settings: {
    brandPrimary: "AGI",
    brandSecondary: "Cards",
    nav: [
      { label: "Platform", target: "#why" },
      { label: "Cards", target: "#cards" },
      { label: "Technology", target: "#technology" },
      { label: "Agents", target: "#agents" },
      { label: "Security", target: "#security" },
    ],
    headerCta: { label: "Explore the platform", target: "#contact" },
    footerTagline: "A physical AI interface platform. Purpose-built intelligence for the physical world.",
    footerColumns: [
      {
        title: "Platform",
        links: [
          { label: "What is AGI Cards?", target: "#why" },
          { label: "Technology", target: "#technology" },
          { label: "AGI Agents", target: "#agents" },
        ],
      },
      {
        title: "Cards",
        links: [
          { label: "Health", target: "#cards" },
          { label: "Voice", target: "#cards" },
          { label: "Identity", target: "#cards" },
          { label: "Payments", target: "#cards" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "Healthcare", target: "#cards" },
          { label: "Elderly", target: "#cards" },
          { label: "Enterprise", target: "#cards" },
          { label: "Accessibility", target: "#cards" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", target: "#why" },
          { label: "Security", target: "#security" },
          { label: "Contact", target: "#contact" },
        ],
      },
    ],
    footerLeft: "© 2026 AGI Cards",
    footerRight: "Physical AI interface platform",
  },
  pages: [
    {
      id: "home",
      slug: "/",
      name: "Home",
      title: "AGI Cards — The Physical AI Interface",
      description:
        "AGI Cards bring AI, voice, sensing and purpose-built intelligence into the physical world through intelligent card-based interfaces.",
      sections: [
        {
          id: "hero",
          type: "hero",
          anchor: "top",
          theme: "carbon",
          eyebrow: "The physical AI interface",
          title: "The AI interface you can hold.",
          body: "AGI Cards bring voice, intelligence, sensing and purpose-built experiences into the physical world — without turning everything into another app.",
          primary: { label: "Explore AGI Cards", target: "#cards" },
          secondary: { label: "See how it works", target: "#how" },
          note: "One physical platform. Many intelligent interfaces.",
          image: img("agi-card-hero.webp", "AGI Card with voice interface floating above a blue-lit platform", 1080, 1350, "agi-card-hero.png"),
          tags: ["VOICE", "IDENTITY", "SENSING", "AI"],
        },
        {
          id: "ticker",
          type: "ticker",
          items: ["Voice", "Health", "Identity", "Payments", "Access", "Loyalty", "Transit", "More"],
        },
        {
          id: "why",
          type: "listFlow",
          anchor: "why",
          theme: "surface",
          eyebrow: "01 — The gap",
          title: "We put AI everywhere except where life happens.",
          body: "AI transformed screens, software and applications. The physical world still depends on fragmented cards, credentials, devices and manual processes. AGI Cards bridge that gap.",
          items: ["Physical world", "AGI Cards", "AI intelligence", "Real-world action"],
        },
        {
          id: "how",
          type: "compare",
          anchor: "how",
          theme: "bone",
          eyebrow: "02 — A different model",
          title: "The smartphone is general-purpose. AGI Cards are purpose-built.",
          leftTitle: "Smartphone",
          leftItems: ["One device, many apps", "Constant screen interaction", "General-purpose interface", "Software-first"],
          rightTitle: "AGI Cards",
          rightItems: [
            "Purpose-built physical interfaces",
            "Voice-first experiences",
            "Dynamic information",
            "Designed around specific human needs",
          ],
          note: "A smartphone is a Swiss Army knife. An AGI Card is the tool designed for the job.",
        },
        {
          id: "cards",
          type: "cardsExplorer",
          anchor: "cards",
          theme: "carbon",
          eyebrow: "03 — Explore the cards",
          title: "One platform. A growing world of intelligent cards.",
          body: "Each interface is designed for its purpose. Together, they form one coherent physical AI ecosystem.",
          primary: { label: "Explore this card", target: "#contact" },
          image: img("agi-card-base.webp", "AGI Card mounted in its wireless base", 800, 800, "agi-card-base.png"),
          cards: [
            { name: "Health Card", mark: "+", use: "Health information", copy: "A dedicated interface for health-related information and supported signals." },
            { name: "National ID", mark: "ID", use: "Identity & credentials", copy: "A purpose-built identity and credential experience in a physical form." },
            { name: "Voice Card", mark: "VO", use: "Natural interaction", copy: "A voice-first path to useful AI experiences without another app in the way." },
            { name: "Payments", mark: "→", use: "Payment interaction", copy: "A focused physical payment experience built around the moment of use." },
            { name: "Transit", mark: "TR", use: "Mobility & access", copy: "A dedicated mobility interface for transit-related information and access." },
            { name: "Loyalty", mark: "LY", use: "Customer engagement", copy: "A tangible customer relationship interface for loyalty experiences." },
          ],
        },
        {
          id: "technology",
          type: "techExplorer",
          anchor: "technology",
          theme: "surface",
          eyebrow: "04 — More than a card",
          title: "It looks like a card. It behaves like an intelligent interface.",
          image: img("agi-intelligence-map.webp", "AGI Card surrounded by connected intelligent experiences", 1400, 1400, "agi-intelligence-map.png"),
          pairs: [
            { label: "Voice", copy: "Natural, voice-first interaction for experiences that should not begin with tapping through an app." },
            { label: "AI", copy: "Intelligence connects the person's intent to the purpose of each physical interface." },
            { label: "Sensors", copy: "Supported health, environmental and contextual signals can inform the experience." },
            { label: "Display", copy: "Dynamic information appears on the card where and when it is useful." },
            { label: "Wireless", copy: "The existing platform materials show Qi-powered wireless capability." },
            { label: "Security", copy: "Control and purpose-built architecture are treated as foundations, not add-ons." },
          ],
        },
        {
          id: "voice",
          type: "voice",
          theme: "ink",
          eyebrow: "05 — Voice first",
          title: "Stop tapping. Start talking.",
          body: "Voice creates a more direct path between a person, the purpose of the card, and the intelligence behind it. The interface stays focused on the moment instead of opening another screen.",
          items: ["User speaks", "AI processes", "Card responds"],
          note: "Voice signal → relevant intelligent response",
        },
        {
          id: "health",
          type: "split",
          theme: "bone",
          imageSide: "left",
          eyebrow: "06 — Health & people",
          title: "Health intelligence, closer to the person.",
          body: "A dedicated physical interface can bring health-related information and supported signals closer to the person — focused on access, understanding and the moment of need.",
          extraTitle: "Technology should adapt to people — not the other way around.",
          extraBody:
            "Purpose-built interfaces can emphasize simplicity, accessibility, voice and dedicated purpose for elderly, faith and other human-centered experiences.",
          image: img("agi-ecosystem.webp", "AGI Cards ecosystem showing card, base, and connected services", 1131, 1600, "agi-ecosystem.png"),
        },
        {
          id: "agents",
          type: "stepsFlow",
          anchor: "agents",
          theme: "carbon",
          eyebrow: "07 — The intelligence layer",
          title: "Physical interfaces. Intelligent agents.",
          body: "Cards are the interface. Agents are the intelligence behind the interface. Together, they connect human intent to useful information, decisions and actions.",
          items: ["Human", "AGI Card", "AGI Agent", "Action"],
        },
        {
          id: "security",
          type: "panelSteps",
          anchor: "security",
          theme: "surface",
          eyebrow: "08 — Trust by design",
          title: "Intelligence without giving up control.",
          body: "The existing AGI Cards positioning puts governed decisions, offline operation, sovereignty and always-on access at the center. The redesigned platform presents those principles precisely—without inventing technical claims.",
          extraTitle: "Controlled data flow",
          items: ["Physical interaction", "Purpose-built interface", "Relevant intelligence", "User-controlled outcome"],
        },
        {
          id: "patents",
          type: "split",
          theme: "bone",
          imageSide: "right",
          eyebrow: "09 — Patented technology",
          title: "Engineered for the physical AI era.",
          body: "The card, wireless power, dynamic display, voice, sensing and intelligence are designed as one physical system. The existing product materials identify the technology as patented; no patent numbers are asserted here.",
          tags: ["Card", "Wireless power", "Dynamic display", "Voice", "Sensors", "AI"],
          image: img("qi-wireless-product.webp", "AGI Cards patented Qi-powered wireless product presentation", 1400, 788, "qi-wireless-product.png"),
        },
        {
          id: "platform",
          type: "stats",
          theme: "ink",
          eyebrow: "10 — From card to platform",
          title: "We're not building another card. We're building a platform.",
          body: "The card is the physical form. The larger opportunity is a platform of purpose-built intelligent interfaces for people, organizations, healthcare, identity, payments, mobility, access, loyalty and specialized experiences.",
          pairs: [
            { label: "Today", copy: "Cards carry information." },
            { label: "Tomorrow", copy: "Interfaces understand context." },
            { label: "Future", copy: "Purpose-built objects become intelligent." },
          ],
        },
        {
          id: "contact",
          type: "cta",
          anchor: "contact",
          theme: "carbon",
          eyebrow: "Ready for the physical AI layer?",
          title: "The next interface isn't another screen.",
          body: "It's something you can hold, speak to, trust, and use in the real world.",
          primary: { label: "Explore AGI Cards", target: "#cards" },
          secondary: { label: "Talk to AGI Cards", target: "mailto:contact@agi-cards.com" },
          image: img("agi-card-cta.webp", "AGI Card floating above its wireless charging base with a glowing blue edge", 1200, 900),
        },
      ],
    },
  ],
};

export function normalizeContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") return defaultContent;
  const doc = raw as Partial<SiteContent>;
  if (!Array.isArray(doc.pages) || doc.pages.length === 0 || !doc.settings) return defaultContent;
  return { settings: { ...defaultContent.settings, ...doc.settings }, pages: doc.pages };
}

export function findPage(content: SiteContent, slug: string): Page | undefined {
  const wanted = slug === "" ? "/" : slug.startsWith("/") ? slug : `/${slug}`;
  return content.pages.find((page) => (page.slug === "" ? "/" : page.slug) === wanted);
}
