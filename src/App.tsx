import { useState } from "react";
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
import { products, type Product } from "./data";

export default function App() {
  const [cart, setCart] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  const items = products.filter((p) => cart.includes(p.id));

  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar count={cart.length} onCart={() => setOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <Shop cart={cart} onToggle={toggle} />
        <Rail />
        <Categories />
        <How />
        <Lookbook />
        <Stats />
        <Visit />
      </main>
      <Footer />

      <CartDrawer
        open={open}
        items={items}
        onClose={() => setOpen(false)}
        onRemove={toggle}
        onCheckout={() => {
          setCart([]);
          setOpen(false);
          flash("Order placed — thanks for thrifting! 🖤");
        }}
      />

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
