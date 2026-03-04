import { NextResponse } from "next/server";
import { getMatchLive } from "@/lib/padel-api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getMatchLive(Number(id));
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch live data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
