import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <aside className="sidebar">
        <h2>管理画面</h2>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/user-info">User Info</Link>
          <Link href="/upload-csv">Upload CSV</Link>
          <Link href="/political-organizations">政治団体</Link>
        </nav>
      </aside>
      <main className="content">
        <div className="card">
          <h1>Welcome</h1>
          <p className="muted">Use the left navigation to manage data.</p>
        </div>
      </main>
    </div>
  );
}
