import { useId, type ReactNode } from "react";

export type GarmentType = "tee" | "hoodie" | "jacket" | "jeans" | "dress" | "cap";

interface Props {
  type: GarmentType;
  color?: string;
  className?: string;
  hanger?: boolean;
  flutter?: boolean;
  delay?: number;
}

const HOOK = "M100 42 V32 C100 24 112 22 112 13 C112 7 107 4 102 6";

const hangers: Record<GarmentType, string> = {
  tee: `${HOOK} M100 42 L34 80 Q30 82 34 82 H166 Q170 82 166 80 Z`,
  hoodie: `${HOOK} M100 42 L34 80 Q30 82 34 82 H166 Q170 82 166 80 Z`,
  jacket: `${HOOK} M100 42 L34 80 Q30 82 34 82 H166 Q170 82 166 80 Z`,
  dress: `${HOOK} M100 42 L80 62 M100 42 L120 62`,
  jeans: `${HOOK} M62 62 H138 M70 62 V74 M130 62 V74`,
  cap: "",
};

const STROKE = "rgba(0,0,0,0.38)";

interface Shape {
  back?: string; // drawn behind body (e.g. hood)
  paths: string[];
  front?: string[]; // extra darker pieces (brim)
  details: ReactNode;
}

const shapes: Record<GarmentType, Shape> = {
  tee: {
    paths: [
      "M70 24 L36 40 L14 80 L42 96 L56 80 L56 168 L144 168 L144 80 L158 96 L186 80 L164 40 L130 24 Q100 50 70 24 Z",
    ],
    details: (
      <>
        <path d="M70 24 Q100 50 130 24" stroke={STROKE} strokeWidth="3" />
        <path d="M56 158 H144" stroke={STROKE} strokeWidth="1.5" />
        <path d="M24 86 L42 96 M176 86 L158 96" stroke={STROKE} strokeWidth="1.5" />
      </>
    ),
  },
  hoodie: {
    back: "M66 28 Q68 2 100 2 Q132 2 134 28 Q116 64 100 68 Q84 64 66 28Z",
    paths: [
      "M66 28 L34 46 L16 150 L42 156 L56 100 L56 172 L144 172 L144 100 L158 156 L184 150 L166 46 L134 28 Q100 74 66 28Z",
    ],
    details: (
      <>
        <path d="M70 30 Q100 74 130 30" stroke={STROKE} strokeWidth="3" />
        <path d="M68 128 H132 L140 158 H60 Z" stroke={STROKE} strokeWidth="1.8" />
        <path d="M92 62 V96 M108 62 V96" stroke="#efe6d2" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 164 H144" stroke={STROKE} strokeWidth="1.5" />
        <path d="M22 142 L44 148 M178 142 L156 148" stroke={STROKE} strokeWidth="1.5" />
      </>
    ),
  },
  jacket: {
    paths: [
      "M64 26 L30 44 L12 156 L40 162 L56 100 L56 172 L144 172 L144 100 L160 162 L188 156 L170 44 L136 26 L100 46 Z",
    ],
    details: (
      <>
        <path d="M64 26 L84 54 L100 46 L116 54 L136 26" stroke={STROKE} strokeWidth="2.5" />
        <path d="M100 46 V172" stroke="#efe6d2" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M66 126 H90 M110 126 H134" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 160 H144" stroke={STROKE} strokeWidth="2" />
        <path d="M18 146 L42 152 M182 146 L158 152" stroke={STROKE} strokeWidth="2" />
      </>
    ),
  },
  jeans: {
    paths: ["M62 22 H138 L152 178 H108 L100 78 L92 178 H48 Z"],
    details: (
      <>
        <path d="M62 38 H138" stroke={STROKE} strokeWidth="2" />
        <path d="M100 38 V78" stroke={STROKE} strokeWidth="1.8" />
        <path d="M66 38 Q74 62 92 54 M134 38 Q126 62 108 54" stroke="#efe6d2" strokeWidth="1.6" strokeDasharray="3 2.5" />
        <path d="M54 166 H93 M107 166 H146" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="100" cy="42" r="2.6" fill="#efe6d2" stroke="none" />
      </>
    ),
  },
  dress: {
    paths: ["M78 22 L88 22 L100 42 L112 22 L122 22 L128 74 L166 176 Q100 192 34 176 L72 74 Z"],
    details: (
      <>
        <path d="M88 22 L100 42 L112 22" stroke={STROKE} strokeWidth="2" />
        <path d="M73 80 H127" stroke={STROKE} strokeWidth="2" />
        <path d="M86 86 Q82 140 62 176 M100 86 V184 M114 86 Q118 140 138 176" stroke={STROKE} strokeWidth="1.2" opacity=".6" />
      </>
    ),
  },
  cap: {
    paths: ["M32 124 Q30 56 100 56 Q170 56 168 124 Z"],
    front: ["M146 114 Q198 116 196 138 Q168 140 126 128 Z"],
    details: (
      <>
        <path d="M100 56 V124" stroke={STROKE} strokeWidth="1.5" />
        <path d="M68 66 Q60 96 64 124 M132 66 Q140 96 136 124" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="100" cy="56" r="4.5" fill="#efe6d2" stroke="none" />
        <path d="M34 118 H168" stroke={STROKE} strokeWidth="2" />
      </>
    ),
  },
};

export default function Garment({
  type,
  color = "#e11d1d",
  className = "",
  hanger = true,
  flutter = true,
  delay = 0,
}: Props) {
  const id = useId().replace(/:/g, "");
  const s = shapes[type];
  const yShift = type === "cap" ? 20 : 40;

  return (
    <svg viewBox="0 0 200 224" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {hanger && hangers[type] && (
        <path
          d={hangers[type]}
          stroke="#efe6d2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      <g transform={`translate(0 ${yShift})`}>
        <g className={flutter ? "flutter" : ""} style={{ ["--delay" as string]: `${delay}s` }}>
          {s.back && (
            <>
              <path d={s.back} fill={color} />
              <path d={s.back} fill="#000" opacity="0.35" />
              <path d={s.back} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            </>
          )}
          {s.paths.map((d) => (
            <g key={d}>
              <path d={d} fill={color} />
              <path d={d} fill={`url(#${id}-shade)`} />
              <path d={d} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinejoin="round" />
            </g>
          ))}
          {s.front?.map((d) => (
            <g key={d}>
              <path d={d} fill={color} />
              <path d={d} fill="#000" opacity="0.3" />
              <path d={d} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinejoin="round" />
            </g>
          ))}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {s.details}
          </g>
        </g>
      </g>
    </svg>
  );
}
