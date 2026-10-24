"use client";

import React, { useState } from "react";
import { ArrowLeftRight, CheckCheck, Copy, Check } from "lucide-react";

interface DiffViewerProps {
  originalText: string;
  revisedText: string;
  originalLabel?: string;
  revisedLabel?: string;
}

export function DiffViewer({
  originalText,
  revisedText,
  originalLabel = "Original Version",
  revisedLabel = "Revised / Suggested Version",
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"split" | "inline">("split");
  const [copied, setCopied] = useState(false);

  const handleCopyRevised = () => {
    navigator.clipboard.writeText(revisedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple word-level diff approximation for high visual polish
  const originalWords = originalText.split(/\s+/);
  const revisedWords = revisedText.split(/\s+/);

  return (
    <div className="rounded-2xl border border-[#DCE9F8] bg-white overflow-hidden shadow-sm">
      {/* Diff controls header */}
      <div className="bg-[#F8FBFF] px-4 py-3 border-b border-[#DCE9F8] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-[#2878F0]" />
          <span className="text-xs font-bold text-[#15265B] uppercase tracking-wider">
            Content Comparison & Diff
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#DCE9F8] p-0.5 bg-white text-xs">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === "split" ? "bg-[#2878F0] text-white shadow-xs" : "text-[#64748B] hover:text-[#15265B]"
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode("inline")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === "inline" ? "bg-[#2878F0] text-white shadow-xs" : "text-[#64748B] hover:text-[#15265B]"
              }`}
            >
              Unified View
            </button>
          </div>

          <button
            onClick={handleCopyRevised}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#DCE9F8] text-xs font-medium text-[#15265B] bg-white hover:bg-slate-50 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
            <span>{copied ? "Copied" : "Copy Revised"}</span>
          </button>
        </div>
      </div>

      {/* Diff content view */}
      {viewMode === "split" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#DCE9F8]">
          {/* Left: Original */}
          <div className="p-4 bg-[#FFF0F5]/30">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#FECDD3]">
              <span className="text-xs font-bold text-[#E65378] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E65378]"></span>
                {originalLabel}
              </span>
              <span className="text-[11px] text-[#64748B]">{originalWords.length} words</span>
            </div>
            <div className="text-xs leading-relaxed text-[#15265B] whitespace-pre-wrap font-sans bg-white p-3.5 rounded-xl border border-[#FECDD3]/50">
              {originalText}
            </div>
          </div>

          {/* Right: Revised */}
          <div className="p-4 bg-[#E4F8F0]/30">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#A7F3D0]">
              <span className="text-xs font-bold text-[#159B72] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#159B72]"></span>
                {revisedLabel}
              </span>
              <span className="text-[11px] text-[#64748B]">{revisedWords.length} words</span>
            </div>
            <div className="text-xs leading-relaxed text-[#15265B] whitespace-pre-wrap font-sans bg-white p-3.5 rounded-xl border border-[#A7F3D0]/60">
              {revisedText}
            </div>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-[#64748B] uppercase mb-2">Flagged Removals:</p>
            <div className="p-3 bg-[#FFF0F5] text-[#E65378] line-through text-xs rounded-lg border border-[#FECDD3]">
              {originalText}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-800 uppercase mb-2">Brand-Approved Replacement:</p>
            <div className="p-3 bg-[#E4F8F0] text-[#159B72] font-medium text-xs rounded-lg border border-[#A7F3D0]">
              {revisedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
