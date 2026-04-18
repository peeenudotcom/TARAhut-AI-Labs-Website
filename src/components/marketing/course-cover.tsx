import type { ReactNode } from 'react';
import styles from './course-cover.module.css';

type SceneKey =
  | 'sceneKidsWarm'
  | 'sceneKidsPink'
  | 'sceneKidsSky'
  | 'sceneMktCards'
  | 'sceneProStudio'
  | 'sceneProFlow'
  | 'sceneProDash';

type ChipTone = 'default' | 'green' | 'orange' | 'gold';
type Modifier = 'vClaude' | 'vHustler' | null;
type TitleTone = 'pro' | 'mkt' | 'claude' | 'hustler';
type ExtrasKey = 'studio' | 'flow' | 'dash' | 'dash4' | 'mktCards' | 'kidsBig' | 'kidsSmall';

interface CoverConfig {
  scene: SceneKey;
  modifier: Modifier;
  extras: ExtrasKey;
  chipTone: ChipTone;
  chipLabel: string;
  wm: string;
  kicker: string;
  titleTones: TitleTone[];
  titleNode: ReactNode;
}

const COVERS: Record<string, CoverConfig> = {
  'ai-tools-mastery-beginners': {
    scene: 'sceneProStudio',
    modifier: null,
    extras: 'studio',
    chipTone: 'green',
    chipLabel: 'AI Tools · Beginner',
    wm: '01 / Mastery',
    kicker: '10× your productivity',
    titleTones: ['pro'],
    titleNode: (
      <>
        AI Tools <em>Mastery</em>
        <br />
        for Beginners
      </>
    ),
  },
  'ai-digital-marketing': {
    scene: 'sceneMktCards',
    modifier: null,
    extras: 'mktCards',
    chipTone: 'default',
    chipLabel: 'Marketing · Beginner',
    wm: '02 / Campaigns',
    kicker: 'Campaigns. Content. Ads.',
    titleTones: ['mkt'],
    titleNode: (
      <>
        AI for <em>Digital</em>
        <br />
        Marketing
      </>
    ),
  },
  'ai-explorer-school-kids-junior': {
    scene: 'sceneKidsPink',
    modifier: null,
    extras: 'kidsSmall',
    chipTone: 'default',
    chipLabel: 'Class 3–7 · Hands-on',
    wm: '03 / Junior',
    kicker: 'Curious minds, real tools',
    titleTones: [],
    titleNode: (
      <>
        AI Explorer
        <br />
        <em>Junior</em>
      </>
    ),
  },
  'ai-explorer-school-kids-senior': {
    scene: 'sceneKidsWarm',
    modifier: null,
    extras: 'kidsBig',
    chipTone: 'default',
    chipLabel: 'Class 8–12 · Build-first',
    wm: '04 / Senior',
    kicker: 'Prompt, build, present',
    titleTones: [],
    titleNode: (
      <>
        AI Explorer
        <br />
        <em>Senior</em>
      </>
    ),
  },
  'generative-ai-prompt-engineering': {
    scene: 'sceneProFlow',
    modifier: null,
    extras: 'flow',
    chipTone: 'green',
    chipLabel: 'Advanced · 8 Weeks',
    wm: '05 / GenAI',
    kicker: 'Prompting as craft',
    titleTones: ['pro'],
    titleNode: (
      <>
        Generative AI
        <br />
        & <em>Prompt Engineering</em>
      </>
    ),
  },
  'ai-power-8-week-program': {
    scene: 'sceneProDash',
    modifier: null,
    extras: 'dash',
    chipTone: 'green',
    chipLabel: 'Beginner · 8 Weeks',
    wm: '06 / Power',
    kicker: 'A portfolio in 60 days',
    titleTones: ['pro'],
    titleNode: (
      <>
        AI <em>Power</em>
        <br />
        8-Week Program
      </>
    ),
  },
  'master-claude-15-days': {
    scene: 'sceneProStudio',
    modifier: 'vClaude',
    extras: 'studio',
    chipTone: 'orange',
    chipLabel: '15 Days · Intensive',
    wm: '07 / Agents',
    kicker: 'Zero to agents',
    titleTones: ['pro', 'claude'],
    titleNode: (
      <>
        <em>Master</em> AI Agents
        <br />
        in 15 Days
      </>
    ),
  },
  'master-ai-builder': {
    scene: 'sceneProDash',
    modifier: null,
    extras: 'dash4',
    chipTone: 'green',
    chipLabel: '90 Days · Portfolio',
    wm: '08 / Builder',
    kicker: '50+ tools, 30+ projects',
    titleTones: ['pro'],
    titleNode: (
      <>
        Master AI <em>Builder</em>
        <br />
        90-Day Program
      </>
    ),
  },
  'ai-hustler-45': {
    scene: 'sceneProStudio',
    modifier: 'vHustler',
    extras: 'studio',
    chipTone: 'gold',
    chipLabel: '45 Days · Side Hustle',
    wm: '09 / Hustler',
    kicker: 'Your first paying client',
    titleTones: ['pro', 'hustler'],
    titleNode: (
      <>
        AI <em>Hustler</em> 45
      </>
    ),
  },
};

