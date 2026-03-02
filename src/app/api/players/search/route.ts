import { NextRequest, NextResponse } from "next/server";
import { getPlayers } from "@/lib/padel-api";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "";

  if (name.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await getPlayers({
      name,
      per_page: "10",
      sort_by: "ranking",
      order_by: "asc",
    });
    return NextResponse.json({ data: res.data });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to search players", data: [] },
      { status: 500 }
    );
  }
}
