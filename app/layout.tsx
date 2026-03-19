import "./globals.css";
import type { Metadata } from "next";
import TopNav from "../components/TopNav";

export const metadata: Metadata = {
  title: "자금조달 뉴스 허브",
  description: "유상증자, CB, BW, EB, 메자닌, 투자유치 관련 뉴스를 한눈에 보여주는 자본시장 뉴스 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, backgroundColor: "#f8fafc", color: "#0f172a" }}>
        <TopNav />
        {children}
      </body>
    </html>
  );
}