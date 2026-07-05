from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    upload_id: str
    filename: str
    content_type: str
    size_bytes: int
    text_length: int
    text_preview: str
    message: str = "Resume uploaded successfully."


class AnalyzeRequest(BaseModel):
    upload_id: str | None = None
    job_description: str | None = None


class JobMatchRequest(BaseModel):
    upload_id: str | None = None
    job_description: str


class CoverLetterRequest(BaseModel):
    upload_id: str | None = None
    job_description: str
    company_name: str | None = None
    role_title: str | None = None


class InterviewRequest(BaseModel):
    upload_id: str | None = None
    job_description: str | None = None
    role_title: str | None = None


class ProfileResponse(BaseModel):
    full_name: str
    email: str
    headline: str
    bio: str
    plan: str
    theme: str
    email_notifications: bool
    push_notifications: bool
    oauth_connected: list[str]


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    email: str | None = None
    headline: str | None = None
    bio: str | None = None
    theme: str | None = None
    email_notifications: bool | None = None
    push_notifications: bool | None = None


class JobMatchResponse(BaseModel):
    match_percentage: int = Field(ge=0, le=100)
    ats_impact: int = Field(ge=0, le=100)
    matched_keywords: list[str]
    missing_keywords: list[str]
    suggestions: list[str]
    summary: str


class CoverLetterResponse(BaseModel):
    company_name: str | None = None
    role_title: str | None = None
    cover_letter: str
    generated_at: datetime


class InterviewResponse(BaseModel):
    role_title: str | None = None
    questions: list[str]
    talking_points: list[str]
    generated_at: datetime


class ExportResponse(BaseModel):
    filename: str
    content_type: str = "application/pdf"


class ResumeAnalysis(BaseModel):
    ats_score: int = Field(ge=0, le=100)
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    technical_skills: list[str]
    soft_skills: list[str]
    missing_keywords: list[str]
    grammar_score: int = Field(ge=0, le=100)
    formatting_score: int = Field(ge=0, le=100)
    improved_bullets: list[str]
    career_level: str
    recommended_roles: list[str]
    interview_questions: list[str]
    overall_feedback: str


class HistoryItem(BaseModel):
    analysis_id: str
    upload_id: str
    filename: str
    content_type: str
    size_bytes: int
    ats_score: int
    career_level: str
    recommended_roles: list[str]
    created_at: datetime


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
    count: int


class ErrorResponse(BaseModel):
    detail: str