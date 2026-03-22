"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NewsCard from "../../../components/NewsCard";
import { supabase } from "../../../lib/supabase";

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

export default function CompanyPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    async function fetchCompanyArticles() {
      const resolved = await params;
      const decodedName = decodeURIComponent(resolved.name);
      setCompanyName(decodedName);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("company", decodedName)
        .order("id", { ascending: false });

      if (error) {
        console.error("회사 기사 불러오기 실패:", error.message);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    }

    fetchCompanyArticles();
  }, [params]);

  const stats = useMemo(() => {
    return {
      total: articles.length,
      cb: articles.filter((a) => a.category === "CB").length,
      bw: articles.filter((a) => a.category === "BW").length,
      eb: articles.filter((a) => a.category === "EB").length,
      rights: articles.filter((a) => a.category === "유상증자").length,
      mezzanine: articles.filter((a) => a.category === "메자닌").length,
    };
  }, [articles]);

  return (
    <main
      style={{
        maxWidth: "1200px",
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
          Company Funding History
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
          {companyName || "회사"} 자금조달 히스토리
        </h1>

        <p
          style={{
            color: "#e2e8f0",
            lineHeight: "1.8",
            margin: 0,
            maxWidth: "820px",
            fontSize: "16px",
          }}
        >
          선택한 회사와 관련된 자금조달 기사만 모아서 보여주는 페이지입니다.
        </p>

        <div style={{ marginTop: "16px" }}>
          <Link
            href="/"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <StatCard label="전체 기사" value={stats.total} />
        <StatCard label="유상증자" value={stats.rights} />
        <StatCard label="CB" value={stats.cb} />
        <StatCard label="BW" value={stats.bw} />
        <StatCard label="EB" value={stats.eb} />
        <StatCard label="메자닌" value={stats.mezzanine} />
      </section>

      {loading ? (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "30px",
            backgroundColor: "#ffffff",
            color: "#64748b",
          }}
        >
          회사 기사 불러오는 중...
        </div>
      ) : articles.length === 0 ? (
        <div
          style={{
            border: "1px dashed #cbd5e1",
            borderRadius: "16px",
            padding: "30px",
            textAlign: "center",
            color: "#64748b",
            backgroundColor: "#ffffff",
          }}
        >
          이 회사와 관련된 기사가 없습니다.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px",
          }}
        >
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}