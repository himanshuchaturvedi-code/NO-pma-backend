export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const customerId = req.query.logged_in_customer_id || null; // present when called via App Proxy

  // Read JSON body safely
  const chunks = [];
  for await (const c of req) chunks.push(c);
  let body = {};
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch {}

  res.status(200).json({ ok: true, endpoint: "save", customerId, body });
}
