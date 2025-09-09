export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // App Proxy includes the logged-in customer id on the query
    const customerId = req.query.logged_in_customer_id;
    if (!customerId) {
      return res.status(401).json({ error: "No logged-in customer id" });
    }

    const store = process.env.SHOPIFY_STORE_DOMAIN; // e.g. pma-test-store.myshopify.com
    const token = process.env.SHOPIFY_ADMIN_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";

    const body = await readJson(req);
    // Expecting: { name, date, signature } — you can add signatureType/version if you want
    const pmaValue = JSON.stringify({
      name: body.name,
      date: body.date,
      signature: body.signature
    });

    // 1) Check if metafield exists
    const listUrl = `https://${store}/admin/api/${apiVersion}/customers/${customerId}/metafields.json`;
    const listRes = await fetch(listUrl, {
      headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" }
    });
    if (!listRes.ok) {
      const t = await listRes.text();
      return res.status(listRes.status).json({ error: "Shopify list failed", detail: t });
    }
    const existing = (await listRes.json()).metafields?.find(m => m.namespace === "pma" && m.key === "agreement");

    if (existing) {
      // 2a) Update existing metafield
      const putUrl = `https://${store}/admin/api/${apiVersion}/metafields/${existing.id}.json`;
      const putRes = await fetch(putUrl, {
        method: "PUT",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ metafield: { id: existing.id, type: "json", value: pmaValue } })
      });
      if (!putRes.ok) {
        const t = await putRes.text();
        return res.status(putRes.status).json({ error: "Shopify update failed", detail: t });
      }
      const saved = await putRes.json();
      return res.status(200).json({ ok: true, metafield: saved.metafield });
    } else {
      // 2b) Create new metafield
      const postUrl = `https://${store}/admin/api/${apiVersion}/customers/${customerId}/metafields.json`;
      const postRes = await fetch(postUrl, {
        method: "POST",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          metafield: {
            namespace: "pma",
            key: "agreement",
            type: "json",
            value: pmaValue
          }
        })
      });
      if (!postRes.ok) {
        const t = await postRes.text();
        return res.status(postRes.status).json({ error: "Shopify create failed", detail: t });
      }
      const created = await postRes.json();
      return res.status(200).json({ ok: true, metafield: created.metafield });
    }
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e) });
  }
}

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8") || "{}";
  try { return JSON.parse(raw); } catch { return {}; }
}
