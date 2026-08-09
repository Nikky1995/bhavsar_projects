import { NextRequest, NextResponse } from "next/server";
import { getHitCount, incrementHitCount, isHitStorageConfigured } from "@/lib/hits";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const record = request.nextUrl.searchParams.get("record") === "1";
  const count = record ? await incrementHitCount() : await getHitCount();

  return NextResponse.json(
    { count, persistent: isHitStorageConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  const count = await incrementHitCount();
  return NextResponse.json(
    { count, persistent: isHitStorageConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
