"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);
  const router = useRouter();

  // Handle invitation tokens from URL hash
  useEffect(() => {
    const handleInvitation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type === 'invite' && accessToken && refreshToken) {
        setIsProcessingInvite(true);
        try {
          const supabase = createClient();
          
          // Set the session with the tokens from the invitation
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setError('Failed to process invitation: ' + error.message);
            return;
          }

          // Get authenticated user data after setting session
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError || !userData.user) {
            setError('Failed to authenticate user: ' + (userError?.message || 'Unknown error'));
            return;
          }

          if (userData.user) {
            // Create user in database if doesn't exist
            try {
              const response = await fetch('/api/users/create-from-invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  authId: userData.user.id, 
                  email: userData.user.email 
                }),
              });

              if (!response.ok) {
                console.error('Failed to create user in database');
              }
            } catch (dbError) {
              console.error('Database error:', dbError);
            }

            // Clear the hash and redirect to setup with explicit flag
            window.history.replaceState({}, document.title, window.location.pathname);
            router.replace('/auth/setup?from=invite');
          }
        } catch (err) {
          setError('Error processing invitation: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
          setIsProcessingInvite(false);
        }
      }
    };

    handleInvitation();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid API key")) {
          throw new Error(
            "認証システムが正しく設定されていません。管理者にお問い合わせください。",
          );
        }
        throw new Error(error.message);
      }

      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (isProcessingInvite) {
    return (
      <div className="container" style={{ gridTemplateColumns: "1fr" }}>
        <main className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card">
            <h1>Processing Invitation...</h1>
            <p>Please wait while we set up your account.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container" style={{ gridTemplateColumns: "1fr" }}>
      <main className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
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
      </main>
    </div>
  );
}
