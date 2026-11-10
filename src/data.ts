import type { GarmentType } from "./components/Garment";

export type Category = "Vintage" | "Streetwear" | "More";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  type: GarmentType;
  color: string;
  size: string;
  condition: string;
  tag?: string;
  /** optional product photo as a compressed JPEG data URL; the illustrated garment shows when absent */
  image?: string;
}

export const products: Product[] = [
  { id: 1, name: "Trucker Denim Jacket", price: 68, category: "Vintage", type: "jacket", color: "#3b5a7a", size: "M", condition: "Excellent", tag: "Rare" },
  { id: 2, name: "90s Band Graphic Tee", price: 34, category: "Vintage", type: "tee", color: "#1b1b1d", size: "L", condition: "Great", tag: "Last one" },
  { id: 3, name: "Heavyweight Blood Hoodie", price: 52, category: "Streetwear", type: "hoodie", color: "#c41b1b", size: "XL", condition: "Like new", tag: "New drop" },
  { id: 4, name: "Carpenter Baggy Jeans", price: 58, category: "Streetwear", type: "jeans", color: "#2c3e5a", size: "32", condition: "Great" },
  { id: 5, name: "Retro Cream Midi Dress", price: 44, category: "Vintage", type: "dress", color: "#d9cfb4", size: "S", condition: "Excellent", tag: "Rare" },
  { id: 6, name: "Washed Dad Cap", price: 18, category: "More", type: "cap", color: "#a31616", size: "OS", condition: "Good" },
  { id: 7, name: "Y2K Zip-Up Hoodie", price: 48, category: "Streetwear", type: "hoodie", color: "#6b7280", size: "M", condition: "Great", tag: "New drop" },
  { id: 8, name: "Black Bomber Jacket", price: 74, category: "Streetwear", type: "jacket", color: "#1f1f24", size: "L", condition: "Like new" },
  { id: 9, name: "Racing Stripe Tee", price: 29, category: "Vintage", type: "tee", color: "#e6dcc4", size: "M", condition: "Great" },
  { id: 10, name: "Wide-Leg Light Denim", price: 46, category: "Vintage", type: "jeans", color: "#6f8fbf", size: "30", condition: "Excellent", tag: "Last one" },
  { id: 11, name: "Wine Slip Dress", price: 39, category: "More", type: "dress", color: "#7f1d1d", size: "M", condition: "Like new" },
  { id: 12, name: "Corduroy Panel Cap", price: 22, category: "More", type: "cap", color: "#7a5230", size: "OS", condition: "Great" },
];

export const photos = {
  rack: "https://images.pexels.com/photos/16729452/pexels-photo-16729452.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  store: "https://images.pexels.com/photos/30163749/pexels-photo-30163749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  shirt: "https://images.pexels.com/photos/2249248/pexels-photo-2249248.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  coats: "https://images.pexels.com/photos/35714492/pexels-photo-35714492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  browse: "https://images.pexels.com/photos/34590186/pexels-photo-34590186.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  street1: "https://images.pexels.com/photos/34582210/pexels-photo-34582210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  street2: "https://images.pexels.com/photos/15127546/pexels-photo-15127546.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  hoodies: "https://images.pexels.com/photos/19697348/pexels-photo-19697348.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};
