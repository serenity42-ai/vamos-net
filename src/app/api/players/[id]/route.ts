import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/padel-api";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
  }
  try {
    const player = await getPlayer(id);
    return NextResponse.json(player);
  } catch {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }
}
