import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

async function handleLogout(request: NextRequest) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore Supabase errors if disconnected
  }

  const cookieStore = cookies();
  cookieStore.delete("gestia_session");

  return NextResponse.redirect(new URL("/login", request.url));
}
