import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Analyzer Pro",
  description: "Premium AI resume analysis, ATS scoring, job matching, cover letters, and export workflows for modern hiring.",
  keywords: ["AI resume analyzer", "ATS scoring", "resume builder", "cover letter generator", "job match"],
  openGraph: {
    title: "AI Resume Analyzer Pro",
    description: "Premium AI resume analysis, ATS scoring, job matching, and export workflows.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#03050f] text-white">{children}</body>
    </html>
  );
}
