import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("logged_in_customer_id");
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, endpoint: "save", customerId, body });
}
