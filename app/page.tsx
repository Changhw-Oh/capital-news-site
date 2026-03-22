"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NewsCard from "../components/NewsCard";
import SearchBox from "../components/SearchBox";
import CategoryFilter from "../components/CategoryFilter";
import SortBox from "../components/SortBox";
import { supabase } from "../lib/supabase";

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

const categories = ["전체", "유상증자", "CB", "BW", "EB", "메자닌", "기타"];

function getLast7DaysDates() {
  const dates: string[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

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

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortType, setSortType] = useState("latest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);
  const last7Days = useMemo(() => getLast7DaysDates(), []);

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("기사 불러오기 실패:", error.message);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    }

    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      const searchTarget =
        `${article.title} ${article.summary} ${article.source} ${article.company} ${article.amount} ${article.method}`.toLowerCase();

      const matchesSearch = searchTarget.includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === "전체" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];

    if (sortType === "latest") {
      sorted.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    } else if (sortType === "oldest") {
      sorted.sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
    } else if (sortType === "amount_desc") {
      sorted.sort(
        (a, b) => parseAmountToEok(b.amount) - parseAmountToEok(a.amount)
      );
    } else if (sortType === "company_asc") {
      sorted.sort((a, b) => a.company.localeCompare(b.company, "ko"));
    }

    return sorted;
  }, [articles, searchText, selectedCategory, sortType]);

  const todayArticles = useMemo(() => {
    return articles
      .filter((article) => article.date === today)
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }, [articles, today]);

  const weeklyMezzanineArticles = useMemo(() => {
    return articles
      .filter(
        (article) =>
          article.category === "메자닌" && last7Days.includes(article.date)
      )
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }, [articles, last7Days]);

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
          Capital Market Funding News
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
          자금조달 뉴스 허브
        </h1>

        <p
          style={{
            color: "#e2e8f0",
            lineHeight: "1.8",
            margin: 0,
            maxWidth: "800px",
            fontSize: "16px",
          }}
        >
          유상증자, CB, BW, EB, 메자닌, 투자유치 관련 기사를 한 곳에서 모아보고
          검색과 카테고리 필터, 정렬 기능으로 빠르게 확인할 수 있는 자본시장 뉴스 사이트입니다.
        </p>
      </section>

      <section
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <SearchBox value={searchText} onChange={setSearchText} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <SortBox value={sortType} onChange={setSortType} />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      <PreviewSection
        title="오늘의 자금조달 뉴스"
        href="/today"
        description="오늘 날짜로 저장된 기사 중 최신 3건을 미리 보여줍니다."
        articles={todayArticles}
      />

      <PreviewSection
        title="이번 주 메자닌 이슈"
        href="/weekly"
        description="최근 7일 기준 메자닌 기사 중 최신 3건을 미리 보여줍니다."
        articles={weeklyMezzanineArticles}
      />

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
          전체 자금조달 기사
        </h2>

        <span
          style={{
            fontSize: "14px",
            color: "#64748b",
            fontWeight: "bold",
          }}
        >
          총 {filteredArticles.length}건
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
          기사 불러오는 중...
        </div>
      ) : filteredArticles.length === 0 ? (
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
          검색 결과가 없습니다.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px",
          }}
        >
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}

function PreviewSection({
  title,
  href,
  description,
  articles,
}: {
  title: string;
  href: string;
  description: string;
  articles: Article[];
}) {
  return (
    <section style={{ marginBottom: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#0f172a",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "6px 0 0 0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            {description}
          </p>
        </div>

        <Link
          href={href}
          style={{
            textDecoration: "none",
            color: "#1d4ed8",
            fontWeight: "bold",
          }}
        >
          더 보기
        </Link>
      </div>

      {articles.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px dashed #cbd5e1",
            borderRadius: "16px",
            padding: "22px",
            color: "#64748b",
          }}
        >
          표시할 기사가 없습니다.
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
    </section>
  );
}