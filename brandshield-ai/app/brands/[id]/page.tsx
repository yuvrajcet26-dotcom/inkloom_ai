"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InkloomStore } from "@/lib/data/store";
import { Brand, TerminologyRule, ApprovedFact } from "@/lib/types";
import {
  BookOpen,
  ChevronLeft,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Layers,
  Sparkles,
  Trash2,
  UploadCloud,
  Palette,
  Eye,
  Type,
  FileText,
} from "lucide-react";

export default function BrandDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [activeTab, setActiveTab] = useState<string>("terminology");
  const [showAddTermModal, setShowAddTermModal] = useState<boolean>(false);
  const [showAddFactModal, setShowAddFactModal] = useState<boolean>(false);

  // New Term Form State
  const [newProhibited, setNewProhibited] = useState<string>("");
  const [newApproved, setNewApproved] = useState<string>("");
  const [newReason, setNewReason] = useState<string>("");
  const [newCategory, setNewCategory] = useState<any>("product_naming");

  // New Fact Form State
  const [newFactText, setNewFactText] = useState<string>("");
  const [newSourceRef, setNewSourceRef] = useState<string>("");

  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    if (id) {
      const b = InkloomStore.getBrandById(id);
      if (b) setBrand(b);
    }
  }, [id]);

  if (!brand) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-[#15265B]">Brand not found</h2>
        <Link href="/brands" className="text-xs text-[#2878F0] underline mt-2 block">
          Return to Brands list
        </Link>
      </div>
    );
  }

  const handleAddTerminology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProhibited.trim() || !newApproved.trim()) return;

    const newRule: TerminologyRule = {
      id: "term-" + Math.random().toString(36).substring(2, 9),
      prohibited_term: newProhibited.trim(),
      approved_alternative: newApproved.trim(),
      rule_reason: newReason.trim() || "Brand consistency guideline violation.",
      category: newCategory,
    };

    brand.terminology_rules = brand.terminology_rules || [];
    brand.terminology_rules.unshift(newRule);
    brand.updated_at = new Date().toISOString();

    InkloomStore.saveBrand(brand);
    setBrand({ ...brand });
    setShowAddTermModal(false);
    setNewProhibited("");
    setNewApproved("");
    setNewReason("");
    setStatusMessage("New terminology rule added to brand profile!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim() || !newSourceRef.trim()) return;

    const newFact: ApprovedFact = {
      id: "fact-" + Math.random().toString(36).substring(2, 9),
      brand_id: brand.id,
      fact_text: newFactText.trim(),
      source_reference: newSourceRef.trim(),
      status: "active",
      valid_from: new Date().toISOString().split("T")[0],
    };

    brand.approved_facts = brand.approved_facts || [];
    brand.approved_facts.unshift(newFact);
    brand.updated_at = new Date().toISOString();

    InkloomStore.saveBrand(brand);
    setBrand({ ...brand });
    setShowAddFactModal(false);
    setNewFactText("");
    setNewSourceRef("");
    setStatusMessage("Approved internal fact added to verification repository!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDeleteTerm = (termId: string) => {
    brand.terminology_rules = brand.terminology_rules.filter((t) => t.id !== termId);
    InkloomStore.saveBrand(brand);
    setBrand({ ...brand });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back button & Title */}
      <div className="pb-4 border-b border-[#DCE9F8] space-y-2">
        <Link
          href="/brands"
          className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to All Brands</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">{brand.name}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#E5F2FF] text-[#2878F0]">
                v{brand.version}
              </span>
            </div>
            <p className="text-xs text-[#8064F5] font-semibold mt-0.5">{brand.tagline}</p>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl">{brand.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTermModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Terminology Rule</span>
            </button>
            <button
              onClick={() => setShowAddFactModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#159B72] text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Add Approved Fact</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE9F8] pb-2">
        <button
          onClick={() => setActiveTab("terminology")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "terminology"
              ? "bg-[#2878F0] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#15265B] hover:bg-white"
          }`}
        >
          Prohibited & Approved Terms ({brand.terminology_rules?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("facts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "facts"
              ? "bg-[#2878F0] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#15265B] hover:bg-white"
          }`}
        >
          Approved Facts & Citations ({brand.approved_facts?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("tone")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "tone"
              ? "bg-[#2878F0] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#15265B] hover:bg-white"
          }`}
        >
          Voice & Tone Guidelines
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "assets"
              ? "bg-[#2878F0] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#15265B] hover:bg-white"
          }`}
        >
          Visual Assets & Typography
        </button>

        <button
          onClick={() => setActiveTab("accessibility")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "accessibility"
              ? "bg-[#2878F0] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#15265B] hover:bg-white"
          }`}
        >
          Accessibility Standards
        </button>
      </div>

      {/* Tab 1: Terminology Rules */}
      {activeTab === "terminology" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              These terms are checked deterministically and via AI during content review.
            </p>
            <button
              onClick={() => setShowAddTermModal(true)}
              className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Rule</span>
            </button>
          </div>

          <div className="pastel-card overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FBFF] text-[#64748B] font-semibold border-b border-[#DCE9F8]">
                <tr>
                  <th className="py-3 px-4">Prohibited Phrase</th>
                  <th className="py-3 px-4">Approved Replacement</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rule Reason & Context</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5F2FF]">
                {brand.terminology_rules?.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#F8FBFF]/60 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#E65378] bg-[#FFF0F5] px-2 py-0.5 rounded border border-[#FECDD3]">
                        {rule.prohibited_term}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#159B72] bg-[#E4F8F0] px-2 py-0.5 rounded border border-[#A7F3D0]">
                        {rule.approved_alternative}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-[#8064F5] font-semibold text-[11px]">
                        {rule.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] max-w-xs">{rule.rule_reason}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTerm(rule.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Approved Facts */}
      {activeTab === "facts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              Factual statements in content are verified against these validated company records.
            </p>
            <button
              onClick={() => setShowAddFactModal(true)}
              className="text-xs font-bold text-[#159B72] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Verified Fact</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.approved_facts?.map((fact) => (
              <div key={fact.id} className="pastel-card p-5 bg-white space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F8F0] text-[#159B72] border border-[#A7F3D0]">
                    Verified Source
                  </span>
                  <span className="text-[10px] text-slate-400">ID: {fact.id}</span>
                </div>
                <p className="text-xs font-semibold text-[#15265B] leading-relaxed">
                  &ldquo;{fact.fact_text}&rdquo;
                </p>
                <div className="pt-2 border-t border-[#E5F2FF] text-[11px] text-[#64748B] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2878F0]" />
                  <span>
                    <strong className="text-[#15265B]">Citation:</strong> {fact.source_reference}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Voice & Tone */}
      {activeTab === "tone" && (
        <div className="pastel-card p-6 sm:p-8 bg-white space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#15265B] uppercase tracking-wider mb-2">
              Primary Brand Tone
            </h3>
            <div className="p-4 rounded-2xl bg-[#E5F2FF] border border-[#BED8F6] text-xs font-semibold text-[#2878F0]">
              {brand.tone_guidelines.primary_tone}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#15265B] uppercase tracking-wider mb-3">
              Core Voice Attributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {brand.tone_guidelines.voice_attributes?.map((attr, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] text-xs space-y-1">
                  <h4 className="font-bold text-[#15265B]">{attr.attribute}</h4>
                  <p className="text-[#64748B] leading-relaxed">{attr.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#E65378] uppercase tracking-wider mb-3">
              Tones to Avoid (Red Flags)
            </h3>
            <div className="flex flex-wrap gap-2">
              {brand.tone_guidelines.avoid_tones?.map((tone, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0F5] border border-[#FECDD3] text-[#E65378] text-xs font-semibold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E65378]"></span>
                  {tone}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Assets & Visuals */}
      {activeTab === "assets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brand.assets?.map((asset) => (
              <div key={asset.id} className="pastel-card p-5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {asset.asset_type}
                  </span>
                  <Palette className="w-4 h-4 text-[#2878F0]" />
                </div>
                <h4 className="font-bold text-xs text-[#15265B]">{asset.asset_name}</h4>
                <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-700">
                  {asset.url_or_value}
                </div>
                <p className="text-[11px] text-[#64748B] pt-1 border-t border-slate-100">
                  <strong className="text-[#15265B]">Rule:</strong> {asset.rules}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Accessibility */}
      {activeTab === "accessibility" && (
        <div className="pastel-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-[#15265B]">Accessibility & Inclusivity Rules</h3>
          <ul className="space-y-2 text-xs text-[#15265B]">
            {brand.accessibility_standards?.map((std, i) => (
              <li key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8]">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0 mt-0.5" />
                <span>{std}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal: Add Terminology */}
      {showAddTermModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTerminology}
            className="w-full max-w-md rounded-3xl bg-white border border-[#DCE9F8] p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-extrabold text-[#15265B]">Add Prohibited Terminology Rule</h3>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Prohibited Phrase *</label>
              <input
                type="text"
                value={newProhibited}
                onChange={(e) => setNewProhibited(e.target.value)}
                placeholder="e.g. cheapest cloud"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Approved Alternative *</label>
              <input
                type="text"
                value={newApproved}
                onChange={(e) => setNewApproved(e.target.value)}
                placeholder="e.g. cost-optimized cloud infrastructure"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
              >
                <option value="product_naming">Product Naming</option>
                <option value="legal">Legal & Liability</option>
                <option value="tone">Tone & Voice</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Rule Reason & Rationale</label>
              <textarea
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                rows={2}
                placeholder="Why is this term prohibited?"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTermModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2878F0] text-white text-xs font-bold rounded-xl"
              >
                Save Term Rule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Fact */}
      {showAddFactModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddFact}
            className="w-full max-w-md rounded-3xl bg-white border border-[#DCE9F8] p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-extrabold text-[#15265B]">Add Approved Fact</h3>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Verified Fact Statement *</label>
              <textarea
                value={newFactText}
                onChange={(e) => setNewFactText(e.target.value)}
                placeholder="e.g. NovaTech delivers 99.99% SLA uptime on all Enterprise Cloud clusters."
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#15265B] mb-1">Source Reference / Citation *</label>
              <input
                type="text"
                value={newSourceRef}
                onChange={(e) => setNewSourceRef(e.target.value)}
                placeholder="e.g. Master Services Agreement 2026 §4.2"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFactModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#159B72] text-white text-xs font-bold rounded-xl"
              >
                Save Fact
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
