/**
 * Site content model — every editable string on the storefront.
 * Defaults are used as instant fallback; Firestore (admin panel) overrides at runtime.
 */

export type ContentKey =
  | "brandName"
  | "brandTagline"
  | "heroPill1"
  | "heroPill2"
  | "heroPill3"
  | "heroLine1"
  | "heroLine2"
  | "heroLine3"
  | "heroSubtitle"
  | "heroCtaPrimary"
  | "heroCtaSecondary"
  | "heroStat1"
  | "heroStat1Label"
  | "heroStat2"
  | "heroStat2Label"
  | "heroStat3"
  | "heroStat3Label"
  | "currency"
  | "marqueeWords"
  | "shopKicker"
  | "shopTitle"
  | "shopScript"
  | "shopNote"
  | "railKicker"
  | "railTitle"
  | "railScript"
  | "railNote"
  | "cat1Name"
  | "cat1Desc"
  | "cat2Name"
  | "cat2Desc"
  | "cat3Name"
  | "cat3Desc"
  | "howKicker"
  | "howTitle"
  | "howScript"
  | "howStep1"
  | "howStep1Desc"
  | "howStep2"
  | "howStep2Desc"
  | "howStep3"
  | "howStep3Desc"
  | "lookbookKicker"
  | "lookbookTitle"
  | "lookbookScript"
  | "lookbookNote"
  | "lbCap1"
  | "lbCap2"
  | "lbCap3"
  | "lbCap4"
  | "lbCap5"
  | "lbCap6"
  | "statBig1"
  | "statBig1Label"
  | "statBig2"
  | "statBig2Label"
  | "statBig3"
  | "statBig3Label"
  | "statBig4"
  | "statBig4Label"
  | "newsletterHeadingPre"
  | "newsletterHeadingAccent"
  | "newsletterSub"
  | "visitHeadingPre"
  | "visitHeadingAccent"
  | "contactAddressLine1"
  | "contactAddressLine2"
  | "contactHours"
  | "contactHoursSub"
  | "contactEmail"
  | "contactInstagram"
  | "contactInstagramUrl"
  | "contactWhatsappNumber"
  | "footerTagline"
  | "footerRights";

export type SiteContent = Record<ContentKey, string>;

