import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  return handleLogin(request);
}

export async function POST(request: NextRequest) {
  return handleLogin(request);
}

async function handleLogin(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "demo@gestia.io";

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
        },
      });

      if (!error) {
        return NextResponse.redirect(new URL("/login?sent=true", request.url));
      }
    } catch {
      // Fallback to demo mode
    }
  }

  // Demo session cookie
  const cookieStore = cookies();
  cookieStore.set("gestia_session", JSON.stringify({ email, name: "Propriétaire" }), {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
