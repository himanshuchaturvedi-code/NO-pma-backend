export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // App Proxy forwards the logged-in customer id as a query param:
    const customerId = req.query.logged_in_customer_id;
    if (!customerId) {
      return res.status(401).json({ error: "No logged-in customer id" });
    }

    const store = process.env.SHOPIFY_STORE_DOMAIN; // e.g. pma-test-store.myshopify.com
    const token = process.env.SHOPIFY_ADMIN_TOKEN;  // Admin API access token from your store
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";

    // Get all customer metafields, then pick the one we need
    const url = `https://${store}/admin/api/${apiVersion}/customers/${customerId}/metafields.json`;
    const r = await fetch(url, {
      headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" }
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: "Shopify GET failed", detail: text });
    }

    const json = await r.json();
    const mf = (json.metafields || []).find(m => m.namespace === "pma" && m.key === "agreement");
    const value = mf?.value ? safeParse(mf.value) : null;

    return res.status(200).json({ agreement: value });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e) });
  }
}

function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }
