import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string; confirmPassword?: string };

  if (!body.password || !body.confirmPassword) {
    return NextResponse.json({ detail: "Both password fields are required." }, { status: 400 });
  }

  if (body.password !== body.confirmPassword) {
    return NextResponse.json({ detail: "Passwords do not match." }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated successfully." });
}