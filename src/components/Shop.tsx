import { useState, type CSSProperties } from "react";
import Garment from "./Garment";
import { SectionTitle, Reveal } from "./ui";
import { products, type Category, type Product } from "../data";

const filters: ("All" | Category)[] = ["All", "Vintage", "Streetwear", "More"];

export function Shop({
  cart,
  onToggle,
}: {
  cart: number[];
  onToggle: (p: Product) => void;
}) {
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [liked, setLiked] = useState<number[]>([]);
  const list = filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="shop" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="Latest finds" title="Shop the drop" script="Fresh">
          One of each. Add it to your bag before someone else does.
        </SectionTitle>

        <Reveal className="mb-10 flex justify-center">
          <div className="glass flex flex-wrap justify-center gap-1 rounded-full p-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-6 py-2.5 font-display text-lg font-bold uppercase tracking-widest transition ${
                  filter === f
                    ? "bg-blood text-white shadow-[0_6px_24px_rgba(225,29,29,0.6)]"
                    : "text-bone/70 hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div key={filter} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => {
            const inCart = cart.includes(p.id);
            const fav = liked.includes(p.id);
            return (
              <article
                key={p.id}
                className="pop glass shine group relative flex flex-col rounded-[2rem] p-4 transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(225,29,29,0.3)]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {p.tag && (
                  <span className="glass-red absolute left-4 top-4 z-10 rounded-full px-3 py-1 font-display text-sm font-bold uppercase tracking-widest">
                    {p.tag}
                  </span>
                )}
                <button
                  onClick={() => setLiked(fav ? liked.filter((x) => x !== p.id) : [...liked, p.id])}
                  aria-label="Favourite"
                  className="glass absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full transition hover:scale-110 active:scale-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? "#e11d1d" : "none"} stroke={fav ? "#e11d1d" : "currentColor"} strokeWidth="2">
                    <path d="M12 21s-8-5.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.6-8 11-8 11Z" />
                  </svg>
                </button>

                <div className="relative grid h-64 place-items-center overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-white/[0.07] to-transparent">
                  <div className="absolute h-40 w-40 rounded-full opacity-30 blur-3xl transition group-hover:opacity-60" style={{ background: p.color }} />
                  <div className="absolute inset-x-8 top-[26px] h-0.5 rounded bg-bone/20" />
                  <div
                    className="swing relative w-44 transition-transform duration-500 group-hover:scale-110"
                    style={{ ["--d" as string]: `${3.6 + (i % 3) * 0.5}s`, ["--delay" as string]: `${-i * 0.6}s` } as CSSProperties}
                  >
                    <Garment type={p.type} color={p.color} delay={-i * 0.4} />
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-blood">{p.category}</p>
                  <h3 className="mt-0.5 font-display text-2xl font-bold uppercase leading-tight">{p.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-bone/60">
                    <span className="glass rounded-full px-2.5 py-1">Size {p.size}</span>
                    <span className="glass rounded-full px-2.5 py-1">{p.condition}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold">${p.price}</span>
                  <button
                    onClick={() => onToggle(p)}
                    className={`rounded-full px-5 py-2.5 font-display text-lg font-bold uppercase tracking-widest transition active:scale-95 ${
                      inCart
                        ? "glass text-bone hover:bg-white/10"
                        : "bg-blood text-white shadow-[0_8px_26px_rgba(225,29,29,0.5)] hover:scale-105"
                    }`}
                  >
                    {inCart ? "✓ In bag" : "Add +"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (p: Product) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((s, p) => s + p.price, 0);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="glass-dark slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/15 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl font-extrabold uppercase">
            Your <span className="font-script font-normal normal-case text-blood">bag</span>
          </h2>
          <button onClick={onClose} className="glass grid h-10 w-10 place-items-center rounded-full transition hover:rotate-90" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
          {items.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="swing mx-auto w-36">
                  <Garment type="hoodie" color="#444" />
                </div>
                <p className="mt-2 font-display text-2xl uppercase tracking-widest text-bone/60">Bag's empty</p>
                <p className="text-sm text-bone/40">Go find something one-of-a-kind.</p>
              </div>
            </div>
          )}
          {items.map((p) => (
            <div key={p.id} className="glass pop flex items-center gap-4 rounded-2xl p-3">
              <div className="w-16 shrink-0 rounded-xl bg-white/5 p-1">
                <Garment type={p.type} color={p.color} flutter={false} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl font-bold uppercase">{p.name}</p>
                <p className="text-xs text-bone/50">
                  Size {p.size} · {p.condition}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold">${p.price}</p>
                <button onClick={() => onRemove(p)} className="text-xs text-blood hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between font-display text-2xl font-bold uppercase">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            disabled={!items.length}
            onClick={onCheckout}
            className="mt-4 w-full rounded-full bg-blood py-4 font-display text-xl font-bold uppercase tracking-widest text-white shadow-[0_10px_36px_rgba(225,29,29,0.5)] transition enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
