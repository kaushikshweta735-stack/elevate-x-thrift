import { useId } from "react";

const Sparkle = ({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) => (
  <path
    className="twinkle"
    style={{ ["--delay" as string]: `${delay}s` }}
    d={`M${x} ${y - 16 * s} Q${x + 2 * s} ${y - 2 * s} ${x + 16 * s} ${y} Q${x + 2 * s} ${y + 2 * s} ${x} ${y + 16 * s} Q${x - 2 * s} ${y + 2 * s} ${x - 16 * s} ${y} Q${x - 2 * s} ${y - 2 * s} ${x} ${y - 16 * s} Z`}
    fill="#efe6d2"
  />
);

export default function Logo({ className = "", detailed = true }: { className?: string; detailed?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 500 500" className={className} role="img" aria-label="Elevate X Thrift logo">
      <defs>
        <path id={`${id}-top`} d="M 60 250 A 190 190 0 0 1 440 250" />
        <path id={`${id}-bot`} d="M 52 250 A 198 198 0 0 0 448 250" />
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>

      <circle cx="250" cy="250" r="246" fill="#050505" />
      <circle cx="250" cy="250" r="238" fill="none" stroke="#e11d1d" strokeWidth="6" />
      <circle cx="250" cy="250" r="224" fill="none" stroke="#efe6d2" strokeWidth="2" />

      {detailed && (
        <>
          <text
            fontFamily="Barlow Condensed, sans-serif"
            fontWeight="600"
            fontSize="27"
            letterSpacing="7"
            fill="#efe6d2"
          >
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
              BUY • WEAR • REPEAT
            </textPath>
          </text>
          <text
            fontFamily="Barlow Condensed, sans-serif"
            fontWeight="600"
            fontSize="27"
            letterSpacing="6"
            fill="#efe6d2"
          >
            <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
              VINTAGE • STREETWEAR • MORE
            </textPath>
          </text>
        </>
      )}

      {/* hanger */}
      <g
        fill="none"
        stroke="#efe6d2"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="swing"
        style={{ transformOrigin: "250px 108px", ["--d" as string]: "3.2s" }}
      >
        <path d="M250 150 V136 C250 126 264 124 264 112 C264 104 257 100 250 102 C244 104 242 108 242 112" />
        <path d="M250 150 L184 176 Q178 180 186 180 H314 Q322 180 316 176 Z" />
      </g>

      <Sparkle x={96} y={200} s={0.85} />
      <Sparkle x={404} y={200} s={0.85} delay={0.8} />
      <Sparkle x={432} y={300} s={1.1} delay={1.4} />

      {/* wordmark */}
      <g transform="rotate(-7 250 260)">
        <text
          x="250"
          y="268"
          textAnchor="middle"
          fontFamily="Kaushan Script, cursive"
          fontSize="96"
          fill="#efe6d2"
          textLength="300"
          lengthAdjust="spacingAndGlyphs"
          filter={`url(#${id}-grain)`}
        >
          Elevate
        </text>
        <text
          x="270"
          y="352"
          textAnchor="middle"
          fontFamily="Kaushan Script, cursive"
          fontSize="96"
          fill="#efe6d2"
          textLength="250"
          lengthAdjust="spacingAndGlyphs"
          filter={`url(#${id}-grain)`}
        >
          Thrift
        </text>
        {/* X */}
        <g stroke="#e11d1d" strokeWidth="11" strokeLinecap="round">
          <path d="M214 276 L262 316" />
          <path d="M262 272 L212 322" />
        </g>
      </g>

      {/* sub label */}
      <g>
        <path d="M130 388 H190 M310 388 H370" stroke="#efe6d2" strokeWidth="1.5" />
        <text
          x="250"
          y="394"
          textAnchor="middle"
          fontFamily="Barlow Condensed, sans-serif"
          fontWeight="600"
          fontSize="22"
          letterSpacing="5"
          fill="#efe6d2"
        >
          THRIFT STORE
        </text>
        <path
          d="M250 408 V404 C250 401 254 401 254 398 C254 395 250 395 249 397 M250 408 L234 416 H266 Z"
          fill="none"
          stroke="#efe6d2"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
