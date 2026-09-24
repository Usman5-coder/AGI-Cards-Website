import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  blankSection,
  defaultContent,
  fieldsFor,
  labelFor,
  newId,
  normalizeContent,
  sectionTypes,
  type CardItem,
  type Field,
  type LinkItem,
  type MediaImage,
  type PairItem,
  type Page,
  type Section,
  type SectionType,
  type SiteContent,
  type Theme,
} from '@/content/site';

const ADMIN_EMAIL = 'mhdusman1313@gmail.com';
const BUCKET = 'site-media';

/* ---------------- shared inputs ---------------- */

const field =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary';
const btn =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition disabled:opacity-50';
const btnPrimary = `${btn} admin-cta`;
const btnGhost = `${btn} border border-border text-foreground hover:border-primary`;

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function TextRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Labeled label={label}>
      <input className={field} value={value} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

function AreaRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Labeled label={label}>
      <textarea className={`${field} min-h-[84px] resize-y`} value={value} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

function LinkRow({ label, value, onChange }: { label: string; value: LinkItem; onChange: (v: LinkItem) => void }) {
  return (
    <Labeled label={label}>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={field} placeholder="Button text" value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} />
        <input
          className={field}
          placeholder="#section, /page or https://…"
          value={value.target}
          onChange={(e) => onChange({ ...value, target: e.target.value })}
        />
      </div>
    </Labeled>
  );
}

function ListRow({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Labeled label={label}>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={field}
              value={item}
              onChange={(e) => onChange(value.map((v, j) => (i === j ? e.target.value : v)))}
            />
            <button type="button" className={btnGhost} onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className={btnGhost} onClick={() => onChange([...value, ''])}>
          + Add item
        </button>
      </div>
    </Labeled>
  );
}

function CardsRow({ label, value, onChange }: { label: string; value: CardItem[]; onChange: (v: CardItem[]) => void }) {
  const patch = (i: number, part: Partial<CardItem>) => onChange(value.map((c, j) => (i === j ? { ...c, ...part } : c)));
  return (
    <Labeled label={label}>
      <div className="space-y-3">
        {value.map((card, i) => (
          <div key={i} className="space-y-2 rounded-md border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <input className={field} placeholder="Name" value={card.name} onChange={(e) => patch(i, { name: e.target.value })} />
              <input className={field} placeholder="Badge (e.g. ID)" value={card.mark} onChange={(e) => patch(i, { mark: e.target.value })} />
              <input className={field} placeholder="Purpose" value={card.use} onChange={(e) => patch(i, { use: e.target.value })} />
            </div>
            <textarea className={`${field} min-h-[64px]`} placeholder="Description" value={card.copy} onChange={(e) => patch(i, { copy: e.target.value })} />
            <button type="button" className={btnGhost} onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remove card
            </button>
          </div>
        ))}
        <button type="button" className={btnGhost} onClick={() => onChange([...value, { name: 'New card', mark: '01', use: 'Purpose', copy: 'Description.' }])}>
          + Add card
        </button>
      </div>
    </Labeled>
  );
}

