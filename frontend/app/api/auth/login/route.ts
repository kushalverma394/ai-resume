import { NextResponse } from "next/server";

import { encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

type LoginPayload = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;

  if (!body.email || !body.password) {
    return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json({ detail: "Password must be at least 8 characters." }, { status: 400 });
  }

  const response = NextResponse.json({
    session: {
      email: body.email,
      name: body.email.split("@")[0].replace(/[._-]/g, " "),
      provider: "email",
    },
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: encodeSession({
      email: body.email,
      name: body.email.split("@")[0].replace(/[._-]/g, " "),
      provider: "email",
      createdAt: new Date().toISOString(),
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
  });

  return response;
}