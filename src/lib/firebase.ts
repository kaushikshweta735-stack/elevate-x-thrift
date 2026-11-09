/**
 * Firebase layer — products + site content + admin auth.
 *
 * ⏳ SETUP: paste your firebaseConfig values below (Firebase console →
 *    Project settings → Your apps → Web app → config).
 *    Nothing else needs to change. Until apiKey is set, the site runs
 *    on bundled defaults and the admin panel shows a setup screen.
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
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { products as defaultProducts, type Product } from "../data";
import { DEFAULT_CONTENT, type SiteContent } from "../content";

/* ------------------------------------------------------------------ */
/*  👇 PASTE YOUR FIREBASE CONFIG VALUES HERE 👇                       */
/* ------------------------------------------------------------------ */
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
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
 * Live product list; falls back to bundled defaults when the cloud is
 * empty or unreachable. `cloudEmpty` is true until the admin seeds the
 * store, so the panel can offer the one-click seeding button.
 */
export function subscribeProducts(cb: (list: Product[], cloudEmpty: boolean) => void): () => void {
  if (!ensure() || !db) return () => {};
  return onSnapshot(
    collection(db, "products"),
    (snap) => {
      if (snap.empty) {
        cb(defaultProducts, true);
        return;
      }
      const list = snap.docs.map((d) => {
        const data = d.data() as Partial<Product> & { id?: unknown };
        const id = typeof data.id === "number" ? data.id : Number(d.id);
        return { ...(data as Product), id: Number.isFinite(id) ? id : 0 };
      });
      cb(list, false);
    },
    (err) => {
      console.warn("[products] read failed:", err);
      cb(defaultProducts, false);
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
  await setDoc(doc(db, "products", String(p.id)), clean(p));
}

export async function deleteProduct(id: number): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await deleteDoc(doc(db, "products", String(id)));
}

export async function saveContent(c: SiteContent): Promise<void> {
  if (!ensure() || !db) throw new Error("Firebase is not configured yet");
  await setDoc(doc(db, "content", "site"), clean(c));
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
