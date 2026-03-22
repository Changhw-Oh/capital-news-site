"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const emptyForm = {
  company: "",
  amount: "",
  method: "",
  category: "",
  source: "",
  date: "",
  title: "",
  summary: "",
  content: "",
  link: "",
};

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [reprocessing, setReprocessing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("관리자 기사 불러오기 실패:", error.message);
    } else {
      setArticles(data || []);
    }

    setLoading(false);
  }

async function fetchLastRun() {
  const { data } = await supabase
    .from("system_logs")
    .select("*")
    .eq("type", "last_run")
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    setLastRun(data[0].value);
  }
}


useEffect(() => {
  fetchArticles();
  fetchLastRun();
}, []);


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);
    setMessage("");
    setForm({
      company: article.company,
      amount: article.amount,
      method: article.method,
      category: article.category,
      source: article.source,
      date: article.date,
      title: article.title,
      summary: article.summary,
      content: article.content,
      link: article.link,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (editingId === null) {
      const { error } = await supabase.from("articles").insert([form]);

      if (error) {
        console.error("기사 저장 실패:", error.message);
        setMessage("기사 저장에 실패했어요.");
      } else {
        setMessage("기사 저장이 완료됐어요.");
        setForm(emptyForm);
        fetchArticles();
      }
    } else {
      const { error } = await supabase
        .from("articles")
        .update(form)
        .eq("id", editingId);

      if (error) {
        console.error("기사 수정 실패:", error.message);
        setMessage("기사 수정에 실패했어요.");
      } else {
        setMessage("기사 수정이 완료됐어요.");
        setForm(emptyForm);
        setEditingId(null);
        fetchArticles();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: number) {
    const ok = window.confirm("정말 이 기사를 삭제할까요?");
    if (!ok) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      console.error("기사 삭제 실패:", error.message);
      alert("기사 삭제에 실패했어요.");
    } else {
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      alert("기사가 삭제됐어요.");
      fetchArticles();
    }
  }

  async function handleImportNews() {
  setImporting(true);
  setMessage("");

  try {
    const response = await fetch("/api/seed-news", {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(`자동 가져오기 실패: ${result.message}`);
    } else {
      await fetch("/api/save-last-run", {
        method: "POST",
      });

fetchLastRun();

      setMessage(`자동 가져오기 성공: ${result.count}개 기사 추가`);
      fetchArticles();
      fetchLastRun();
    }
  } catch (error) {
    console.error(error);
    setMessage("자동 가져오기 중 오류가 발생했어요.");
  }

  setImporting(false);
}



async function handleReprocessNews() {
  setReprocessing(true);
  setMessage("");

  try {
    const response = await fetch("/api/reprocess-news", {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(`기존 기사 다시 정리 실패: ${result.message}`);
    } else {
      setMessage(`기존 기사 다시 정리 성공: ${result.count}개 기사 업데이트`);
      fetchArticles();
      fetchLastRun();
    }
  } catch (error) {
    console.error(error);
    setMessage("기존 기사 다시 정리 중 오류가 발생했어요.");
  }

  setReprocessing(false);
}



  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          marginBottom: "24px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
          Admin Page
        </p>

      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px" }}>
  관리자 페이지
</h1>

        <p style={{ color: "#475569", lineHeight: "1.7", margin: 0 }}>
          기사 추가, 수정, 삭제, 자동 가져오기가 가능한 페이지입니다.
        </p>

{lastRun && (
  <p style={{ marginTop: "10px", color: "#64748b", fontSize: "14px" }}>
    마지막 자동수집: {new Date(lastRun).toLocaleString()}
  </p>
)}

        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

          <button
            type="button"
            onClick={handleImportNews}
            disabled={importing}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#059669",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {importing ? "가져오는 중..." : "기사 자동 가져오기"}
          </button>

          <button
            type="button"
            onClick={handleReprocessNews}
            disabled={reprocessing}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {reprocessing ? "정리 중..." : "기존 기사 다시 정리하기"}
          </button>
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px", fontSize: "24px" }}>
          {editingId === null ? "새 기사 추가" : `기사 수정 중 (ID: ${editingId})`}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <InputBox label="회사명" name="company" value={form.company} onChange={handleChange} />
            <InputBox label="조달금액" name="amount" value={form.amount} onChange={handleChange} />
            <InputBox label="방식" name="method" value={form.method} onChange={handleChange} />
            <InputBox label="카테고리" name="category" value={form.category} onChange={handleChange} />
            <InputBox label="언론사" name="source" value={form.source} onChange={handleChange} />
            <InputBox label="날짜" name="date" value={form.date} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>제목</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>요약</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={3}
              style={textareaStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>본문</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              style={textareaStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>원문 링크</label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {saving
                ? "저장 중..."
                : editingId === null
                ? "기사 저장하기"
                : "기사 수정 완료"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#334155",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                수정 취소
              </button>
            )}
          </div>

          {message && (
            <p style={{ marginTop: "12px", color: "#475569" }}>
              {message}
            </p>
          )}
        </form>
      </div>

      {loading ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            color: "#64748b",
          }}
        >
          기사 목록 불러오는 중...
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>회사명</th>
                <th style={thStyle}>조달금액</th>
                <th style={thStyle}>방식</th>
                <th style={thStyle}>카테고리</th>
                <th style={thStyle}>제목</th>
                <th style={thStyle}>날짜</th>
                <th style={thStyle}>관리</th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td style={tdStyle}>{article.id}</td>
                  <td style={tdStyle}>{article.company}</td>
                  <td style={tdStyle}>{article.amount}</td>
                  <td style={tdStyle}>{article.method}</td>
                  <td style={tdStyle}>{article.category}</td>
                  <td style={tdStyle}>{article.title}</td>
                  <td style={tdStyle}>{article.date}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleEdit(article)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        수정
                      </button>

                      <button
                        onClick={() => handleDelete(article.id)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: "#dc2626",
                          color: "#ffffff",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function InputBox({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  color: "#334155",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#334155",
};

const tdStyle: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#475569",
  verticalAlign: "top",
};