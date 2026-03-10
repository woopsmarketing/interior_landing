import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "인테리어 견적 비교 | 무료 견적 요청",
  description:
    "AI가 분석한 인테리어 견적을 한 번에 비교하세요. 검증된 전문 업체 견적을 무료로 받아보세요.",
  openGraph: {
    title: "인테리어 견적 비교 | 무료 견적 요청",
    description:
      "AI가 분석한 인테리어 견적을 한 번에 비교하세요. 검증된 전문 업체 견적을 무료로 받아보세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "인테리어 견적 비교 | 무료 견적 요청",
    description:
      "AI가 분석한 인테리어 견적을 한 번에 비교하세요. 검증된 전문 업체 견적을 무료로 받아보세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>{children}</body>
    </html>
  );
}
