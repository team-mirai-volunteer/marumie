import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/server/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Access token and refresh token are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Set the session with the tokens from the invitation
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to process invitation: " + error.message },
        { status: 400 }
      );
    }

    // Get authenticated user data after setting session
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Failed to authenticate user: " + (userError?.message || "Unknown error") },
        { status: 400 }
      );
    }

    if (userData.user) {
      // Create user in database if doesn't exist
      try {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/users/create-from-invite`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              authId: userData.user.id,
              email: userData.user.email,
            }),
          },
        );

        if (!response.ok) {
          console.error("Failed to create user in database");
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }

      return NextResponse.json({ success: true });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Error processing invitation: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}