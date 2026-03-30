import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "60px",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px 40px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "10px",
                color: "#0f172a",
                fontSize: "20px",
              }}
            >
              자금조달 뉴스 허브
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.8",
                fontSize: "14px",
              }}
            >
              유상증자, CB, BW, EB, 메자닌, 투자유치 관련 뉴스를 모아보고
              회사별 흐름과 통계까지 확인할 수 있는 자본시장 뉴스 서비스입니다.
            </p>
          </div>

          <div>
            <h4
              style={{
                marginTop: 0,
                marginBottom: "10px",
                color: "#0f172a",
                fontSize: "16px",
              }}
            >
              바로가기
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/" style={linkStyle}>홈</Link>
              <Link href="/about" style={linkStyle}>소개</Link>
              <Link href="/dashboard" style={linkStyle}>대시보드</Link>
              <Link href="/today" style={linkStyle}>오늘의 자금조달 뉴스</Link>
              <Link href="/weekly" style={linkStyle}>이번 주 메자닌 이슈</Link>
              <Link href="/admin" style={linkStyle}>관리자</Link>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          © 2026 Capital News Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#475569",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};