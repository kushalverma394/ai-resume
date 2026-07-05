import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function GET() {
  const session = decodeSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  return NextResponse.json({ session });
}