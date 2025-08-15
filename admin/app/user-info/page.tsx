export default async function UserInfoPage() {
  // Placeholder: could fetch from your auth/session
  const user = { id: "demo-user", email: "demo@example.com" };
  return (
    <div className="container">
      <aside className="sidebar">
        <h2>管理画面</h2>
        <nav className="nav">
          <a href="/">Dashboard</a>
          <a href="/user-info" className="active">User Info</a>
          <a href="/upload-csv">Upload CSV</a>
        </nav>
      </aside>
      <main className="content">
        <div className="card">
          <h1>User Info</h1>
          <p><b>ID:</b> {user.id}</p>
          <p><b>Email:</b> {user.email}</p>
          <p className="muted">Auth wiring to be added later.</p>
        </div>
      </main>
    </div>
  );
}


