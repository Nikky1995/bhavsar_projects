import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getEventById, saveEvent } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { EventImage } from "@/lib/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "events");

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const eventId = formData.get("eventId") as string;
  const caption = (formData.get("caption") as string) || undefined;
  const files = formData.getAll("images") as File[];

  if (!eventId || files.length === 0) {
    return NextResponse.json({ error: "Missing eventId or images" }, { status: 400 });
  }

  const event = await getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const newImages: EventImage[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    newImages.push({
      id: uuidv4(),
      url: `/uploads/events/${filename}`,
      caption,
      createdAt: new Date().toISOString(),
    });
  }

  event.images = [...event.images, ...newImages];
  event.updatedAt = new Date().toISOString();
  await saveEvent(event);

  return NextResponse.json({ images: newImages });
}
