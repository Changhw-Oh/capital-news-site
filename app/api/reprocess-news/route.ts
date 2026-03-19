import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

function guessCategory(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("bw") || lower.includes("신주인수권부사채")) {
    return "BW";
  }

  if (lower.includes("eb") || lower.includes("교환사채")) {
    return "EB";
  }

  if (lower.includes("cb") || lower.includes("전환사채")) {
    return "CB";
  }

  if (
    lower.includes("유상증자") ||
    lower.includes("제3자배정") ||
    lower.includes("주주배정") ||
    lower.includes("일반공모")
  ) {
    return "유상증자";
  }

  if (
    lower.includes("rcps") ||
    lower.includes("cps") ||
    lower.includes("상환전환우선주") ||
    lower.includes("전환우선주") ||
    lower.includes("메자닌")
  ) {
    return "메자닌";
  }

  return "기타";
}

function guessMethod(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("bw") || lower.includes("신주인수권부사채")) return "BW";
  if (lower.includes("eb") || lower.includes("교환사채")) return "EB";
  if (lower.includes("cb") || lower.includes("전환사채")) return "CB";
  if (lower.includes("rcps")) return "RCPS";
  if (lower.includes("cps")) return "CPS";
  if (
    lower.includes("유상증자") ||
    lower.includes("제3자배정") ||
    lower.includes("주주배정") ||
    lower.includes("일반공모")
  ) {
    return "유상증자";
  }
  if (lower.includes("pre-ipo")) return "Pre-IPO";

  return "기타";
}

function guessAmount(text: string) {
  const patterns = [
    /(\d[\d,\.]*\s?(억원))/,
    /(\d[\d,\.]*\s?(억 원))/,
    /(\d[\d,\.]*\s?(조원))/,
    /(\d[\d,\.]*\s?(조 원))/,
    /(\d[\d,\.]*\s?(원))/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return "미확인";
}

function guessCompany(title: string) {
  const cleaned = title.replace(/[<>"'\[\]\(\)]/g, " ").trim();
  const firstChunk = cleaned.split(",")[0].split("…")[0].split(" - ")[0].trim();

  const stopWords = [
    "유상증자",
    "전환사채",
    "교환사채",
    "신주인수권부사채",
    "메자닌",
    "기사",
    "뉴스",
  ];

  const words = firstChunk.split(" ").filter(Boolean);

  if (words.length === 0) {
    return "미확인";
  }

  const firstWord = words[0];

  if (stopWords.includes(firstWord)) {
    return "미확인";
  }

  return firstWord;
}

export async function POST() {
  try {
    const { data: articles, error } = await supabase.from("articles").select("*");

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const rows = articles || [];

    let updatedCount = 0;

    for (const article of rows) {
      const combinedText = `${article.title} ${article.summary} ${article.content}`
        .replace(/\s+/g, " ")
        .trim();

      const newValues = {
        category: guessCategory(combinedText),
        method: guessMethod(combinedText),
        amount: guessAmount(combinedText),
        company: guessCompany(article.title),
      };

      const { error: updateError } = await supabase
        .from("articles")
        .update(newValues)
        .eq("id", article.id);

      if (!updateError) {
        updatedCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      message: "기존 기사 다시 정리가 완료됐어요.",
      count: updatedCount,
    });
  } catch (error) {
    console.error("reprocess-news API error:", error);

    return NextResponse.json(
      { success: false, message: "기존 기사 다시 정리 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}