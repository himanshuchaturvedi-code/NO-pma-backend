export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // You should see this when called via the App Proxy (Shopify adds this query param)
  const customerId = req.query.logged_in_customer_id || null;
  return res.status(200).json({ ok: true, endpoint: "check", customerId });
}