export const DEFAULT_CONTENT: SiteContent = {
  /* -------- brand -------- */
  brandName: "Elevate X Thrift",
  brandTagline: "Vintage • Streetwear • More",

  /* -------- hero -------- */
  heroPill1: "Buy",
  heroPill2: "Wear",
  heroPill3: "Repeat",
  heroLine1: "Elevate your",
  heroLine2: "Wardrobe",
  heroLine3: "one thrift at a time",
  heroSubtitle:
    "Hand-picked vintage, fresh-drop streetwear and one-of-a-kind finds. Every piece has a past — now it gets a second life on you.",
  heroCtaPrimary: "Shop the drop →",
  heroCtaSecondary: "See the rail",
  heroStat1: "12k+",
  heroStat1Label: "Pieces saved",
  heroStat2: "4.9★",
  heroStat2Label: "Customer love",
  heroStat3: "Weekly",
  heroStat3Label: "New drops",
  currency: "₹",

  /* -------- marquee -------- */
  marqueeWords: "Vintage, Streetwear, More, Buy, Wear, Repeat",

  /* -------- shop -------- */
  shopKicker: "Latest finds",
  shopTitle: "Shop the drop",
  shopScript: "Fresh",
  shopNote: "One of each. Add it to your bag before someone else does.",

  /* -------- rail -------- */
  railKicker: "Fresh on the rail",
  railTitle: "Swing by",
  railScript: "The Rail",
  railNote: "Hover a hanger and watch it sway — every piece on this rail is a one-of-one.",

  /* -------- categories -------- */
  cat1Name: "Vintage",
  cat1Desc: "Decades-old gems, perfectly worn in.",
  cat2Name: "Streetwear",
  cat2Desc: "Oversized fits, hoodies & heat.",
  cat3Name: "More",
  cat3Desc: "Caps, dresses & curious extras.",

  /* -------- how -------- */
  howKicker: "The loop",
  howTitle: "Buy · Wear · Repeat",
  howScript: "Simple.",
  howStep1: "Buy",
  howStep1Desc:
    "Browse hand-picked, quality-checked pieces. Every item is one of a kind — when it's gone, it's gone.",
  howStep2: "Wear",
  howStep2Desc: "Rock it your way. Mix eras, layer textures and build a fit nobody else can copy.",
  howStep3: "Repeat",
  howStep3Desc: "Bring it back for store credit and grab your next find. Keep the loop spinning.",

  /* -------- lookbook -------- */
  lookbookKicker: "Style inspo",
  lookbookTitle: "Lookbook",
  lookbookScript: "The",
  lookbookNote: "Real fits, real finds. Tag us to get featured on the wall.",
  lbCap1: "Blackout layers",
  lbCap2: "Coat season",
  lbCap3: "Graphic hoodies",
  lbCap4: "Inside the store",
  lbCap5: "Pick of the week",
  lbCap6: "Fresh from the rack",

  /* -------- stats -------- */
  statBig1: "12,400+",
  statBig1Label: "Pieces re-homed",
  statBig2: "3.4t",
  statBig2Label: "Textile waste saved",
  statBig3: "4.9★",
  statBig3Label: "Average rating",
  statBig4: "8,200+",
  statBig4Label: "Repeat shoppers",

  /* -------- newsletter + visit -------- */
  newsletterHeadingPre: "Get first dibs on",
  newsletterHeadingAccent: "every drop",
  newsletterSub: "Join the list for early access, secret sales and a 10% welcome code on your first bag.",
  visitHeadingPre: "Visit the",
  visitHeadingAccent: "store",
  contactAddressLine1: "Panipat, Haryana",
  contactAddressLine2: "India",
  contactHours: "Mon–Sat 11am – 8pm",
  contactHoursSub: "Sunday 12pm – 6pm",
  contactEmail: "kartiktyagi970@gmail.com",
  contactInstagram: "elevatex_thrift108",
  contactInstagramUrl: "https://www.instagram.com/elevatex_thrift108/",
  contactWhatsappNumber: "918571064108",

  /* -------- footer -------- */
  footerTagline: "Buy · Wear · Repeat",
  footerRights: "© {year} Elevate X Thrift. All rights reserved.",
};

/** Helper: replace {year} etc. */
export function renderText(tpl: string): string {
  return tpl.replace("{year}", String(new Date().getFullYear()));
}

export interface FieldSpec {
  key: ContentKey;
  label: string;
  multiline?: boolean;
}

export interface FieldGroup {
  name: string;
  fields: FieldSpec[];
}

