import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getEventById, saveEvent } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: imageId } = await params;
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const event = await getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const image = event.images.find((img) => img.id === imageId);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", image.url);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may not exist
  }

  event.images = event.images.filter((img) => img.id !== imageId);
  event.updatedAt = new Date().toISOString();
  await saveEvent(event);

  return NextResponse.json({ success: true });
}
