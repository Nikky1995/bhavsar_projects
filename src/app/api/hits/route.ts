import { NextResponse } from "next/server";
import { getHitCount, incrementHitCount } from "@/lib/hits";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getHitCount();
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  const count = await incrementHitCount();
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "no-store" } },
  );
}
