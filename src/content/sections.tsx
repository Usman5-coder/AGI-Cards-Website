import { useState, type ReactNode } from "react";
import { ArrowRight, Moon, Sun, X, Menu } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { useReveal } from "@/hooks/use-reveal";
import type { MediaImage, Page, Section, SiteSettings, Theme } from "./site";

/* ---------- helpers ---------- */

const themeClass: Record<Theme, string> = {
  carbon: "bg-carbon text-bone",
  ink: "bg-ink text-bone",
  bone: "bg-bone text-carbon",
  surface: "bg-background text-foreground",
};

const isDarkTheme = (theme: Theme) => theme === "carbon" || theme === "ink";
const accent = (theme: Theme) => (isDarkTheme(theme) ? "text-cobalt-soft" : theme === "bone" ? "text-cobalt" : "text-primary");
const lineClass = (theme: Theme) => (isDarkTheme(theme) ? "border-line" : theme === "bone" ? "border-carbon/15" : "border-border");

function goTo(target: string) {
  if (!target) return;
  if (target.startsWith("#")) {
    document.getElementById(target.slice(1))?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.href = target;
}

export function Action({
  target,
  children,
  className = "",
}: {
  target: string;
  children: ReactNode;
  className?: string;
}) {
  if (target && !target.startsWith("#")) {
    return (
      <a href={target} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => goTo(target)} className={className}>
      {children}
    </button>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reveal = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={reveal.ref} style={reveal.style} className={`${reveal.className} ${className}`}>
      {children}
    </div>
  );
}

function Picture({
  image,
  priority = false,
  wrapperClassName = "",
}: {
  image: MediaImage | undefined;
  priority?: boolean;
  wrapperClassName?: string;
}) {
  if (!image?.src) return null;
  return (
    <SmartImage
      src={image.src}
      {...(image.fallback ? { fallback: image.fallback } : {})}
      alt={image.alt ?? ""}
      width={image.width || 1200}
      height={image.height || 900}
      priority={priority}
      wrapperClassName={wrapperClassName}
      className="object-contain"
    />
  );
}

/* ---------- section renderers ---------- */

function Hero({ section }: { section: Section }) {
  return (
    <section id={section.anchor || undefined} className="relative min-h-[92svh] overflow-hidden bg-carbon pt-18 text-bone">
      <div className="technical-grid absolute inset-0 opacity-30" />
      <div className="aurora absolute right-[12%] top-[18%] size-72 rounded-full bg-cobalt/15 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(92svh-4.5rem)] max-w-7xl items-center gap-8 px-5 py-14 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="z-10 lg:col-span-7">
          {section.eyebrow && (
            <div className="animate-fade-in mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-cobalt-soft">
              <span className="h-px w-10 bg-cobalt" />
              {section.eyebrow}
            </div>
          )}
          <h1 className="animate-fade-in max-w-3xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">{section.title}</h1>
          {section.body && <p className="animate-fade-in mt-7 max-w-xl text-base leading-relaxed text-bone/65 sm:text-lg">{section.body}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            {section.primary?.label && (
              <Action
                target={section.primary.target}
                className="group flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-semibold text-bone transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt-soft hover:text-carbon hover:shadow-[0_18px_46px_-18px_var(--cobalt)]"
              >
                {section.primary.label}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Action>
            )}
            {section.secondary?.label && (
              <Action
                target={section.secondary.target}
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-bone transition duration-300 hover:-translate-y-0.5 hover:border-bone/40"
              >
                {section.secondary.label}
              </Action>
            )}
          </div>
          {section.note && <p className="mt-9 text-sm font-medium text-bone/55">{section.note}</p>}
        </div>
        <div className="group relative flex items-center justify-center lg:col-span-5">
          <div className="aurora absolute size-[72%] rounded-full bg-cobalt/15 blur-3xl" />
          <Picture image={section.image} priority wrapperClassName="card-float relative z-10 w-full max-w-[520px] transition-transform duration-500 group-hover:scale-[1.03]" />
          {(section.tags ?? []).slice(0, 4).map((label, i) => (
            <span
              key={label}
              className={`absolute z-20 hidden items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-cobalt-soft transition-all duration-500 group-hover:text-bone sm:flex ${
                ["left-0 top-[22%]", "right-0 top-[35%]", "left-[10%] bottom-[18%]", "right-[12%] bottom-[10%]"][i]
              }`}
            >
              <span className="signal-pulse size-1.5 rounded-full bg-cobalt" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ticker({ section }: { section: Section }) {
  const items = section.items ?? [];
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4 text-bone">
      <div className="ticker-motion flex w-max gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-bone/50">
        {[0, 1].flatMap((round) =>
          items.map((item, j) => (
            <span key={`${round}-${j}`} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-cobalt">→</span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}

function Shell({ section, children, className = "" }: { section: Section; children: ReactNode; className?: string }) {
  const theme = section.theme ?? "surface";
  return (
    <section id={section.anchor || undefined} className={`${themeClass[theme]} py-24 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">{children}</div>
    </section>
  );
}

function Heading({ section }: { section: Section }) {
  const theme = section.theme ?? "surface";
  return (
    <Reveal>
      {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
      {section.title && <h2 className="mt-5 max-w-5xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{section.title}</h2>}
    </Reveal>
  );
}

function ListFlow({ section }: { section: Section }) {
  const theme = section.theme ?? "surface";
  return (
    <Shell section={section}>
      <Heading section={section} />
      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        {section.body && (
          <Reveal delay={120}>
            <p className="max-w-xl text-lg leading-relaxed opacity-70">{section.body}</p>
          </Reveal>
        )}
        <div className={`border-y py-2 ${lineClass(theme)}`}>
          {(section.items ?? []).map((item, i) => (
            <Reveal key={`${item}-${i}`} delay={140 + i * 110}>
              <div className={`group flex items-center gap-5 border-b py-4 transition-colors last:border-0 ${lineClass(theme)}`}>
                <span className={`text-xs ${accent(theme)}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl font-semibold transition-transform duration-300 group-hover:translate-x-1">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Compare({ section }: { section: Section }) {
  const theme = section.theme ?? "bone";
  return (
    <Shell section={{ ...section, theme }}>
      <Heading section={{ ...section, theme }} />
      <div className={`mt-14 grid border-y lg:grid-cols-2 ${lineClass(theme)}`}>
        <Reveal delay={100}>
          <div className={`py-8 lg:border-r lg:pr-12 ${lineClass(theme)}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-50">{section.leftTitle}</p>
            <ul className="mt-7 space-y-4">
              {(section.leftItems ?? []).map((item) => (
                <li key={item} className="flex items-center gap-3 opacity-65">
                  <span className="size-1.5 rounded-full bg-current opacity-40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className={`border-t py-8 lg:border-t-0 lg:pl-12 ${lineClass(theme)}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent(theme)}`}>{section.rightTitle}</p>
            <ul className="mt-7 space-y-4">
              {(section.rightItems ?? []).map((item) => (
                <li key={item} className="group flex items-center gap-3 font-medium transition-transform duration-300 hover:translate-x-1">
                  <span className={`size-1.5 rounded-full ${isDarkTheme(theme) ? "bg-cobalt" : "bg-cobalt"}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      {section.note && (
        <Reveal delay={160}>
          <p className="mt-8 max-w-3xl font-display text-2xl font-semibold">{section.note}</p>
        </Reveal>
      )}
    </Shell>
  );
}

function CardsExplorer({ section }: { section: Section }) {
  const cards = section.cards ?? [];
  const [active, setActive] = useState(0);
  const current = cards[Math.min(active, Math.max(cards.length - 1, 0))];
  const theme = section.theme ?? "carbon";
  return (
    <Shell section={{ ...section, theme }}>
      <Reveal>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
            <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight lg:text-5xl">{section.title}</h2>
          </div>
          {section.body && <p className="max-w-sm text-sm leading-relaxed opacity-55">{section.body}</p>}
        </div>
      </Reveal>
      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <div className="flex gap-2 overflow-x-auto pb-3 lg:col-span-4 lg:flex-col lg:overflow-visible">
          {cards.map((card, i) => (
            <button
              key={`${card.name}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`min-w-max border-l-2 px-5 py-4 text-left transition-all duration-300 lg:min-w-0 ${
                active === i ? "translate-x-1 border-cobalt bg-ink text-bone" : `${lineClass(theme)} opacity-50 hover:translate-x-1 hover:opacity-100`
              }`}
            >
              <span className="block text-[10px] uppercase tracking-[0.16em]">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 block font-display text-lg font-semibold">{card.name}</span>
            </button>
          ))}
        </div>
        <div className={`group relative min-h-[480px] overflow-hidden border bg-ink text-bone transition-shadow duration-500 hover:glow-ring lg:col-span-8 ${lineClass("ink")}`}>
          <div className="technical-grid absolute inset-0 opacity-20" />
          <div className="aurora absolute -right-10 top-10 size-56 rounded-full bg-cobalt/20 blur-3xl" />
          <div className="relative grid min-h-[480px] items-center gap-8 p-7 sm:p-10 lg:grid-cols-2">
            {current && (
              <div key={current.name} className="animate-fade-in">
                <span className="grid size-12 place-items-center rounded-lg bg-cobalt/15 font-display font-semibold text-cobalt-soft">{current.mark}</span>
                <p className="mt-8 text-xs uppercase tracking-[0.18em] text-cobalt-soft">{current.use}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold">{current.name}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-bone/55">{current.copy}</p>
                {section.primary?.label && (
                  <Action
                    target={section.primary.target}
                    className="mt-8 flex items-center gap-2 text-sm font-semibold text-cobalt-soft transition-colors hover:text-bone"
                  >
                    {section.primary.label}
                    <ArrowRight size={15} />
                  </Action>
                )}
              </div>
            )}
            <Picture image={section.image} wrapperClassName="mx-auto w-full max-w-[320px] transition-transform duration-500 group-hover:scale-105" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function TechExplorer({ section }: { section: Section }) {
  const pairs = section.pairs ?? [];
  const [active, setActive] = useState(0);
  const current = pairs[Math.min(active, Math.max(pairs.length - 1, 0))];
  const theme = section.theme ?? "surface";
  return (
    <Shell section={{ ...section, theme }}>
      <Heading section={{ ...section, theme }} />
      <div className="mt-14 grid items-center gap-12 lg:grid-cols-12">
        <Reveal delay={100} className="lg:col-span-7">
          <Picture image={section.image} wrapperClassName="w-full transition-transform duration-700 hover:scale-[1.02]" />
        </Reveal>
        <Reveal delay={200} className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-2">
            {pairs.map((pair, i) => (
              <button
                key={`${pair.label}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`lift border px-4 py-4 text-left text-sm font-semibold ${
                  active === i ? "border-cobalt bg-cobalt text-bone lift-hover" : `${lineClass(theme)} hover:border-cobalt hover:lift-hover`
                }`}
              >
                {pair.label}
              </button>
            ))}
          </div>
          {current && (
            <div key={current.label} className="animate-fade-in mt-6 border-l-2 border-cobalt pl-5">
              <p className="font-display text-2xl font-semibold">{current.label}</p>
              <p className="mt-3 leading-relaxed opacity-70">{current.copy}</p>
            </div>
          )}
        </Reveal>
      </div>
    </Shell>
  );
}

function Voice({ section }: { section: Section }) {
  const theme = section.theme ?? "ink";
  return (
    <section id={section.anchor || undefined} className={`${themeClass[theme]} py-24 lg:py-32`}>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div>
            {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
            <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">{section.title}</h2>
            {section.body && <p className="mt-6 max-w-xl leading-relaxed opacity-60">{section.body}</p>}
            <div className="mt-10 flex flex-wrap items-center gap-5 text-xs uppercase tracking-[0.16em] opacity-60">
              {(section.items ?? []).map((item, i) => (
                <span key={`${item}-${i}`} className="flex items-center gap-5">
                  {i > 0 && <ArrowRight size={14} className="text-cobalt" />}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className={`lift border bg-carbon p-8 text-bone hover:lift-hover ${lineClass("carbon")}`}>
            <div className="flex h-32 items-center gap-2">
              {[45, 75, 100, 55, 85, 35, 65, 90, 50, 72, 42, 60].map((h, i) => (
                <span key={i} className="voice-wave flex-1 rounded-full bg-cobalt" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            {section.note && <p className="mt-6 text-sm text-bone/45">{section.note}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Split({ section }: { section: Section }) {
  const theme = section.theme ?? "bone";
  const imageFirst = (section.imageSide ?? "left") === "left";
  const text = (
    <Reveal delay={imageFirst ? 140 : 0}>
      <div>
        {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
        <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">{section.title}</h2>
        {section.body && <p className="mt-6 leading-relaxed opacity-65">{section.body}</p>}
        {(section.extraTitle || section.extraBody) && (
          <div className={`mt-10 border-t pt-8 ${lineClass(theme)}`}>
            {section.extraTitle && <h3 className="font-display text-2xl font-semibold">{section.extraTitle}</h3>}
            {section.extraBody && <p className="mt-4 opacity-65">{section.extraBody}</p>}
          </div>
        )}
        {(section.tags ?? []).length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {(section.tags ?? []).map((tag) => (
              <span key={tag} className={`lift border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] hover:border-cobalt hover:lift-hover ${lineClass(theme)}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
  const media = (
    <Reveal delay={imageFirst ? 0 : 140}>
      <Picture image={section.image} wrapperClassName="w-full transition-transform duration-700 hover:scale-[1.02]" />
    </Reveal>
  );
  return (
    <section id={section.anchor || undefined} className={`${themeClass[theme]} overflow-hidden py-24 lg:py-32`}>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        {imageFirst ? media : text}
        {imageFirst ? text : media}
      </div>
    </section>
  );
}

function StepsFlow({ section }: { section: Section }) {
  const theme = section.theme ?? "carbon";
  const items = section.items ?? [];
  return (
    <Shell section={{ ...section, theme }}>
      <Reveal>
        {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
        <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">{section.title}</h2>
        {section.body && <p className="mt-6 max-w-2xl leading-relaxed opacity-60">{section.body}</p>}
      </Reveal>
      <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
        {items.map((item, i) => (
          <Reveal key={`${item}-${i}`} delay={i * 90}>
            <div className="flex items-center gap-3">
              {i > 0 && <span className="text-cobalt">→</span>}
              <div className={`lift border bg-ink px-6 py-6 text-center font-display font-semibold text-bone hover:border-cobalt hover:lift-hover ${lineClass("ink")}`}>{item}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

function PanelSteps({ section }: { section: Section }) {
  const theme = section.theme ?? "surface";
  return (
    <section id={section.anchor || undefined} className={`${themeClass[theme]} py-24 lg:py-32`}>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div>
            {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
            <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">{section.title}</h2>
            {section.body && <p className="mt-6 max-w-xl leading-relaxed opacity-70">{section.body}</p>}
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className={`lift border p-7 hover:lift-hover ${lineClass(theme)}`}>
            {section.extraTitle && <p className={`text-xs uppercase tracking-[0.18em] ${accent(theme)}`}>{section.extraTitle}</p>}
            {(section.items ?? []).map((item, i) => (
              <div key={`${item}-${i}`} className={`group flex items-center gap-4 border-b py-5 last:border-0 ${lineClass(theme)}`}>
                <span className={`grid size-8 place-items-center rounded-full border text-xs ${lineClass(theme)}`}>{i + 1}</span>
                <span className="font-medium transition-transform duration-300 group-hover:translate-x-1">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats({ section }: { section: Section }) {
  const theme = section.theme ?? "ink";
  return (
    <Shell section={{ ...section, theme }}>
      <Reveal>
        {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
        <h2 className="mt-5 max-w-5xl font-display text-4xl font-semibold leading-tight lg:text-6xl">{section.title}</h2>
        {section.body && <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-60">{section.body}</p>}
      </Reveal>
      <div className={`mt-16 grid border-y sm:grid-cols-3 ${lineClass(theme)}`}>
        {(section.pairs ?? []).map((pair, i) => (
          <Reveal key={`${pair.label}-${i}`} delay={i * 120}>
            <div className={`group border-t py-8 sm:border-t-0 sm:px-8 ${i > 0 ? `sm:border-l ${lineClass(theme)}` : ""} ${lineClass(theme)}`}>
              <span className="text-xs uppercase tracking-[0.18em] opacity-45">{pair.label}</span>
              <p className="mt-3 font-display text-xl font-semibold transition-transform duration-300 group-hover:translate-x-1">{pair.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

function Cta({ section }: { section: Section }) {
  const theme = section.theme ?? "carbon";
  return (
    <section id={section.anchor || undefined} className={`relative overflow-hidden ${themeClass[theme]} py-24 text-center lg:py-36`}>
      <div className="technical-grid absolute inset-0 opacity-20" />
      <div className="aurora absolute inset-x-0 bottom-0 mx-auto h-64 max-w-3xl bg-cobalt/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-5">
        <Reveal>
          {section.eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent(theme)}`}>{section.eyebrow}</p>}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{section.title}</h2>
          {section.body && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-60">{section.body}</p>}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {section.primary?.label && (
              <Action
                target={section.primary.target}
                className="group inline-flex items-center gap-2 rounded-full bg-cobalt px-7 py-3.5 text-sm font-semibold text-bone transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt-soft hover:text-carbon"
              >
                {section.primary.label}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Action>
            )}
            {section.secondary?.label && (
              <Action
                target={section.secondary.target}
                className={`rounded-full border px-7 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${lineClass(theme)}`}
              >
                {section.secondary.label}
              </Action>
            )}
          </div>
        </Reveal>
        {section.image?.src && (
          <Reveal delay={160}>
            <div className="group relative mx-auto mt-16 w-full max-w-[560px]">
              <span aria-hidden="true" className="ring-out absolute left-1/2 top-[62%] block size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cobalt/30" />
              <Picture image={section.image} wrapperClassName="card-float relative z-10 w-full transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function RichText({ section }: { section: Section }) {
  return (
    <Shell section={section}>
      <Reveal>
        {section.title && <h2 className="max-w-4xl font-display text-3xl font-semibold lg:text-4xl">{section.title}</h2>}
        {section.body && <p className="mt-6 max-w-3xl whitespace-pre-line leading-relaxed opacity-70">{section.body}</p>}
      </Reveal>
    </Shell>
  );
}

export function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} />;
    case "ticker":
      return <Ticker section={section} />;
    case "listFlow":
      return <ListFlow section={section} />;
    case "compare":
      return <Compare section={section} />;
    case "cardsExplorer":
      return <CardsExplorer section={section} />;
    case "techExplorer":
      return <TechExplorer section={section} />;
    case "voice":
      return <Voice section={section} />;
    case "split":
      return <Split section={section} />;
    case "stepsFlow":
      return <StepsFlow section={section} />;
    case "panelSteps":
      return <PanelSteps section={section} />;
    case "stats":
      return <Stats section={section} />;
    case "cta":
      return <Cta section={section} />;
    default:
      return <RichText section={section} />;
  }
}

/* ---------- header, footer, page ---------- */

function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    window.localStorage.setItem("agi-theme", next ? "dark" : "light");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 text-foreground backdrop-blur-xl dark:border-line dark:bg-carbon/90 dark:text-bone">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="/" className="flex items-baseline gap-2 font-display transition-transform duration-300 hover:-translate-y-0.5">
          <span className="text-lg font-semibold">{settings.brandPrimary}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary dark:text-cobalt-soft">{settings.brandSecondary}</span>
        </a>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {settings.nav.map((item) => (
            <Action
              key={`${item.label}-${item.target}`}
              target={item.target}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-bone/65 dark:hover:text-bone"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-cobalt transition-transform duration-300 group-hover:scale-x-100" />
            </Action>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Switch colour mode"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition duration-300 hover:rotate-12 hover:border-primary hover:text-primary dark:border-line dark:text-bone/70"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {settings.headerCta?.label && (
            <Action
              target={settings.headerCta.target}
              className="group hidden items-center gap-2 rounded-full bg-cobalt px-5 py-2.5 text-sm font-semibold text-bone transition duration-300 hover:bg-cobalt-soft hover:text-carbon sm:flex"
            >
              {settings.headerCta.label}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Action>
          )}
          <button type="button" aria-label="Toggle menu" className="grid size-10 place-items-center lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="animate-fade-in border-t border-border bg-background px-5 py-5 dark:border-line dark:bg-carbon lg:hidden">
          {settings.nav.map((item) => (
            <Action
              key={`m-${item.label}`}
              target={item.target}
              className="block w-full border-b border-border py-3 text-left text-sm text-muted-foreground last:border-0 hover:text-foreground dark:border-line dark:text-bone/75"
            >
              {item.label}
            </Action>
          ))}
        </nav>
      )}
    </header>
  );
}

function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-line bg-carbon py-14 text-bone">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="flex items-baseline gap-2 font-display">
            <span className="text-xl font-semibold">{settings.brandPrimary}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cobalt-soft">{settings.brandSecondary}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/45">{settings.footerTagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
          {settings.footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bone/35">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Action target={link.target} className="text-left text-sm text-bone/60 transition-all duration-300 hover:translate-x-1 hover:text-bone">
                      {link.label}
                    </Action>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-line px-5 pt-6 text-xs text-bone/30 sm:flex-row lg:px-8">
        <span>{settings.footerLeft}</span>
        <span className="uppercase tracking-[0.16em]">{settings.footerRight}</span>
      </div>
    </footer>
  );
}

export function PageView({ page, settings }: { page: Page; settings: SiteSettings }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader settings={settings} />
      <main id="top" className={page.sections[0]?.type === "hero" ? "" : "pt-18"}>
        {page.sections.map((section) => (
          <SectionView key={section.id} section={section} />
        ))}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
