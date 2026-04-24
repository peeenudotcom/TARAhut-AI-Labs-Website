'use client'

/**
 * Punjab expansion map — stylised, not geographically precise. Shows
 * the Kotkapura HQ as a solid ringed emerald node and the target
 * districts as pulsing nodes connected by subtle dashed lines.
 * Pure SVG + SMIL animations, respects prefers-reduced-motion.
 */

type City = {
  id: string
  label: string
  sub: string
  x: number
  y: number
  hq?: boolean
}

// Relative coords inside a 360x240 viewBox — roughly laid out so
// Punjab readers can locate each town without needing a real map.
// HQ is Kotkapura (south-west). Targets spread across the state.
const CITIES: City[] = [
  { id: 'kotkapura',  label: 'Kotkapura',  sub: 'HQ · Live',     x: 92,  y: 168, hq: true },
  { id: 'bathinda',   label: 'Bathinda',   sub: 'Target · 2026', x: 140, y: 184 },
  { id: 'amritsar',   label: 'Amritsar',   sub: 'Target · 2026', x: 68,  y: 56 },
  { id: 'jalandhar',  label: 'Jalandhar',  sub: 'Target · 2026', x: 148, y: 92 },
  { id: 'ludhiana',   label: 'Ludhiana',   sub: 'Target · 2026', x: 196, y: 128 },
  { id: 'patiala',    label: 'Patiala',    sub: 'Target · 2026', x: 248, y: 168 },
  { id: 'chandigarh', label: 'Chandigarh', sub: 'Target · 2026', x: 296, y: 124 },
]

const HQ = CITIES[0]

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
        aria-label="Punjab expansion map — Kotkapura HQ with target districts"
      >
        {/* Container */}
        <rect
          x="2"
          y="2"
          width="356"
          height="236"
          rx="18"
          fill="rgba(16,185,129,0.02)"
          stroke="rgba(16,185,129,0.18)"
        />

        {/* Faint grid — the "blueprint" feel */}
        <defs>
          <pattern id="partner-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="partner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.5)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="356" height="236" rx="18" fill="url(#partner-grid)" />

        {/* Connectors from HQ to each target — dashed, subtle animation */}
        <g fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="1" strokeDasharray="4 4">
          {targets.map((t) => (
            <line
              key={`line-${t.id}`}
              x1={HQ.x}
              y1={HQ.y}
              x2={t.x}
              y2={t.y}
            >
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
            stroke="rgba(16,185,129,0.55)"
            strokeWidth="1"
          >
            <animate attributeName="r" values="9;14;9" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0.15;0.55" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={HQ.x} cy={HQ.y} r="6" fill="#10b981" />
          <circle cx={HQ.x} cy={HQ.y} r="2.5" fill="#e7fbf3" />
        </g>

        {/* Target nodes — smaller, pulsing */}
        {targets.map((t, i) => (
          <g key={t.id}>
            <circle cx={t.x} cy={t.y} r="12" fill="url(#partner-glow)" opacity="0.7" />
            <circle cx={t.x} cy={t.y} r="4" fill="#10b981">
              <animate
                attributeName="r"
                values="3.2;5.5;3.2"
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

        {/* City labels — all render, HQ gets a different style */}
        {CITIES.map((c) => {
          // Offset label above or below based on vertical position
          // so we don't overlap the node.
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

        {/* Legend strip — bottom-right, monospace */}
        <g>
          <text
            x="342"
            y="222"
            fontSize="5.5"
            fill="rgba(148,163,184,0.55)"
            textAnchor="end"
            letterSpacing="1.5"
            style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
          >
            PUNJAB · EXPANSION · 2026
          </text>
        </g>
      </svg>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          svg animate, svg animateTransform { display: none; }
        }
      `}</style>
    </div>
  )
}
