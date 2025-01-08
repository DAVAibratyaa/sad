import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laudos.AI - Radiology Report Generation",
  description: "AI-powered radiology report generation system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} antialiased bg-[#0d1117] text-foreground min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
