import { promises as fs } from "fs";
import path from "path";
import type { Event, EventsData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

const defaultData: EventsData = { events: [] };

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readEvents(): Promise<Event[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(EVENTS_FILE, "utf-8");
    const data = JSON.parse(raw) as EventsData;
    return data.events ?? [];
  } catch {
    return defaultData.events;
  }
}

export async function writeEvents(events: Event[]): Promise<void> {
  await ensureDataDir();
  const data: EventsData = { events };
  await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const events = await readEvents();
  return events.find((e) => e.id === id);
}

export async function saveEvent(event: Event): Promise<Event> {
  const events = await readEvents();
  const index = events.findIndex((e) => e.id === event.id);
  if (index >= 0) {
    events[index] = event;
  } else {
    events.push(event);
  }
  await writeEvents(events);
  return event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const events = await readEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  await writeEvents(filtered);
  return true;
}
