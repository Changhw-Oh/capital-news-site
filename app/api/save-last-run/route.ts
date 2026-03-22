import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST() {
  const now = new Date().toISOString();

  const { error } = await supabase.from("system_logs").insert([
    {
      type: "last_run",
      value: now,
    },
  ]);

  if (error) {
    console.error("save-last-run error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}