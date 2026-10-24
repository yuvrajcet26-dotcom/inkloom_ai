import { NextRequest, NextResponse } from "next/server";
import { ServerDatabase } from "@/lib/db/adapter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, reviewer, decision, reason } = body;

    if (!submissionId || !reviewer || !decision) {
      return NextResponse.json({ error: "Missing required approval fields." }, { status: 400 });
    }

    // Server-Side RBAC Enforcement: Only Authorized Roles can Approve / Reject
    const allowedRoles = ["admin", "brand_manager", "reviewer"];
    if (!allowedRoles.includes(reviewer.role)) {
      return NextResponse.json(
        {
          error: `Forbidden: User with role '${reviewer.role}' is not authorized to sign off on content approvals. Only Brand Managers, Reviewers, and Admins possess approval privileges.`,
        },
        { status: 403 }
      );
    }

    const updated = ServerDatabase.recordApproval(
      submissionId,
      reviewer,
      decision,
      reason || "Decision recorded by authorized reviewer."
    );

    if (!updated) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record approval." }, { status: 500 });
  }
}
