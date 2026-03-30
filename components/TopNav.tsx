"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/admin", label: "관리자" },
  { href: "/today", label: "오늘의 자금조달 뉴스" },
  { href: "/weekly", label: "이번 주 메자닌 이슈" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(248, 250, 252, 0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#0f172a",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          자금조달 뉴스 허브
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {menus.map((menu) => {
            const active = pathname === menu.href;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                style={{
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  backgroundColor: active ? "#0f172a" : "#ffffff",
                  color: active ? "#ffffff" : "#334155",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}