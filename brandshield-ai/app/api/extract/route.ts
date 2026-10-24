import { NextRequest, NextResponse } from "next/server";
import { DocumentParser } from "@/lib/extraction/parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractedText = await DocumentParser.extractText(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      text: extractedText,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to extract document text." }, { status: 500 });
  }
}
