import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Sparkles,
  UserCircle2,
  Upload,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Analysis", href: "/analysis", icon: Sparkles },
  { label: "History", href: "/history", icon: FileText },
  { label: "Profile", href: "/profile", icon: UserCircle2 },
];

export type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export const dashboardStats: StatCard[] = [
  { label: "Total Resumes", value: "128", change: "+18 this week", icon: FileText },
  { label: "Average ATS Score", value: "87%", change: "+4.2 from last month", icon: Sparkles },
  { label: "Job Matches", value: "42", change: "+11 qualified matches", icon: BriefcaseBusiness },
  { label: "Interviews Generated", value: "19", change: "+6 practice sets", icon: ArrowUpRight },
];

export type RecentAnalysisItem = {
  title: string;
  company: string;
  score: number;
  status: string;
  date: string;
};

export const recentAnalyses: RecentAnalysisItem[] = [
  {
    title: "Senior Product Designer Resume",
    company: "Nova Labs",
    score: 92,
    status: "Interview Ready",
    date: "Today",
  },
  {
    title: "Frontend Engineer Portfolio",
    company: "Arc Systems",
    score: 88,
    status: "Strong Match",
    date: "Yesterday",
  },
  {
    title: "Design Systems Lead Resume",
    company: "Orbit Health",
    score: 84,
    status: "Needs Refinement",
    date: "2 days ago",
  },
];

export type HistoryRecord = {
  id: string;
  role: string;
  company: string;
  score: number;
  match: string;
  date: string;
  fileType: string;
};

export const historyRecords: HistoryRecord[] = [
  {
    id: "AN-1001",
    role: "Senior Product Designer",
    company: "Nova Labs",
    score: 92,
    match: "94%",
    date: "Jul 5, 2026",
    fileType: "PDF",
  },
  {
    id: "AN-1002",
    role: "Frontend Engineer",
    company: "Arc Systems",
    score: 88,
    match: "89%",
    date: "Jul 4, 2026",
    fileType: "DOCX",
  },
  {
    id: "AN-1003",
    role: "Design Systems Lead",
    company: "Orbit Health",
    score: 84,
    match: "81%",
    date: "Jul 2, 2026",
    fileType: "PDF",
  },
  {
    id: "AN-1004",
    role: "Senior UX Engineer",
    company: "Northstar AI",
    score: 90,
    match: "92%",
    date: "Jun 30, 2026",
    fileType: "DOCX",
  },
];

export const analysisSummary = {
  atsScore: 92,
  keywordMatch: 87,
  grammarScore: 95,
  formattingScore: 90,
  jobDescriptionMatch: 94,
  resumeSummary:
    "A strong resume for a senior product/design systems role with clear ownership, measurable outcomes, and good technical depth. The profile is nearly interview-ready, but can benefit from tighter keyword alignment and more concise impact statements.",
  technicalSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Design Systems", "Recharts"],
  softSkills: ["Collaboration", "Product Thinking", "Mentorship", "Stakeholder Management", "Communication"],
  missingSkills: ["A/B Testing", "Motion Design", "Accessibility Audits", "Design Ops"],
  strengths: [
    "Strong measurable impact across shipping cycles and product outcomes.",
    "Good alignment with modern frontend and design system requirements.",
    "Clear leadership signals and ownership of cross-functional work.",
  ],
  weaknesses: [
    "Could include more explicit ATS keywords from the target job description.",
    "Some bullets are slightly long and can be sharpened for skim readability.",
    "Missing a few role-specific competencies around experimentation and design operations.",
  ],
  recommendations: [
    "Add 1-2 lines that demonstrate experimentation and performance ownership.",
    "Rewrite older bullets to start with stronger verbs and concrete outcomes.",
    "Include accessibility and design system keywords near the top of the resume.",
  ],
  bulletImprovements: [
    {
      before: "Led product redesigns across core user flows.",
      after: "Led redesigns across 5 core product flows, improving activation by 18% and reducing support tickets by 22%.",
    },
    {
      before: "Worked with engineering to improve the design system.",
      after: "Partnered with engineering to ship a scalable design system used by 8 teams, cutting UI inconsistencies by 40%.",
    },
    {
      before: "Improved dashboard clarity for users.",
      after: "Improved dashboard clarity by restructuring navigation and prioritizing key metrics, lifting task completion by 15%.",
    },
  ],
  interviewQuestions: [
    "How do you decide which product metrics should influence the resume narrative?",
    "Describe a time you improved a design system while balancing speed and consistency.",
    "How do you collaborate with recruiters and hiring managers to tailor a resume for an open role?",
    "What signals do you look for to decide whether a resume is ATS-ready?",
  ],
};

export const skillChartData = [
  { category: "Technical", score: 92 },
  { category: "Product", score: 88 },
  { category: "Collaboration", score: 90 },
  { category: "Accessibility", score: 84 },
  { category: "Communication", score: 91 },
  { category: "Strategy", score: 86 },
];

export const uploadFormats = [
  { label: "PDF", description: "Best for consistent resume formatting" },
  { label: "DOCX", description: "Editable Word documents supported" },
];

export const searchPills = ["ATS Score", "Technical Skills", "Keywords", "Questions"];