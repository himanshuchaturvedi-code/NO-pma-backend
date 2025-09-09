export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const customerId = req.query.logged_in_customer_id || null; // present when called via App Proxy
  res.status(200).json({ ok: true, endpoint: "check", customerId });
}
