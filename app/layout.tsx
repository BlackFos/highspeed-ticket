import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xn--299a350b00j9wd.com"),
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
      <body>{children}</body>
    </html>
  );
}
