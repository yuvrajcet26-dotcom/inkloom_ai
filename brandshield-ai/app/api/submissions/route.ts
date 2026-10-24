import { NextRequest, NextResponse } from "next/server";
import { ServerDatabase } from "@/lib/db/adapter";

export async function GET() {
  const submissions = ServerDatabase.getSubmissions();
  return NextResponse.json({ success: true, submissions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand_id, brand_name, creator, title, content_type, channel, original_content, current_content, latest_review, assigned_reviewer } = body;

    if (!title || !original_content || !brand_id) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const created = ServerDatabase.createSubmission({
      brand_id,
      brand_name,
      creator,
      title,
      content_type: content_type || "press_release",
      channel: channel || "Web",
      original_content,
      current_content: current_content || original_content,
      status: "submitted_for_review",
      latest_review,
      assigned_reviewer,
    });

    return NextResponse.json({ success: true, submission: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create submission" }, { status: 500 });
  }
}
