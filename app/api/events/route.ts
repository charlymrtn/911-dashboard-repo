import { NextResponse } from "next/server";
import { getEvents } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    total: getEvents().length,
    data: getEvents()
  });
}
