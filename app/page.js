export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>NO PMA Backend</h1>
      <p>Check: <code>/api/pma/check</code></p>
      <p>Save (POST JSON): <code>/api/pma/save</code></p>
    </main>
  );
}

