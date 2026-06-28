import { NextRequest, NextResponse } from "next/server";
import { readEvents, saveEvent } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStateName } from "@/lib/states";
import { v4 as uuidv4 } from "uuid";
import type { Event } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get("state");

  let events = await readEvents();

  if (stateCode) {
    events = events.filter((e) => e.stateCode === stateCode);
  }

  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const now = new Date().toISOString();

  const event: Event = {
    id: uuidv4(),
    title: body.title,
    description: body.description,
    state: getStateName(body.stateCode),
    stateCode: body.stateCode,
    location: body.location,
    date: body.date,
    endDate: body.endDate,
    type: body.type ?? "upcoming_event",
    images: [],
    createdAt: now,
    updatedAt: now,
  };

  await saveEvent(event);
  return NextResponse.json({ event }, { status: 201 });
}
