import path from "path";

export const EVENT_IMAGES_DIR = path.join("public", "images", "events");
export const EVENT_IMAGES_URL_PREFIX = "/images/events";

const LEGACY_UPLOAD_PREFIX = "/uploads/events/";

const legacyImageMap: Record<string, string> = {
  "8172188a-57b1-457d-a513-24b422e8636e.jpg": "maharashtra-sammelan.jpg",
};

export function normalizeEventImageUrl(url: string): string {
  if (!url.startsWith(LEGACY_UPLOAD_PREFIX)) {
    return url;
  }

  const filename = url.slice(LEGACY_UPLOAD_PREFIX.length);
  const mapped = legacyImageMap[filename] ?? filename;
  return `${EVENT_IMAGES_URL_PREFIX}/${mapped}`;
}

export function getEventImageFilePath(url: string): string {
  const normalized = normalizeEventImageUrl(url);
  return path.join(process.cwd(), "public", normalized);
}
