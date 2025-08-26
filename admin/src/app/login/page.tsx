import "server-only";
import InvitationHandler from "@/client/components/InvitationHandler";
import LoginForm from "@/client/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <InvitationHandler />
      <div className="container" style={{ gridTemplateColumns: "1fr" }}>
        <main className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card">
            <h1>Login</h1>
            <LoginForm />
          </div>
        </main>
      </div>
    </>
  );
}
