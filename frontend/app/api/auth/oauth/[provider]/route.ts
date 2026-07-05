import { NextResponse } from "next/server";

import { encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

import { NextRequest, NextResponse } from "next/server";
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ provider: string }> }
) {
    const { provider } = await params;

  // rest of your existing code
  }
  const provider = params.provider.toLowerCase();
  if (provider !== "google" && provider !== "github") {
    return NextResponse.json({ detail: "Unsupported provider." }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: encodeSession({
      email: `${provider}@resumepro.app`,
      name: provider === "google" ? "Google User" : "GitHub User",
      provider: provider as "google" | "github",
      createdAt: new Date().toISOString(),
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}