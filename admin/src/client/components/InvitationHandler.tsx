"use client";
import "client-only";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvitationHandler() {
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleInvitation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "invite" && accessToken && refreshToken) {
        setIsProcessingInvite(true);
        try {
          const response = await fetch("/api/process-invitation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, refreshToken }),
          });

          const result = await response.json();
          
          if (!response.ok || result.error) {
            setError(result.error || "Failed to process invitation");
          } else {
            // Clear the hash and redirect to setup with explicit flag
            window.history.replaceState({}, document.title, window.location.pathname);
            router.replace("/auth/setup?from=invite");
          }
        } catch (err) {
          setError("Error processing invitation: " + (err instanceof Error ? err.message : String(err)));
        } finally {
          setIsProcessingInvite(false);
        }
      }
    };

    handleInvitation();
  }, [router]);

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

  if (error) {
    return (
      <div className="container" style={{ gridTemplateColumns: "1fr" }}>
        <main className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card">
            <h1>Invitation Error</h1>
            <p className="muted">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}