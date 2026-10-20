import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لكل مؤمن",
  description: "رفيقك اليومي للقرآن والعبادات والأذكار بمصادر موثوقة.",
  applicationName: "لكل مؤمن",
};

export const viewport: Viewport = {
  themeColor: "#0d5b46",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
