import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { deleteEvent, getEventById } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  for (const image of event.images) {
    const filePath = path.join(process.cwd(), "public", image.url);
    try {
      await fs.unlink(filePath);
    } catch {
      // file may not exist
    }
  }

  await deleteEvent(id);
  return NextResponse.json({ success: true });
}
