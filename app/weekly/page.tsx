"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NewsCard from "../../components/NewsCard";
import { supabase } from "../../lib/supabase";

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

function getLast7DaysDates() {
  const dates: string[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

export default function WeeklyPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const last7Days = useMemo(() => getLast7DaysDates(), []);

  useEffect(() => {
    async function fetchWeeklyMezzanineArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", "메자닌")
        .order("id", { ascending: false });

      if (error) {
        console.error("이번 주 메자닌 기사 불러오기 실패:", error.message);
      } else {
        const filtered = (data || []).filter((article) =>
          last7Days.includes(article.date)
        );
        setArticles(filtered);
      }

      setLoading(false);
    }

    fetchWeeklyMezzanineArticles();
  }, [last7Days]);

  const stats = useMemo(() => {
    return {
      total: articles.length,
      rcps: articles.filter((a) => a.method === "RCPS").length,
      cps: articles.filter((a) => a.method === "CPS").length,
      other: articles.filter(
        (a) => a.method !== "RCPS" && a.method !== "CPS"
      ).length,
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
          background: "linear-gradient(135deg, #312e81 0%, #4c1d95 100%)",
          color: "#ffffff",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(49, 46, 129, 0.2)",
        }}
      >
        <p
          style={{
            color: "#ddd6fe",
            fontSize: "14px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          Weekly Mezzanine Issues
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
          이번 주 메자닌 이슈
        </h1>

        <p
          style={{
            color: "#ede9fe",
            lineHeight: "1.8",
            margin: 0,
            maxWidth: "820px",
            fontSize: "16px",
          }}
        >
          최근 7일 동안 저장된 메자닌 관련 기사만 따로 모아보는 페이지입니다.
          RCPS, CPS, 전환우선주, 메자닌 구조 관련 흐름을 빠르게 확인할 수 있어요.
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
        <StatCard label="전체 메자닌 기사" value={stats.total} />
        <StatCard label="RCPS" value={stats.rcps} />
        <StatCard label="CPS" value={stats.cps} />
        <StatCard label="기타 메자닌" value={stats.other} />
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#0f172a",
          }}
        >
          최근 7일 메자닌 기사
        </h2>

        <span
          style={{
            fontSize: "14px",
            color: "#64748b",
            fontWeight: "bold",
          }}
        >
          최근 7일 기준
        </span>
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
          이번 주 메자닌 기사 불러오는 중...
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
          최근 7일 기준 메자닌 기사가 없습니다.
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