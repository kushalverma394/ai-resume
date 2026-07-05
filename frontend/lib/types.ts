export type AnalyzeRequest = {
  uploadId?: string;
  jobDescription?: string;
};

export type UploadResponse = {
  upload_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  text_length: number;
  text_preview: string;
  message: string;
};

export type ResumeAnalysis = {
  ats_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  technical_skills: string[];
  soft_skills: string[];
  missing_keywords: string[];
  grammar_score: number;
  formatting_score: number;
  improved_bullets: string[];
  career_level: string;
  recommended_roles: string[];
  interview_questions: string[];
  overall_feedback: string;
};

export type HistoryItem = {
  analysis_id: string;
  upload_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  ats_score: number;
  career_level: string;
  recommended_roles: string[];
  created_at: string;
};

export type HistoryResponse = {
  items: HistoryItem[];
  count: number;
};

export type ProfileResponse = {
  full_name: string;
  email: string;
  headline: string;
  bio: string;
  plan: string;
  theme: string;
  email_notifications: boolean;
  push_notifications: boolean;
  oauth_connected: string[];
};

export type ProfileUpdateRequest = Partial<Pick<ProfileResponse, "full_name" | "email" | "headline" | "bio" | "theme" | "email_notifications" | "push_notifications">>;

export type JobMatchResponse = {
  match_percentage: number;
  ats_impact: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  summary: string;
};

export type CoverLetterResponse = {
  company_name: string | null;
  role_title: string | null;
  cover_letter: string;
  generated_at: string;
};

export type InterviewResponse = {
  role_title: string | null;
  questions: string[];
  talking_points: string[];
  generated_at: string;
};
