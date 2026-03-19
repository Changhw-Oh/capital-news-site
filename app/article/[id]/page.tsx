import Link from "next/link";
import { articles } from "../../../data/articles";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = articles.find((item) => item.id === Number(id));

  if (!article) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
            기사를 찾을 수 없습니다.
          </h1>

          <Link href="/" style={{ color: "#1d4ed8", textDecoration: "none" }}>
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
            marginBottom: "14px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: "bold",
            }}
          >
            {article.category}
          </span>

          <span>{article.source}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            lineHeight: "1.4",
            color: "#0f172a",
            marginTop: 0,
            marginBottom: "16px",
          }}
        >
          {article.title}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            회사명: {article.company}
          </span>

          <span
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            조달금액: {article.amount}
          </span>

          <span
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            방식: {article.method}
          </span>
        </div>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#475569",
            marginTop: 0,
            marginBottom: "24px",
          }}
        >
          {article.summary}
        </p>

        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: "24px",
            color: "#334155",
            lineHeight: "1.9",
            fontSize: "17px",
            marginBottom: "24px",
          }}
        >
          {article.content}
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            홈으로 돌아가기
          </Link>

          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#1d4ed8",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            원문 보기
          </a>
        </div>
      </div>
    </main>
  );
}