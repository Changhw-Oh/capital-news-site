import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const baseUrl = new URL(request.url).origin;

    const importResponse = await fetch(`${baseUrl}/api/seed-news`, {
      method: "POST",
    });
    const importResult = await importResponse.json();

    const reprocessResponse = await fetch(`${baseUrl}/api/reprocess-news`, {
      method: "POST",
    });
    const reprocessResult = await reprocessResponse.json();

await fetch(`${baseUrl}/api/save-last-run`, {
  method: "POST",
});

    return NextResponse.json({
      success: true,
      message: "하루 1번 자동수집이 완료됐어요.",
      importResult,
      reprocessResult,
    });
  } catch (error) {
    console.error("daily-import error:", error);

    return NextResponse.json(
      { success: false, message: "자동수집 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}