import type { Metadata, Viewport } from "next";
import { siteConfig } from "./site-config";
import "./globals.css";
import { GoogleAds } from "./google-ads";
import { ClixtellTracking } from "./clixtell";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  alternates: { canonical: "/" },
  title: "고속티켓 | 상품권 상담 전문",
  description: "고속티켓 상품권 상담 안내 페이지입니다.",
  openGraph: {
    title: "고속티켓",
    description: "상품권 상담은 고속티켓",
    siteName: "고속티켓",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body><ClixtellTracking />{children}<GoogleAds /></body>
    </html>
  );
}
