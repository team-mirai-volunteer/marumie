import 'server-only';
import { loginWithPassword } from '@/server/actions/auth';
import InviteProcessor from './processor';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params?.error ?? '';

  return (
    <div className="container" style={{ gridTemplateColumns: '1fr' }}>
      <main className="content" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="card">
          <h1>Login</h1>
          <form action={loginWithPassword} style={{ display: 'grid', gap: 12 }}>
            <label>
              <div className="muted">Email</div>
              <input className="input" name="email" type="email" required />
            </label>
            <label>
              <div className="muted">Password</div>
              <input className="input" name="password" type="password" required />
            </label>
            <button className="button" type="submit">
              Sign in
            </button>
            {error && <div className="muted">{error}</div>}
          </form>
        </div>
        {/* Client-only invite hash processor to set session via server action */}
        <InviteProcessor />
      </main>
    </div>
  );
}
