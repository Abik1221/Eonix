import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eonix - Semantic Repository Mapping Platform",
  description: "Transform your dead code into living architectural maps. Understand, visualize, and govern your software architecture with deterministic analysis and AI-powered insights.",
  keywords: ["architecture", "code analysis", "semantic graph", "software visualization", "microservices", "API mapping"],
  authors: [{ name: "Eonix" }],
  openGraph: {
    title: "Eonix - Semantic Repository Mapping Platform",
    description: "Transform your dead code into living architectural maps.",
    type: "website",
    locale: "en_US",
    siteName: "Eonix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eonix - Semantic Repository Mapping Platform",
    description: "Transform your dead code into living architectural maps.",
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
