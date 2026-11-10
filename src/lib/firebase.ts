/**
 * Firebase layer — products + site content + orders + admin auth.
 * Storefront reads products/content live (bundled defaults as fallback);
 * the admin panel writes products/texts; customers create orders.
 * Admin login: Firebase Authentication email/password.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { products as defaultProducts, type Product } from "../data";
import { DEFAULT_CONTENT, type SiteContent } from "../content";

/* ------------------------------------------------------------------ */
/*  Firebase web app config (project: elevate-x-thrift)                */
/* ------------------------------------------------------------------ */
export const firebaseConfig = {
  apiKey: "AIzaSyDh-iXTnoQgDItiO4fSdsjnvmK_7KhRTRI",
  authDomain: "elevate-x-thrift.firebaseapp.com",
  projectId: "elevate-x-thrift",
  storageBucket: "elevate-x-thrift.firebasestorage.app",
  messagingSenderId: "63811587714",
  appId: "1:63811587714:web:071dd65e9de266acee2e9b",
};
/* ------------------------------------------------------------------ */

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

function ensure(): boolean {
  if (!firebaseConfig.apiKey) return false;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
  return true;
}

/** strips `undefined` fields (Firestore rejects them) */
function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Live product list straight from the cloud — only items the admin really
 * saved reach the storefront (never the bundled demo list). `cloudEmpty`
 * is true until products exist, driving the admin's seed/restore banner.
 */
export function subscribeProducts(cb: (list: Product[], cloudEmpty: boolean) => void): () => void {
  if (!ensure() || !db) return () => {};
  return onSnapshot(
    collection(db, "products"),
    (snap) => {
      if (snap.empty) {
        cb([], true);
        return;
      }
      const list = snap.docs.map((d) => {
        const data = d.data() as Partial<Product> & { id?: unknown };
        const id = typeof data.id === "number" ? data.id : Number(d.id);
        return { ...(data as Product), id: Number.isFinite(id) ? id : 0, docPath: d.id };
      });
      cb(list, false);
    },
    (err) => {
      console.warn("[products] read failed:", err);
      cb([], false);
    },
  );
}

/** live site content; falls back to bundled defaults */
export function subscribeContent(cb: (c: SiteContent) => void): () => void {
  if (!ensure() || !db) return () => {};
  return onSnapshot(
    doc(db, "content", "site"),
    (snap) => {
      const data = snap.data() as Partial<SiteContent> | undefined;
      cb(data ? { ...DEFAULT_CONTENT, ...data } : DEFAULT_CONTENT);
    },
    (err) => {
      console.warn("[content] read failed:", err);
      cb(DEFAULT_CONTENT);
    },
  );
}

export async function saveProduct(p: Product): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  /* writes go to the product's real cloud doc (its snapshot id); fresh cards use the timestamp id */
  const { docPath, ...data } = p;
  await setDoc(doc(db, "products", docPath ?? String(p.id)), clean(data));
}

export async function deleteProduct(p: Product): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await deleteDoc(doc(db, "products", p.docPath ?? String(p.id)));
}

export async function saveContent(c: SiteContent): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await setDoc(doc(db, "content", "site"), clean(c));
}

/* ------------------------------- orders ------------------------------ */

export interface OrderContact {
  name: string;
  phone: string;
  note: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
}

export interface StoreOrder {
  docId: string;
  name: string;
  phone: string;
  note: string;
  items: OrderItem[];
  total: number;
  placedAt: number;
  status: "new" | "done";
}

/** customer checkout — public create, so anyone can order */
export async function placeOrder(
  info: OrderContact & { items: OrderItem[]; total: number },
): Promise<string> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  const payload = clean({
    name: info.name.slice(0, 120),
    phone: info.phone.slice(0, 40),
    note: info.note.slice(0, 500),
    items: info.items
      .slice(0, 50)
      .map((i) => ({ id: i.id, name: String(i.name).slice(0, 120), price: Number(i.price) || 0 })),
    total: Number(info.total) || 0,
    status: "new",
    placedAt: Date.now(),
  });
  const ref = await addDoc(collection(db, "orders"), payload);
  return ref.id;
}

/** live orders feed for the admin panel (authenticated read only) */
export function subscribeOrders(cb: (list: StoreOrder[]) => void): () => void {
  if (!ensure() || !db) return () => {};
  return onSnapshot(
    query(collection(db, "orders"), orderBy("placedAt", "desc")),
    (snap) =>
      cb(
        snap.docs.map((d) => {
          const x = d.data() as Partial<StoreOrder> & { items?: OrderItem[] };
          return {
            docId: d.id,
            name: x.name ?? "—",
            phone: x.phone ?? "",
            note: x.note ?? "",
            items: Array.isArray(x.items) ? x.items : [],
            total: typeof x.total === "number" ? x.total : 0,
            placedAt: typeof x.placedAt === "number" ? x.placedAt : 0,
            status: x.status === "done" ? "done" : "new",
          };
        }),
      ),
    (err) => {
      console.warn("[orders] read failed:", err);
      cb([]);
    },
  );
}

export async function setOrderStatus(docId: string, status: "new" | "done"): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await updateDoc(doc(db, "orders", docId), { status });
}

export async function deleteOrder(docId: string): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await deleteDoc(doc(db, "orders", docId));
}

/** write the bundled defaults (12 products + site texts) up to Firestore */
export async function seedCloud(): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  const batch = writeBatch(db);
  for (const p of defaultProducts) {
    batch.set(doc(db, "products", String(p.id)), clean(p));
  }
  batch.set(doc(db, "content", "site"), clean(DEFAULT_CONTENT));
  await batch.commit();
}

/* ------------------------------- auth ------------------------------ */

export function watchAuth(cb: (user: User | null) => void): () => void {
  if (!ensure() || !auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

export function signInAdmin(email: string, password: string): Promise<User> {
  if (!ensure() || !auth) return Promise.reject(new Error("Firebase is not configured yet"));
  return signInWithEmailAndPassword(auth, email, password) as unknown as Promise<User>;
}

export function signOutAdmin(): Promise<void> {
  if (!ensure() || !auth) return Promise.reject(new Error("Firebase is not configured yet"));
  return fbSignOut(auth);
}
