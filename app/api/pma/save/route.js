import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerId, signed } = body;

    if (!customerId) {
      return NextResponse.json({ ok: false, error: "Missing customerId" }, { status: 400 });
    }

    // Call Shopify Admin API to write metafield
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/${customerId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOP_ACCESS_TOKEN, // we’ll set this
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "pma",
            key: "agreement",
            type: "boolean",
            value: signed ? "true" : "false",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ ok: false, error: "Shopify API error", details: err }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, metafield: data.metafield });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
