'use client'

/**
 * Punjab expansion map — approximate state outline with real-geography
 * city placements. Kotkapura HQ is a solid ringed emerald node; target
 * districts (Amritsar, Jalandhar, Ludhiana, Bathinda, Patiala,
 * Chandigarh) pulse. Pure SVG + SMIL, respects prefers-reduced-motion.
 *
 * Cities positioned by rough lat/long within a 360×240 viewBox
 * (longitude 73.9–76.9 → x 20–320, latitude 29.5–32.5 → y 220–20).
 * Punjab outline is a hand-drawn simplification, not cartographically
 * exact, but close enough for a Punjab reader to recognise their state.
 */

type City = {
  id: string
  label: string
  sub: string
  x: number
  y: number
  hq?: boolean
}

const CITIES: City[] = [
  { id: 'kotkapura',  label: 'Kotkapura',  sub: 'HQ · Live',     x: 113, y: 148, hq: true },
  { id: 'bathinda',   label: 'Bathinda',   sub: 'Target · 2026', x: 125, y: 173 },
  { id: 'amritsar',   label: 'Amritsar',   sub: 'Target · 2026', x: 117, y: 78 },
  { id: 'jalandhar',  label: 'Jalandhar',  sub: 'Target · 2026', x: 188, y: 98 },
  { id: 'ludhiana',   label: 'Ludhiana',   sub: 'Target · 2026', x: 216, y: 127 },
  { id: 'patiala',    label: 'Patiala',    sub: 'Target · 2026', x: 269, y: 164 },
  { id: 'chandigarh', label: 'Chandigarh', sub: 'Target · 2026', x: 308, y: 138 },
]

const HQ = CITIES[0]

// Simplified Punjab outline — 18 control points going clockwise from
// the northern Pathankot peak through the Chandigarh corner (east),
// the Mansa/Bathinda south belt, the Pakistan-border west, and back
// up via Amritsar. Approximation.
const PUNJAB_PATH = [
  'M 210 30',   // Pathankot peak
  'L 245 55',   // NE descent into Hoshiarpur
  'L 275 78',
  'L 300 105',  // approaching Rupnagar
  'L 322 132',  // Chandigarh corner
  'L 315 152',  // turning south
  'L 288 168',  // Patiala latitude
  'L 258 175',
  'L 222 182',  // Sangrur
  'L 175 195',  // Mansa
  'L 130 202',  // Muktsar south belt
  'L 85 198',
  'L 55 183',   // SW corner (Fazilka)
  'L 38 158',
  'L 42 120',   // Pakistan border west
  'L 58 92',    // up toward Amritsar
  'L 82 72',
  'L 118 52',   // Gurdaspur area
  'L 158 36',
  'Z',
].join(' ')

export function PartnerPunjabMap() {
  const targets = CITIES.filter((c) => !c.hq)

  return (
    <div className="relative w-full aspect-[3/2] max-w-3xl mx-auto">
      {/* Halo behind the map */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[40px] blur-3xl opacity-70 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(16,185,129,0.18), rgba(16,185,129,0) 70%)',
        }}
      />

      <svg
        viewBox="0 0 360 240"
        className="relative w-full h-full drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Map of Punjab — Kotkapura HQ with target districts highlighted"
      >
        <defs>
          <pattern id="partner-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="partner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.5)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </radialGradient>
          <linearGradient id="punjab-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.08)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.02)" />
          </linearGradient>
        </defs>

        {/* Background grid (clipped by the container's rounded corners via border) */}
        <rect x="0" y="0" width="360" height="240" fill="url(#partner-grid)" opacity="0.6" />

        {/* The Punjab state — filled shape + border */}
        <path
          d={PUNJAB_PATH}
          fill="url(#punjab-fill)"
          stroke="rgba(16,185,129,0.55)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Subtle inner shadow — gives the shape some depth */}
        <path
          d={PUNJAB_PATH}
          fill="none"
          stroke="rgba(16,185,129,0.18)"
          strokeWidth="4"
          strokeLinejoin="round"
          opacity="0.5"
          style={{ filter: 'blur(3px)' }}
        />

        {/* PUNJAB · EXPANSION label, placed inside the northern part of the shape */}
        <text
          x="185"
          y="58"
          fontSize="5.5"
          fill="rgba(148,163,184,0.55)"
          textAnchor="middle"
          letterSpacing="2"
          style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
        >
          PUNJAB · EXPANSION · 2026
        </text>

        {/* Connectors from HQ to each target — dashed, subtle animation */}
        <g fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1" strokeDasharray="4 4">
          {targets.map((t) => (
            <line key={`line-${t.id}`} x1={HQ.x} y1={HQ.y} x2={t.x} y2={t.y}>
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-24"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>

        {/* HQ node — larger, ringed, steady (proof of model) */}
        <g>
          <circle cx={HQ.x} cy={HQ.y} r="20" fill="url(#partner-glow)" />
          <circle
            cx={HQ.x}
            cy={HQ.y}
            r="11"
            fill="none"
            stroke="rgba(16,185,129,0.6)"
            strokeWidth="1"
          >
            <animate attributeName="r" values="9;14;9" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={HQ.x} cy={HQ.y} r="6.5" fill="#10b981" />
          <circle cx={HQ.x} cy={HQ.y} r="2.8" fill="#e7fbf3" />
        </g>

        {/* Target nodes — smaller, pulsing */}
        {targets.map((t, i) => (
          <g key={t.id}>
            <circle cx={t.x} cy={t.y} r="12" fill="url(#partner-glow)" opacity="0.7" />
            <circle cx={t.x} cy={t.y} r="4" fill="#10b981">
              <animate
                attributeName="r"
                values="3.2;5.8;3.2"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.18}s`}
              />
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.18}s`}
              />
            </circle>
          </g>
        ))}

        {/* City labels — placed above for northern cities, below for southern */}
        {CITIES.map((c) => {
          const labelY = c.y < 120 ? c.y - 12 : c.y + 22
          const subY = c.y < 120 ? c.y - 24 : c.y + 32
          return (
            <g key={`label-${c.id}`}>
              <text
                x={c.x}
                y={labelY}
                fontSize="8"
                fontWeight="700"
                fill={c.hq ? '#a7f3d0' : '#cbd5e1'}
                textAnchor="middle"
                style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
              >
                {c.label}
              </text>
              <text
                x={c.x}
                y={subY}
                fontSize="6"
                fontWeight="500"
                fill={c.hq ? 'rgba(16,185,129,0.95)' : 'rgba(148,163,184,0.7)'}
                textAnchor="middle"
                letterSpacing="1.2"
                style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
              >
                {c.sub.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          svg animate, svg animateTransform { display: none; }
        }
      `}</style>
    </div>
  )
}
