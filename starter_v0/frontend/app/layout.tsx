import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Tech News Assistant",
  description: "Trợ lý AI Tra cứu Tin tức Công nghệ — research agent demo UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}