import { NextRequest, NextResponse } from "next/server";
import { getHeadToHead } from "@/lib/padel-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { team_1, team_2 } = body;

    if (!team_1 || !Array.isArray(team_1) || team_1.length === 0) {
      return NextResponse.json(
        { error: "team_1 is required" },
        { status: 400 }
      );
    }

    const res = await getHeadToHead(team_1, team_2);
    return NextResponse.json(res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch H2H data";
    return NextResponse.json({ error: msg, data: [] }, { status: 500 });
  }
}
