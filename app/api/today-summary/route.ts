let parsed: { summary: string; bullets: string[] };

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