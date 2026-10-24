"use client";

import { Brand, ContentSubmission, AuditLog, User, FindingResolution } from "@/lib/types";
import { INITIAL_BRANDS, INITIAL_SUBMISSIONS, INITIAL_AUDIT_LOGS, DEMO_USERS } from "./mockData";

const STORAGE_KEYS = {
  BRANDS: "inkloom_brands_v1",
  SUBMISSIONS: "inkloom_submissions_v1",
  AUDIT_LOGS: "inkloom_audit_logs_v1",
  ACTIVE_USER: "inkloom_active_user_v1",
};

export class InkloomStore {
  private static isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  public static getBrands(): Brand[] {
    if (!this.isBrowser()) return INITIAL_BRANDS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
      return INITIAL_BRANDS;
    } catch {
      return INITIAL_BRANDS;
    }
  }

  public static getBrandById(id: string): Brand | undefined {
    return this.getBrands().find((b) => b.id === id);
  }

  public static saveBrand(brand: Brand): void {
    const brands = this.getBrands();
    const existingIndex = brands.findIndex((b) => b.id === brand.id);
    if (existingIndex >= 0) {
      brands[existingIndex] = brand;
    } else {
      brands.unshift(brand);
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      this.addAuditLog({
        actor: this.getActiveUser(),
        action: existingIndex >= 0 ? "BRAND_UPDATED" : "BRAND_CREATED",
        resource_type: "brand",
        resource_id: brand.id,
        resource_title: brand.name,
        details: `Saved brand guidelines for ${brand.name} (version ${brand.version})`,
      });
    }
  }

  public static getSubmissions(): ContentSubmission[] {
    if (!this.isBrowser()) return INITIAL_SUBMISSIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  }

  public static getSubmissionById(id: string): ContentSubmission | undefined {
    return this.getSubmissions().find((s) => s.id === id);
  }

  public static saveSubmission(submission: ContentSubmission): void {
    const list = this.getSubmissions();
    const idx = list.findIndex((s) => s.id === submission.id);
    if (idx >= 0) {
      list[idx] = submission;
    } else {
      list.unshift(submission);
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    }
  }

  public static addSubmission(
    submissionData: Omit<ContentSubmission, "id" | "created_at" | "updated_at" | "versions" | "comments" | "approvals">
  ): ContentSubmission {
    const id = "sub-" + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newSubmission: ContentSubmission = {
      ...submissionData,
      id,
      created_at: now,
      updated_at: now,
      versions: [
        {
          id: "ver-" + Math.random().toString(36).substring(2, 9),
          submission_id: id,
          version_number: 1,
          content: submissionData.original_content,
          created_by: submissionData.creator.name,
          created_at: now,
          change_summary: "Initial submission",
        },
      ],
      comments: [],
      approvals: [],
    };

    this.saveSubmission(newSubmission);
    this.addAuditLog({
      actor: submissionData.creator,
      action: "CONTENT_SUBMITTED",
      resource_type: "submission",
      resource_id: id,
      resource_title: submissionData.title,
      details: `Submitted new content for brand '${submissionData.brand_name}' on channel '${submissionData.channel}'.`,
    });
    return newSubmission;
  }

  public static saveRevision(
    submissionId: string,
    newContent: string,
    changeSummary: string,
    author: User
  ): ContentSubmission | null {
    const submission = this.getSubmissionById(submissionId);
    if (!submission) return null;

    const nextVerNumber = (submission.versions?.length || 0) + 1;
    const now = new Date().toISOString();

    const newVersion = {
      id: "ver-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      version_number: nextVerNumber,
      content: newContent,
      created_by: author.name,
      created_at: now,
      change_summary: changeSummary,
    };

    submission.versions = submission.versions || [];
    submission.versions.unshift(newVersion);
    submission.current_content = newContent;
    submission.updated_at = now;
    submission.status = "resubmitted";

    this.saveSubmission(submission);
    this.addAuditLog({
      actor: author,
      action: "REVISION_SAVED",
      resource_type: "submission",
      resource_id: submission.id,
      resource_title: submission.title,
      details: `Created Revision #${nextVerNumber}: ${changeSummary}`,
    });

    return submission;
  }

  public static updateFindingResolution(
    submissionId: string,
    findingId: string,
    resolution: FindingResolution
  ): void {
    const submission = this.getSubmissionById(submissionId);
    if (!submission || !submission.latest_review) return;

    const finding = submission.latest_review.findings.find((f) => f.id === findingId);
    if (finding) {
      finding.resolution_status = resolution;
      this.saveSubmission(submission);
    }
  }

  public static addComment(submissionId: string, author: User, commentText: string): void {
    const submission = this.getSubmissionById(submissionId);
    if (!submission) return;

    const now = new Date().toISOString();
    const comment = {
      id: "comm-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      author,
      comment_text: commentText,
      created_at: now,
    };

    submission.comments = submission.comments || [];
    submission.comments.push(comment);
    this.saveSubmission(submission);

    this.addAuditLog({
      actor: author,
      action: "COMMENT_ADDED",
      resource_type: "submission",
      resource_id: submissionId,
      resource_title: submission.title,
      details: `Added review comment: "${commentText.substring(0, 60)}..."`,
    });
  }

  public static recordApprovalDecision(
    submissionId: string,
    reviewer: User,
    decision: "approved" | "changes_requested" | "rejected",
    reason: string
  ): void {
    const submission = this.getSubmissionById(submissionId);
    if (!submission) return;

    const now = new Date().toISOString();
    const approvalRecord = {
      id: "app-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      reviewer,
      decision,
      decision_reason: reason,
      created_at: now,
    };

    submission.approvals = submission.approvals || [];
    submission.approvals.push(approvalRecord);

    if (decision === "approved") {
      submission.status = "approved";
    } else if (decision === "changes_requested") {
      submission.status = "changes_requested";
    } else {
      submission.status = "rejected";
    }
    submission.updated_at = now;

    this.saveSubmission(submission);

    this.addAuditLog({
      actor: reviewer,
      action: decision === "approved" ? "APPROVAL_GRANTED" : decision === "changes_requested" ? "CHANGES_REQUESTED" : "REJECTION_ISSUED",
      resource_type: "approval",
      resource_id: submissionId,
      resource_title: submission.title,
      details: `Decision [${decision.toUpperCase()}]: ${reason}`,
    });
  }

  public static getAuditLogs(): AuditLog[] {
    if (!this.isBrowser()) return INITIAL_AUDIT_LOGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public static addAuditLog(log: Omit<AuditLog, "id" | "created_at">): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: "log-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    }
  }

  public static getActiveUser(): User {
    if (!this.isBrowser()) return DEMO_USERS[1]; // default Brand Manager
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEMO_USERS[1];
  }

  public static setActiveUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    }
  }

  public static resetToDemo(): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(DEMO_USERS[1]));
    }
  }
}
