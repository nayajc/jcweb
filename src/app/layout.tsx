import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jcweb.vercel.app";

const siteDescription =
  "JC Song — web apps, dashboards, and side projects, all deployed and clickable.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "JC Song — I make ideas real & live.",
    template: "%s — JC Song",
  },
  description: siteDescription,
  openGraph: {
    title: "JC Song — I make ideas real & live.",
    description: siteDescription,
    url: baseUrl,
    siteName: "JC Song",
    type: "website",
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
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
