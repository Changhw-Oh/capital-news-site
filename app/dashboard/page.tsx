"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const PIE_COLORS = ["#2563eb", "#0f172a", "#7c3aed", "#dc2626", "#059669"];

function parseAmountToEok(amount: string) {
  if (!amount || amount === "미확인") return 0;

  const cleaned = amount.replace(/\s/g, "");

  const joMatch = cleaned.match(/([\d,.]+)조원?/);
  if (joMatch) {
    return Number(joMatch[1].replace(/,/g, "")) * 10000;
  }

  const eokMatch = cleaned.match(/([\d,.]+)억원?/);
  if (eokMatch) {
    return Number(eokMatch[1].replace(/,/g, ""));
  }

  const wonMatch = cleaned.match(/([\d,.]+)원/);
  if (wonMatch) {
    const won = Number(wonMatch[1].replace(/,/g, ""));
    return won / 100000000;
  }

  return 0;
}

function formatEok(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}조원`;
  }

  return `${value.toLocaleString()}억원`;
}

function getLast7Days() {
  const dates: string[] = [];

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("대시보드 기사 불러오기 실패:", error.message);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    }

    fetchArticles();
  }, []);

  const stats = useMemo(() => {
    const total = articles.length;
    const todayArticles = articles.filter((a) => a.date === today);
    const mezzanineArticles = articles.filter((a) => a.category === "메자닌");

    const todayCount = todayArticles.length;
    const mezzanineCount = mezzanineArticles.length;
    const cbCount = articles.filter((a) => a.category === "CB").length;
    const bwCount = articles.filter((a) => a.category === "BW").length;
    const ebCount = articles.filter((a) => a.category === "EB").length;
    const rightsCount = articles.filter((a) => a.category === "유상증자").length;

    const totalAmountEok = articles.reduce(
      (sum, article) => sum + parseAmountToEok(article.amount),
      0
    );

    const todayAmountEok = todayArticles.reduce(
      (sum, article) => sum + parseAmountToEok(article.amount),
      0
    );

    const mezzanineAmountEok = mezzanineArticles.reduce(
      (sum, article) => sum + parseAmountToEok(article.amount),
      0
    );

    return {
      total,
      todayCount,
      mezzanineCount,
      cbCount,
      bwCount,
      ebCount,
      rightsCount,
      totalAmountEok,
      todayAmountEok,
      mezzanineAmountEok,
    };
  }, [articles, today]);

  const categoryChartData = useMemo(() => {
    return [
      { name: "유상증자", count: stats.rightsCount },
      { name: "CB", count: stats.cbCount },
      { name: "BW", count: stats.bwCount },
      { name: "EB", count: stats.ebCount },
      { name: "메자닌", count: stats.mezzanineCount },
    ];
  }, [stats]);

  const categoryPieData = useMemo(() => {
    return [
      { name: "유상증자", value: stats.rightsCount },
      { name: "CB", value: stats.cbCount },
      { name: "BW", value: stats.bwCount },
      { name: "EB", value: stats.ebCount },
      { name: "메자닌", value: stats.mezzanineCount },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const topCompanies = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const article of articles) {
      const company = article.company || "미확인";
      counts[company] = (counts[company] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [articles]);

  const topCompanyAmounts = useMemo(() => {
    const sums: Record<string, number> = {};

    for (const article of articles) {
      const company = article.company || "미확인";
      const amount = parseAmountToEok(article.amount);

      sums[company] = (sums[company] || 0) + amount;
    }

    return Object.entries(sums)
      .map(([company, amount]) => ({ company, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [articles]);

  const dailyTrendData = useMemo(() => {
    const dates = getLast7Days();

    return dates.map((date) => {
      const count = articles.filter((article) => article.date === date).length;

      return {
        date,
        count,
      };
    });
  }, [articles]);

  const latestArticles = useMemo(() => {
    return articles.slice(0, 5);
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
          Funding News Dashboard
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
          통계 대시보드
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
          전체 기사 흐름, 카테고리별 기사 수, 회사별 기사 수와 누적 조달금액을 한눈에 보는 페이지입니다.
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
          대시보드 불러오는 중...
        </div>
      ) : (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <StatCard label="전체 기사 수" value={stats.total} />
            <StatCard label="오늘 기사 수" value={stats.todayCount} />
            <StatCard label="메자닌 기사 수" value={stats.mezzanineCount} />
            <StatCard label="전체 조달금액" value={formatEok(stats.totalAmountEok)} />
            <StatCard label="오늘 조달금액" value={formatEok(stats.todayAmountEok)} />
            <StatCard label="메자닌 조달금액" value={formatEok(stats.mezzanineAmountEok)} />
            <StatCard label="유상증자" value={stats.rightsCount} />
            <StatCard label="CB" value={stats.cbCount} />
            <StatCard label="BW" value={stats.bwCount} />
            <StatCard label="EB" value={stats.ebCount} />
          </section>

          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
              카테고리별 기사 수
            </h2>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
              최근 7일 기사 수 추이
            </h2>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
              카테고리 비중
            </h2>

            {categoryPieData.length === 0 ? (
              <p style={{ color: "#64748b", margin: 0 }}>표시할 데이터가 없습니다.</p>
            ) : (
              <div style={{ width: "100%", height: "360px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr",
              gap: "18px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "22px",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
                최근 기사 5건
              </h2>

              {latestArticles.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>기사가 없습니다.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {latestArticles.map((article) => (
                    <div
                      key={article.id}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: "12px",
                      }}
                    >
                      <Link
                        href={`/article/${article.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#0f172a",
                          fontWeight: "bold",
                          lineHeight: "1.6",
                        }}
                      >
                        {article.title}
                      </Link>

                      <div
                        style={{
                          marginTop: "6px",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        {article.company} · {article.category} · {article.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "22px",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
                회사별 기사 수 TOP 10
              </h2>

              {topCompanies.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>데이터가 없습니다.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {topCompanies.map((item, index) => (
                    <div
                      key={`${item.company}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: "10px",
                      }}
                    >
                      <Link
                        href={`/company/${encodeURIComponent(item.company)}`}
                        style={{
                          textDecoration: "none",
                          color: "#0f172a",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}. {item.company}
                      </Link>

                      <span
                        style={{
                          color: "#64748b",
                          fontWeight: "bold",
                        }}
                      >
                        {item.count}건
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "22px",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#0f172a" }}>
                회사별 누적 조달금액 TOP 10
              </h2>

              {topCompanyAmounts.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>데이터가 없습니다.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {topCompanyAmounts.map((item, index) => (
                    <div
                      key={`${item.company}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: "10px",
                      }}
                    >
                      <Link
                        href={`/company/${encodeURIComponent(item.company)}`}
                        style={{
                          textDecoration: "none",
                          color: "#0f172a",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}. {item.company}
                      </Link>

                      <span
                        style={{
                          color: "#64748b",
                          fontWeight: "bold",
                        }}
                      >
                        {formatEok(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
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