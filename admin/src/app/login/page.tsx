"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const search = useSearchParams();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Login failed");
      }
      const redirect = search.get("redirect");
      router.replace(redirect || "/upload-csv");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="card">
      <h1>Login</h1>
      <form
        onSubmit={onSubmit}
        className=""
        style={{ display: "grid", gap: 12 }}
      >
        <label>
          <div className="muted">Email</div>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <div className="muted">Password</div>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="button" type="submit">
          Sign in
        </button>
        {error && <div className="muted">{error}</div>}
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container" style={{ gridTemplateColumns: "1fr" }}>
      <main className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
        <Suspense fallback={<div className="card">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