/** Admin "Site texts" editor structure */
export const FIELD_GROUPS: FieldGroup[] = [
  {
    name: "Brand & hero",
    fields: [
      { key: "brandName", label: "Store name" },
      { key: "brandTagline", label: "Tagline (under store name)" },
      { key: "heroLine1", label: "Hero line 1 (script font)" },
      { key: "heroLine2", label: "Hero line 2 (big red)" },
      { key: "heroLine3", label: "Hero line 3" },
      { key: "heroPill1", label: "Hero badge word 1" },
      { key: "heroPill2", label: "Hero badge word 2" },
      { key: "heroPill3", label: "Hero badge word 3" },
      { key: "heroSubtitle", label: "Hero description", multiline: true },
      { key: "heroCtaPrimary", label: "Primary button text" },
      { key: "heroCtaSecondary", label: "Secondary button text" },
      { key: "currency", label: "Currency symbol" },
    ],
  },
  {
    name: "Marquee & stats strip",
    fields: [
      { key: "marqueeWords", label: "Marquee words (comma separated)" },
      { key: "heroStat1", label: "Hero mini-stat 1 — value" },
      { key: "heroStat1Label", label: "Hero mini-stat 1 — label" },
      { key: "heroStat2", label: "Hero mini-stat 2 — value" },
      { key: "heroStat2Label", label: "Hero mini-stat 2 — label" },
      { key: "heroStat3", label: "Hero mini-stat 3 — value" },
      { key: "heroStat3Label", label: "Hero mini-stat 3 — label" },
    ],
  },
  {
    name: "Shop & rail",
    fields: [
      { key: "shopKicker", label: "Shop kicker (small pill)" },
      { key: "shopTitle", label: "Shop title" },
      { key: "shopScript", label: "Shop script word (red)" },
      { key: "shopNote", label: "Shop note (under title)", multiline: true },
      { key: "railKicker", label: "Rail kicker" },
      { key: "railTitle", label: "Rail title" },
      { key: "railScript", label: "Rail script word" },
      { key: "railNote", label: "Rail note (under title)", multiline: true },
    ],
  },
  {
    name: "Categories & How it works",
    fields: [
      { key: "cat1Name", label: "Category 1 name" },
      { key: "cat1Desc", label: "Category 1 description", multiline: true },
      { key: "cat2Name", label: "Category 2 name" },
      { key: "cat2Desc", label: "Category 2 description", multiline: true },
      { key: "cat3Name", label: "Category 3 name" },
      { key: "cat3Desc", label: "Category 3 description", multiline: true },
      { key: "howKicker", label: "How-it-works kicker" },
      { key: "howTitle", label: "How-it-works title" },
      { key: "howScript", label: "How-it-works script word" },
      { key: "howStep1", label: "Step 1 title" },
      { key: "howStep1Desc", label: "Step 1 description", multiline: true },
      { key: "howStep2", label: "Step 2 title" },
      { key: "howStep2Desc", label: "Step 2 description", multiline: true },
      { key: "howStep3", label: "Step 3 title" },
      { key: "howStep3Desc", label: "Step 3 description", multiline: true },
    ],
  },
  {
    name: "Lookbook",
    fields: [
      { key: "lookbookKicker", label: "Lookbook kicker" },
      { key: "lookbookTitle", label: "Lookbook title" },
      { key: "lookbookScript", label: "Lookbook script word" },
      { key: "lookbookNote", label: "Lookbook note", multiline: true },
      { key: "lbCap1", label: "Photo 1 caption" },
      { key: "lbCap2", label: "Photo 2 caption" },
      { key: "lbCap3", label: "Photo 3 caption" },
      { key: "lbCap4", label: "Photo 4 caption" },
      { key: "lbCap5", label: "Photo 5 caption" },
      { key: "lbCap6", label: "Photo 6 caption" },
    ],
  },
  {
    name: "Big stats",
    fields: [
      { key: "statBig1", label: "Stat 1 (e.g. 12,400+)" },
      { key: "statBig1Label", label: "Stat 1 label" },
      { key: "statBig2", label: "Stat 2 (e.g. 3.4t)" },
      { key: "statBig2Label", label: "Stat 2 label" },
      { key: "statBig3", label: "Stat 3 (e.g. 4.9★)" },
      { key: "statBig3Label", label: "Stat 3 label" },
      { key: "statBig4", label: "Stat 4 (e.g. 8,200+)" },
      { key: "statBig4Label", label: "Stat 4 label" },
    ],
  },
  {
    name: "Newsletter & contact (real details!)",
    fields: [
      { key: "newsletterHeadingPre", label: "Newsletter heading (before red words)" },
      { key: "newsletterHeadingAccent", label: "Newsletter heading (red words)" },
      { key: "newsletterSub", label: "Newsletter description", multiline: true },
      { key: "visitHeadingPre", label: "Visit box heading (before red word)" },
      { key: "visitHeadingAccent", label: "Visit box heading (red word)" },
      { key: "contactAddressLine1", label: "Address line 1" },
      { key: "contactAddressLine2", label: "Address line 2" },
      { key: "contactHours", label: "Opening hours" },
      { key: "contactHoursSub", label: "Opening hours (second line)" },
      { key: "contactEmail", label: "Email address" },
      { key: "contactInstagram", label: "Instagram handle (to show)" },
      { key: "contactInstagramUrl", label: "Instagram full URL (to open)" },
      { key: "contactWhatsappNumber", label: "WhatsApp number (digits with country code, no +)" },
    ],
  },
  {
    name: "Footer",
    fields: [
      { key: "footerTagline", label: "Footer slogan" },
      { key: "footerRights", label: "Copyright line ({year} = current year)" },
    ],
  },
];
