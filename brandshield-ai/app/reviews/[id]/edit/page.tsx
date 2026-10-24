"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, Finding } from "@/lib/types";
import { DiffViewer } from "@/components/common/DiffViewer";
import { useAuth } from "@/lib/context/AuthContext";
import { BrandAnalysisEngine } from "@/lib/ai/engine";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Send,
  Eye,
  FileCheck2,
  ChevronLeft,
  Check,
  Edit,
  History,
} from "lucide-react";

export default function SuggestedCorrectionsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<ContentSubmission | null>(null);
  const [draftContent, setDraftContent] = useState<string>("");
  const [changeSummary, setChangeSummary] = useState<string>("Applied brand-approved corrections");
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string>("");
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const sub = InkloomStore.getSubmissionById(id);
      if (sub) {
        setSubmission(sub);
        setDraftContent(sub.current_content || sub.original_content);
      }
    }
  }, [id]);

  if (!submission) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-[#15265B]">Loading workspace...</h2>
      </div>
    );
  }

  const findings = submission.latest_review?.findings || [];

  // Apply single finding replacement
  const applyCorrection = (finding: Finding) => {
    if (draftContent.includes(finding.original_text)) {
      const updated = draftContent.replace(finding.original_text, finding.suggested_text);
      setDraftContent(updated);
      setAppliedCount((prev) => prev + 1);
      InkloomStore.updateFindingResolution(submission.id, finding.id, "accepted");
      setStatusNotice(`Applied correction for: "${finding.original_text}"`);
      setTimeout(() => setStatusNotice(""), 3000);
    } else {
      setStatusNotice(`Target phrase already revised or not found in current draft.`);
      setTimeout(() => setStatusNotice(""), 3000);
    }
  };

  // Apply all pending suggestions automatically
  const applyAllCorrections = () => {
    let revised = draftContent;
    let count = 0;
    for (const f of findings) {
      if (revised.includes(f.original_text)) {
        revised = revised.replaceAll(f.original_text, f.suggested_text);
        InkloomStore.updateFindingResolution(submission.id, f.id, "accepted");
        count++;
      }
    }
    setDraftContent(revised);
    setAppliedCount((prev) => prev + count);
    setStatusNotice(`Applied ${count} brand corrections across content.`);
    setTimeout(() => setStatusNotice(""), 3000);
  };

  // Revert back to original
  const resetToOriginal = () => {
    setDraftContent(submission.original_content);
    setStatusNotice("Reverted draft to original submitted version.");
    setTimeout(() => setStatusNotice(""), 3000);
  };

  // Save new revision
  const handleSaveRevision = () => {
    const updated = InkloomStore.saveRevision(submission.id, draftContent, changeSummary, currentUser);
    if (updated) {
      setSubmission(updated);
      setStatusNotice(`Revision #${updated.versions?.length || 2} saved successfully!`);
      setTimeout(() => setStatusNotice(""), 3000);
    }
  };

  // Re-run AI analysis on revised draft
  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    const brand = InkloomStore.getBrandById(submission.brand_id);
    if (!brand) return;

    // Run review engine on revised draft
    const newReview = await BrandAnalysisEngine.analyzeContent({
      submissionId: submission.id,
      brand,
      title: submission.title,
      contentType: submission.content_type,
      channel: submission.channel,
      content: draftContent,
    });

    // Update submission
    submission.current_content = draftContent;
    submission.latest_review = newReview;
    submission.status = "resubmitted";
    InkloomStore.saveSubmission(submission);

    setIsReanalyzing(false);
    setStatusNotice(`Re-analysis complete! New Compliance Score: ${newReview.overall_indicator}/100`);
    setSubmission({ ...submission });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/reviews/${submission.id}`}
              className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Findings</span>
            </Link>
            <span className="text-xs text-[#64748B]">/</span>
            <span className="text-xs font-bold text-[#8064F5]">Suggested Corrections Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Interactive Revision & Diff Studio
          </h1>
          <p className="text-xs text-[#64748B]">
            Compare original draft against proposed brand replacements, accept individual fixes, and save traceable revisions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyAllCorrections}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E4F8F0] border border-[#A7F3D0] text-[#159B72] text-xs font-bold hover:bg-emerald-100 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply All Brand Fixes</span>
          </button>

          <button
            type="button"
            onClick={resetToOriginal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>

          <button
            type="button"
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm hover:shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isReanalyzing ? "Re-checking..." : "Re-Run Analysis"}</span>
          </button>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Side-by-side or Diff View Component */}
      <DiffViewer
        originalText={submission.original_content}
        revisedText={draftContent}
        originalLabel="Original Submitted Version"
        revisedLabel="Current Working Revision (Editable)"
      />

      {/* Editable Draft Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Textarea */}
        <div className="lg:col-span-7 pastel-card p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <Edit className="w-4 h-4 text-[#2878F0]" />
              <span>Active Working Revision</span>
            </h3>
            <span className="text-xs text-[#64748B]">
              {draftContent.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            rows={10}
            className="w-full text-xs p-4 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
          />

          {/* Revision Save Controls */}
          <div className="pt-3 border-t border-[#E5F2FF] space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">
                Revision Changelog / Reason:
              </label>
              <input
                type="text"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="e.g. Replaced prohibited pricing jargon and corrected customer metrics"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B] focus:outline-none focus:ring-1 focus:ring-[#2878F0]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-[#64748B]">
                Original content is permanently archived and cannot be overwritten.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveRevision}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save as Revision</span>
                </button>

                <Link
                  href="/approvals"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold hover:shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Manager Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Click-to-Apply Suggested Fixes */}
        <div className="lg:col-span-5 pastel-card p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8064F5]" />
              <span>Available Suggested Fixes</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E5F2FF] text-[#2878F0]">
              {findings.length} findings
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {findings.map((f) => {
              const isPresentInDraft = draftContent.includes(f.original_text);
              return (
                <div
                  key={f.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition ${
                    isPresentInDraft
                      ? "border-[#DCE9F8] bg-[#F8FBFF]"
                      : "border-emerald-200 bg-emerald-50/50 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#15265B] text-[11px]">{f.description}</span>
                    {!isPresentInDraft ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Resolved in Draft
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => applyCorrection(f)}
                        className="px-2.5 py-1 rounded-lg bg-[#2878F0] text-white font-bold text-[11px] hover:bg-blue-600 transition shadow-2xs"
                      >
                        Apply Fix
                      </button>
                    )}
                  </div>

                  <div className="p-2 rounded-lg bg-red-50 text-rose-800 text-[11px] line-through">
                    &ldquo;{f.original_text}&rdquo;
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                    &ldquo;{f.suggested_text}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revision History Log */}
      {submission.versions && submission.versions.length > 0 && (
        <div className="pastel-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
            <History className="w-4 h-4 text-[#2878F0]" />
            <span>Traceable Version History</span>
          </h3>

          <div className="space-y-2">
            {submission.versions.map((ver) => (
              <div
                key={ver.id}
                className="p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#15265B]">Revision #{ver.version_number}</span>
                  <span className="text-slate-500 ml-2">by {ver.created_by}</span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {ver.change_summary || "Draft modification"}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400">
                  {new Date(ver.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
