import { NextResponse } from "next/server";
import { getMatchLive } from "@/lib/padel-api";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
  }
  try {
    const data = await getMatchLive(id);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch live data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
