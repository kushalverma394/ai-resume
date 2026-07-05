import type {
  AnalyzeRequest,
  CoverLetterResponse,
  HistoryResponse,
  InterviewResponse,
  JobMatchResponse,
  ProfileResponse,
  ProfileUpdateRequest,
  ResumeAnalysis,
  UploadResponse,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

type JsonHeaders = Record<string, string>;

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string; message?: string };
    return body.detail || body.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers as JsonHeaders | undefined),
    },
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
}

async function apiForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
}

export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return apiForm<UploadResponse>("/upload", formData);
}

export async function analyzeResume(payload: AnalyzeRequest & { file?: File }): Promise<ResumeAnalysis> {
  const formData = new FormData();

  if (payload.file) {
    formData.append("file", payload.file);
  }

  if (payload.uploadId) {
    formData.append("upload_id", payload.uploadId);
  }

  if (payload.jobDescription) {
    formData.append("job_description", payload.jobDescription);
  }

  return apiForm<ResumeAnalysis>("/analyze", formData);
}

export async function fetchHistory(limit = 20): Promise<HistoryResponse> {
  return apiJson<HistoryResponse>(`/history?limit=${limit}`);
}

export async function deleteHistoryItem(analysisId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/${analysisId}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function fetchProfile(): Promise<ProfileResponse> {
  return apiJson<ProfileResponse>("/profile");
}

export async function updateProfile(payload: ProfileUpdateRequest): Promise<ProfileResponse> {
  return apiJson<ProfileResponse>("/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchJobMatch(payload: { uploadId?: string; jobDescription: string; file?: File }): Promise<JobMatchResponse> {
  const formData = new FormData();
  if (payload.uploadId) {
    formData.append("upload_id", payload.uploadId);
  }
  if (payload.jobDescription) {
    formData.append("job_description", payload.jobDescription);
  }
  if (payload.file) {
    formData.append("file", payload.file);
  }
  return apiForm<JobMatchResponse>("/job-match", formData);
}

export async function fetchCoverLetter(payload: {
  uploadId?: string;
  jobDescription: string;
  companyName?: string;
  roleTitle?: string;
  file?: File;
}): Promise<CoverLetterResponse> {
  const formData = new FormData();
  if (payload.uploadId) formData.append("upload_id", payload.uploadId);
  formData.append("job_description", payload.jobDescription);
  if (payload.companyName) formData.append("company_name", payload.companyName);
  if (payload.roleTitle) formData.append("role_title", payload.roleTitle);
  if (payload.file) formData.append("file", payload.file);
  return apiForm<CoverLetterResponse>("/cover-letter", formData);
}

export async function fetchInterview(payload: {
  uploadId?: string;
  jobDescription?: string;
  roleTitle?: string;
  file?: File;
}): Promise<InterviewResponse> {
  const formData = new FormData();
  if (payload.uploadId) formData.append("upload_id", payload.uploadId);
  if (payload.jobDescription) formData.append("job_description", payload.jobDescription);
  if (payload.roleTitle) formData.append("role_title", payload.roleTitle);
  if (payload.file) formData.append("file", payload.file);
  return apiForm<InterviewResponse>("/interview", formData);
}

export async function exportResume(payload: { uploadId?: string; analysisId?: string }): Promise<Blob> {
  const formData = new FormData();
  if (payload.uploadId) formData.append("upload_id", payload.uploadId);
  if (payload.analysisId) formData.append("analysis_id", payload.analysisId);

  const response = await fetch(`${API_BASE_URL}/export`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return await response.blob();
}

export async function login(email: string, password: string, rememberMe: boolean) {
  const response = await apiJson<{
    session: {
      email: string;
      name: string;
      provider: "email" | "google" | "github";
    };
  }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  const { encodeSession, SESSION_COOKIE_NAME } = await import("./auth-session");

  document.cookie =
    `${SESSION_COOKIE_NAME}=` +
    encodeSession({
      ...response.session,
      createdAt: new Date().toISOString(),
    }) +
    "; path=/";

  return response;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const response = await apiJson<{
    session: {
      email: string;
      name: string;
      provider: "email" | "google" | "github";
    };
  }>("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword,
    }),
  });

  const { encodeSession, SESSION_COOKIE_NAME } = await import("./auth-session");

  document.cookie =
    `${SESSION_COOKIE_NAME}=` +
    encodeSession({
      ...response.session,
      createdAt: new Date().toISOString(),
    }) +
    "; path=/";

  return response;
}

export async function logout() {
  return apiJson<{ ok: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(email: string) {
  return apiJson<{ message: string; email: string }>("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(password: string, confirmPassword: string) {
  return apiJson<{ message: string }>("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmPassword }),
  });
}

export async function session() {
  return apiJson<{ session: { email: string; name: string; provider: string } | null }>("/auth/session");
}

export function oauthHref(provider: "google" | "github") {
  return `/api/auth/oauth/${provider}`;
}
