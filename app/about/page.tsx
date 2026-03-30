import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px 60px 20px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <section
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
        }}
      >
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          About This Service
        </p>

        <h1
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            marginTop: 0,
            marginBottom: "14px",
            lineHeight: "1.3",
          }}
        >
          자금조달 뉴스 허브 소개
        </h1>

        <p
          style={{
            color: "#e2e8f0",
            lineHeight: "1.8",
            margin: 0,
            fontSize: "16px",
          }}
        >
          자본시장 자금조달 관련 기사를 한 곳에서 모아보고,
          검색·필터·정렬·통계·회사별 흐름까지 확인할 수 있는 뉴스 서비스입니다.
        </p>
      </section>

      <section style={{ display: "grid", gap: "18px" }}>
        <InfoCard
          title="이 사이트는 무엇을 하나요?"
          content="유상증자, CB, BW, EB, 메자닌, 투자유치 관련 뉴스를 자동으로 수집하고 정리해서 보여줍니다."
        />

        <InfoCard
          title="어떤 기능이 있나요?"
          content="홈 화면, 오늘의 뉴스, 이번 주 메자닌 이슈, 회사별 히스토리, 통계 대시보드, 관리자 기사 관리 기능이 있습니다."
        />

        <InfoCard
          title="어떻게 활용하면 좋나요?"
          content="기업별 자금조달 흐름 확인, 최근 메자닌 시장 동향 파악, 대시보드로 기사 수와 조달금액 흐름 확인 등에 활용할 수 있습니다."
        />

        <InfoCard
          title="기사 데이터는 어떻게 들어오나요?"
          content="RSS 기반 자동수집 구조와 관리자 페이지 수동 입력 기능을 함께 사용합니다."
        />
      </section>

      <div style={{ marginTop: "28px" }}>
        <Link
          href="/"
          style={{
            color: "#1d4ed8",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "22px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "10px",
          color: "#0f172a",
          fontSize: "22px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#475569",
          lineHeight: "1.8",
        }}
      >
        {content}
      </p>
    </div>
  );
}