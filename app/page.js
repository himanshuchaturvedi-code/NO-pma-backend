export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>NO PMA Backend</h1>
      <p>Health check: <code>/api/pma/check</code></p>
      <p>Save endpoint: <code>/api/pma/save</code> (POST JSON)</p>
    </main>
  );
}
