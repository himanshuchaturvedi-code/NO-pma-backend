export default function Home() {
  const shop = "pma-test-store.myshopify.com"; // hardcode for now

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_customers&redirect_uri=${encodeURIComponent("https://no-pma-backend.vercel.app/api/auth/callback")}`;

  return (
    <div>
      <h1>N O PMA Backend</h1>
      <a href={authUrl}>Install App</a>
    </div>
  );
}