const CHIP_CLASS: Record<ChipTone, string> = {
  default: '',
  green: styles.chipGreen,
  orange: styles.chipOrange,
  gold: styles.chipGold,
};

function Extras({ kind }: { kind: ExtrasKey }) {
  switch (kind) {
    case 'studio':
      return (
        <>
          <span className={`${styles.glow} ${styles.g1}`} />
          <span className={`${styles.glow} ${styles.g2}`} />
          <span className={styles.gridLines} />
          <span className={styles.device} />
          <span className={styles.caret} />
        </>
      );
    case 'flow':
      return (
        <>
          <span className={`${styles.glow} ${styles.g1}`} />
          <span className={`${styles.glow} ${styles.g2}`} />
          <svg className={styles.doodleSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M14,32 L34,36 M42,36 L62,32 M62,34 L28,60 M62,34 L54,62"
              stroke="rgba(16,185,129,.35)"
              strokeWidth=".3"
              strokeDasharray="1 1"
              fill="none"
            />
          </svg>
          <span className={`${styles.node} ${styles.n1}`}>PROMPT</span>
          <span className={`${styles.node} ${styles.n2}`}>CONTEXT</span>
          <span className={`${styles.node} ${styles.n3}`}>TOOLS</span>
          <span className={`${styles.node} ${styles.n4}`}>REFLECT</span>
          <span className={`${styles.node} ${styles.n5}`}>OUTPUT</span>
        </>
      );
    case 'dash':
      return (
        <>
          <span className={`${styles.glow} ${styles.g1}`} />
          <span className={styles.gridLines} />
          <span className={styles.stack}>
            <span className={`${styles.bar} ${styles.f} ${styles.s2}`} />
            <span className={`${styles.bar} ${styles.f} ${styles.s1}`} />
            <span className={`${styles.bar} ${styles.s3}`} />
          </span>
          <span className={styles.dashRings} />
        </>
      );
    case 'dash4':
      return (
        <>
          <span className={`${styles.glow} ${styles.g1}`} />
          <span className={styles.gridLines} />
          <span className={styles.stack}>
            <span className={`${styles.bar} ${styles.f} ${styles.s2}`} />
            <span className={`${styles.bar} ${styles.f} ${styles.s1}`} />
            <span className={`${styles.bar} ${styles.s3}`} />
            <span className={`${styles.bar} ${styles.f} ${styles.s4}`} />
          </span>
          <span className={styles.dashRings} />
        </>
      );
    case 'mktCards':
      return (
        <>
          <span className={`${styles.orb} ${styles.o1}`} />
          <span className={`${styles.orb} ${styles.o2}`} />
          <div className={`${styles.cardGhost} ${styles.c1}`}>
            <span className={`${styles.ln} ${styles.w70}`} />
            <span className={`${styles.ln} ${styles.w40}`} />
            <span className={`${styles.ln} ${styles.w70}`} />
          </div>
          <div className={`${styles.cardGhost} ${styles.c2}`}>
            <span className={`${styles.ln} ${styles.w40}`} />
            <span className={`${styles.ln} ${styles.w70}`} />
          </div>
          <div className={`${styles.cardGhost} ${styles.c3}`}>
            <span className={`${styles.ln} ${styles.w70}`} />
            <span className={`${styles.ln} ${styles.w40}`} />
          </div>
          <span className={styles.mktBar} />
        </>
      );
    case 'kidsBig':
      return (
        <>
          <span className={`${styles.orb} ${styles.o1}`} />
          <span className={`${styles.orb} ${styles.o2}`} />
          <span className={styles.row} />
          <span className={styles.silhouette} />
        </>
      );
    case 'kidsSmall':
      return (
        <>
          <span className={`${styles.orb} ${styles.o1}`} />
          <span className={`${styles.orb} ${styles.o2}`} />
          <span className={styles.row} />
          <span className={`${styles.silhouette} ${styles.small}`} />
        </>
      );
    default:
      return null;
  }
}

export function CourseCover({ slug, className }: { slug: string; className?: string }) {
  const cfg = COVERS[slug];
  if (!cfg) return null;

  const modClass = cfg.modifier ? styles[cfg.modifier] : '';
  const titleToneClasses = cfg.titleTones.map((t) => styles[t]).join(' ');

  return (
    <div
      className={`${styles.cover} ${styles[cfg.scene]} ${modClass} ${className ?? ''}`.trim()}
      aria-hidden="true"
    >
      <Extras kind={cfg.extras} />
      <div className={styles.stage}>
        <div className={styles.top}>
          <span className={`${styles.chip} ${CHIP_CLASS[cfg.chipTone]}`.trim()}>
            {cfg.chipLabel}
          </span>
          <span className={styles.wm}>{cfg.wm}</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.kicker}>{cfg.kicker}</span>
          <div className={`${styles.title} ${titleToneClasses}`.trim()}>{cfg.titleNode}</div>
        </div>
      </div>
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  );
}

export function hasCourseCover(slug: string) {
  return slug in COVERS;
}
