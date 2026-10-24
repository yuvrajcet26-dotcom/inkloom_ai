import fs from "fs";
import path from "path";
import { Brand, ContentSubmission, AuditLog, User } from "@/lib/types";
import { INITIAL_BRANDS, INITIAL_SUBMISSIONS, INITIAL_AUDIT_LOGS, DEMO_USERS } from "@/lib/data/mockData";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DatabaseSchema {
  brands: Brand[];
  submissions: ContentSubmission[];
  audit_logs: AuditLog[];
}

export class ServerDatabase {
  private static init(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        brands: INITIAL_BRANDS,
        submissions: INITIAL_SUBMISSIONS,
        audit_logs: INITIAL_AUDIT_LOGS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    } catch {
      return {
        brands: INITIAL_BRANDS,
        submissions: INITIAL_SUBMISSIONS,
        audit_logs: INITIAL_AUDIT_LOGS,
      };
    }
  }

  private static save(db: DatabaseSchema): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }

  public static getBrands(): Brand[] {
    return this.init().brands;
  }

  public static getBrandById(id: string): Brand | undefined {
    return this.getBrands().find((b) => b.id === id);
  }

  public static saveBrand(brand: Brand, actor: User): Brand {
    const db = this.init();
    const idx = db.brands.findIndex((b) => b.id === brand.id);
    if (idx >= 0) {
      db.brands[idx] = brand;
    } else {
      db.brands.unshift(brand);
    }

    this.addAuditLogInternal(db, {
      actor,
      action: idx >= 0 ? "BRAND_UPDATED" : "BRAND_CREATED",
      resource_type: "brand",
      resource_id: brand.id,
      resource_title: brand.name,
      details: `Saved guidelines for ${brand.name} (v${brand.version})`,
    });

    this.save(db);
    return brand;
  }

  public static getSubmissions(): ContentSubmission[] {
    return this.init().submissions;
  }

  public static getSubmissionById(id: string): ContentSubmission | undefined {
    return this.getSubmissions().find((s) => s.id === id);
  }

  public static createSubmission(
    data: Omit<ContentSubmission, "id" | "created_at" | "updated_at" | "versions" | "comments" | "approvals">
  ): ContentSubmission {
    const db = this.init();
    const id = "sub-" + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const sub: ContentSubmission = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      versions: [
        {
          id: "ver-" + Math.random().toString(36).substring(2, 9),
          submission_id: id,
          version_number: 1,
          content: data.original_content,
          created_by: data.creator.name,
          created_at: now,
          change_summary: "Initial submission",
        },
      ],
      comments: [],
      approvals: [],
    };

    db.submissions.unshift(sub);
    this.addAuditLogInternal(db, {
      actor: data.creator,
      action: "CONTENT_SUBMITTED",
      resource_type: "submission",
      resource_id: id,
      resource_title: data.title,
      details: `Submitted content for brand '${data.brand_name}' on channel '${data.channel}'`,
    });

    this.save(db);
    return sub;
  }

  public static saveRevision(
    submissionId: string,
    newContent: string,
    changeSummary: string,
    author: User
  ): ContentSubmission | null {
    const db = this.init();
    const sub = db.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    const nextVer = (sub.versions?.length || 0) + 1;
    const now = new Date().toISOString();

    sub.versions = sub.versions || [];
    sub.versions.unshift({
      id: "ver-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      version_number: nextVer,
      content: newContent,
      created_by: author.name,
      created_at: now,
      change_summary: changeSummary,
    });

    sub.current_content = newContent;
    sub.updated_at = now;
    sub.status = "resubmitted";

    this.addAuditLogInternal(db, {
      actor: author,
      action: "REVISION_SAVED",
      resource_type: "submission",
      resource_id: sub.id,
      resource_title: sub.title,
      details: `Saved revision #${nextVer}: ${changeSummary}`,
    });

    this.save(db);
    return sub;
  }

  public static recordApproval(
    submissionId: string,
    reviewer: User,
    decision: "approved" | "changes_requested" | "rejected",
    reason: string
  ): ContentSubmission | null {
    const db = this.init();
    const sub = db.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    const now = new Date().toISOString();
    sub.approvals = sub.approvals || [];
    sub.approvals.unshift({
      id: "app-" + Math.random().toString(36).substring(2, 9),
      submission_id: submissionId,
      reviewer,
      decision,
      decision_reason: reason,
      created_at: now,
    });

    sub.status = decision;
    sub.updated_at = now;

    this.addAuditLogInternal(db, {
      actor: reviewer,
      action: decision === "approved" ? "APPROVAL_GRANTED" : decision === "changes_requested" ? "CHANGES_REQUESTED" : "REJECTION_ISSUED",
      resource_type: "approval",
      resource_id: sub.id,
      resource_title: sub.title,
      details: `Decision [${decision.toUpperCase()}]: ${reason}`,
    });

    this.save(db);
    return sub;
  }

  public static getAuditLogs(): AuditLog[] {
    return this.init().audit_logs;
  }

  private static addAuditLogInternal(db: DatabaseSchema, log: Omit<AuditLog, "id" | "created_at">): void {
    const entry: AuditLog = {
      ...log,
      id: "log-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    db.audit_logs.unshift(entry);
    if (db.audit_logs.length > 200) {
      db.audit_logs = db.audit_logs.slice(0, 200);
    }
  }
}
