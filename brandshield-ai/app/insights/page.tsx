"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, Brand } from "@/lib/types";
import {
  BarChart3,
  Download,
  Filter,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Flame,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function InsightsPage() {
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [exportNotice, setExportNotice] = useState<string>("");

  useEffect(() => {
    setSubmissions(InkloomStore.getSubmissions());
    setBrands(InkloomStore.getBrands());
  }, []);

  const issueCategoriesData = [
    { name: "Prohibited Terms", count: 18, fill: "#2878F0" },
    { name: "Unsupported Claims", count: 14, fill: "#E9A23B" },
    { name: "Tone & Voice", count: 11, fill: "#8064F5" },
    { name: "Factual Errors", count: 7, fill: "#E65378" },
    { name: "Accessibility", count: 6, fill: "#159B72" },
  ];

  const beforeAfterData = [
    { name: "Draft 1 (Raw)", violations: 24, compliance: 56 },
    { name: "Revision 1 (Accepted Fixes)", violations: 8, compliance: 82 },
    { name: "Final Approved Content", violations: 1, compliance: 96 },
  ];

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `inkloom_governance_report_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const csvRows = [
        ["ID", "Title", "Brand", "Channel", "Status", "Compliance Score"],
        ...submissions.map((s) => [
          s.id,
          `"${s.title.replace(/"/g, '""')}"`,
          s.brand_name,
          s.channel,
          s.status,
          s.latest_review?.overall_indicator || 0,
        ]),
      ];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `inkloom_governance_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    setExportNotice(`Governance report successfully exported as ${format.toUpperCase()}!`);
    setTimeout(() => setExportNotice(""), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8064F5] px-2.5 py-0.5 rounded-full bg-[#F2EFFF]">
              Organizational Learning
            </span>
            <span className="text-xs text-[#64748B]">• Governance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Brand Governance Insights
          </h1>
          <p className="text-xs text-[#64748B]">
            Aggregate compliance trends, recurring terminology pitfalls, and guideline clarification opportunities.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DCE9F8] bg-white text-xs font-semibold text-[#15265B] hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport("json")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Audit</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="pastel-card p-5 bg-white">
          <span className="text-xs text-[#64748B] font-semibold">Violation Reduction</span>
          <div className="text-2xl font-black text-[#159B72] mt-1 flex items-center gap-1">
            <TrendingDown className="w-5 h-5" /> -78%
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">From initial draft to approved publication</p>
        </div>

        <div className="pastel-card p-5 bg-white">
          <span className="text-xs text-[#64748B] font-semibold">Avg Approval Velocity</span>
          <div className="text-2xl font-black text-[#2878F0] mt-1">1.8 hrs</div>
          <p className="text-[11px] text-[#64748B] mt-1">25% reduction in editorial review turnaround</p>
        </div>

        <div className="pastel-card p-5 bg-white">
          <span className="text-xs text-[#64748B] font-semibold">Highest Confusion Guideline</span>
          <div className="text-sm font-extrabold text-[#E65378] mt-1">Pricing Superlatives</div>
          <p className="text-[11px] text-[#64748B] mt-1">Repeated misuse of &ldquo;cheapest&rdquo; / &ldquo;discount&rdquo;</p>
        </div>

        <div className="pastel-card p-5 bg-white">
          <span className="text-xs text-[#64748B] font-semibold">Fact Verification Accuracy</span>
          <div className="text-2xl font-black text-[#8064F5] mt-1">99.4%</div>
          <p className="text-[11px] text-[#64748B] mt-1">Claims backed by internal investor & audit sources</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Issue Breakdown */}
        <div className="pastel-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-[#15265B]">Most Frequent Issue Categories</h3>
          <p className="text-xs text-[#64748B]">Historical distribution across all reviewed campaigns</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueCategoriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5F2FF" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCE9F8",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#2878F0" radius={[6, 6, 0, 0]} name="Issues Flagged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Before vs After Impact */}
        <div className="pastel-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-[#15265B]">
            Before vs After Revision Compliance Progression
          </h3>
          <p className="text-xs text-[#64748B]">
            Compliance score improvement across content revision lifecycles
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5F2FF" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCE9F8",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="compliance" fill="#159B72" radius={[6, 6, 0, 0]} name="Compliance Score (0-100)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
