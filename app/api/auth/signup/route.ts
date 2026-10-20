import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  return handleAuth(request);
}

export async function POST(request: NextRequest) {
  return handleAuth(request);
}

async function handleAuth(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "demo@gestia.io";
  const name = url.searchParams.get("name") || "Propriétaire Démo";

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("votre-projet.supabase.co") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "votre-cle-anon";

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${url.origin}/api/auth/callback`,
          data: { full_name: name },
        },
      });

      if (!error) {
        // Redirect to a confirmation or login with notice
        return NextResponse.redirect(new URL("/login?sent=true", request.url));
      }
    } catch {
      // Fallback to demo mode if auth provider fails
    }
  }

  // Demo / Local development login session
  const cookieStore = cookies();
  cookieStore.set("gestia_session", JSON.stringify({ email, name }), {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
