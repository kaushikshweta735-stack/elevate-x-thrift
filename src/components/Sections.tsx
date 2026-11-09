import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Garment, { type GarmentType } from "./Garment";
import Logo from "./Logo";
import { Reveal, SectionTitle } from "./ui";
import { photos } from "../data";

/* ---------------------------------- NAV ---------------------------------- */
export function Navbar({ count, onCart }: { count: number; onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    ["Shop", "#shop"],
    ["The Rail", "#rail"],
    ["How it works", "#how"],
    ["Lookbook", "#lookbook"],
    ["Visit", "#visit"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
      <nav
        className={`glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-5 ${
          scrolled ? "shadow-[0_10px_50px_rgba(225,29,29,0.25)]" : ""
        }`}
      >
        <a href="#top" className="flex items-center gap-3">
          <Logo className="h-11 w-11 transition-transform duration-700 hover:rotate-[360deg]" detailed={false} />
          <span className="font-script text-xl leading-none">
            Elevate <span className="text-blood">X</span> Thrift
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([l, h]) => (
            <li key={h}>
              <a
                href={h}
                className="rounded-full px-4 py-2 font-display text-lg font-semibold uppercase tracking-widest text-bone/70 transition hover:bg-white/10 hover:text-white"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={onCart}
            className="glass-red relative flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-lg font-bold uppercase tracking-widest transition hover:scale-105 active:scale-95"
            aria-label="Open cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            Bag
            <span
              key={count}
              className={`pop grid h-6 min-w-6 place-items-center rounded-full bg-blood px-1.5 text-sm text-white ${
                count ? "pulse-ring" : "opacity-60"
              }`}
            >
              {count}
            </span>
          </button>
          <button
            className="glass grid h-11 w-11 place-items-center rounded-full lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-bone transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-bone transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-bone transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass pop mx-auto mt-2 max-w-7xl rounded-3xl p-3 lg:hidden">
          {links.map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 font-display text-2xl font-semibold uppercase tracking-widest text-bone/80 hover:bg-white/10"
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ---------------------------------- HERO --------------------------------- */
function FloatChip({
  type,
  color,
  className,
  delay,
  label,
}: {
  type: GarmentType;
  color: string;
  className: string;
  delay: number;
  label: string;
}) {
  return (
    <div
      className={`float glass absolute rounded-3xl p-3 ${className}`}
      style={{ ["--delay" as string]: `${delay}s`, ["--d" as string]: `${5 + delay}s`, ["--r" as string]: "3deg" } as CSSProperties}
    >
      <div className="swing w-16 sm:w-24" style={{ ["--delay" as string]: `${delay}s` } as CSSProperties}>
        <Garment type={type} color={color} delay={delay} />
      </div>
      <p className="mt-1 text-center font-display text-xs uppercase tracking-[0.25em] text-bone/70">{label}</p>
    </div>
  );
}

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <section id="top" className="relative flex min-h-screen items-center px-4 pb-16 pt-32 sm:px-8">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="glass inline-flex items-center gap-3 rounded-full px-5 py-2 font-display text-base font-semibold uppercase tracking-[0.3em]">
              Buy <i className="h-1.5 w-1.5 rounded-full bg-blood" /> Wear <i className="h-1.5 w-1.5 rounded-full bg-blood" /> Repeat
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 leading-[0.9]">
              <span className="block font-script text-5xl text-bone sm:text-7xl">Elevate your</span>
              <span className="text-gradient-red block font-display text-[5.2rem] font-extrabold uppercase tracking-tight sm:text-[9rem]">
                Wardrobe
              </span>
              <span className="block font-display text-3xl font-semibold uppercase tracking-[0.2em] text-bone/80 sm:text-4xl">
                one thrift at a time
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone/65">
              Hand-picked vintage, fresh-drop streetwear and one-of-a-kind finds. Every piece has a past — now it gets a
              second life on you.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#shop"
              className="group relative overflow-hidden rounded-full bg-blood px-8 py-4 font-display text-xl font-bold uppercase tracking-widest text-white shadow-[0_10px_40px_rgba(225,29,29,0.5)] transition hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Shop the drop →</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#rail"
              className="glass rounded-full px-8 py-4 font-display text-xl font-bold uppercase tracking-widest transition hover:scale-105 hover:bg-white/10 active:scale-95"
            >
              See the rail
            </a>
          </Reveal>
          <Reveal delay={0.4} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              ["12k+", "Pieces saved"],
              ["4.9★", "Customer love"],
              ["Weekly", "New drops"],
            ].map(([a, b]) => (
              <div key={b} className="glass rounded-2xl px-3 py-3 text-center">
                <div className="font-display text-3xl font-bold text-bone">{a}</div>
                <div className="text-xs uppercase tracking-wider text-bone/50">{b}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* logo stage */}
        <div
          ref={stage}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative mx-auto aspect-square w-full max-w-[560px]"
          style={{ perspective: 1200 }}
        >
          <div className="spin-slow absolute inset-[-4%] rounded-full border border-dashed border-blood/50" />
          <div className="spin-rev absolute inset-[-10%] rounded-full border border-dashed border-bone/20" />

          <div
            className="glass absolute inset-[4%] rounded-full p-4 transition-transform duration-200 ease-out"
            style={{
              transform: `rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 14}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-blood/10 blur-2xl" />
            <Logo className="relative h-full w-full drop-shadow-[0_0_40px_rgba(225,29,29,0.45)]" />
          </div>

          <FloatChip type="hoodie" color="#c41b1b" className="-left-2 top-4 sm:-left-8" delay={0} label="Hoodies" />
          <FloatChip type="jacket" color="#3b5a7a" className="-right-2 top-14 sm:-right-8" delay={1.2} label="Jackets" />
          <FloatChip type="tee" color="#efe6d2" className="bottom-6 -left-2 sm:-left-10" delay={2.1} label="Tees" />
          <FloatChip type="cap" color="#a31616" className="-right-2 bottom-2 sm:-right-6" delay={0.7} label="Caps" />
        </div>
      </div>

      <a href="#marquee" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block" aria-label="Scroll">
        <div className="glass flex h-12 w-7 justify-center rounded-full pt-2">
          <span className="float h-2 w-1 rounded-full bg-blood" style={{ ["--d" as string]: "1.6s" } as CSSProperties} />
        </div>
      </a>
    </section>
  );
}

/* -------------------------------- MARQUEE -------------------------------- */
export function Marquee() {
  const words = ["Vintage", "Streetwear", "More", "Buy", "Wear", "Repeat"];
  const row = [...words, ...words, ...words, ...words];
  return (
    <section id="marquee" className="relative -rotate-1 overflow-hidden border-y border-white/10 bg-blood/90 py-4 shadow-[0_0_60px_rgba(225,29,29,0.4)]">
      <div className="marquee flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={i} className="flex items-center font-display text-3xl font-extrabold uppercase tracking-[0.2em] text-ink sm:text-4xl">
                <span className="px-6">{w}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#050505">
                  <path d="M12 0 Q13 11 24 12 Q13 13 12 24 Q11 13 0 12 Q11 11 12 0Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- RAIL --------------------------------- */
export function Rail() {
  const items: { t: GarmentType; c: string; n: string; p: string }[] = [
    { t: "jacket", c: "#3b5a7a", n: "Denim Trucker", p: "$68" },
    { t: "tee", c: "#e6dcc4", n: "Racing Tee", p: "$29" },
    { t: "hoodie", c: "#c41b1b", n: "Blood Hoodie", p: "$52" },
    { t: "dress", c: "#7f1d1d", n: "Wine Slip", p: "$39" },
    { t: "jeans", c: "#2c3e5a", n: "Carpenters", p: "$58" },
    { t: "tee", c: "#1b1b1d", n: "Band Tee", p: "$34" },
    { t: "jacket", c: "#1f1f24", n: "Bomber", p: "$74" },
  ];
  return (
    <section id="rail" className="relative px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="Fresh on the rail" title="Swing by" script="The Rail">
          Hover a hanger and watch it sway — every piece on this rail is a one-of-one.
        </SectionTitle>

        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2.5rem] px-4 pb-8 pt-14 sm:px-10">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blood/15 to-transparent" />
            {/* rod */}
            <div className="absolute left-6 right-6 top-9 h-2.5 rounded-full bg-gradient-to-b from-bone/80 to-bone/30 shadow-[0_6px_20px_rgba(0,0,0,0.6)]" />
            <div className="absolute left-3 top-6 h-8 w-3 rounded bg-bone/50" />
            <div className="absolute right-3 top-6 h-8 w-3 rounded bg-bone/50" />

            <div className="relative grid grid-cols-2 gap-x-2 gap-y-8 pt-3 sm:grid-cols-4 lg:grid-cols-7">
              {items.map((it, i) => (
                <div key={i} className="group flex flex-col items-center">
                  <div
                    className="swing w-full max-w-[130px] cursor-pointer transition-transform duration-300 group-hover:scale-110"
                    style={{ ["--d" as string]: `${3.4 + (i % 4) * 0.6}s`, ["--delay" as string]: `${-i * 0.7}s` } as CSSProperties}
                  >
                    <Garment type={it.t} color={it.c} delay={-i * 0.5} />
                  </div>
                  <div className="glass mt-1 rounded-full px-3 py-1 text-center opacity-70 transition group-hover:opacity-100">
                    <p className="font-display text-sm font-semibold uppercase tracking-wider">{it.n}</p>
                    <p className="text-xs font-bold text-blood">{it.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- CATEGORIES ------------------------------ */
export function Categories() {
  const cats: { n: string; d: string; img: string; t: GarmentType; c: string }[] = [
    { n: "Vintage", d: "Decades-old gems, perfectly worn in.", img: photos.rack, t: "jacket", c: "#3b5a7a" },
    { n: "Streetwear", d: "Oversized fits, hoodies & heat.", img: photos.street1, t: "hoodie", c: "#c41b1b" },
    { n: "More", d: "Caps, dresses & curious extras.", img: photos.browse, t: "cap", c: "#a31616" },
  ];
  return (
    <section className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="Pick your lane" title="Three ways to elevate" />
        <div className="grid gap-6 md:grid-cols-3">
          {cats.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.12}>
              <a
                href="#shop"
                className="group glass shine relative block h-[480px] overflow-hidden rounded-[2rem] p-3 transition duration-500 hover:-translate-y-2 hover:shadow-[0_20px_70px_rgba(225,29,29,0.35)]"
              >
                <img
                  src={c.img}
                  alt={c.n}
                  loading="lazy"
                  className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-[1.5rem] object-cover opacity-70 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                />
                <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div
                  className="swing absolute right-8 top-4 w-24 transition-transform duration-500 group-hover:scale-125"
                  style={{ ["--delay" as string]: `${-i}s` } as CSSProperties}
                >
                  <Garment type={c.t} color={c.c} />
                </div>
                <div className="glass-dark absolute inset-x-6 bottom-6 rounded-2xl p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display text-4xl font-extrabold uppercase tracking-wide">{c.n}</h3>
                      <p className="text-sm text-bone/60">{c.d}</p>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-blood text-xl transition group-hover:rotate-45">↗</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- HOW --------------------------------- */
export function How() {
  const steps: { n: string; t: string; d: string; g: GarmentType; c: string }[] = [
    { n: "01", t: "Buy", d: "Browse hand-picked, quality-checked pieces. Every item is one of a kind — when it's gone, it's gone.", g: "hoodie", c: "#c41b1b" },
    { n: "02", t: "Wear", d: "Rock it your way. Mix eras, layer textures and build a fit nobody else can copy.", g: "jacket", c: "#3b5a7a" },
    { n: "03", t: "Repeat", d: "Bring it back for store credit and grab your next find. Keep the loop spinning.", g: "tee", c: "#efe6d2" },
  ];
  return (
    <section id="how" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="The loop" title="Buy · Wear · Repeat" script="Simple." />
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-24 hidden border-t-2 border-dashed border-blood/40 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.15}>
              <div className="glass shine group relative h-full rounded-[2rem] p-8 text-center transition duration-500 hover:-translate-y-2">
                <span className="absolute right-6 top-4 font-display text-6xl font-extrabold text-white/5">{s.n}</span>
                <div
                  className="swing mx-auto w-28 transition-transform duration-500 group-hover:scale-110"
                  style={{ ["--delay" as string]: `${-i * 1.1}s` } as CSSProperties}
                >
                  <Garment type={s.g} color={s.c} />
                </div>
                <h3 className="mt-2 font-display text-5xl font-extrabold uppercase">
                  <span className="text-blood">{s.t}</span>
                </h3>
                <p className="mt-3 text-bone/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- LOOKBOOK ------------------------------ */
export function Lookbook() {
  const shots = [
    { src: photos.street2, cap: "Blackout layers", h: "h-80" },
    { src: photos.coats, cap: "Coat season", h: "h-[26rem]" },
    { src: photos.hoodies, cap: "Graphic hoodies", h: "h-72" },
    { src: photos.store, cap: "Inside the store", h: "h-[26rem]" },
    { src: photos.shirt, cap: "Pick of the week", h: "h-72" },
    { src: photos.rack, cap: "Fresh from the rack", h: "h-80" },
  ];
  return (
    <section id="lookbook" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="Style inspo" title="Lookbook" script="The">
          Real fits, real finds. Tag us to get featured on the wall.
        </SectionTitle>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {shots.map((s, i) => (
            <Reveal key={s.cap} delay={(i % 3) * 0.1}>
              <figure className="group glass shine relative break-inside-avoid overflow-hidden rounded-[2rem] p-2.5 transition duration-500 hover:-translate-y-1.5 hover:rotate-[-0.6deg]">
                <img
                  src={s.src}
                  alt={s.cap}
                  loading="lazy"
                  className={`${s.h} w-full rounded-[1.5rem] object-cover transition duration-700 group-hover:scale-[1.04]`}
                />
                <figcaption className="glass-dark absolute bottom-5 left-5 rounded-full px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.2em] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-3">
                  {s.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- STATS ------------------------------- */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1800, 1);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Stats() {
  const stats = [
    { to: 12400, s: "+", l: "Pieces re-homed", g: "tee" as GarmentType, c: "#efe6d2" },
    { to: 3.4, s: "t", l: "Textile waste saved", g: "jeans" as GarmentType, c: "#5b7aa6", d: 1 },
    { to: 4.9, s: "★", l: "Average rating", g: "dress" as GarmentType, c: "#c41b1b", d: 1 },
    { to: 8200, s: "+", l: "Repeat shoppers", g: "cap" as GarmentType, c: "#a31616" },
  ];
  return (
    <section className="relative px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass-red grid gap-2 rounded-[2.5rem] p-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.l} className="relative flex items-center gap-4 rounded-3xl p-5 transition hover:bg-white/5">
                <div className="swing w-16 shrink-0" style={{ ["--delay" as string]: `${-i}s` } as CSSProperties}>
                  <Garment type={s.g} color={s.c} />
                </div>
                <div>
                  <div className="font-display text-5xl font-extrabold leading-none">
                    <Counter to={s.to} suffix={s.s} decimals={s.d ?? 0} />
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-wider text-bone/70">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ NEWSLETTER + VISIT ----------------------- */
export function Visit() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="visit" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="glass relative h-full overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
            <div className="swing absolute -right-2 top-0 w-32 opacity-80 sm:w-44">
              <Garment type="hoodie" color="#c41b1b" />
            </div>
            <h2 className="max-w-md font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
              Get first dibs on <span className="text-gradient-red">every drop</span>
            </h2>
            <p className="mt-4 max-w-md text-bone/60">
              Join the list for early access, secret sales and a 10% welcome code on your first bag.
            </p>
            {done ? (
              <div className="pop glass-red mt-8 inline-flex items-center gap-3 rounded-full px-6 py-4 font-display text-xl font-bold uppercase tracking-wider">
                ✦ You're on the list — welcome to the loop!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setDone(true);
                }}
                className="glass-dark mt-8 flex max-w-lg flex-col gap-2 rounded-3xl p-2 sm:flex-row sm:rounded-full"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-bone outline-none placeholder:text-bone/40"
                />
                <button className="rounded-full bg-blood px-7 py-3 font-display text-lg font-bold uppercase tracking-widest text-white transition hover:scale-105 active:scale-95">
                  Join
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="glass h-full rounded-[2.5rem] p-8 sm:p-10">
            <h3 className="font-display text-4xl font-extrabold uppercase">
              Visit the <span className="font-script text-blood normal-case">store</span>
            </h3>
            <ul className="mt-6 space-y-4 text-bone/70">
              <li className="flex gap-3">
                <span className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full">📍</span>
                <span>
                  24 Hanger Lane, Old Town
                  <br />
                  <span className="text-sm text-bone/40">Next to the record shop</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full">🕒</span>
                <span>
                  Mon–Sat 11am – 8pm
                  <br />
                  <span className="text-sm text-bone/40">Sunday 12pm – 6pm</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full">✉️</span>
                <span>
                  hello@elevatethrift.store
                  <br />
                  <span className="text-sm text-bone/40">@elevatexthrift</span>
                </span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-4 pb-10 pt-6 sm:px-8">
      <div className="glass mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-[2rem] px-8 py-8 md:flex-row">
        <div className="flex items-center gap-4">
          <Logo className="h-20 w-20" />
          <div>
            <p className="font-script text-2xl">
              Elevate <span className="text-blood">X</span> Thrift
            </p>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-bone/50">Vintage • Streetwear • More</p>
          </div>
        </div>
        <p className="font-display text-xl uppercase tracking-[0.3em] text-bone/60">Buy · Wear · Repeat</p>
        <p className="text-sm text-bone/40">© {new Date().getFullYear()} Elevate X Thrift. All rights reserved.</p>
      </div>
    </footer>
  );
}
