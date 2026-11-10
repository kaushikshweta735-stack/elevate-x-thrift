/**
 * Client-side photo compression for product photos.
 * Phone photos are 3–8 MB but Firestore documents cap at 1 MB — so every
 * picked photo is downscaled and re-encoded as a JPEG data URL, stepping
 * quality/size down until it fits safely inside a product document.
 */

/** longest edge we keep (sharp enough on phones + retina zoom) */
const MAX_SIDE_PX = 1000;
/** safety cap on the base64 string; Firestore docs hold 1 MiB, we leave lots of headroom */
const MAX_DATA_URL_CHARS = 700_000;
/** progressively smaller edge / lower quality steps until we fit */
const STEPS: Array<[number, number]> = [
  [MAX_SIDE_PX, 0.75],
  [800, 0.6],
  [600, 0.45],
  [420, 0.35],
];

function loadDecoded(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image — try a different photo"));
    };
    img.src = url;
  });
}

/** shrink + re-encode one file; resolves to a storable `data:image/jpeg` string */
export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("That file isn't a photo — choose a JPG or PNG image");
  if (file.size > 25 * 1024 * 1024)
    throw new Error("That photo is enormous (25+ MB) — try a smaller one");
  const img = await loadDecoded(file);
  for (const [side, quality] of STEPS) {
    const scale = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Photo processing isn't available in this browser");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const url = canvas.toDataURL("image/jpeg", quality);
    if (url.length <= MAX_DATA_URL_CHARS) return url;
  }
  throw new Error("That photo is still too large even compressed — try a different one");
}
