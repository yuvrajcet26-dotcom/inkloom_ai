"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, FindingSeverity, FindingCategory, FindingResolution } from "@/lib/types";
import { StatusBadge, SeverityBadge, VerificationBadge } from "@/components/common/Badge";
import { ComplianceGauge } from "@/components/common/ComplianceGauge";
import { FindingCard } from "@/components/common/FindingCard";
import { useAuth } from "@/lib/context/AuthContext";
import {
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Filter,
  Check,
  Send,
  UserCheck,
  Edit3,
  Calendar,
  Layers,
  FileCheck2,
  Share2,
} from "lucide-react";

export default function ReviewResultPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<ContentSubmission | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [commentInput, setCommentInput] = useState<string>("");
  const [notificationMsg, setNotificationMsg] = useState<string>("");

  useEffect(() => {
    if (id) {
      const sub = InkloomStore.getSubmissionById(id);
      if (sub) {
        setSubmission(sub);
      }
    }
  }, [id]);

  if (!submission) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-[#15265B]">Submission Not Found</h2>
        <p className="text-xs text-[#64748B]">Could not locate review result for ID: {id}</p>
        <Link
          href="/dashboard"
          className="inline-block px-4 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const review = submission.latest_review;
  const findings = review?.findings || [];

  const handleResolveFinding = (findingId: string, resolution: FindingResolution, editedText?: string) => {
    InkloomStore.updateFindingResolution(submission.id, findingId, resolution);
    // Reload submission state
    const updated = InkloomStore.getSubmissionById(submission.id);
    if (updated) setSubmission(updated);

    setNotificationMsg(`Finding marked as ${resolution.replace("_", " ")}.`);
    setTimeout(() => setNotificationMsg(""), 3000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    InkloomStore.addComment(submission.id, currentUser, commentInput.trim());
    setCommentInput("");
    const updated = InkloomStore.getSubmissionById(submission.id);
    if (updated) setSubmission(updated);
  };

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== "all" && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== "all" && f.category !== selectedCategory) return false;
    return true;
  });

  const highCount = findings.filter((f) => f.severity === "high").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;
  const lowCount = findings.filter((f) => f.severity === "low").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Brand Review Report
            </span>
            <span className="text-xs text-[#64748B]">ID: {submission.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            {submission.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1.5">
            <span>
              Brand: <strong className="text-[#15265B]">{submission.brand_name}</strong>
            </span>
            <span>•</span>
            <span>
              Channel: <strong className="text-[#15265B]">{submission.channel}</strong>
            </span>
            <span>•</span>
            <span>
              Creator: <strong className="text-[#15265B]">{submission.creator.name}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={`/reviews/${submission.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold hover:shadow-md transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Open Diff & Corrections Workspace</span>
          </Link>
          <Link
            href="/approvals"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#DCE9F8] bg-white text-xs font-bold text-[#15265B] hover:bg-[#F8FBFF] transition"
          >
            <UserCheck className="w-4 h-4 text-[#159B72]" />
            <span>Approval Queue</span>
          </Link>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Executive Summary Card & Compliance Gauge */}
      <div className="pastel-card p-6 sm:p-8 bg-gradient-to-r from-white via-white to-[#F8FBFF]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Gauge column */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#F8FBFF] border border-[#DCE9F8]">
            <ComplianceGauge score={review?.overall_indicator || 0} size="lg" />
            <div className="mt-3 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Overall Compliance Index
              </span>
            </div>
          </div>

          {/* Details column */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={submission.status} />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700">
                  Engine: {review?.model_version || "Inkloom Governor"}
                </span>
              </div>
              <div className="text-xs text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Analyzed on {new Date(submission.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#15265B]">Analysis Summary</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {review?.summary || "Brand governance review completed successfully."}
              </p>
            </div>

            {/* Severity Pill Counts */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#FFF0F5] border border-[#FECDD3] text-center">
                <div className="text-xl font-black text-[#E65378]">{highCount}</div>
                <div className="text-[11px] font-bold text-[#E65378] uppercase">High Priority</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF7DF] border border-[#FDE68A] text-center">
                <div className="text-xl font-black text-[#D97706]">{mediumCount}</div>
                <div className="text-[11px] font-bold text-[#D97706] uppercase">Medium Priority</div>
              </div>
              <div className="p-3 rounded-xl bg-[#E5F2FF] border border-[#BED8F6] text-center">
                <div className="text-xl font-black text-[#2878F0]">{lowCount}</div>
                <div className="text-[11px] font-bold text-[#2878F0] uppercase">Low / Advisory</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#15265B]">
              Detailed Findings & Explainable Actions ({filteredFindings.length})
            </h2>
            <p className="text-xs text-[#64748B]">
              Every issue explains what was detected, why it matters, citations, and proposed replacements.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B]"
            >
              <option value="all">All Severities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B]"
            >
              <option value="all">All Categories</option>
              <option value="terminology_and_messaging">Terminology & Messaging</option>
              <option value="factual_consistency">Factual Consistency</option>
              <option value="unsupported_promotional_claims">Unsupported Claims</option>
              <option value="tone_and_voice">Tone & Voice</option>
              <option value="accessibility">Accessibility & Readability</option>
            </select>
          </div>
        </div>

        {/* Findings List */}
        {filteredFindings.length === 0 ? (
          <div className="pastel-card p-8 text-center space-y-2 bg-emerald-50/20 border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-[#15265B]">No Findings Match Selected Filters</h3>
            <p className="text-xs text-[#64748B]">All checks in this view have passed or been resolved.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onResolve={handleResolveFinding}
              />
            ))}
          </div>
        )}
      </div>

      {/* Collaboration & Comments Section (Human-in-the-Loop) */}
      <div className="pastel-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
          <div>
            <h3 className="text-base font-bold text-[#15265B] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#8064F5]" />
              <span>Review Collaboration & Threaded Feedback</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Comments between creators, brand managers, and editorial reviewers.
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#15265B]">
            {submission.comments?.length || 0} Comments
          </span>
        </div>

        {/* Existing Comments */}
        <div className="space-y-3">
          {(!submission.comments || submission.comments.length === 0) ? (
            <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation below.</p>
          ) : (
            submission.comments.map((comm) => (
              <div key={comm.id} className="p-4 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15265B]">{comm.author.name}</span>
                    <span className="text-[10px] text-[#64748B]">({comm.author.department || comm.author.role})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comm.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-[#15265B] leading-relaxed">{comm.comment_text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={`Add a review note as ${currentUser.name} (${currentUser.role})...`}
            className="flex-1 text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