function PairsRow({ label, value, onChange }: { label: string; value: PairItem[]; onChange: (v: PairItem[]) => void }) {
  const patch = (i: number, part: Partial<PairItem>) => onChange(value.map((p, j) => (i === j ? { ...p, ...part } : p)));
  return (
    <Labeled label={label}>
      <div className="space-y-3">
        {value.map((pair, i) => (
          <div key={i} className="space-y-2 rounded-md border border-border p-3">
            <input className={field} placeholder="Label" value={pair.label} onChange={(e) => patch(i, { label: e.target.value })} />
            <textarea className={`${field} min-h-[60px]`} placeholder="Text" value={pair.copy} onChange={(e) => patch(i, { copy: e.target.value })} />
            <button type="button" className={btnGhost} onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className={btnGhost} onClick={() => onChange([...value, { label: 'Label', copy: 'Text' }])}>
          + Add item
        </button>
      </div>
    </Labeled>
  );
}

function ImageRow({ label, value, onChange }: { label: string; value: MediaImage | undefined; onChange: (v: MediaImage) => void }) {
  const image: MediaImage = value ?? { src: '', alt: '', width: 1200, height: 900 };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError('');
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const path = `uploads/${Date.now()}-${safe}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, cacheControl: '31536000' });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = urlData.publicUrl;
      const size = await new Promise<{ w: number; h: number }>((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve({ w: probe.naturalWidth || 1200, h: probe.naturalHeight || 900 });
        probe.onerror = () => resolve({ w: 1200, h: 900 });
        probe.src = url;
      });
      const next: MediaImage = { src: url, alt: image.alt, width: size.w, height: size.h };
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Labeled label={label}>
      <div className="space-y-2 rounded-md border border-border p-3">
        <div className="flex flex-wrap items-center gap-3">
          {image.src ? (
            <img src={image.src} alt="" className="h-20 w-20 rounded-md border border-border object-contain" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">No image</div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
          <button type="button" className={btnPrimary} disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? 'Uploading…' : 'Upload image'}
          </button>
          {image.src && (
            <button type="button" className={btnGhost} onClick={() => onChange({ src: '', alt: '', width: 1200, height: 900 })}>
              Clear
            </button>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <input className={field} placeholder="Image address" value={image.src} onChange={(e) => onChange({ ...image, src: e.target.value })} />
        <input className={field} placeholder="Description for screen readers" value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })} />
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={field} type="number" placeholder="Width" value={image.width} onChange={(e) => onChange({ ...image, width: Number(e.target.value) || 1200 })} />
          <input className={field} type="number" placeholder="Height" value={image.height} onChange={(e) => onChange({ ...image, height: Number(e.target.value) || 900 })} />
        </div>
      </div>
    </Labeled>
  );
}

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'carbon', label: 'Dark (deep)' },
  { value: 'ink', label: 'Dark (soft)' },
  { value: 'bone', label: 'Light (warm)' },
  { value: 'surface', label: 'Follows site mode' },
];

function SectionField({ section, entry, onPatch }: { section: Section; entry: Field; onPatch: (part: Partial<Section>) => void }) {
  const key = entry.key;
  switch (entry.kind) {
    case 'text':
      return <TextRow label={entry.label} value={(section[key] as string) ?? ''} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'textarea':
      return <AreaRow label={entry.label} value={(section[key] as string) ?? ''} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'link':
      return (
        <LinkRow
          label={entry.label}
          value={(section[key] as LinkItem) ?? { label: '', target: '' }}
          onChange={(v) => onPatch({ [key]: v } as Partial<Section>)}
        />
      );
    case 'list':
      return <ListRow label={entry.label} value={(section[key] as string[]) ?? []} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'cards':
      return <CardsRow label={entry.label} value={(section[key] as CardItem[]) ?? []} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'pairs':
      return <PairsRow label={entry.label} value={(section[key] as PairItem[]) ?? []} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'image':
      return <ImageRow label={entry.label} value={section[key] as MediaImage | undefined} onChange={(v) => onPatch({ [key]: v } as Partial<Section>)} />;
    case 'theme':
      return (
        <Labeled label={entry.label}>
          <select className={field} value={(section.theme ?? 'surface') as string} onChange={(e) => onPatch({ theme: e.target.value as Theme })}>
            {themeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    case 'side':
      return (
        <Labeled label={entry.label}>
          <select className={field} value={section.imageSide ?? 'left'} onChange={(e) => onPatch({ imageSide: e.target.value as 'left' | 'right' })}>
            <option value="left">Image on the left</option>
            <option value="right">Image on the right</option>
          </select>
        </Labeled>
      );
    default:
      return null;
  }
}

/* ---------------- login ---------------- */

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError('Those details are not correct.');
      setBusy(false);
      return;
    }
    if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError('This account cannot manage the website.');
      setBusy(false);
      return;
    }
    setBusy(false);
    onSignedIn();
  };

  return (
    <div className="admin-shell grid min-h-screen place-items-center px-5 text-foreground">
      <form onSubmit={submit} className="admin-card w-full max-w-sm space-y-4 p-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Private access</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">Content studio</h1>
        </div>
        <Labeled label="Email">
          <input className={field} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Labeled>
        <Labeled label="Password">
          <input className={field} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Labeled>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" className={`${btnPrimary} w-full py-2.5 text-sm`} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/* ---------------- editor ---------------- */

function Editor({ onSignOut }: { onSignOut: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [tab, setTab] = useState<'pages' | 'settings'>('pages');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [addType, setAddType] = useState<SectionType>('richText');

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from('site_content').select('data').eq('id', 'main').maybeSingle();
      setContent(normalizeContent(data?.data ?? null));
    })();
  }, []);

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setStatus('');
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 'main', data: content as unknown as never, updated_at: new Date().toISOString() });
    setSaving(false);
    setStatus(error ? `Could not save: ${error.message}` : 'Saved. The live website is updated.');
  }, [content]);

  if (!content) {
    return <div className="admin-shell grid min-h-screen place-items-center text-sm text-muted-foreground">Loading content…</div>;
  }

  const page = content.pages[Math.min(pageIndex, content.pages.length - 1)];
  const setPages = (pages: Page[]) => setContent({ ...content, pages });
  const patchPage = (part: Partial<Page>) => setPages(content.pages.map((p, i) => (i === pageIndex ? { ...p, ...part } : p)));
  const setSections = (sections: Section[]) => patchPage({ sections });

  const move = (index: number, direction: -1 | 1) => {
    if (!page) return;
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) return;
    const next = [...page.sections];
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    setSections(next);
  };

  return (
    <div className="admin-shell min-h-screen text-foreground">
      <header className="admin-topbar sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-semibold">Content studio</span>
          <div className="flex gap-1">
            {(['pages', 'settings'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} className={t === tab ? btnPrimary : btnGhost}>
                {t === 'pages' ? 'Pages & sections' : 'Header, footer & brand'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status && <span className="text-xs text-muted-foreground">{status}</span>}
          <a href="/" target="_blank" rel="noreferrer" className={btnGhost}>
            View website
          </a>
          <button type="button" className={btnPrimary} onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className={btnGhost} onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {tab === 'settings' ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextRow label="Brand name" value={content.settings.brandPrimary} onChange={(v) => setContent({ ...content, settings: { ...content.settings, brandPrimary: v } })} />
              <TextRow label="Brand second word" value={content.settings.brandSecondary} onChange={(v) => setContent({ ...content, settings: { ...content.settings, brandSecondary: v } })} />
            </div>
            <Labeled label="Menu links">
              <div className="space-y-2">
                {content.settings.nav.map((item, i) => (
                  <div key={i} className="flex flex-wrap gap-2">
                    <input
                      className={`${field} sm:max-w-[200px]`}
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) =>
                        setContent({ ...content, settings: { ...content.settings, nav: content.settings.nav.map((n, j) => (i === j ? { ...n, label: e.target.value } : n)) } })
                      }
                    />
                    <input
                      className={field}
                      placeholder="#section or /page"
                      value={item.target}
                      onChange={(e) =>
                        setContent({ ...content, settings: { ...content.settings, nav: content.settings.nav.map((n, j) => (i === j ? { ...n, target: e.target.value } : n)) } })
                      }
                    />
                    <button type="button" className={btnGhost} onClick={() => setContent({ ...content, settings: { ...content.settings, nav: content.settings.nav.filter((_, j) => j !== i) } })}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className={btnGhost} onClick={() => setContent({ ...content, settings: { ...content.settings, nav: [...content.settings.nav, { label: 'New link', target: '#top' }] } })}>
                  + Add menu link
                </button>
              </div>
            </Labeled>
            <LinkRow label="Header button" value={content.settings.headerCta} onChange={(v) => setContent({ ...content, settings: { ...content.settings, headerCta: v } })} />
            <AreaRow label="Footer intro text" value={content.settings.footerTagline} onChange={(v) => setContent({ ...content, settings: { ...content.settings, footerTagline: v } })} />
            <Labeled label="Footer columns">
              <div className="space-y-3">
                {content.settings.footerColumns.map((column, ci) => (
                  <div key={ci} className="space-y-2 rounded-md border border-border p-3">
                    <input
                      className={field}
                      placeholder="Column title"
                      value={column.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          settings: { ...content.settings, footerColumns: content.settings.footerColumns.map((c, j) => (ci === j ? { ...c, title: e.target.value } : c)) },
                        })
                      }
                    />
                    {column.links.map((link, li) => (
                      <div key={li} className="flex flex-wrap gap-2">
                        <input
                          className={`${field} sm:max-w-[200px]`}
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              settings: {
                                ...content.settings,
                                footerColumns: content.settings.footerColumns.map((c, j) =>
                                  ci === j ? { ...c, links: c.links.map((l, k) => (li === k ? { ...l, label: e.target.value } : l)) } : c,
                                ),
                              },
                            })
                          }
                        />
                        <input
                          className={field}
                          placeholder="#section or /page"
                          value={link.target}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              settings: {
                                ...content.settings,
                                footerColumns: content.settings.footerColumns.map((c, j) =>
                                  ci === j ? { ...c, links: c.links.map((l, k) => (li === k ? { ...l, target: e.target.value } : l)) } : c,
                                ),
                              },
                            })
                          }
                        />
                        <button
                          type="button"
                          className={btnGhost}
                          onClick={() =>
                            setContent({
                              ...content,
                              settings: {
                                ...content.settings,
                                footerColumns: content.settings.footerColumns.map((c, j) => (ci === j ? { ...c, links: c.links.filter((_, k) => k !== li) } : c)),
                              },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          setContent({
                            ...content,
                            settings: {
                              ...content.settings,
                              footerColumns: content.settings.footerColumns.map((c, j) => (ci === j ? { ...c, links: [...c.links, { label: 'New link', target: '#top' }] } : c)),
                            },
                          })
                        }
                      >
                        + Add link
                      </button>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() => setContent({ ...content, settings: { ...content.settings, footerColumns: content.settings.footerColumns.filter((_, j) => j !== ci) } })}
                      >
                        Remove column
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setContent({ ...content, settings: { ...content.settings, footerColumns: [...content.settings.footerColumns, { title: 'New column', links: [] }] } })}
                >
                  + Add column
                </button>
              </div>
            </Labeled>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextRow label="Footer bottom left" value={content.settings.footerLeft} onChange={(v) => setContent({ ...content, settings: { ...content.settings, footerLeft: v } })} />
              <TextRow label="Footer bottom right" value={content.settings.footerRight} onChange={(v) => setContent({ ...content, settings: { ...content.settings, footerRight: v } })} />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Pages</p>
              {content.pages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition ${i === pageIndex ? 'border-primary bg-muted' : 'border-border hover:border-primary'}`}
                >
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.slug}</span>
                </button>
              ))}
            </aside>

            {page && (
              <div className="space-y-6">
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextRow label="Page name (studio only)" value={page.name} onChange={(v) => patchPage({ name: v })} />
                    <TextRow label="Web address (use / for home)" value={page.slug} onChange={(v) => patchPage({ slug: v.startsWith('/') ? v : `/${v}` })} />
                  </div>
                  <TextRow label="Browser tab title" value={page.title} onChange={(v) => patchPage({ title: v })} />
                  <AreaRow label="Search description" value={page.description} onChange={(v) => patchPage({ description: v })} />
                </div>

                <div className="space-y-3">
                  {page.sections.map((section, i) => {
                    const open = openSection === section.id;
                    return (
                      <div key={section.id} className="rounded-lg border border-border">
                        <div className="flex flex-wrap items-center gap-2 p-3">
                          <button type="button" className="flex-1 text-left" onClick={() => setOpenSection(open ? null : section.id)}>
                            <span className="block text-sm font-semibold">{section.title || labelFor(section.type)}</span>
                            <span className="block text-xs text-muted-foreground">{labelFor(section.type)}</span>
                          </button>
                          <button type="button" className={btnGhost} onClick={() => move(i, -1)}>
                            ↑
                          </button>
                          <button type="button" className={btnGhost} onClick={() => move(i, 1)}>
                            ↓
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() => {
                              const copy: Section = { ...structuredClone(section), id: newId() };
                              const next = [...page.sections];
                              next.splice(i + 1, 0, copy);
                              setSections(next);
                            }}
                          >
                            Duplicate
                          </button>
                          <button type="button" className={btnGhost} onClick={() => setSections(page.sections.filter((_, j) => j !== i))}>
                            Delete
                          </button>
                        </div>
                        {open && (
                          <div className="space-y-4 border-t border-border p-4">
                            {fieldsFor(section.type).map((entry) => (
                              <SectionField
                                key={String(entry.key)}
                                section={section}
                                entry={entry}
                                onPatch={(part) => setSections(page.sections.map((s, j) => (i === j ? { ...s, ...part } : s)))}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-border p-4">
                  <Labeled label="Add a new section">
                    <select className={field} value={addType} onChange={(e) => setAddType(e.target.value as SectionType)}>
                      {sectionTypes.map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Labeled>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => {
                      const created = blankSection(addType);
                      setSections([...page.sections, created]);
                      setOpenSection(created.id);
                    }}
                  >
                    + Add section
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => {
                      if (confirm('Replace this page with the original AGI Cards content?')) {
                        const original = defaultContent.pages[0];
                        if (original) patchPage({ sections: structuredClone(original.sections) });
                      }
                    }}
                  >
                    Restore original sections
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- admin page ---------------- */

export default function AdminPage() {
  const [state, setState] = useState<'checking' | 'out' | 'in'>('checking');

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user.email?.toLowerCase();
      if (email === ADMIN_EMAIL) setState('in');
      else {
        if (data.session) await supabase.auth.signOut();
        setState('out');
      }
    })();
  }, []);

  if (state === 'checking') {
    return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Checking access…</div>;
  }
  if (state === 'out') return <Login onSignedIn={() => setState('in')} />;
  return (
    <Editor
      onSignOut={() => {
        void supabase.auth.signOut().then(() => setState('out'));
      }}
    />
  );
}
