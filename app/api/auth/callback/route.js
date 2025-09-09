import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);

  const { hmac, shop, code } = params;
  if (!hmac || !shop || !code) {
    return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
  }

  // Verify HMAC
  const message = Object.keys(params)
    .filter(k => k !== "hmac")
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");

  const hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  if (hash !== hmac) {
    return NextResponse.json({ ok: false, error: "Invalid HMAC" }, { status: 400 });
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return NextResponse.json({ ok: false, error: "Token exchange failed", details: err }, { status: 400 });
  }

  const { access_token } = await tokenRes.json();

  // ⚠️ TODO: store access_token securely (DB, KV, etc.)
  console.log(`Access token for ${shop}:`, access_token);

  return NextResponse.json({ ok: true, shop, access_token });
}
