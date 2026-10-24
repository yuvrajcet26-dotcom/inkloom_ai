"use client";

import React, { useState } from "react";
import { Finding, FindingResolution } from "@/lib/types";
import { SeverityBadge, VerificationBadge } from "./Badge";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Edit3,
  Check,
  Undo2,
} from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  onResolve?: (findingId: string, resolution: FindingResolution, editedText?: string) => void;
  readOnly?: boolean;
}

export function FindingCard({ finding, onResolve, readOnly = false }: FindingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(finding.suggested_text);
  const [currentResolution, setCurrentResolution] = useState<FindingResolution>(finding.resolution_status || "pending");

  const categoryLabels: Record<string, string> = {
    tone_and_voice: "Tone & Voice",
    terminology_and_messaging: "Terminology & Messaging",
    factual_consistency: "Factual Consistency",
    unsupported_promotional_claims: "Unsupported Promotional Claim",
    visual_consistency: "Visual Consistency",
    accessibility: "Accessibility & Readability",
    guideline_conflicts: "Guideline Conflict",
  };

  const handleAccept = () => {
    setCurrentResolution("accepted");
    onResolve?.(finding.id, "accepted", finding.suggested_text);
  };

  const handleReject = () => {
    setCurrentResolution("rejected");
    onResolve?.(finding.id, "rejected");
  };

  const handleCustomSave = () => {
    setCurrentResolution("custom_edited");
    setIsEditing(false);
    onResolve?.(finding.id, "custom_edited", customText);
  };

  const handleReset = () => {
    setCurrentResolution("pending");
    onResolve?.(finding.id, "pending");
  };

  return (
    <div
      className={`rounded-2xl border transition-all p-5 ${
        currentResolution === "accepted"
          ? "border-emerald-300 bg-emerald-50/40"
          : currentResolution === "rejected"
          ? "border-slate-300 bg-slate-50/60 opacity-75"
          : currentResolution === "custom_edited"
          ? "border-indigo-300 bg-indigo-50/40"
          : "border-[#DCE9F8] bg-white shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header: Category, Severity, Verification status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5F2FF]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E5F2FF] text-[#2878F0]">
            {categoryLabels[finding.category] || finding.category}
          </span>
          <SeverityBadge severity={finding.severity} />
          <VerificationBadge status={finding.verification_status} />
        </div>

        {/* Resolution status indicator */}
        <div>
          {currentResolution === "accepted" && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted Fix
            </span>
          )}
          {currentResolution === "rejected" && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5" /> Dismissed
            </span>
          )}
          {currentResolution === "custom_edited" && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
              <Edit3 className="w-3.5 h-3.5" /> Custom Adjusted
            </span>
          )}
          {currentResolution === "pending" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Needs Creator Review
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="mt-3">
        <h4 className="text-sm font-bold text-[#15265B] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E65378] flex-shrink-0 mt-0.5" />
          <span>{finding.description}</span>
        </h4>
        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed pl-6">
          <strong className="text-[#15265B]">Why this matters:</strong> {finding.reason}
        </p>
      </div>

      {/* Comparison: Flagged Text vs Suggested Correction */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
        {/* Original Content */}
        <div className="p-3 rounded-xl bg-[#FFF0F5] border border-[#FECDD3] text-xs">
          <div className="font-semibold text-[#E65378] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E65378]"></span>
            Flagged Text
          </div>
          <p className="text-[#15265B] italic font-medium leading-relaxed">
            &ldquo;{finding.original_text}&rdquo;
          </p>
        </div>

        {/* Suggested Content */}
        <div className="p-3 rounded-xl bg-[#E4F8F0] border border-[#A7F3D0] text-xs">
          <div className="font-semibold text-[#159B72] mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#159B72]"></span>
              Suggested Brand-Compliant Fix
            </span>
            {!readOnly && !isEditing && currentResolution === "pending" && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-[#2878F0] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Edit fix
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1 space-y-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#BED8F6] focus:outline-none focus:ring-2 focus:ring-[#2878F0] bg-white text-[#15265B]"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomSave}
                  className="px-2.5 py-1 text-xs bg-[#2878F0] text-white rounded font-medium hover:bg-blue-600"
                >
                  Save Custom Fix
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[#15265B] font-medium leading-relaxed">
              &ldquo;{currentResolution === "custom_edited" ? customText : finding.suggested_text}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Guidelines & Approved Reference Citations */}
      <div className="mt-4 pt-3 border-t border-[#E5F2FF] flex flex-wrap items-center justify-between gap-3 text-xs pl-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#2878F0]" />
            <span className="font-medium text-[#15265B]">Rule:</span>
            <span>{finding.guideline_reference}</span>
          </div>

          {finding.evidence_reference && (
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#159B72]" />
              <span className="font-medium text-[#15265B]">Source:</span>
              <span>{finding.evidence_reference}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!readOnly && (
          <div className="flex items-center gap-2">
            {currentResolution === "pending" ? (
              <>
                <button
                  onClick={handleReject}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleAccept}
                  className="px-3 py-1.5 rounded-lg bg-[#2878F0] text-white text-xs font-semibold hover:bg-[#1e62c9] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Accept Fix
                </button>
              </>
            ) : (
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 transition flex items-center gap-1"
              >
                <Undo2 className="w-3 h-3" /> Revert Decision
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
