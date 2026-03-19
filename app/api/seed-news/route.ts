import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabase } from "../../../lib/supabase";

const parser = new Parser();

const RSS_URL =
  "https://news.google.com/rss/search?q=%EC%9C%A0%EC%83%81%EC%A6%9D%EC%9E%90+OR+%EC%A0%84%ED%99%98%EC%82%AC%EC%B1%84+OR+CB+OR+BW+OR+EB+OR+%EA%B5%90%ED%99%98%EC%82%AC%EC%B1%84+OR+%EC%8B%A0%EC%A3%BC%EC%9D%B8%EC%88%98%EA%B6%8C%EB%B6%80%EC%82%AC%EC%B1%84+OR+%EB%A9%94%EC%9E%90%EB%8B%8C+OR+RCPS+OR+CPS+OR+%EC%A0%9C3%EC%9E%90%EB%B0%B0%EC%A0%95+OR+%EC%A3%BC%EC%A3%BC%EB%B0%B0%EC%A0%95&hl=ko&gl=KR&ceid=KR:ko";

function guessCategory(text: string) {
  const lower = text.toLowerCase();

  // 1. BW 먼저 검사
  // "신주인수권부사채"는 사채라는 단어가 들어 있어서
  // 순서를 잘못 두면 CB로 잘못 들어갈 수 있음
  if (
    lower.includes("bw") ||
    lower.includes("신주인수권부사채")
  ) {
    return "BW";
  }

  // 2. EB 검사
  if (
    lower.includes("eb") ||
    lower.includes("교환사채")
  ) {
    return "EB";
  }

  // 3. CB 검사
  if (
    lower.includes("cb") ||
    lower.includes("전환사채")
  ) {
    return "CB";
  }

  // 4. 유상증자 검사
  if (
    lower.includes("유상증자") ||
    lower.includes("제3자배정") ||
    lower.includes("주주배정") ||
    lower.includes("일반공모")
  ) {
    return "유상증자";
  }

  // 5. 메자닌 검사
  if (
    lower.includes("rcps") ||
    lower.includes("cps") ||
    lower.includes("상환전환우선주") ||
    lower.includes("전환우선주") ||
    lower.includes("메자닌")
  ) {
    return "메자닌";
  }

  // 6. 그 외
  return "기타";
}

function guessMethod(text: string) {
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

  if (lower.includes("rcps")) {
    return "RCPS";
  }

  if (lower.includes("cps")) {
    return "CPS";
  }

  if (
    lower.includes("유상증자") ||
    lower.includes("제3자배정") ||
    lower.includes("주주배정") ||
    lower.includes("일반공모")
  ) {
    return "유상증자";
  }

  if (lower.includes("pre-ipo")) {
    return "Pre-IPO";
  }

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

  // 쉼표, 점, 특수기호 기준으로 앞쪽을 먼저 자름
  const firstChunk = cleaned.split(",")[0].split("…")[0].split(" - ")[0].trim();

  // 너무 일반적인 단어는 회사명으로 잡지 않기
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
    const feed = await parser.parseURL(RSS_URL);

    const rssArticles = (feed.items || []).slice(0, 10).map((item) => {
      const title = item.title || "제목 없음";
      const summary =
        item.contentSnippet || item.content || item.summary || "요약 없음";
      const link = item.link || "";
      const source = feed.title || "Google News RSS";
      const date = item.pubDate
        ? new Date(item.pubDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

      const combinedText = `${title} ${summary}`.replace(/\s+/g, " ").trim();

      return {
        company: guessCompany(title),
        amount: guessAmount(combinedText),
        method: guessMethod(combinedText),
        category: guessCategory(combinedText),
        source,
        date,
        title,
        summary,
        content: summary,
        link,
      };
    });

    const { data: existingArticles, error: selectError } = await supabase
      .from("articles")
      .select("title, link");

    if (selectError) {
      return NextResponse.json(
        { success: false, message: selectError.message },
        { status: 500 }
      );
    }

    const existing = existingArticles || [];

    const filteredArticles = rssArticles.filter((article) => {
      const duplicated = existing.some((item) => {
        const sameLink = item.link === article.link;
        const sameTitle =
          item.title.trim().toLowerCase() === article.title.trim().toLowerCase();

        return sameLink || sameTitle;
      });

      return !duplicated;
    });

    if (filteredArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "새로 추가할 RSS 기사가 없어요. 모두 중복 기사예요.",
        count: 0,
      });
    }

    const { error: insertError } = await supabase
      .from("articles")
      .insert(filteredArticles);

    if (insertError) {
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "RSS 기사 가져오기가 완료됐어요.",
      count: filteredArticles.length,
    });
  } catch (error) {
    console.error("RSS import error:", error);

    return NextResponse.json(
      { success: false, message: "RSS 기사 가져오기 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}