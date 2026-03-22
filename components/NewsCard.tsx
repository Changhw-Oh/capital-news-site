import Link from "next/link";

type Article = {
  id: number;
  company: string;
  amount: string;
  method: string;
  category: string;
  source: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  link: string;
};

export default function NewsCard({ article }: { article: Article }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "22px",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          marginBottom: "12px",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <span
          style={{
            padding: "5px 10px",
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

      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginTop: 0,
          marginBottom: "12px",
          lineHeight: "1.5",
        }}
      >
        <Link
          href={`/article/${article.id}`}
          style={{
            color: "#0f172a",
            textDecoration: "none",
          }}
        >
          {article.title}
        </Link>
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
       
       <Link
        href={`/company/${encodeURIComponent(article.company)}`}
       style={{ textDecoration: "none" }}
         >
       <InfoBadge label="회사명" value={article.company} />
       </Link>
       
        <InfoBadge label="회사명" value={article.company} />
        <InfoBadge label="금액" value={article.amount} />
        <InfoBadge label="방식" value={article.method} />
      </div>

      <p
        style={{
          color: "#475569",
          lineHeight: "1.75",
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "15px",
        }}
      >
        {article.summary}
      </p>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <Link
          href={`/article/${article.id}`}
          style={{
            color: "#0f172a",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          상세 보기
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
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <span
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "7px 10px",
        fontSize: "13px",
        color: "#334155",
        fontWeight: "bold",
      }}
    >
      {label}: {value}
    </span>
  );
}