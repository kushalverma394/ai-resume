export type SessionUser = {
  email: string;
  name: string;
  provider: "email" | "google" | "github";
  createdAt: string;
};

export const SESSION_COOKIE_NAME = "ai_resume_session";

export function encodeSession(user: SessionUser): string {
  const json = JSON.stringify(user);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as SessionUser;
  } catch {
    return null;
  }
}