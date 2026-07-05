import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };

  if (!body.email) {
    return NextResponse.json({ detail: "Email is required." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Password reset instructions have been generated for this session.",
    email: body.email,
  });
}