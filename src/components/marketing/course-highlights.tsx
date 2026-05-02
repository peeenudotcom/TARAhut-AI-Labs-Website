'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { courses } from '@/config/courses'
import { useUserRole, ROLE_LABEL, type UserRole } from '@/lib/hooks/use-user-role'
import { rolePrioritySorter } from '@/lib/role-personalization'

const featuredCourses = courses.filter((c) => c.isFeatured)

type Audience = 'pro' | 'mkt' | 'kids'
type Scene = 's-pro' | 's-claude' | 's-hustler' | 's-mkt' | 's-kids-pink' | 's-kids-warm'

const courseMeta: Record<string, { audience: Audience; audLabel: string; scene: Scene }> = {
  '1':  { audience: 'pro',  audLabel: 'Professional', scene: 's-pro' },
  '2':  { audience: 'mkt',  audLabel: 'Marketing',    scene: 's-mkt' },
  '3':  { audience: 'kids', audLabel: 'School Kids',  scene: 's-kids-pink' },
  '3b': { audience: 'kids', audLabel: 'School Kids',  scene: 's-kids-warm' },
  '5':  { audience: 'pro',  audLabel: 'Professional', scene: 's-pro' },
  '7':  { audience: 'pro',  audLabel: 'Professional', scene: 's-pro' },
  '9':  { audience: 'pro',  audLabel: 'Professional', scene: 's-claude' },
  '10': { audience: 'pro',  audLabel: 'Professional', scene: 's-pro' },
  '11': { audience: 'pro',  audLabel: 'Side Hustle',  scene: 's-hustler' },
}

const audienceFilters: { id: 'all' | Audience; label: string }[] = [
  { id: 'all',  label: 'All' },
  { id: 'pro',  label: 'Professionals' },
  { id: 'mkt',  label: 'Marketing' },
  { id: 'kids', label: 'School Kids' },
]

// Lowercase italic noun used in the editorial headline ("Programs for *X.*").
// "founders" reads punchier than "business owners" and aligns with the hero accent.
const ROLE_HEADLINE_NOUN: Record<UserRole, string> = {
  'student':      'students',
  'biz-owner':    'founders',
  'freelancer':   'freelancers',
  'professional': 'professionals',
}

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function discountPct(original: number, current: number) {
  return Math.round(((original - current) / original) * 100)
}

