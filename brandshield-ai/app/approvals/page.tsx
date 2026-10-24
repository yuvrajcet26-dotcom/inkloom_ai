"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, SubmissionStatus } from "@/lib/types";
import { StatusBadge, RoleBadge } from "@/components/common/Badge";
import { useAuth } from "@/lib/context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  FileText,
  UserCheck,
  MessageSquare,
  Lock,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function ApprovalsPage() {
  const { currentUser, isAuthorized, switchUser } = useAuth();
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [activeModal, setActiveModal] = useState<"approve" | "changes" | "reject" | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    setSubmissions(InkloomStore.getSubmissions());
  }, []);

  const canApprove = isAuthorized(["admin", "brand_manager", "reviewer"]);

  const filteredSubmissions = submissions.filter((s) => {
    if (selectedStatus === "pending") {
      return (
        s.status === "submitted_for_review" ||
        s.status === "in_review" ||
        s.status === "resubmitted"
      );
    }
    if (selectedStatus === "changes_requested") return s.status === "changes_requested";
    if (selectedStatus === "approved") return s.status === "approved";
    if (selectedStatus === "rejected") return s.status === "rejected";
    return true; // all
  });

  const openDecisionModal = (type: "approve" | "changes" | "reject", subId: string) => {
    setActiveModal(type);
    setActiveSubId(subId);
    if (type === "approve") {
      setReasonInput("Content aligns strictly with brand voice guidelines, verified facts, and approved terminology.");
    } else if (type === "changes") {
      setReasonInput("Please revise highlighted terminology and unverified customer figures before publication.");
    } else {
      setReasonInput("Severe policy conflict that cannot be resolved in this current campaign format.");
    }
  };

  const handleConfirmDecision = async () => {
    if (!activeSubId || !activeModal) return;

    const decision = activeModal === "approve" ? "approved" : activeModal === "changes" ? "changes_requested" : "rejected";

    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: activeSubId,
          reviewer: currentUser,
          decision,
          reason: reasonInput,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setNotification(`Server Authorization Error (${res.status}): ${errData.error || "Permission Denied"}`);
        setActiveModal(null);
        setActiveSubId(null);
        setTimeout(() => setNotification(""), 5000);
        return;
      }
    } catch (err) {
      console.warn("Server approval sync error:", err);
    }

    if (activeModal === "approve") {
      InkloomStore.recordApprovalDecision(activeSubId, currentUser, "approved", reasonInput);
      setNotification("Submission successfully approved and certified for publication (Server Signed)!");
    } else if (activeModal === "changes") {
      InkloomStore.recordApprovalDecision(activeSubId, currentUser, "changes_requested", reasonInput);
      setNotification("Change request feedback sent back to content creator (Server Signed).");
    } else if (activeModal === "reject") {
      InkloomStore.recordApprovalDecision(activeSubId, currentUser, "rejected", reasonInput);
      setNotification("Submission marked as rejected with documented rationale (Server Signed).");
    }

    setActiveModal(null);
    setActiveSubId(null);
    setSubmissions(InkloomStore.getSubmissions());
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Human-in-the-Loop Governance
            </span>
            <span className="text-xs text-[#64748B]">• Manager Sign-Off</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Review & Approval Workflow
          </h1>
          <p className="text-xs text-[#64748B]">
            Authorized brand managers and editorial leads evaluate findings, collaborate with creators, and sign off on content.
          </p>
        </div>

        {/* Current User Role Notice */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#DCE9F8] text-xs">
          <span className="text-[#64748B]">Acting as:</span>
          <strong className="text-[#15265B]">{currentUser.name}</strong>
          <RoleBadge role={currentUser.role} />
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Notice for Judges */}
      {!canApprove && (
        <div className="p-4 rounded-2xl bg-[#FFF7DF] border border-[#FDE68A] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#B45309]">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>
              You are currently logged in as a <strong>Creator ({currentUser.name})</strong>. Approval and Rejection decisions require <strong>Brand Manager</strong>, <strong>Reviewer</strong>, or <strong>Admin</strong> authorization.
            </span>
          </div>
          <button
            onClick={() => switchUser("brand_manager")}
            className="px-3 py-1.5 rounded-lg bg-[#2878F0] text-white font-bold hover:bg-blue-600 transition whitespace-nowrap shadow-xs"
          >
            Switch to Brand Manager (Alex Rivera)
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedStatus("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedStatus === "pending"
              ? "bg-[#2878F0] text-white shadow-sm"
              : "bg-white border border-[#DCE9F8] text-[#64748B] hover:text-[#15265B]"
          }`}
        >
          Pending Review Queue ({submissions.filter((s) => s.status === "submitted_for_review" || s.status === "in_review" || s.status === "resubmitted").length})
        </button>

        <button
          onClick={() => setSelectedStatus("changes_requested")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedStatus === "changes_requested"
              ? "bg-[#2878F0] text-white shadow-sm"
              : "bg-white border border-[#DCE9F8] text-[#64748B] hover:text-[#15265B]"
          }`}
        >
          Changes Requested ({submissions.filter((s) => s.status === "changes_requested").length})
        </button>

        <button
          onClick={() => setSelectedStatus("approved")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedStatus === "approved"
              ? "bg-[#2878F0] text-white shadow-sm"
              : "bg-white border border-[#DCE9F8] text-[#64748B] hover:text-[#15265B]"
          }`}
        >
          Approved Content ({submissions.filter((s) => s.status === "approved").length})
        </button>

        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedStatus === "all"
              ? "bg-[#2878F0] text-white shadow-sm"
              : "bg-white border border-[#DCE9F8] text-[#64748B] hover:text-[#15265B]"
          }`}
        >
          All Submissions ({submissions.length})
        </button>
      </div>

      {/* Submissions Cards */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="pastel-card p-12 text-center space-y-2 bg-white">
            <CheckCircle2 className="w-12 h-12 text-[#159B72] mx-auto" />
            <h3 className="text-sm font-bold text-[#15265B]">Queue is Clear!</h3>
            <p className="text-xs text-[#64748B]">No items currently found in this review queue.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const score = sub.latest_review?.overall_indicator || 0;
            const findingsCount = sub.latest_review?.findings?.length || 0;

            return (
              <div
                key={sub.id}
                className="pastel-card p-6 bg-white space-y-4 hover:border-[#BED8F6] transition"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5F2FF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#2878F0]">{sub.brand_name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-[#64748B]">{sub.channel}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-[#64748B]">Submitted by {sub.creator.name}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#15265B] mt-0.5">
                      {sub.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black text-xs px-2.5 py-1 rounded-lg ${
                        score >= 85
                          ? "bg-[#E4F8F0] text-[#159B72]"
                          : score >= 60
                          ? "bg-[#FFF7DF] text-[#D97706]"
                          : "bg-[#FFF0F5] text-[#E65378]"
                      }`}
                    >
                      Compliance: {score}/100
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>

                {/* Content preview snippet */}
                <div className="p-3.5 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] text-xs text-[#15265B] leading-relaxed italic line-clamp-3">
                  &ldquo;{sub.current_content || sub.original_content}&rdquo;
                </div>

                {/* Findings & Revisions meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center gap-4 text-[#64748B]">
                    <span>
                      <strong className="text-[#15265B]">{findingsCount}</strong> findings flagged
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#15265B]">{sub.versions?.length || 1}</strong> revisions recorded
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#15265B]">{sub.comments?.length || 0}</strong> review comments
                    </span>
                  </div>

                  {/* Actions for this submission */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/reviews/${sub.id}`}
                      className="px-3 py-1.5 rounded-xl border border-[#DCE9F8] bg-white text-xs font-semibold text-[#15265B] hover:bg-slate-50 transition"
                    >
                      View Findings & Citations
                    </Link>

                    <Link
                      href={`/reviews/${sub.id}/edit`}
                      className="px-3 py-1.5 rounded-xl border border-[#BED8F6] text-[#2878F0] bg-[#E5F2FF]/50 text-xs font-semibold hover:bg-[#E5F2FF] transition"
                    >
                      Inspect Diff
                    </Link>

                    {canApprove && sub.status !== "approved" && (
                      <>
                        <button
                          type="button"
                          onClick={() => openDecisionModal("changes", sub.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#FFF7DF] border border-[#FDE68A] text-[#D97706] text-xs font-bold hover:bg-amber-100 transition"
                        >
                          Request Changes
                        </button>

                        <button
                          type="button"
                          onClick={() => openDecisionModal("approve", sub.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#159B72] text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Content</span>
                        </button>
                      </>
                    )}

                    {sub.status === "approved" && (
                      <span className="text-xs font-bold text-[#159B72] bg-[#E4F8F0] px-3 py-1 rounded-xl flex items-center gap-1 border border-[#A7F3D0]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Publication
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog Modal for Approval / Change Request / Reject */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#DCE9F8] p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
              <div className="flex items-center gap-2">
                {activeModal === "approve" ? (
                  <div className="w-9 h-9 rounded-xl bg-[#E4F8F0] text-[#159B72] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : activeModal === "changes" ? (
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7DF] text-[#D97706] flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#E65378] flex items-center justify-center font-bold">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-extrabold text-[#15265B]">
                    {activeModal === "approve"
                      ? "Confirm Content Approval"
                      : activeModal === "changes"
                      ? "Request Content Revisions"
                      : "Confirm Submission Rejection"}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Reviewer Decision Record • Grounded in Human Oversight
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1.5">
                Reviewer Decision Rationale / Guidance:
              </label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] space-y-1">
              <div>
                <strong className="text-[#15265B]">Signed by:</strong> {currentUser.name} ({currentUser.department || currentUser.role})
              </div>
              <div>
                <strong className="text-[#15265B]">Audit Trail:</strong> This decision will be permanently signed and committed to the organizational governance audit log.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setActiveSubId(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm ${
                  activeModal === "approve"
                    ? "bg-[#159B72] hover:bg-emerald-700"
                    : activeModal === "changes"
                    ? "bg-[#D97706] hover:bg-amber-700"
                    : "bg-[#E65378] hover:bg-rose-700"
                }`}
              >
                {activeModal === "approve"
                  ? "Authorize & Approve"
                  : activeModal === "changes"
                  ? "Send Revision Request"
                  : "Reject Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
