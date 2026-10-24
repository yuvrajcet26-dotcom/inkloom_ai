"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InkloomStore } from "@/lib/data/store";
import { ContentSubmission, Brand } from "@/lib/types";
import { StatusBadge } from "@/components/common/Badge";
import {
  Library,
  Search,
  Filter,
  PlusCircle,
  FileText,
  Calendar,
  User,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ContentLibraryPage() {
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    setSubmissions(InkloomStore.getSubmissions());
    setBrands(InkloomStore.getBrands());
  }, []);

  const filtered = submissions.filter((s) => {
    if (selectedBrand !== "all" && s.brand_id !== selectedBrand) return false;
    if (selectedType !== "all" && s.content_type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchBrand = s.brand_name.toLowerCase().includes(q);
      const matchContent = s.current_content.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchContent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Asset Repository
            </span>
            <span className="text-xs text-[#64748B]">• Unified Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Central Content Library
          </h1>
          <p className="text-xs text-[#64748B]">
            Search, filter, inspect revision histories, and reopen organizational marketing assets.
          </p>
        </div>

        <Link
          href="/review/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm hover:shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Content Review</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="pastel-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keywords, or brand..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
          />
        </div>

        {/* Brand & Type Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B]"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B]"
          >
            <option value="all">All Content Types</option>
            <option value="press_release">Press Release</option>
            <option value="blog_article">Blog Article</option>
            <option value="social_post">Social Media Post</option>
            <option value="email_campaign">Email Campaign</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="pastel-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFF] text-[#64748B] font-semibold border-b border-[#DCE9F8]">
              <tr>
                <th className="py-3.5 px-4">Title & Channel</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5F2FF]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#64748B]">
                    No content submissions match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const score = item.latest_review?.overall_indicator || 0;
                  return (
                    <tr key={item.id} className="hover:bg-[#F8FBFF]/60 transition">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/reviews/${item.id}`}
                          className="font-bold text-[#15265B] hover:text-[#2878F0] block leading-snug"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-[#64748B]">{item.channel}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#15265B]">{item.brand_name}</td>
                      <td className="py-3.5 px-4 capitalize text-[#8064F5] font-medium">
                        {item.content_type?.replace("_", " ")}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">{item.creator.name}</td>
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
                          {score}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {item.assigned_reviewer?.name || "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/reviews/${item.id}`}
                            className="px-2.5 py-1 rounded-lg border border-[#BED8F6] text-[#2878F0] hover:bg-[#E5F2FF] font-semibold text-[11px] transition"
                          >
                            Report
                          </Link>
                          <Link
                            href={`/reviews/${item.id}/edit`}
                            className="px-2.5 py-1 rounded-lg bg-[#2878F0] text-white hover:bg-blue-600 font-semibold text-[11px] transition"
                          >
                            Diff
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
