export type UserRole = "admin" | "brand_manager" | "reviewer" | "creator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export type SubmissionStatus =
  | "draft"
  | "submitted_for_review"
  | "in_review"
  | "changes_requested"
  | "resubmitted"
  | "approved"
  | "rejected"
  | "archived";

export type FindingSeverity = "high" | "medium" | "low";

export type FindingCategory =
  | "tone_and_voice"
  | "terminology_and_messaging"
  | "factual_consistency"
  | "unsupported_promotional_claims"
  | "visual_consistency"
  | "accessibility"
  | "guideline_conflicts";

export type VerificationStatus =
  | "confirmed_conflict"
  | "unsupported_claim"
  | "uncertain_finding";

export type FindingResolution = "pending" | "accepted" | "rejected" | "custom_edited";

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  description: string;
  reason: string;
  original_text: string;
  suggested_text: string;
  guideline_reference: string;
  evidence_reference?: string;
  verification_status: VerificationStatus;
  resolution_status: FindingResolution;
}

export interface ReviewResult {
  id: string;
  submission_id: string;
  model_provider: "google_gemini" | "openai" | "inkloom_deterministic";
  model_version: string;
  overall_indicator: number; // 0-100 compliance score
  analysis_status: "completed" | "processing" | "failed";
  findings: Finding[];
  created_at: string;
  summary: string;
}

export interface ApprovedFact {
  id: string;
  brand_id: string;
  fact_text: string;
  source_reference: string;
  valid_from?: string;
  valid_until?: string;
  status: "active" | "deprecated";
}

export interface TerminologyRule {
  id: string;
  prohibited_term: string;
  approved_alternative: string;
  rule_reason: string;
  category: "product_naming" | "legal" | "tone" | "compliance";
}

export interface BrandAsset {
  id: string;
  brand_id: string;
  asset_name: string;
  asset_type: "logo" | "color_palette" | "font" | "icon" | "image";
  url_or_value: string;
  rules: string;
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tone_guidelines: {
    primary_tone: string;
    secondary_tones: string[];
    voice_attributes: { attribute: string; description: string }[];
    avoid_tones: string[];
  };
  terminology_rules: TerminologyRule[];
  approved_facts: ApprovedFact[];
  assets: BrandAsset[];
  accessibility_standards: string[];
  version: string;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  submission_id: string;
  version_number: number;
  content: string;
  created_by: string;
  created_at: string;
  change_summary?: string;
}

export interface Comment {
  id: string;
  submission_id: string;
  author: User;
  comment_text: string;
  created_at: string;
}

export interface Approval {
  id: string;
  submission_id: string;
  reviewer: User;
  decision: "approved" | "changes_requested" | "rejected";
  decision_reason: string;
  created_at: string;
}

export interface ContentSubmission {
  id: string;
  brand_id: string;
  brand_name: string;
  creator: User;
  title: string;
  content_type: "social_post" | "blog_article" | "press_release" | "landing_page" | "email_campaign" | "ad_copy";
  channel: string;
  original_content: string;
  current_content: string;
  status: SubmissionStatus;
  assigned_reviewer?: User;
  latest_review?: ReviewResult;
  versions: ContentVersion[];
  comments: Comment[];
  approvals: Approval[];
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor: User;
  action: string;
  resource_type: "submission" | "brand" | "approval" | "guideline" | "settings";
  resource_id: string;
  resource_title: string;
  details: string;
  created_at: string;
}
