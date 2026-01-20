import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

/* ============================================================================
   FONT CONFIGURATION
   Using Outfit for headings (geometric, modern) and DM Sans for body text.
   These are production-grade fonts used by companies like Stripe and Linear.
   ============================================================================ */

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ============================================================================
   SEO METADATA
   Comprehensive meta tags for search engines and social sharing.
   ============================================================================ */

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

/* ============================================================================
   ROOT LAYOUT
   Applies font variables to the entire application.
   Dark mode is the default theme for this premium design.
   ============================================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}