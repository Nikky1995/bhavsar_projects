import { promises as fs } from "fs";
import path from "path";

const HITS_FILE = path.join(process.cwd(), "data", "hits.json");
const HITS_KEY = "site:hits";

interface HitsData {
  count: number;
}

function getKvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
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

async function writeHitsToFile(count: number): Promise<void> {
  await fs.mkdir(path.dirname(HITS_FILE), { recursive: true });
  await fs.writeFile(HITS_FILE, JSON.stringify({ count }, null, 2), "utf-8");
}

async function readHitsFromKv(): Promise<number | null> {
  const kv = getKvConfig();
  if (!kv) return null;

  const res = await fetch(`${kv.url}/get/${HITS_KEY}`, {
    headers: { Authorization: `Bearer ${kv.token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { result?: string | number | null };
  if (data.result === null || data.result === undefined) return 0;
  return Number(data.result);
}

async function incrementHitsInKv(): Promise<number | null> {
  const kv = getKvConfig();
  if (!kv) return null;

  const res = await fetch(`${kv.url}/incr/${HITS_KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kv.token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { result?: string | number };
  return Number(data.result ?? 0);
}

export async function getHitCount(): Promise<number> {
  const kvCount = await readHitsFromKv();
  if (kvCount !== null) return kvCount;
  return readHitsFromFile();
}

export async function incrementHitCount(): Promise<number> {
  const kvCount = await incrementHitsInKv();
  if (kvCount !== null) return kvCount;

  const nextCount = (await readHitsFromFile()) + 1;
  try {
    await writeHitsToFile(nextCount);
  } catch {
    return nextCount;
  }
  return nextCount;
}
