'use client'

/**
 * Little cyan robot mascot — SVG-only, lightweight, blinks + gently
 * waves an antenna. Pure SMIL animations so there's no rAF, no state,
 * no motion library. Floating bob is a CSS keyframe on the wrapper.
 *
 * The face is intentionally simple (two eye dots + a smile) so kids
 * read it as friendly at any size.
 */
export function KidsFriendlyRobot({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative ${className}`}
      style={{ animation: 'kids-robot-float 4s ease-in-out infinite' }}
    >
      <style>{`
        @keyframes kids-robot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-kids-robot], [data-kids-robot] * { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        data-kids-robot
      >
        {/* Soft outer halo */}
        <circle cx="110" cy="110" r="96" fill="rgba(34,211,238,0.08)" />
        <circle
          cx="110"
          cy="110"
          r="88"
          fill="none"
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1.5"
          strokeDasharray="3 6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 110 110"
            to="360 110 110"
            dur="40s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Antenna */}
        <line x1="110" y1="60" x2="110" y2="40" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-6 110 60; 6 110 60; -6 110 60"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </line>
        <circle cx="110" cy="34" r="6" fill="#22d3ee">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Head */}
        <rect
          x="64"
          y="66"
          width="92"
          height="74"
          rx="24"
          fill="#0a1220"
          stroke="#22d3ee"
          strokeWidth="4"
        />

        {/* Cheek blush */}
        <circle cx="78" cy="118" r="5" fill="rgba(16,185,129,0.45)" />
        <circle cx="142" cy="118" r="5" fill="rgba(16,185,129,0.45)" />

        {/* Eyes — blink together */}
        <g>
          <ellipse cx="92" cy="100" rx="7" ry="9" fill="#22d3ee">
            <animate
              attributeName="ry"
              values="9;9;9;1;9;9"
              keyTimes="0;0.45;0.48;0.5;0.52;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="128" cy="100" rx="7" ry="9" fill="#22d3ee">
            <animate
              attributeName="ry"
              values="9;9;9;1;9;9"
              keyTimes="0;0.45;0.48;0.5;0.52;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>
          {/* eye highlights */}
          <circle cx="94" cy="97" r="1.8" fill="white" opacity="0.9" />
          <circle cx="130" cy="97" r="1.8" fill="white" opacity="0.9" />
        </g>

        {/* Smile */}
        <path
          d="M84 122 Q110 138 136 122"
          stroke="#10b981"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Side "ears" / speakers */}
        <rect x="56" y="92" width="6" height="22" rx="3" fill="#22d3ee" opacity="0.65" />
        <rect x="158" y="92" width="6" height="22" rx="3" fill="#22d3ee" opacity="0.65" />

        {/* Body hint (shoulders) */}
        <rect x="84" y="148" width="52" height="18" rx="9" fill="#0a1220" stroke="#22d3ee" strokeWidth="3" />
        <circle cx="110" cy="157" r="3" fill="#10b981">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
        </circle>

        {/* Floating sparkles — just vibes */}
        <g>
          <circle cx="36" cy="80" r="2" fill="#22d3ee">
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="184" cy="72" r="2" fill="#10b981">
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle cx="44" cy="162" r="2" fill="#10b981">
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="1.2s" />
          </circle>
          <circle cx="180" cy="150" r="2" fill="#22d3ee">
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="1.8s" />
          </circle>
        </g>
      </svg>
    </div>
  )
}
