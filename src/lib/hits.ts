import { Redis } from "@upstash/redis";
import { list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

const HITS_FILE = path.join(process.cwd(), "data", "hits.json");
const HITS_KEY = "site-hits";
const HITS_BLOB_PATH = "hits/count.json";

interface HitsData {
  count: number;
}

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readHitsFromFile(): Promise<number> {
  try {
    const raw = await fs.readFile(HITS_FILE, "utf-8");
    const data = JSON.parse(raw) as HitsData;
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

async function writeHitsToFile(count: number): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(HITS_FILE), { recursive: true });
    await fs.writeFile(HITS_FILE, JSON.stringify({ count }, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function readHitsFromRedis(): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const count = await redis.get<number>(HITS_KEY);
    return count ?? 0;
  } catch {
    return null;
  }
}

async function incrementHitsInRedis(): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    return await redis.incr(HITS_KEY);
  } catch {
    return null;
  }
}

async function readHitsFromBlob(): Promise<number | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const { blobs } = await list({ prefix: "hits/", limit: 1 });
    if (blobs.length === 0) return 0;

    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as HitsData;
    return data.count ?? 0;
  } catch {
    return null;
  }
}

async function writeHitsToBlob(count: number): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;

  try {
    await put(HITS_BLOB_PATH, JSON.stringify({ count }), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getHitCount(): Promise<number> {
  const redisCount = await readHitsFromRedis();
  if (redisCount !== null) return redisCount;

  const blobCount = await readHitsFromBlob();
  if (blobCount !== null) return blobCount;

  return readHitsFromFile();
}

export async function incrementHitCount(): Promise<number> {
  const redisCount = await incrementHitsInRedis();
  if (redisCount !== null) return redisCount;

  const blobCount = await readHitsFromBlob();
  if (blobCount !== null || process.env.BLOB_READ_WRITE_TOKEN) {
    const nextCount = (blobCount ?? 0) + 1;
    const saved = await writeHitsToBlob(nextCount);
    if (saved) return nextCount;
  }

  const nextCount = (await readHitsFromFile()) + 1;
  const saved = await writeHitsToFile(nextCount);
  return saved ? nextCount : nextCount;
}

export function isHitStorageConfigured(): boolean {
  return Boolean(
    getRedis() ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.NODE_ENV !== "production",
  );
}
