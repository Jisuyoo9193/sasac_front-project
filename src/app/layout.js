import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DON'T MISS",
  description: "놓치면 돈 나가는 쿠폰·구독·마감일을 한눈에 관리하는 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {/* 전에는 여기서 Tabler 아이콘 폰트를 CDN으로 받아왔는데, 그 주소가
          존재하지 않는 버전(2.47.0)이라 전체 아이콘이 하나도 안 보이는
          문제가 있었습니다. 이제 외부 폰트 없이 components/icons.js의
          SVG 아이콘만 쓰므로 이 링크 자체가 필요 없어졌습니다. */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
