import { NextRequest, NextResponse } from "next/server";

import { encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const normalizedProvider = provider.toLowerCase();

  if (
    normalizedProvider !== "google" &&
    normalizedProvider !== "github"
  ) {
    return NextResponse.json(
      { detail: "Unsupported provider." },
      { status: 400 }
    );
  }

  const response = NextResponse.redirect(
    new URL(
      "/dashboard",
      process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    )
  );

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: encodeSession({
      email: `${normalizedProvider}@resumepro.app`,
      name:
        normalizedProvider === "google"
          ? "Google User"
          : "GitHub User",
      provider: normalizedProvider as "google" | "github",
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