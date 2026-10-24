/**
 * Real Server-side Document and File Extraction Utility
 */
export class DocumentParser {
  /**
   * Extracts text from buffer based on mime type or filename
   */
  public static async extractText(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    // 1. Plain text / Markdown
    if (ext === "txt" || ext === "md" || mimeType.includes("text/")) {
      return buffer.toString("utf-8");
    }

    // 2. DOCX Parser (Extracts plain text from standard OpenXML word/document.xml)
    if (ext === "docx" || mimeType.includes("wordprocessingml")) {
      return this.extractFromDocx(buffer);
    }

    // 3. PDF Text Parser
    if (ext === "pdf" || mimeType.includes("pdf")) {
      return this.extractFromPdf(buffer);
    }

    // 4. Default fallback: text decode with header
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\t\r\n]/g, " ");
  }

  /**
   * Extracts readable text from OpenXML DOCX archive
   */
  private static extractFromDocx(buffer: Buffer): string {
    const raw = buffer.toString("binary");
    // Look for XML paragraph and text tags (<w:t>...</w:t>)
    const textMatches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (textMatches && textMatches.length > 0) {
      return textMatches
        .map((m) => m.replace(/<[^>]+>/g, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
    // Fallback: clean ASCII printable characters
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, " ").replace(/\s{2,}/g, " ").trim();
  }

  /**
   * Extracts stream text from PDF objects
   */
  private static extractFromPdf(buffer: Buffer): string {
    const raw = buffer.toString("binary");
    // Extract text enclosed in PDF BT ... ET blocks and parentheses (text strings)
    const textBlocks: string[] = [];
    const streamRegex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = streamRegex.exec(raw)) !== null) {
      if (match[1] && match[1].length > 1) {
        textBlocks.push(match[1]);
      }
    }

    if (textBlocks.length > 0) {
      return textBlocks.join(" ").replace(/\\([()\\])/g, "$1").trim();
    }

    // Fallback stream text extraction
    const rawAscii = buffer.toString("latin1").replace(/[^\x20-\x7E\n]/g, " ");
    return rawAscii.replace(/\s{2,}/g, " ").slice(0, 3000).trim();
  }
}
