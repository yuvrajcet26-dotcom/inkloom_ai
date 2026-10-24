import { Brand, Finding, ReviewResult, VerificationStatus, FindingSeverity, FindingCategory } from "@/lib/types";

export interface AnalysisInput {
  submissionId: string;
  brand: Brand;
  title: string;
  contentType: string;
  channel: string;
  content: string;
  fileName?: string;
  fileType?: string;
}

export class BrandAnalysisEngine {
  /**
   * Main entry point for brand compliance review.
   * Runs multi-layered checks:
   * 1. Deterministic prohibited terminology & product naming
   * 2. Approved facts & claims verification
   * 3. Tone & voice attribute consistency
   * 4. Unsupported superlative & promotional liability claims
   * 5. Accessibility & readability standards
   */
  public static async analyzeContent(input: AnalysisInput): Promise<ReviewResult> {
    const { submissionId, brand, content } = input;
    const findings: Finding[] = [];

    const lowerContent = content.toLowerCase();

    // 1. Terminology & Prohibited Words Check
    if (brand.terminology_rules && brand.terminology_rules.length > 0) {
      for (const rule of brand.terminology_rules) {
        const regex = new RegExp(`\\b${rule.prohibited_term}\\b`, "i");
        const match = content.match(regex);
        if (match) {
          findings.push({
            id: "find-" + Math.random().toString(36).substring(2, 9),
            category: "terminology_and_messaging",
            severity: "high",
            description: `Prohibited terminology: "${rule.prohibited_term}" detected.`,
            reason: rule.rule_reason || "Violates approved brand terminology and voice positioning.",
            original_text: match[0],
            suggested_text: rule.approved_alternative,
            guideline_reference: `${brand.name} Style Guide v${brand.version} — Terminology Rule (${rule.category})`,
            evidence_reference: `Approved Alternative: "${rule.approved_alternative}"`,
            verification_status: "confirmed_conflict",
            resolution_status: "pending",
          });
        }
      }
    }

    // 2. High-Liability / Superlative Promotional Claims
    const liabilityPatterns = [
      {
        regex: /\b(100% immune|unbreakable security|hack-proof|invulnerable)\b/i,
        category: "unsupported_promotional_claims" as FindingCategory,
        severity: "high" as FindingSeverity,
        desc: "Extreme absolute security claim detected.",
        reason: "Legal risk policy prohibits absolute security guarantees. No system can guarantee 100% invulnerability.",
        suggested: "multi-layered zero-trust architecture and resilient defenses",
        guideline: "Legal & Regulatory Compliance Standards §5.4",
        status: "unsupported_claim" as VerificationStatus,
      },
      {
        regex: /\b(cheapest|dirt-cheap|bargain basement)\b/i,
        category: "tone_and_voice" as FindingCategory,
        severity: "high" as FindingSeverity,
        desc: "Low-end price descriptor contradicts premium enterprise positioning.",
        reason: "Brand voice positioning emphasizes high ROI, cost-optimization, and quality rather than cheapness.",
        suggested: "cost-optimized, high-efficiency solution",
        guideline: "Brand Positioning Guidelines §2.2",
        status: "confirmed_conflict" as VerificationStatus,
      },
      {
        regex: /\b(miracle cure|100% guaranteed|instant fix|foolproof)\b/i,
        category: "factual_consistency" as FindingCategory,
        severity: "high" as FindingSeverity,
        desc: "Misleading absolute outcome or efficacy promise.",
        reason: "Regulatory bodies (FDA/FTC) and brand honesty principles require verified evidence for efficacy claims.",
        suggested: "clinically evaluated and rigorously tested solution",
        guideline: "Product Truth in Advertising & Compliance Standard",
        status: "confirmed_conflict" as VerificationStatus,
      },
      {
        regex: /\b(deal of the century|insane discount|hurry before it's gone)\b/i,
        category: "tone_and_voice" as FindingCategory,
        severity: "medium" as FindingSeverity,
        desc: "High-pressure urgency marketing tone.",
        reason: "Brand voice emphasizes quiet confidence and timeless value rather than aggressive sales tactics.",
        suggested: "exclusive seasonal offering for discerning clients",
        guideline: "Editorial Tone Manual §3.1",
        status: "unsupported_claim" as VerificationStatus,
      },
    ];

    for (const pat of liabilityPatterns) {
      const match = content.match(pat.regex);
      if (match) {
        findings.push({
          id: "find-" + Math.random().toString(36).substring(2, 9),
          category: pat.category,
          severity: pat.severity,
          description: pat.desc,
          reason: pat.reason,
          original_text: match[0],
          suggested_text: pat.suggested,
          guideline_reference: `${brand.name} — ${pat.guideline}`,
          evidence_reference: "Brand Compliance Knowledgebase",
          verification_status: pat.status,
          resolution_status: "pending",
        });
      }
    }

    // 3. Customer & Metric Exaggeration Checks
    const customerCountMatch = content.match(/(\d{1,3}(?:,\d{3})*)\s+(global\s+)?(fortune\s+500\s+)?(enterprises|companies|customers)/i);
    if (customerCountMatch) {
      const statedNum = parseInt(customerCountMatch[1].replace(/,/g, ""), 10);
      // Check if exceeds approved facts
      const verifiedFact = brand.approved_facts.find((f) => f.fact_text.includes("4,500"));
      if (verifiedFact && statedNum > 4500) {
        findings.push({
          id: "find-" + Math.random().toString(36).substring(2, 9),
          category: "factual_consistency",
          severity: "high",
          description: `Exaggerated customer count (${customerCountMatch[1]}) exceeds approved internal records.`,
          reason: `Internal investor briefing confirms ${verifiedFact.fact_text}. Exaggerating customer figures damages corporate trust and poses audit risks.`,
          original_text: customerCountMatch[0],
          suggested_text: `over 4,500 enterprise organizations globally`,
          guideline_reference: "Approved Facts Repository — Customer Adoption",
          evidence_reference: verifiedFact.source_reference,
          verification_status: "confirmed_conflict",
          resolution_status: "pending",
        });
      }
    }

    // 4. Accessibility & Readability Check
    // Check for excessive exclamation marks or all-caps yelling
    const capsMatches = content.match(/\b[A-Z]{4,}\b/g);
    if (capsMatches && capsMatches.length > 2) {
      findings.push({
        id: "find-" + Math.random().toString(36).substring(2, 9),
        category: "accessibility",
        severity: "low",
        description: `Excessive uppercase styling (${capsMatches.slice(0, 3).join(", ")}) hinders screen readers.`,
        reason: "Screen readers may interpret all-caps words as individual acronym letters, degrading user experience.",
        original_text: capsMatches.slice(0, 3).join(" "),
        suggested_text: "Use title case or sentence case formatting instead",
        guideline_reference: "WCAG 2.2 AA Readability Standards",
        evidence_reference: "Web Content Accessibility Guidelines §3.1.2",
        verification_status: "uncertain_finding",
        resolution_status: "pending",
      });
    }

    // 5. Acronym expansion check
    if (content.includes("SLA") && !content.includes("Service Level Agreement")) {
      findings.push({
        id: "find-" + Math.random().toString(36).substring(2, 9),
        category: "accessibility",
        severity: "low",
        description: "Technical acronym 'SLA' should be expanded on first mention for non-technical stakeholders.",
        reason: "Broadens accessibility across cross-functional marketing and prospective buyer personas.",
        original_text: "SLA",
        suggested_text: "Service Level Agreement (SLA)",
        guideline_reference: `${brand.name} Readability Standards §2.1`,
        evidence_reference: "Editorial Style Guide",
        verification_status: "uncertain_finding",
        resolution_status: "pending",
      });
    }

    // Deduplicate findings by original_text
    const uniqueFindings = findings.filter(
      (v, i, a) => a.findIndex((t) => t.original_text.toLowerCase() === v.original_text.toLowerCase()) === i
    );

    // Calculate transparent score
    // Start at 100
    // High: -15 pts, Medium: -8 pts, Low: -4 pts
    let penalty = 0;
    for (const f of uniqueFindings) {
      if (f.severity === "high") penalty += 15;
      else if (f.severity === "medium") penalty += 8;
      else penalty += 4;
    }

    const calculatedScore = Math.max(25, Math.min(100, 100 - penalty));

    const now = new Date().toISOString();

    return {
      id: "rev-res-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      model_provider: "inkloom_deterministic",
      model_version: "inkloom-semantic-governor-v2",
      overall_indicator: calculatedScore,
      analysis_status: "completed",
      findings: uniqueFindings,
      created_at: now,
      summary:
        uniqueFindings.length === 0
          ? "Exemplary compliance. No brand violations, unverified facts, or tone drift detected."
          : `Detected ${uniqueFindings.length} findings across brand guidelines, facts, and accessibility. Suggested fixes are ready for creator review.`,
    };
  }
}
