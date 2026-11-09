import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Garment, { type GarmentType } from "./Garment";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ ["--delay" as string]: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  script,
  children,
}: {
  kicker: string;
  title: string;
  script?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 text-center">
      <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.3em] text-bone/80">
        <span className="h-1.5 w-1.5 rounded-full bg-blood" /> {kicker}
      </span>
      <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl">
        {script && <span className="mr-3 font-script text-4xl font-normal normal-case text-blood sm:text-6xl">{script}</span>}
        {title}
      </h2>
      {children && <p className="mx-auto mt-4 max-w-xl text-bone/60">{children}</p>}
    </Reveal>
  );
}

/** Fixed animated background: blurry blobs, cursor glow, drifting garments */
export function Background() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (glow.current) {
        glow.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const drifters: { t: GarmentType; c: string; l: string; s: number; d: number; delay: number; x: number }[] = [
    { t: "hoodie", c: "#e11d1d", l: "6%", s: 110, d: 38, delay: 0, x: 60 },
    { t: "tee", c: "#efe6d2", l: "20%", s: 80, d: 46, delay: -14, x: -40 },
    { t: "jacket", c: "#3b5a7a", l: "36%", s: 120, d: 52, delay: -30, x: 50 },
    { t: "cap", c: "#e11d1d", l: "52%", s: 80, d: 34, delay: -8, x: -60 },
    { t: "jeans", c: "#5b7aa6", l: "66%", s: 100, d: 48, delay: -22, x: 40 },
    { t: "dress", c: "#efe6d2", l: "80%", s: 100, d: 42, delay: -36, x: -50 },
    { t: "tee", c: "#e11d1d", l: "92%", s: 72, d: 40, delay: -18, x: 30 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="blob absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-blood/35 blur-[130px]" />
      <div
        className="blob absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full bg-[#7f1d1d]/40 blur-[130px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="blob absolute -bottom-40 left-1/4 h-[560px] w-[560px] rounded-full bg-bone/10 blur-[140px]"
        style={{ animationDelay: "-11s" }}
      />
      {drifters.map((g, i) => (
        <div
          key={i}
          className="drift absolute left-0 top-0 opacity-[0.1]"
          style={{
            left: g.l,
            width: g.s,
            ["--d" as string]: `${g.d}s`,
            ["--delay" as string]: `${g.delay}s`,
            ["--x" as string]: `${g.x}px`,
          }}
        >
          <Garment type={g.t} color={g.c} />
        </div>
      ))}
      <div
        ref={glow}
        className="absolute left-0 top-0 hidden h-[500px] w-[500px] rounded-full bg-blood/20 blur-[100px] transition-transform duration-300 ease-out md:block"
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}
