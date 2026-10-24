"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Cpu,
  UserCheck,
  Eye,
  FileCheck2,
  FileCode,
  Server,
  Zap,
} from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F2FF] text-[#2878F0] text-xs font-bold border border-[#BED8F6]">
          <Layers className="w-3.5 h-3.5 text-[#8064F5]" />
          <span>Master System Architecture & Innovation Pillars</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15265B] tracking-tight">
          How Inkloom AI Works: End-to-End Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          A secure, modular, and scalable multi-layer pipeline designed for pre-publication brand governance, grounded in organizational guidelines and human oversight.
        </p>
      </div>

      {/* Visual Pipeline Flow matching PPT Slide 6 */}
      <div className="pastel-card p-6 sm:p-10 bg-white space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE9F8]">
          <h2 className="text-base font-extrabold text-[#15265B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2878F0]" />
            <span>Interactive Dataflow Architecture (Matching Presentation Slide 6)</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2878F0]">1. Blue: UI Layer</span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-[#8064F5]">2. Purple: Backend</span>
            <span className="px-2 py-0.5 rounded bg-pink-100 text-[#E65378]">3. Pink: AI Analysis</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#159B72]">4. Green: Knowledge Base</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-[#D97706]">5. Yellow: Human Review</span>
          </div>
        </div>

        {/* The 8 Architectural Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Node 1: Users */}
          <div className="p-4 rounded-2xl bg-[#E5F2FF] border border-[#BED8F6] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#2878F0]">1. Users</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#2878F0]">UI</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Content Creators, Marketing Teams, Agencies, & Brand Managers.
            </p>
          </div>

          {/* Node 2: Upload Content */}
          <div className="p-4 rounded-2xl bg-[#E5F2FF] border border-[#BED8F6] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#2878F0]">2. Upload & Input</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#2878F0]">Multimodal</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Text articles, social copy, PDF documents, DOCX, and visual imagery.
            </p>
          </div>

          {/* Node 3: Backend API */}
          <div className="p-4 rounded-2xl bg-[#F2EFFF] border border-[#D7CCFC] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#8064F5]">3. Backend API</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#8064F5]">Server</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Next.js server-side API, auth verification, file extraction, RBAC enforcement.
            </p>
          </div>

          {/* Node 4: Brand Context */}
          <div className="p-4 rounded-2xl bg-[#E4F8F0] border border-[#A7F3D0] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#159B72]">4. Context DB</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#159B72]">Grounding</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Loads guidelines, approved internal facts, prohibited terms, and asset rules.
            </p>
          </div>

          {/* Node 5: AI Brand Check */}
          <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#FECDD3] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#E65378]">5. AI Analysis Engine</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#E65378]">Multi-Tier</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Deterministic terms + Gemini/OpenAI tone checks + fact verification + accessibility.
            </p>
          </div>

          {/* Node 6: Explainable Results */}
          <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#FECDD3] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#E65378]">6. Structured Findings</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#E65378]">Explainable</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Explains each detection, cites relevant guideline, provides intent-preserving fixes.
            </p>
          </div>

          {/* Node 7: Human Review */}
          <div className="p-4 rounded-2xl bg-[#FFF7DF] border border-[#FDE68A] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#D97706]">7. Human Review</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#D97706]">In-the-Loop</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Creator edits and diffs ↔ Manager review ↔ Formal approval or change request.
            </p>
          </div>

          {/* Node 8: Output & Insights */}
          <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BED8F6] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#2878F0]">8. Output & Insights</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#2878F0]">Intelligence</span>
            </div>
            <p className="text-[#15265B] font-medium leading-relaxed">
              Publication-ready content, complete audit trail, and recurring mistake insights.
            </p>
          </div>
        </div>
      </div>

      {/* Six Innovation Pillars Details */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#15265B]">
            The Six Originality & Innovation Pillars
          </h2>
          <p className="text-xs text-[#64748B]">
            Core competitive differentiators established in the project specification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F2FF] text-[#2878F0]">
              Pillar 1
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Context-Aware Brand Intelligence</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Unlike generic spell-checkers or standard LLMs, Inkloom AI checks content strictly against your company&apos;s stored brand guidelines, approved facts, and prohibited vocabularies.
            </p>
          </div>

          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#E65378]">
              Pillar 2
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Multi-Modal Governance</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Supports plain text, press releases, documents (PDF/DOCX), and visual brand assets (logos, images), providing comprehensive pre-publication governance.
            </p>
          </div>

          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F8F0] text-[#159B72]">
              Pillar 3
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Explainable & Actionable Feedback</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Never outputs black-box rejection codes. Every finding explains why it matters, references the specific brand rule or approved source, and gives an editable correction.
            </p>
          </div>

          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7DF] text-[#D97706]">
              Pillar 4
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Human-in-the-Loop Workflow</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              AI provides decision-support and suggestions, but human brand managers and reviewers retain absolute publishing authority. Full diff comparisons and threaded comments enable smooth collaboration.
            </p>
          </div>

          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2EFFF] text-[#8064F5]">
              Pillar 5
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Governance Insights</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Aggregates historical review data to detect recurring terminology pitfalls and identify guidelines that confuse content creators, driving continuous organizational improvement.
            </p>
          </div>

          <div className="pastel-card p-6 bg-white space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Pillar 6
            </span>
            <h3 className="text-base font-bold text-[#15265B]">Secure, Confidential & Auditable</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Role-based access control (Admin, Manager, Reviewer, Creator), complete audit log trail for every action, secure server-side AI calls, and private data retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
