import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerId, signed, details } = body;

    if (!customerId) {
      return NextResponse.json(
        { ok: false, error: "Missing customerId" },
        { status: 400 }
      );
    }

    // Build metafield value: include signed + details
    const value = JSON.stringify({
      signed: !!signed,
      ...details,
    });

    const res = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/${customerId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOP_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
                      namespace: "custom",
                      key: "pma_agreement",
                      type: "json",
                      value
                    }
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { ok: false, error: "Shopify API error", details: err },
        { status: 400 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, metafield: data.metafield });
  } catch (err) {
    console.error("❌ Save error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
