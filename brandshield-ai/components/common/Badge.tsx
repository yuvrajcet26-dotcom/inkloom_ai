import React from "react";
import { SubmissionStatus, FindingSeverity, VerificationStatus, UserRole } from "@/lib/types";

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const configs: Record<SubmissionStatus, { label: string; bg: string; text: string; border: string }> = {
    draft: {
      label: "Draft",
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
    },
    submitted_for_review: {
      label: "Submitted for Review",
      bg: "bg-[#E5F2FF]",
      text: "text-[#2878F0]",
      border: "border-[#BED8F6]",
    },
    in_review: {
      label: "In Review",
      bg: "bg-[#F2EFFF]",
      text: "text-[#8064F5]",
      border: "border-[#D7CCFC]",
    },
    changes_requested: {
      label: "Changes Requested",
      bg: "bg-[#FFF7DF]",
      text: "text-[#B45309]",
      border: "border-[#FDE68A]",
    },
    resubmitted: {
      label: "Resubmitted",
      bg: "bg-[#E5F2FF]",
      text: "text-[#1E40AF]",
      border: "border-[#93C5FD]",
    },
    approved: {
      label: "Approved",
      bg: "bg-[#E4F8F0]",
      text: "text-[#159B72]",
      border: "border-[#A7F3D0]",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-[#FFF0F5]",
      text: "text-[#E65378]",
      border: "border-[#FECDD3]",
    },
    archived: {
      label: "Archived",
      bg: "bg-gray-100",
      text: "text-gray-500",
      border: "border-gray-300",
    },
  };

  const c = configs[status] || configs.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {c.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const configs: Record<FindingSeverity, { label: string; bg: string; text: string; border: string }> = {
    high: {
      label: "High Priority",
      bg: "bg-[#FFF0F5]",
      text: "text-[#E65378]",
      border: "border-[#FECDD3]",
    },
    medium: {
      label: "Medium",
      bg: "bg-[#FFF7DF]",
      text: "text-[#D97706]",
      border: "border-[#FDE68A]",
    },
    low: {
      label: "Low",
      bg: "bg-[#E5F2FF]",
      text: "text-[#2878F0]",
      border: "border-[#BED8F6]",
    },
  };

  const c = configs[severity] || configs.low;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const configs: Record<VerificationStatus, { label: string; bg: string; text: string; border: string }> = {
    confirmed_conflict: {
      label: "Confirmed Conflict",
      bg: "bg-red-50",
      text: "text-rose-700",
      border: "border-red-200",
    },
    unsupported_claim: {
      label: "Unsupported Claim",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    uncertain_finding: {
      label: "Uncertain / Advisory",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  };

  const c = configs[status] || configs.uncertain_finding;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const labels: Record<UserRole, { label: string; color: string }> = {
    admin: { label: "Admin", color: "bg-[#F2EFFF] text-[#8064F5] border-[#D7CCFC]" },
    brand_manager: { label: "Brand Manager", color: "bg-[#E5F2FF] text-[#2878F0] border-[#BED8F6]" },
    reviewer: { label: "Reviewer", color: "bg-[#E4F8F0] text-[#159B72] border-[#A7F3D0]" },
    creator: { label: "Creator", color: "bg-[#FFF7DF] text-[#D97706] border-[#FDE68A]" },
  };

  const r = labels[role];
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${r.color}`}>
      {r.label}
    </span>
  );
}
