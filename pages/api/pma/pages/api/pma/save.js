export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const customerId = req.query.logged_in_customer_id || null;
  const body = await readBody(req);
  return res.status(200).json({ ok: true, endpoint: "save", customerId, body });
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }
  catch { return {}; }
}
