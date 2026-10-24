import { NextRequest, NextResponse } from "next/server";
import { ServerDatabase } from "@/lib/db/adapter";

export async function GET() {
  const brands = ServerDatabase.getBrands();
  return NextResponse.json({ success: true, brands });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, actor } = body;

    if (!brand || !brand.name) {
      return NextResponse.json({ error: "Brand details are required." }, { status: 400 });
    }

    const saved = ServerDatabase.saveBrand(brand, actor || { id: "sys", name: "System Admin", role: "admin" });
    return NextResponse.json({ success: true, brand: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save brand." }, { status: 500 });
  }
}
