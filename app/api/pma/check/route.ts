import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("logged_in_customer_id");
  return NextResponse.json({ ok: true, endpoint: "check", customerId });
}

