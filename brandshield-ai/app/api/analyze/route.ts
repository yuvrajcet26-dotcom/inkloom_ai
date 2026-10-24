import { NextRequest, NextResponse } from "next/server";
import { ServerBrandEngine } from "@/lib/ai/server-engine";
import { ServerDatabase } from "@/lib/db/adapter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, brandId, title, contentType, channel, content } = body;

    if (!content || !brandId) {
      return NextResponse.json({ error: "Content and brandId are required." }, { status: 400 });
    }

    const brand = ServerDatabase.getBrandById(brandId);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }

    const result = await ServerBrandEngine.analyze({
      submissionId: submissionId || "temp-" + Date.now(),
      brand,
      title: title || "Untitled Submission",
      contentType: contentType || "press_release",
      channel: channel || "Web",
      content,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
