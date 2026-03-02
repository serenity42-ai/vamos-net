import { NextRequest, NextResponse } from "next/server";
import { simulateMatch } from "@/lib/padel-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { team_1, team_2 } = body;

    if (
      !team_1 ||
      !Array.isArray(team_1) ||
      team_1.length === 0 ||
      !team_2 ||
      !Array.isArray(team_2) ||
      team_2.length === 0
    ) {
      return NextResponse.json(
        { error: "Both team_1 and team_2 are required" },
        { status: 400 }
      );
    }

    const res = await simulateMatch(team_1, team_2);
    return NextResponse.json(res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Simulation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
