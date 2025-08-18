export default async function UserInfoPage() {
  // Placeholder: could fetch from your auth/session
  const user = { id: "demo-user", email: "demo@example.com" };
  return (
    <div className="card">
      <h1>User Info</h1>
      <p>
        <b>ID:</b> {user.id}
      </p>
      <p>
        <b>Email:</b> {user.email}
      </p>
      <p className="muted">Auth wiring to be added later.</p>
    </div>
  );
}
