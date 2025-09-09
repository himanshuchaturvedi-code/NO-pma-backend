import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("logged_in_customer_id");
  const domain = process.env.SHOPIFY_STORE_DOMAIN || "MISSING";

  return NextResponse.json({
    ok: true,
    endpoint: "check",
    customerId,
    domain
  });
}
