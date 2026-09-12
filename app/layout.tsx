import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PHYVERA — Seedwoken Biological Intelligence",
  description: "Private biological species design system for the Seedwoken universe.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
