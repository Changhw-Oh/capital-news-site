import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("date", today)
      .order("id", { ascending: false })
      .limit(12);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const articles = data || [];

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        summary: "오늘 날짜로 저장된 기사가 아직 없습니다.",
        bullets: [],
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const articleText = articles
      .map((article, index) => {
        return [
          `기사 ${index + 1}`,
          `제목: ${article.title}`,
          `회사명: ${article.company}`,
          `금액: ${article.amount}`,
          `방식: ${article.method}`,
          `카테고리: ${article.category}`,
          `요약: ${article.summary}`,
        ].join("\n");
      })
      .join("\n\n");

    const prompt = `
너는 한국 자본시장 자금조달 뉴스를 요약하는 편집자다.
아래 오늘 기사들을 읽고, 다음 형식의 JSON만 출력해라.

{
  "summary": "오늘 핵심을 2~3문장으로 요약",
  "bullets": ["핵심포인트1", "핵심포인트2", "핵심포인트3"]
}

조건:
- 한국어로 작성
- 너무 장황하지 않게
- 유상증자, CB, BW, EB, 메자닌, 투자유치 흐름 중심으로 정리
- 회사명과 금액이 보이면 반영
- 절대로 JSON 바깥의 문장을 쓰지 말 것

기사 목록:
${articleText}
`;

    const response = await openai.responses.create({
      model: process.env.OPENAI_SUMMARY_MODEL || "gpt-5-mini",
      input: prompt,
    });

    const text = response.output_text;

    let parsed: { summary: string; bullets: string[] } | null = null;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        summary: text || "오늘 기사 요약을 생성하지 못했습니다.",
        bullets: [],
      };
    }

    return NextResponse.json({
      success: true,
      summary: parsed.summary,
      bullets: parsed.bullets || [],
    });
  } catch (error) {
    console.error("today-summary error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "AI 요약 생성 중 오류가 발생했어요.",
      },
      { status: 500 }
    );
  }
}