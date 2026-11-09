import { useEffect, useState } from "react";
import { Background } from "./components/ui";
import {
  Navbar,
  Hero,
  Marquee,
  Rail,
  Categories,
  How,
  Lookbook,
  Stats,
  Visit,
  Footer,
} from "./components/Sections";
import { Shop, CartDrawer } from "./components/Shop";
import Admin from "./components/Admin";
import { products, type Product } from "./data";
import { DEFAULT_CONTENT, type SiteContent } from "./content";
import { placeOrder, subscribeProducts, subscribeContent, type OrderContact } from "./lib/firebase";

/* --------------------------- tiny hash router --------------------------- */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  if (hash.startsWith("#/admin")) return <Admin />;
  return <Storefront />;
}

function Storefront() {
  const [cart, setCart] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [items, setItems] = useState<Product[]>(products);

  /* live data from Firebase (falls back to bundled defaults) */
  useEffect(() => {
    const unP = subscribeProducts((list) => setItems(list));
    const unC = subscribeContent((c) => setContent(c));
    return () => {
      unP();
      unC();
    };
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const toggle = (p: Product) => {
    if (cart.includes(p.id)) {
      setCart(cart.filter((x) => x !== p.id));
      flash(`${p.name} removed`);
    } else {
      setCart([...cart, p.id]);
      flash(`${p.name} added to bag ✦`);
    }
  };

  const bagItems = items.filter((p) => cart.includes(p.id));

  /** checkout → save to Firestore; on failure the drawer shows a WhatsApp fallback */
  const handlePlaceOrder = async (info: OrderContact): Promise<"placed"> => {
    await placeOrder({
      name: info.name.trim(),
      phone: info.phone.trim(),
      note: info.note.trim(),
      items: bagItems.map((p) => ({ id: p.id, name: p.name, price: p.price })),
      total: bagItems.reduce((s, p) => s + p.price, 0),
    });
    setCart([]);
    flash("Order received — we'll WhatsApp you shortly! 🖤");
    return "placed";
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar content={content} count={cart.length} onCart={() => setOpen(true)} />
      <main>
        <Hero content={content} />
        <Marquee content={content} />
        <Shop content={content} products={items} cart={cart} onToggle={toggle} />
        <Rail content={content} products={items} />
        <Categories content={content} />
        <How content={content} />
        <Lookbook content={content} />
        <Stats content={content} />
        <Visit content={content} />
      </main>
      <Footer content={content} />

      {/* floating WhatsApp button */}
      <a
        href={`https://wa.me/${content.contactWhatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="pop fixed bottom-5 right-5 z-[55] grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_34px_rgba(37,211,102,0.45)] transition hover:scale-110 active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.298-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {open && (
        <CartDrawer
          open={open}
          items={bagItems}
          currency={content.currency}
          whatsapp={content.contactWhatsappNumber}
          onClose={() => setOpen(false)}
          onRemove={toggle}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div
            key={toast}
            className="glass-dark pop rounded-full px-6 py-3 text-center font-display text-lg font-semibold uppercase tracking-wider shadow-[0_10px_40px_rgba(225,29,29,0.35)]"
          >
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
