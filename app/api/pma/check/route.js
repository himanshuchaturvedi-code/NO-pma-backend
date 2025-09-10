import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("logged_in_customer_id");
  const domain = process.env.SHOPIFY_STORE_DOMAIN || "MISSING";

  let signed = false;
  let details = null;

  if (customerId) {
    try {
      const res = await fetch(
        `https://${domain}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/${customerId}/metafields.json`,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOP_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const pmaField = data.metafields.find(
        (mf) => mf.namespace === "custom" && mf.key === "pma_agreement"
          );

        if (pmaField) {
          const parsed = JSON.parse(pmaField.value);
          signed = parsed.signed === true;
          details = parsed;
        }

      }
    } catch (err) {
      console.error("Error fetching metafields:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    endpoint: "check",
    customerId,
    signed,
    details,
    domain,
  });
}
