"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, Brand } from "@/lib/types";
import { StatusBadge, SeverityBadge } from "@/components/common/Badge";
import { ComplianceGauge } from "@/components/common/ComplianceGauge";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingUp,
  Filter,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSubmissions(InkloomStore.getSubmissions());
    setBrands(InkloomStore.getBrands());
  }, []);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (selectedBrand !== "all" && s.brand_id !== selectedBrand) return false;
    if (selectedStatus !== "all" && s.status !== selectedStatus) return false;
    return true;
  });

  // Calculate Metrics from stored submissions
  const totalSubmissions = submissions.length;
  const awaitingReview = submissions.filter(
    (s) => s.status === "submitted_for_review" || s.status === "resubmitted" || s.status === "in_review"
  ).length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const changesRequestedCount = submissions.filter((s) => s.status === "changes_requested").length;

  // High priority unresolved issues
  const highPriorityIssues = submissions.reduce((acc, sub) => {
    if (!sub.latest_review) return acc;
    const unresolvedHigh = sub.latest_review.findings.filter(
      (f) => f.severity === "high" && f.resolution_status === "pending"
    ).length;
    return acc + unresolvedHigh;
  }, 0);

  // Deterministic chart data
  const trendData = [
    { date: "Oct 16", complianceScore: 72, submissions: 3 },
    { date: "Oct 17", complianceScore: 76, submissions: 5 },
    { date: "Oct 18", complianceScore: 81, submissions: 4 },
    { date: "Oct 19", complianceScore: 85, submissions: 7 },
    { date: "Oct 20", complianceScore: 88, submissions: 6 },
    { date: "Oct 21", complianceScore: 84, submissions: 8 },
    { date: "Oct 22", complianceScore: 91, submissions: 9 },
  ];

  const categoryDistribution = [
    { category: "Terminology", count: 14, color: "#2878F0" },
    { category: "Tone & Voice", count: 9, color: "#8064F5" },
    { category: "Unsupported Claims", count: 11, color: "#E9A23B" },
    { category: "Facts Check", count: 6, color: "#E65378" },
    { category: "Accessibility", count: 5, color: "#159B72" },
  ];

  const recurringIssues = [
    {
      term: "'cheapest cloud' / 'dirt-cheap'",
      count: 7,
      category: "Prohibited Vocabulary",
      impact: "Damages luxury/enterprise brand prestige",
      action: "Enforce automated rule in pre-commit",
    },
    {
      term: "'100% unbreakable' / 'foolproof'",
      count: 5,
      category: "Legal & Liability",
      impact: "Violates legal liability & compliance policy",
      action: "Substitute with 'resilient zero-trust architecture'",
    },
    {
      term: "Missing Customer Metric Citation",
      count: 4,
      category: "Fact Verification",
      impact: "Unsubstantiated stats risk trust erosion",
      action: "Link to Investor Briefing source repository",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Governance Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">• Live Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B] mt-1">
            Executive Brand Dashboard
          </h1>
          <p className="text-xs text-[#64748B]">
            Real-time compliance monitoring, pre-publication queues, and recurring risk analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/review/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Review New Content</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Submissions */}
        <div className="pastel-card p-4">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="text-xs font-semibold">Submissions</span>
            <FileText className="w-4 h-4 text-[#2878F0]" />
          </div>
          <div className="text-2xl font-black text-[#15265B]">{totalSubmissions}</div>
          <div className="text-[11px] text-[#159B72] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </div>
        </div>

        {/* Awaiting Review */}
        <div className="pastel-card p-4 border-[#BED8F6] bg-[#F8FBFF]">
          <div className="flex items-center justify-between text-[#2878F0] mb-1">
            <span className="text-xs font-semibold">In Review Queue</span>
            <Clock className="w-4 h-4 text-[#2878F0]" />
          </div>
          <div className="text-2xl font-black text-[#2878F0]">{awaitingReview}</div>
          <div className="text-[11px] text-[#64748B] font-medium mt-1">Requires manager review</div>
        </div>

        {/* Approved Content */}
        <div className="pastel-card p-4 border-[#A7F3D0] bg-[#E4F8F0]/20">
          <div className="flex items-center justify-between text-[#159B72] mb-1">
            <span className="text-xs font-semibold">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-[#159B72]" />
          </div>
          <div className="text-2xl font-black text-[#159B72]">{approvedCount}</div>
          <div className="text-[11px] text-[#159B72] font-medium mt-1">Ready for publish</div>
        </div>

        {/* Changes Requested */}
        <div className="pastel-card p-4 border-[#FDE68A] bg-[#FFF7DF]/30">
          <div className="flex items-center justify-between text-[#D97706] mb-1">
            <span className="text-xs font-semibold">Revisions Needed</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-[#D97706]">{changesRequestedCount}</div>
          <div className="text-[11px] text-[#64748B] font-medium mt-1">Pending creator edits</div>
        </div>

        {/* High Priority Issues */}
        <div className="pastel-card p-4 border-[#FECDD3] bg-[#FFF0F5]/30">
          <div className="flex items-center justify-between text-[#E65378] mb-1">
            <span className="text-xs font-semibold">High Priority</span>
            <Flame className="w-4 h-4 text-[#E65378]" />
          </div>
          <div className="text-2xl font-black text-[#E65378]">{highPriorityIssues}</div>
          <div className="text-[11px] text-[#E65378] font-semibold mt-1">Requires immediate fix</div>
        </div>

        {/* Turnaround Time */}
        <div className="pastel-card p-4">
          <div className="flex items-center justify-between text-[#8064F5] mb-1">
            <span className="text-xs font-semibold">Avg Turnaround</span>
            <Clock className="w-4 h-4 text-[#8064F5]" />
          </div>
          <div className="text-2xl font-black text-[#15265B]">1.8 hrs</div>
          <div className="text-[11px] text-[#159B72] font-semibold mt-1">25% faster than SLA</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Trend Chart */}
        <div className="lg:col-span-7 pastel-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#15265B]">Brand Compliance Trend</h3>
              <p className="text-xs text-[#64748B]">Average compliance score over the past 7 days</p>
            </div>
            <span className="text-xs font-extrabold text-[#159B72] bg-[#E4F8F0] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
              91% Current Avg
            </span>
          </div>

          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2878F0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8064F5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5F2FF" />
                  <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCE9F8",
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="complianceScore"
                    stroke="#2878F0"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    name="Compliance Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Issue Distribution by Category */}
        <div className="lg:col-span-5 pastel-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#15265B]">Issue Distribution</h3>
              <p className="text-xs text-[#64748B]">Flagged violations by governance category</p>
            </div>
            <span className="text-xs font-bold text-[#8064F5] bg-[#F2EFFF] px-2 py-0.5 rounded-md">
              45 Total Flags
            </span>
          </div>

          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5F2FF" />
                  <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} />
                  <YAxis type="category" dataKey="category" tick={{ fill: "#15265B", fontSize: 11, fontWeight: 500 }} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCE9F8",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#8064F5" radius={[0, 8, 8, 0]} name="Issues Flagged" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recurring Issues & Governance Alerts */}
      <div className="pastel-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8064F5]" />
              <span>Recurring Brand Violations (Governance Insights)</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Frequently repeated mistakes identified across multiple teams and campaigns.
            </p>
          </div>
          <Link
            href="/insights"
            className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
          >
            <span>Deep Dive in Insights</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recurringIssues.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#E65378] bg-[#FFF0F5] px-2 py-0.5 rounded border border-[#FECDD3]">
                  {item.term}
                </span>
                <span className="text-[10px] font-extrabold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {item.count} occurrences
                </span>
              </div>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                <strong className="text-[#15265B]">Impact:</strong> {item.impact}
              </p>
              <div className="pt-2 border-t border-[#E5F2FF] text-[10px] text-[#2878F0] font-semibold flex items-center gap-1">
                <span>Recommendation:</span> {item.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Table with Filters */}
      <div className="pastel-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#15265B]">Recent Content Submissions</h3>
            <p className="text-xs text-[#64748B]">
              Inspect findings, accept suggestions, and manage approvals.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#64748B] mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B] focus:outline-none focus:ring-1 focus:ring-[#2878F0]"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B] focus:outline-none focus:ring-1 focus:ring-[#2878F0]"
            >
              <option value="all">All Statuses</option>
              <option value="submitted_for_review">Submitted for Review</option>
              <option value="in_review">In Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFF] text-[#64748B] font-semibold border-y border-[#DCE9F8]">
              <tr>
                <th className="py-3 px-4">Title & Channel</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4 text-center">Compliance</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5F2FF]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B]">
                    No submissions found matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const score = sub.latest_review?.overall_indicator || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-[#F8FBFF]/60 transition">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/reviews/${sub.id}`}
                          className="font-bold text-[#15265B] hover:text-[#2878F0] block leading-snug"
                        >
                          {sub.title}
                        </Link>
                        <span className="text-[10px] text-[#64748B] mt-0.5 block">{sub.channel}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#15265B]">{sub.brand_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {sub.creator.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded text-xs ${
                            score >= 85
                              ? "bg-[#E4F8F0] text-[#159B72]"
                              : score >= 60
                              ? "bg-[#FFF7DF] text-[#D97706]"
                              : "bg-[#FFF0F5] text-[#E65378]"
                          }`}
                        >
                          {score}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {sub.assigned_reviewer?.name || "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/reviews/${sub.id}`}
                            className="px-2.5 py-1 rounded-lg border border-[#BED8F6] text-[#2878F0] hover:bg-[#E5F2FF] font-semibold text-[11px] transition"
                          >
                            Findings
                          </Link>
                          <Link
                            href={`/reviews/${sub.id}/edit`}
                            className="px-2.5 py-1 rounded-lg bg-[#2878F0] text-white hover:bg-[#1e62c9] font-semibold text-[11px] transition"
                          >
                            Revise
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
