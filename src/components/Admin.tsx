/**
 * Admin panel — lives at the hash route #/admin.
 * Login with the email/password created in Firebase Authentication.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import Garment, { type GarmentType } from "./Garment";
import { Background } from "./ui";
import type { ContentKey, SiteContent } from "../content";
import { FIELD_GROUPS } from "../content";
import {
  firebaseConfig,
  deleteOrder,
  deleteProduct,
  saveContent,
  saveProduct,
  seedCloud,
  setOrderStatus,
  signInAdmin,
  signOutAdmin,
  subscribeContent,
  subscribeOrders,
  subscribeProducts,
  watchAuth,
  type StoreOrder,
} from "../lib/firebase";
import type { Category, Product } from "../data";

const GARMENT_TYPES: GarmentType[] = ["tee", "hoodie", "jacket", "jeans", "dress", "cap"];
const CATEGORIES: Category[] = ["Vintage", "Streetwear", "More"];
const SITE_URL = "https://kaushikshweta735-stack.github.io/elevate-x-thrift/";

/* ------------------------------ primitives ----------------------------- */

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-bone outline-none transition focus:border-blood/70 focus:bg-black/60";
const labelCls = "mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-bone/45";
const btnCls =
  "rounded-full px-4 py-2 font-display text-sm font-bold uppercase tracking-widest transition active:scale-95 disabled:opacity-40";

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {multiline ? (
        <textarea rows={2} className={inputCls + " resize-y"} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function useFlash() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const flash = (text: string, ok = true) => {
    setMsg({ text, ok });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 4000);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { msg, flash };
}

/* ------------------------------- products ------------------------------ */

function ProductCard({
  product,
  extra,
  cloudReady,
  onSaved,
}: {
  product: Product;
  extra: boolean;
  cloudReady: boolean;
  onSaved: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>(product);
  const [busy, setBusy] = useState(false);
  const { msg, flash } = useFlash();
  const set = (patch: Partial<Product>) => setDraft((d) => ({ ...d, ...patch }));

  const save = async () => {
    if (!cloudReady) return flash("Connect Firebase first!", false);
    setBusy(true);
    try {
      await saveProduct(draft);
      onSaved(draft);
      flash("Saved ✓");
    } catch (e) {
      flash(String(e), false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (extra) {
      onSaved(draft);
      return;
    }
    if (!cloudReady) return flash("Connect Firebase first!", false);
    if (!window.confirm(`Delete “${draft.name}” permanently?`)) return;
    setBusy(true);
    try {
      await deleteProduct(draft.id);
      flash("Deleted");
    } catch (e) {
      flash(String(e), false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-dark pop flex flex-col gap-3 rounded-2xl p-4" data-new-card={extra ? "" : undefined}>
      <div className="flex items-center gap-3">
        <div className="glass w-14 shrink-0 rounded-xl p-1">
          <Garment type={draft.type} color={draft.color} flutter={false} />
        </div>
        <input
          className={inputCls + " font-display text-lg font-bold uppercase"}
          value={draft.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Product name"
        />
      </div>
      {extra && (
        <p className="text-xs font-bold uppercase tracking-widest text-blood">
          Add your product now — it isn't online until you press Save.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <label className="block">
          <span className={labelCls}>Price (number)</span>
          <input
            type="number"
            min={0}
            className={inputCls}
            value={draft.price}
            onChange={(e) => set({ price: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Size</span>
          <input className={inputCls} value={draft.size} onChange={(e) => set({ size: e.target.value })} />
        </label>
        <label className="block">
          <span className={labelCls}>Condition</span>
          <input className={inputCls} value={draft.condition} onChange={(e) => set({ condition: e.target.value })} />
        </label>
        <label className="block">
          <span className={labelCls}>Category</span>
          <select className={inputCls} value={draft.category} onChange={(e) => set({ category: e.target.value as Category })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Garment</span>
          <select className={inputCls} value={draft.type} onChange={(e) => set({ type: e.target.value as GarmentType })}>
            {GARMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Tag (optional)</span>
          <input
            className={inputCls}
            value={draft.tag ?? ""}
            onChange={(e) => set({ tag: e.target.value || undefined })}
            placeholder="Rare / New drop…"
          />
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <span className={labelCls}>Colour</span>
          <input
            type="color"
            className={inputCls + " h-[38px] p-1"}
            value={/^#[0-9a-fA-F]{6}$/.test(draft.color) ? draft.color : "#e11d1d"}
            onChange={(e) => set({ color: e.target.value })}
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={save} disabled={busy} className={btnCls + " bg-blood text-white"}>
          {busy ? "Saving…" : "Save"}
        </button>
        <button onClick={remove} disabled={busy} className={btnCls + " glass text-bone hover:bg-white/10"}>
          {extra ? "Discard" : "Delete"}
        </button>
        <span className="ml-auto text-xs text-bone/40">{extra ? "not saved yet" : `id ${draft.id}`}</span>
        {msg && <span className={`text-xs font-bold ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}

function ProductsTab({ cloudReady }: { cloudReady: boolean }) {
  const [items, setItems] = useState<Product[] | null>(null);
  const [cloudEmpty, setCloudEmpty] = useState(false);
  const [extras, setExtras] = useState<Product[]>([]);
  const [seeding, setSeeding] = useState(false);
  const { msg, flash } = useFlash();

  useEffect(() => {
    if (!cloudReady) return;
    return subscribeProducts((list, empty) => {
      setItems(list);
      setCloudEmpty(empty);
      // drop extras that are now stored
      setExtras((xs) => xs.filter((x) => !list.some((p) => p.id === x.id)));
    });
  }, [cloudReady]);

  const add = () => {
    if (!cloudReady) return;
    setExtras((xs) => [
      ...xs,
      {
        id: Date.now(),
        name: "New one-of-one",
        price: 0,
        category: "Vintage",
        type: "tee",
        color: "#e11d1d",
        size: "M",
        condition: "Great",
      },
    ]);
    /* bring the fresh card into view so it's obvious something happened */
    window.setTimeout(() => {
      const cards = document.querySelectorAll<HTMLElement>("[data-new-card]");
      const last = cards[cards.length - 1];
      if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
      flash("New product card added below — fill it in and press Save ✓");
    }, 60);
  };

  const seed = async () => {
    setSeeding(true);
    try {
      await seedCloud();
      flash("Online store loaded — all products & texts now editable ✓");
    } catch (e) {
      flash(String(e), false);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      {cloudEmpty && cloudReady && (
        <div className="glass-red pop flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <p className="text-sm text-bone/80">
            First run — nothing is stored in the cloud yet. Load the current site into the cloud so the admin panel
            can manage it.
          </p>
          <button onClick={seed} disabled={seeding} className={btnCls + " bg-blood text-white"}>
            {seeding ? "Uploading…" : "Upload site → cloud"}
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-bone/50">
          {items === null ? "Loading…" : `${items.length} product${items.length === 1 ? "" : "s"} live on the site`}
        </p>
        <button onClick={add} disabled={!cloudReady} className={btnCls + " bg-blood text-white"}>
          + Add product
        </button>
      </div>
      {!cloudReady && <p className="glass rounded-2xl p-4 text-sm text-bone/60">Log in (Firebase) to manage products.</p>}
      {(items ?? []).concat(extras).map((p) => (
        <ProductCard
          key={`${p.id}-${extras.includes(p) ? "x" : "c"}`}
          product={p}
          extra={extras.includes(p)}
          cloudReady={cloudReady}
          onSaved={(saved) => {
            setExtras((xs) => xs.filter((x) => x.id !== saved.id));
            flash(`“${saved.name}” saved — live on the site now ✓`);
          }}
        />
      ))}
      {msg && <p className={`text-sm font-bold ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
    </div>
  );
}

/* -------------------------------- orders ------------------------------- */

function orderWhen(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function OrdersTab({
  cloudReady,
  flash,
}: {
  cloudReady: boolean;
  flash: (text: string, ok?: boolean) => void;
}) {
  const [orders, setOrders] = useState<StoreOrder[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!cloudReady) return;
    return subscribeOrders((list) => setOrders(list));
  }, [cloudReady]);

  const act = async (o: StoreOrder, action: "done" | "delete") => {
    if (action === "delete" && !window.confirm(`Delete the order from “${o.name}”? This is permanent.`)) return;
    setBusyId(o.docId);
    try {
      if (action === "done") {
        await setOrderStatus(o.docId, o.status === "done" ? "new" : "done");
        flash(o.status === "done" ? "Moved back to new" : "Marked as done ✓");
      } else {
        await deleteOrder(o.docId);
        flash("Order deleted");
      }
    } catch (e) {
      flash(String(e), false);
    } finally {
      setBusyId(null);
    }
  };

  const newCount = (orders ?? []).filter((o) => o.status === "new").length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-bone/50">
        Orders customers place on the site appear here live —{" "}
        {orders === null ? "loading…" : `${orders.length} total, ${newCount} new`}
      </p>
      {orders !== null && orders.length === 0 && (
        <div className="glass pop rounded-3xl p-8 text-center">
          <p className="font-display text-2xl uppercase tracking-widest text-bone/60">No orders yet 🕒</p>
          <p className="mt-1 text-sm text-bone/40">
            The moment someone checks out in the bag, their order pops up here — name, phone, items and total.
          </p>
        </div>
      )}
      {(orders ?? []).map((o) => {
        const digits = o.phone.replace(/[^0-9]/g, "");
        const waLink = digits
          ? `https://wa.me/${digits}?text=${encodeURIComponent(
              `Hi ${o.name.split(" ")[0] || "there"}! Thanks for ordering from Elevate X Thrift 🖤 Your order: ${o.items
                .map((i) => i.name)
                .join(", ")} — total ₹${o.total}. Reply here and we'll sort delivery.`,
            )}`
          : "";
        return (
          <article
            key={o.docId}
            className={`pop glass-dark rounded-2xl p-4 ${o.status === "done" ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-widest ${
                  o.status === "new" ? "bg-blood text-white" : "bg-[#25d366]/20 text-[#25d366]"
                }`}
              >
                {o.status === "new" ? "● New" : "✓ Done"}
              </span>
              <span className="text-xs text-bone/40">{orderWhen(o.placedAt)}</span>
              <span className="ml-auto font-display text-xl font-bold text-bone">₹{o.total}</span>
            </div>
            <div className="mt-2 text-sm">
              <p className="font-semibold">
                {o.name} {o.phone && <span className="text-bone/50">· {o.phone}</span>}
              </p>
              <ul className="mt-1 space-y-0.5 text-bone/70">
                {o.items.map((i, k) => (
                  <li key={k}>
                    · {i.name} <span className="text-bone/40">₹{i.price}</span>
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-1 text-xs italic text-bone/50">“{o.note}”</p>}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {digits && (
                <a href={waLink} target="_blank" rel="noreferrer" className={btnCls + " bg-[#25d366] text-white"}>
                  WhatsApp customer
                </a>
              )}
              <button
                onClick={() => void act(o, "done")}
                disabled={busyId === o.docId}
                className={btnCls + " glass text-bone hover:bg-white/10"}
              >
                {o.status === "new" ? "Mark done ✓" : "Move to new"}
              </button>
              <button
                onClick={() => void act(o, "delete")}
                disabled={busyId === o.docId}
                className={btnCls + " glass text-red-300 hover:bg-white/10"}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* -------------------------------- texts -------------------------------- */

function TextsTab({ content }: { content: SiteContent }) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const dirty = useRef<Set<ContentKey>>(new Set());
  const [busy, setBusy] = useState(false);
  const { msg, flash } = useFlash();

  useEffect(() => {
    // merge incoming cloud changes but never clobber a field being edited
    setDraft((d) => {
      const next = { ...d };
      for (const key of Object.keys(content) as ContentKey[]) {
        if (!dirty.current.has(key)) next[key] = content[key];
      }
      return next;
    });
  }, [content]);

  const change = (key: ContentKey, value: string) => {
    dirty.current.add(key);
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const save = async () => {
    if (!firebaseConfig.apiKey) return flash("Connect Firebase first!", false);
    setBusy(true);
    try {
      await saveContent(draft);
      dirty.current.clear();
      flash("All texts saved ✓ — check the live site");
    } catch (e) {
      flash(String(e), false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-bone/50">Edit any text on the site — grouped by section.</p>
        <button onClick={save} disabled={busy} className={btnCls + " bg-blood text-white"}>
          Save all texts
        </button>
      </div>
      {msg && (
        <p className={`glass rounded-xl px-4 py-2 text-sm font-bold ${msg.ok ? "text-green-400" : "text-red-400"}`}>
          {msg.text}
        </p>
      )}
      {FIELD_GROUPS.map((g) => (
        <details key={g.name} open className="glass group rounded-2xl">
          <summary className="cursor-pointer list-none px-5 py-3.5 font-display text-lg font-bold uppercase tracking-widest">
            <span className="text-blood">▸</span> {g.name}
          </summary>
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
            {g.fields.map((f) => (
              <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                <Field
                  label={f.label}
                  multiline={f.multiline}
                  value={draft[f.key] ?? ""}
                  onChange={(v) => change(f.key, v)}
                />
              </div>
            ))}
          </div>
        </details>
      ))}
      <button onClick={save} disabled={busy} className={btnCls + " w-full bg-blood py-3 text-white sm:hidden"}>
        Save all texts
      </button>
    </div>
  );
}

/* --------------------------------- shell -------------------------------- */

export default function Admin() {
  const [setupDone] = useState(() => Boolean(firebaseConfig.apiKey));
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(setupDone);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<"products" | "orders" | "texts">("products");
  const [newOrders, setNewOrders] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { msg, flash } = useFlash();

  useEffect(() => {
    if (!setupDone) return;
    return watchAuth((u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, [setupDone]);

  useEffect(() => {
    if (!setupDone || !user) return;
    return subscribeContent((c) => setContent(c));
  }, [setupDone, user]);

  /* live "new orders" badge */
  useEffect(() => {
    if (!setupDone || !user) return;
    return subscribeOrders((list) => setNewOrders(list.filter((o) => o.status === "new").length));
  }, [setupDone, user]);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInAdmin(email, password);
      flash("Welcome back 🖤");
    } catch (err) {
      const code = String(err);
      if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
        setError("Wrong email or password.");
      else setError("Login failed: " + (code.split("auth/")[1]?.replace(")", "") ?? ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <Background />
      <div className="mx-auto max-w-5xl">
        {/* top bar */}
        <div className="glass mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl px-5 py-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wider">
              Admin <span className="text-blood">·</span> Elevate X Thrift
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-bone/40">Everything you change goes live instantly</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={SITE_URL} target="_blank" rel="noreferrer" className={btnCls + " glass text-bone hover:bg-white/10"}>
              View site ↗
            </a>
            {user && (
              <>
                <button onClick={() => setTab("products")} className={btnCls + (tab === "products" ? " bg-blood text-white" : " glass text-bone")}>
                  Products
                </button>
                <button onClick={() => setTab("orders")} className={btnCls + (tab === "orders" ? " bg-blood text-white" : " glass text-bone")}>
                  Orders
                  {newOrders > 0 && tab !== "orders" && (
                    <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">{newOrders}</span>
                  )}
                </button>
                <button onClick={() => setTab("texts")} className={btnCls + (tab === "texts" ? " bg-blood text-white" : " glass text-bone")}>
                  Site texts
                </button>
                <button onClick={() => signOutAdmin().catch(() => {})} className={btnCls + " glass text-bone hover:bg-white/10"}>
                  Log out
                </button>
              </>
            )}
          </div>
        </div>

        {/* not set up yet */}
        {!setupDone && (
          <div className="glass-dark pop rounded-3xl p-8">
            <h2 className="font-display text-4xl font-extrabold uppercase">Setup pending ⏳</h2>
            <p className="mt-3 text-bone/60">The admin panel needs the Firebase keys. Steps:</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-bone/70">
              <li>Create (or open) your project at console.firebase.google.com</li>
              <li>⚙️ Project settings → Your apps → `&lt;/&gt;` Web app → copy the config</li>
              <li>Paste the config block in chat — it goes into <code className="rounded bg-white/10 px-1">src/lib/firebase.ts</code></li>
              <li>Wait for the auto-deploy (~1 min), reopen this page</li>
            </ol>
          </div>
        )}

        {/* login */}
        {setupDone && !user && (
          <form onSubmit={login} className="glass-dark pop mx-auto max-w-md rounded-3xl p-8">
            <div className="mx-auto mb-4 w-24">
              <Garment type="hoodie" color="#e11d1d" />
            </div>
            <h2 className="text-center font-display text-4xl font-extrabold uppercase">Admin login</h2>
            <p className="mt-1 text-center text-sm text-bone/50">Use the email &amp; password from Firebase Authentication</p>
            <div className="mt-6 space-y-3">
              <input
                type="email"
                required
                className={inputCls}
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className={inputCls}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="mt-3 text-center text-sm font-bold text-red-400">{error}</p>}
            <button disabled={busy} className={btnCls + " mt-5 w-full bg-blood py-3 text-white text-lg"}>
              {busy ? "Checking…" : "Log in"}
            </button>
          </form>
        )}

        {/* auth loading */}
        {setupDone && authLoading && !user && <p className="text-center text-bone/50">Checking login…</p>}

        {/* login feedback + panel */}
        {msg && <p className={`mb-4 text-center text-sm font-bold ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
        {setupDone && user && tab === "products" && <ProductsTab cloudReady />}
        {setupDone && user && tab === "orders" && <OrdersTab cloudReady flash={flash} />}
        {setupDone && user && tab === "texts" && content && <TextsTab content={content} />}
        {setupDone && user && tab === "texts" && !content && (
          <p className="text-center text-bone/50">Loading texts…</p>
        )}
      </div>
    </div>
  );
}
