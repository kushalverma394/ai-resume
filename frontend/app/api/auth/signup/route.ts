import { NextResponse } from "next/server";

import { encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

type SignupPayload = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignupPayload;

  if (!body.name || !body.email || !body.password || !body.confirmPassword) {
    return NextResponse.json({ detail: "All fields are required." }, { status: 400 });
  }

  if (body.password !== body.confirmPassword) {
    return NextResponse.json({ detail: "Passwords do not match." }, { status: 400 });
  }

  const response = NextResponse.json({
    session: {
      email: body.email,
      name: body.name,
      provider: "email",
    },
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: encodeSession({
      email: body.email,
      name: body.name,
      provider: "email",
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