function CourseCard({
  course,
  meta,
  ariaHidden,
}: {
  course: (typeof featuredCourses)[number]
  meta: { audience: Audience; audLabel: string; scene: Scene }
  ariaHidden?: boolean
}) {
  const discount = course.originalPrice ? discountPct(course.originalPrice, course.price) : null
  return (
    <article className="pc-card" data-aud={meta.audience} aria-hidden={ariaHidden || undefined}>
      <div className="pc-cover">
        <Scene scene={meta.scene} />
        <div className="pc-cover-mask" />
      </div>
      <div className="pc-card-top">
        <span className={`pc-pill pc-aud-${meta.audience}`}>
          <span className="pc-tag-dot" />
          {meta.audLabel}
        </span>
        <div className="pc-card-top-right">
          {course.batchStartingSoon && (
            <span className="pc-badge pc-badge-seats">⚡ Limited Seats</span>
          )}
          {discount !== null && (
            <span className="pc-badge pc-badge-discount">-{discount}%</span>
          )}
        </div>
      </div>
      <div className="pc-card-mid">
        <div className="pc-meta-row">
          <span className="pc-level">{course.level}</span>
          <span className="pc-dot" />
          <span>{course.duration}</span>
        </div>
        <h3 className="pc-card-title">{course.title}</h3>
        <p className="pc-card-desc">{course.shortDescription}</p>
      </div>
      <div className="pc-card-bottom">
        <div className="pc-price">
          <span className="pc-price-now">{inr(course.price)}</span>
          {course.originalPrice && (
            <span className="pc-price-was">{inr(course.originalPrice)}</span>
          )}
        </div>
        <Link
          className="pc-cta"
          href={`/courses/${course.slug}`}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          View Curriculum
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

function Scene({ scene }: { scene: Scene }) {
  if (scene === 's-pro' || scene === 's-claude' || scene === 's-hustler') {
    return (
      <div className={`pc-scene pc-${scene}`}>
        <div className="pc-glow pc-g1" />
        <div className="pc-grid-lines" />
        <div className="pc-grain" />
      </div>
    )
  }
  return (
    <div className={`pc-scene pc-${scene}`}>
      <div className="pc-orb pc-o1" />
      <div className="pc-orb pc-o2" />
      <div className="pc-grain" />
    </div>
  )
}

export function CourseHighlights() {
  const { role } = useUserRole()
  const [filter, setFilter] = useState<'all' | Audience>('all')

  // Reorder so role-relevant courses lead. Pure permutation — same 9 courses,
  // just re-prioritised. Filter is applied on top.
  const orderedCourses = useMemo(
    () => [...featuredCourses].sort(rolePrioritySorter(role, (c) => c.slug)),
    [role],
  )

  const visible = orderedCourses.filter((c) => {
    if (filter === 'all') return true
    return courseMeta[c.id]?.audience === filter
  })

  const lowestPrice = Math.min(...featuredCourses.map((c) => c.price))
  const marquee = visible.length >= 3
  const durationSec = Math.max(40, visible.length * 6)

  const headlineNoun = role ? ROLE_HEADLINE_NOUN[role] : 'everyone'
  const eyebrowText = role
    ? `Recommended for ${ROLE_LABEL[role]}s · 2026 cohort`
    : 'Curated learning paths · 2026 cohort'
  const metaParagraph = role
    ? 'Reordered just for you — the programs that fit your goals lead the way. Hands-on projects, real datasets, weekly feedback.'
    : 'Industry-relevant AI programs designed with hands-on projects, real datasets and weekly feedback. From school kids to working professionals.'

  return (
    <>
      <style>{popularCoursesCss}</style>
      <section className="pc-section">
        <div className="pc-right-fade" />
        <div className="pc-container">
          <div className="pc-head">
            <div>
              <div className="pc-eyebrow"><i />{eyebrowText}</div>
              <h2 className="pc-title">
                Programs for<br />
                <em>{headlineNoun}.</em>
              </h2>
            </div>
            <div className="pc-meta">
              <p>{metaParagraph}</p>
              <span className="pc-count">
                <b>{featuredCourses.length}</b>active programs · <b>{inr(lowestPrice)}/-</b>onwards
              </span>
            </div>
          </div>

          <div className="pc-filters">
            {audienceFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pc-filter ${filter === f.id ? 'pc-filter-on' : ''} ${f.id !== 'all' ? `pc-filter-${f.id}` : ''}`}
                onClick={() => setFilter(f.id)}
              >
                <i />{f.label}
              </button>
            ))}
          </div>

          <div className="pc-rail-wrap">
            <div
              className={`pc-rail ${marquee ? 'pc-rail-marquee' : ''}`}
              style={marquee ? { animationDuration: `${durationSec}s` } : undefined}
            >
              {visible.map((c) => {
                const meta = courseMeta[c.id]
                if (!meta) return null
                return <CourseCard key={c.id} course={c} meta={meta} />
              })}
              {marquee && visible.map((c) => {
                const meta = courseMeta[c.id]
                if (!meta) return null
                return <CourseCard key={`${c.id}-clone`} course={c} meta={meta} ariaHidden />
              })}
            </div>
          </div>

          <div className="pc-below">
            <span className="pc-marquee-hint">
              <i className="pc-pulse-dot" /> Auto-scrolling · hover to pause
            </span>
            <Link className="pc-view-all" href="/courses">
              View all courses
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

const popularCoursesCss = `
.pc-section{
  --pc-bg:#070b0d;
  --pc-ink:#f4f2ee;
  --pc-muted:#7c8682;
  --pc-line:#16201d;
  --pc-green:#10b981;
  --pc-green-soft:#5df0c0;
  --pc-kid:#ff8a5b;
  --pc-mkt:#ff6ab0;
  --pc-pro:#10b981;
  --pc-gold:#ffd84a;
  position:relative;padding:96px 0 80px;color:var(--pc-ink);font-family:var(--font-sans),system-ui,sans-serif;
  background:
    radial-gradient(60% 50% at 78% 0%, rgba(16,185,129,.12) 0%, transparent 60%),
    radial-gradient(40% 40% at 8% 100%, rgba(16,185,129,.06) 0%, transparent 60%),
    linear-gradient(180deg, #070b0d 0%, #050708 100%);
  overflow:hidden;
}
.pc-section::before{
  content:"";position:absolute;inset:0;pointer-events:none;opacity:.4;
  background-image:radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px);
  background-size:24px 24px;
  -webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
}
.pc-section::after{
  content:"";position:absolute;top:0;bottom:0;left:0;width:96px;z-index:3;pointer-events:none;
  background:linear-gradient(90deg, var(--pc-bg), transparent);
}
.pc-right-fade{
  position:absolute;top:0;bottom:0;right:0;width:96px;z-index:3;pointer-events:none;
  background:linear-gradient(-90deg, var(--pc-bg), transparent);
}
.pc-container{max-width:1440px;margin:0 auto;padding:0 56px;position:relative;z-index:2}

.pc-head{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end;margin-bottom:48px}
.pc-eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--pc-muted);margin-bottom:18px;
}
.pc-eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--pc-green);box-shadow:0 0 12px var(--pc-green)}
.pc-title{
  font-family:var(--font-display),'Playfair Display',serif;font-weight:400;
  font-size:clamp(48px,5.6vw,84px);line-height:.96;letter-spacing:-.025em;margin:0;
  color:var(--pc-ink);text-wrap:balance;max-width:14ch;
}
.pc-title em{font-style:italic;color:var(--pc-green-soft);position:relative}
.pc-title em::after{
  content:"";position:absolute;left:0;right:0;bottom:.08em;height:.06em;
  background:var(--pc-green);opacity:.35;border-radius:1px;
}
.pc-meta{display:flex;flex-direction:column;gap:18px;align-items:flex-end;text-align:right}
.pc-meta p{margin:0;color:var(--pc-muted);font-size:14px;line-height:1.55;max-width:36ch}
.pc-count{
  display:inline-flex;align-items:baseline;gap:10px;
  font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;letter-spacing:.2em;color:var(--pc-muted);text-transform:uppercase;
}
.pc-count b{font-family:var(--font-display),'Playfair Display',serif;font-style:italic;font-weight:400;font-size:28px;color:var(--pc-ink);letter-spacing:-.01em}

.pc-filters{display:flex;align-items:center;gap:8px;margin-bottom:32px;flex-wrap:wrap}
.pc-filter{
  display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;
  background:rgba(255,255,255,.03);border:1px solid var(--pc-line);color:var(--pc-muted);
  font-size:12px;letter-spacing:.06em;cursor:pointer;transition:all .2s ease;font-weight:500;
  font-family:inherit;
}
.pc-filter:hover{color:var(--pc-ink);border-color:#243430}
.pc-filter-on{background:rgba(16,185,129,.12)!important;border-color:rgba(16,185,129,.4)!important;color:var(--pc-green-soft)!important}
.pc-filter i{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.6}
.pc-filter-pro i{background:var(--pc-pro)}
.pc-filter-mkt i{background:var(--pc-mkt)}
.pc-filter-kids i{background:var(--pc-kid)}

.pc-rail-wrap{position:relative;overflow:hidden;margin:0 -56px;padding:8px 0 24px}
.pc-rail{
  display:flex;gap:24px;
  padding:0 56px;
  width:max-content;
}
.pc-rail-marquee{
  animation-name:pcMarquee;
  animation-timing-function:linear;
  animation-iteration-count:infinite;
}
.pc-rail-wrap:hover .pc-rail-marquee,
.pc-rail-wrap:focus-within .pc-rail-marquee{animation-play-state:paused}
@keyframes pcMarquee{
  0%{transform:translateX(0)}
  100%{transform:translateX(calc(-50% - 12px))}
}
@media (prefers-reduced-motion:reduce){
  .pc-rail-marquee{animation:none}
}

.pc-card{
  flex:0 0 calc((100vw - 160px) / 3);
  max-width:440px;
  position:relative;
  border-radius:18px;
  overflow:hidden;
  background:linear-gradient(180deg, #0d1411 0%, #0a0e10 100%);
  border:1px solid var(--pc-line);
  container-type:inline-size;
  transition:transform .4s cubic-bezier(.2,.7,.2,1), border-color .3s ease, box-shadow .4s ease;
  cursor:pointer;
  isolation:isolate;
  min-height:480px;
  display:flex;flex-direction:column;
}
.pc-card:hover{
  transform:translateY(-4px);
  border-color:rgba(16,185,129,.35);
  box-shadow:0 24px 60px -20px rgba(0,0,0,.6), 0 0 0 1px rgba(16,185,129,.12);
}

.pc-cover{
  position:absolute;inset:0;border-radius:inherit;overflow:hidden;
  opacity:1;pointer-events:none;z-index:0;
}
.pc-cover-mask{
  position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(7,11,13,.15) 0%, rgba(7,11,13,.55) 50%, rgba(7,11,13,.92) 100%);
}

.pc-card-top{
  position:relative;z-index:2;padding:20px 22px 0;
  display:flex;justify-content:space-between;align-items:flex-start;gap:12px;
}
.pc-card-top-right{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.pc-pill{
  display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  font-size:11px;letter-spacing:.06em;color:var(--pc-ink);font-weight:500;
}
.pc-tag-dot{width:6px;height:6px;border-radius:50%}
.pc-aud-pro .pc-tag-dot{background:var(--pc-pro);box-shadow:0 0 8px var(--pc-pro)}
.pc-aud-mkt .pc-tag-dot{background:var(--pc-mkt);box-shadow:0 0 8px var(--pc-mkt)}
.pc-aud-kids .pc-tag-dot{background:var(--pc-kid);box-shadow:0 0 8px var(--pc-kid)}

.pc-badge{
  display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:6px;
  font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;font-weight:600;letter-spacing:.04em;
}
.pc-badge-discount{background:rgba(217,119,87,.14);color:#ffb089;border:1px solid rgba(217,119,87,.3)}
.pc-badge-seats{background:rgba(255,216,74,.12);color:#ffe28a;border:1px solid rgba(255,216,74,.28)}

.pc-card-mid{
  position:relative;z-index:2;padding:24px 22px 8px;flex:1;display:flex;flex-direction:column;gap:14px;
}
.pc-meta-row{
  display:flex;align-items:center;gap:10px;font-family:var(--font-geist-mono),ui-monospace,monospace;
  font-size:10.5px;letter-spacing:.08em;color:rgba(255,255,255,.7);text-transform:uppercase;
  flex-wrap:nowrap;white-space:nowrap;
}
.pc-meta-row span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.pc-level{color:var(--pc-green-soft)}
.pc-dot{width:3px;height:3px;border-radius:50%;background:var(--pc-muted);opacity:.6}

.pc-card-title{
  font-family:var(--font-display),'Playfair Display',serif;font-weight:400;font-size:28px;line-height:1.05;letter-spacing:-.015em;
  margin:0;color:#fff;text-wrap:balance;
}
.pc-card-desc{
  color:rgba(244,242,238,.85);font-size:13.5px;line-height:1.55;margin:0;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}

.pc-card-bottom{
  position:relative;z-index:2;padding:16px 22px 20px;
  display:flex;justify-content:space-between;align-items:flex-end;gap:12px;
  border-top:1px solid rgba(255,255,255,.12);margin-top:auto;
}
.pc-price{display:flex;flex-direction:column;gap:4px}
.pc-price-now{font-family:var(--font-display),'Playfair Display',serif;font-size:28px;letter-spacing:-.01em;line-height:1;color:#fff}
.pc-price-was{font-size:12px;color:rgba(255,255,255,.6);text-decoration:line-through;letter-spacing:.04em}
.pc-cta{
  display:inline-flex;align-items:center;gap:6px;color:var(--pc-green-soft);
  font-size:13px;font-weight:500;text-decoration:none;letter-spacing:.02em;
  transition:gap .2s ease;
}
.pc-card:hover .pc-cta{gap:10px}
.pc-cta svg{width:14px;height:14px}

.pc-scene{position:absolute;inset:0;border-radius:inherit;overflow:hidden}
.pc-grain{position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;opacity:.18;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.6'/></svg>");
}

.pc-s-pro{background:
  radial-gradient(60% 50% at 70% 20%, #0e6b4f 0%, transparent 60%),
  radial-gradient(80% 70% at 20% 70%, #0a2b30 0%, transparent 60%),
  linear-gradient(180deg, #0a1410 0%, #050807 100%);}
.pc-s-pro .pc-glow{position:absolute;border-radius:50%;filter:blur(50px);mix-blend-mode:screen;opacity:.55;pointer-events:none}
.pc-s-pro .pc-g1{width:60%;height:60%;right:-10%;top:-10%;background:radial-gradient(circle,#12c98c,transparent 60%)}
.pc-s-pro .pc-grid-lines{position:absolute;inset:0;opacity:.18;pointer-events:none;background-image:
  linear-gradient(rgba(120,220,180,.3) 1px,transparent 1px),
  linear-gradient(90deg, rgba(120,220,180,.3) 1px,transparent 1px);
  background-size:36px 36px;-webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);}

.pc-s-claude{background:
  radial-gradient(60% 50% at 70% 20%, #3a1e12 0%, transparent 60%),
  radial-gradient(80% 70% at 20% 70%, #1e120a 0%, transparent 60%),
  linear-gradient(180deg, #120806 0%, #060403 100%);}
.pc-s-claude .pc-glow{position:absolute;border-radius:50%;filter:blur(50px);mix-blend-mode:screen;opacity:.55;pointer-events:none}
.pc-s-claude .pc-g1{width:60%;height:60%;right:-10%;top:-10%;background:radial-gradient(circle,#d97757,transparent 60%)}
.pc-s-claude .pc-grid-lines{position:absolute;inset:0;opacity:.12;pointer-events:none;background-image:
  linear-gradient(rgba(217,119,87,.3) 1px,transparent 1px),
  linear-gradient(90deg, rgba(217,119,87,.3) 1px,transparent 1px);
  background-size:36px 36px;-webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);}

.pc-s-hustler{background:
  radial-gradient(70% 55% at 78% 25%, #c2b300 0%, transparent 55%),
  linear-gradient(180deg, #0f0d05 0%, #070603 100%);}
.pc-s-hustler .pc-glow{position:absolute;border-radius:50%;filter:blur(50px);mix-blend-mode:screen;opacity:.55;pointer-events:none}
.pc-s-hustler .pc-g1{width:60%;height:60%;right:-10%;top:-10%;background:radial-gradient(circle,#ffd84a,transparent 60%)}
.pc-s-hustler .pc-grid-lines{position:absolute;inset:0;opacity:.12;pointer-events:none;background-image:
  linear-gradient(rgba(255,216,74,.3) 1px,transparent 1px),
  linear-gradient(90deg, rgba(255,216,74,.3) 1px,transparent 1px);
  background-size:36px 36px;-webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          mask-image:linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);}

.pc-s-mkt{background:
  radial-gradient(70% 60% at 80% 20%, #ff6ab0 0%, transparent 55%),
  radial-gradient(90% 70% at 15% 40%, #8b5bff 0%, transparent 60%),
  radial-gradient(120% 90% at 50% 110%, #180a2a 0%, #0b0614 70%);}
.pc-s-mkt .pc-orb{position:absolute;border-radius:50%;filter:blur(36px);mix-blend-mode:screen;opacity:.7;pointer-events:none}
.pc-s-mkt .pc-o1{width:50%;height:50%;left:-8%;top:-10%;background:radial-gradient(circle,#ff8ac9,transparent 60%)}
.pc-s-mkt .pc-o2{width:40%;height:40%;right:-8%;bottom:-10%;background:radial-gradient(circle,#b28bff,transparent 60%)}

.pc-s-kids-warm{background:
  radial-gradient(80% 60% at 20% 20%, #ffd08a 0%, transparent 55%),
  radial-gradient(90% 70% at 85% 30%, #ff8a5b 0%, transparent 60%),
  radial-gradient(120% 90% at 60% 110%, #3a1a0a 0%, #120806 70%);}
.pc-s-kids-pink{background:
  radial-gradient(80% 60% at 25% 25%, #ffc2c2 0%, transparent 55%),
  radial-gradient(90% 70% at 80% 30%, #ff7aa8 0%, transparent 60%),
  radial-gradient(120% 90% at 60% 110%, #2b0f1c 0%, #110710 70%);}
.pc-s-kids-warm .pc-orb,.pc-s-kids-pink .pc-orb{position:absolute;border-radius:50%;filter:blur(36px);mix-blend-mode:screen;opacity:.85;pointer-events:none}
.pc-s-kids-warm .pc-orb.pc-o1,.pc-s-kids-pink .pc-orb.pc-o1{width:50%;height:50%;left:-8%;top:-10%}
.pc-s-kids-warm .pc-orb.pc-o2,.pc-s-kids-pink .pc-orb.pc-o2{width:40%;height:40%;right:-8%;bottom:5%}
.pc-s-kids-warm .pc-orb.pc-o1{background:radial-gradient(circle,#ffe0a8,transparent 60%)}
.pc-s-kids-warm .pc-orb.pc-o2{background:radial-gradient(circle,#ff7a3d,transparent 60%)}
.pc-s-kids-pink .pc-orb.pc-o1{background:radial-gradient(circle,#ffd0e2,transparent 60%)}
.pc-s-kids-pink .pc-orb.pc-o2{background:radial-gradient(circle,#ff5b95,transparent 60%)}

.pc-below{
  display:flex;justify-content:space-between;align-items:center;gap:24px;
  margin-top:36px;flex-wrap:wrap;
}
.pc-marquee-hint{
  display:inline-flex;align-items:center;gap:10px;
  font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;color:var(--pc-muted);
  letter-spacing:.12em;text-transform:uppercase;
}
.pc-pulse-dot{
  width:6px;height:6px;border-radius:50%;background:var(--pc-green);
  box-shadow:0 0 12px var(--pc-green);
  animation:pcPulse 1.6s ease-in-out infinite;
}
@keyframes pcPulse{0%,100%{opacity:.5}50%{opacity:1}}

.pc-view-all{
  display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:999px;
  background:transparent;border:1px solid var(--pc-line);color:var(--pc-ink);
  font-size:13px;font-weight:500;letter-spacing:.04em;text-decoration:none;
  transition:all .2s ease;font-family:inherit;cursor:pointer;
}
.pc-view-all:hover{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.4);color:var(--pc-green-soft);gap:14px}
.pc-view-all svg{width:14px;height:14px}

@media (max-width:1100px){
  .pc-card{flex:0 0 calc((100vw - 96px) / 2);max-width:420px}
}
@media (max-width:720px){
  .pc-container{padding:0 24px}
  .pc-rail-wrap{margin:0 -24px;padding:8px 0 24px}
  .pc-rail{padding:0 24px;gap:16px}
  .pc-head{grid-template-columns:1fr}
  .pc-meta{align-items:flex-start;text-align:left}
  .pc-card{flex:0 0 80vw;max-width:360px;min-height:440px}
  .pc-section{padding:72px 0 64px}
  @keyframes pcMarquee{
    0%{transform:translateX(0)}
    100%{transform:translateX(calc(-50% - 8px))}
  }
}
`
