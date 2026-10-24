"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users2,
  Building2,
  ShieldAlert,
  SlidersHorizontal,
  BarChart4,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  FileText,
  Clock,
  ThumbsUp,
  Cpu,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  const workflowSteps = [
    {
      step: 1,
      title: "Upload Content",
      desc: "Creators upload text, images, PDF/DOCX or marketing copy through the platform.",
      icon: UploadCloud,
      color: "bg-[#E5F2FF] text-[#2878F0] border-[#BED8F6]",
    },
    {
      step: 2,
      title: "AI Brand Review",
      desc: "AI analyses content against verified brand guidelines, approved facts, and policies.",
      icon: Cpu,
      color: "bg-[#F2EFFF] text-[#8064F5] border-[#D7CCFC]",
    },
    {
      step: 3,
      title: "Identify Issues",
      desc: "System detects and flags inconsistencies in tone, terminology, facts, visuals, & accessibility.",
      icon: AlertTriangle,
      color: "bg-[#FFF0F5] text-[#E65378] border-[#FECDD3]",
    },
    {
      step: 4,
      title: "Suggest Corrections",
      desc: "Provides clear explanations and actionable suggestions while preserving the creator's intent.",
      icon: Lightbulb,
      color: "bg-[#FFF7DF] text-[#D97706] border-[#FDE68A]",
    },
    {
      step: 5,
      title: "Human Approval",
      desc: "Reviewers and managers verify suggestions, make final decisions, and approve for publishing.",
      icon: CheckCircle2,
      color: "bg-[#E4F8F0] text-[#159B72] border-[#A7F3D0]",
    },
  ];

  const problemPoints = [
    {
      title: "Inconsistent Brand Voice",
      desc: "Content fails to follow approved tone, language, and terminology across fragmented teams.",
      icon: "🗣️",
      bg: "bg-[#E5F2FF]",
    },
    {
      title: "Incorrect Information",
      desc: "Outdated facts, unsupported claims, and misleading statements cause serious reputational risk.",
      icon: "❌",
      bg: "bg-[#FFF0F5]",
    },
    {
      title: "Visual Inconsistency",
      desc: "Incorrect logos, unapproved color palettes, and font mismatches weaken brand identity.",
      icon: "🎨",
      bg: "bg-[#FFF7DF]",
    },
    {
      title: "Lack of Quality Control",
      desc: "Reviewing large volumes of content manually is slow, error-prone, and bottlenecked.",
      icon: "⏱️",
      bg: "bg-[#F2EFFF]",
    },
    {
      title: "Limited Accountability",
      desc: "Tracking feedback, revisions, and managerial approvals across teams is challenging and untraceable.",
      icon: "👥",
      bg: "bg-[#E4F8F0]",
    },
  ];

  const targetUsers = [
    {
      role: "Marketing Teams",
      desc: "Ensure all campaigns, social copy, and promotional media adhere strictly to brand guidelines.",
      badge: "Campaign Speed",
      color: "border-[#BED8F6] bg-blue-50/50",
    },
    {
      role: "Content Creators",
      desc: "Get real-time feedback, tone coaching, and instant verified corrections before publishing.",
      badge: "Instant Feedback",
      color: "border-[#D7CCFC] bg-purple-50/50",
    },
    {
      role: "Agencies & Partners",
      desc: "Deliver on-brand multi-client content with measurable confidence and documented sign-offs.",
      badge: "Multi-Brand Scale",
      color: "border-[#A7F3D0] bg-emerald-50/50",
    },
    {
      role: "Brand Managers",
      desc: "Maintain brand integrity, audit performance, enforce policies, and supervise approvals.",
      badge: "Human Oversight",
      color: "border-[#FDE68A] bg-amber-50/50",
    },
  ];

  const innovationPillars = [
    {
      title: "Context-Aware Brand Intelligence",
      desc: "Checks content against your organisation's actual guidelines and approved facts—not generic keyword matching.",
      badge: "Our Advantage",
      color: "bg-[#E5F2FF] text-[#2878F0]",
    },
    {
      title: "Multi-Modal Review",
      desc: "Comprehensive review across text, documents (PDF/DOCX), and visual brand assets (logos, images).",
      badge: "Multi-Format",
      color: "bg-[#FFF0F5] text-[#E65378]",
    },
    {
      title: "Explainable & Actionable Feedback",
      desc: "Doesn't just flag issues—explains why, cites the exact guideline or source, and suggests intent-preserving fixes.",
      badge: "Transparent AI",
      color: "bg-[#E4F8F0] text-[#159B72]",
    },
    {
      title: "Human-in-the-Loop Workflow",
      desc: "Creators, reviewers, and managers collaborate through comments, revision diffs, and formal approval decisions.",
      badge: "Human Control",
      color: "bg-[#FFF7DF] text-[#D97706]",
    },
    {
      title: "Governance Insights",
      desc: "Identifies recurring mistakes, guideline confusion gaps, and trends to help teams improve over time.",
      badge: "Continuous Learning",
      color: "bg-[#F2EFFF] text-[#8064F5]",
    },
    {
      title: "Secure & Confidential",
      desc: "Protects brand assets and sensitive data with role-based access control, audit logs, and private storage.",
      badge: "Enterprise Grade",
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section matching PPT Slide 1 */}
      <section className="relative pt-6 pb-12 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5F2FF] border border-[#BED8F6] text-xs font-bold text-[#2878F0]">
              <Sparkles className="w-4 h-4 text-[#8064F5]" />
              <span>Next-Gen Intelligent Brand Governance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#15265B] tracking-tight leading-[1.12]">
              Every Content Piece. <br />
              <span className="brand-gradient-text">On Brand. Every Time.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed">
              Inkloom AI transforms brand compliance from a slow, manual bottleneck into an explainable, collaborative, and human-guided workflow. Review copy, verify facts, detect tone drift, and approve with confidence before publication.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/review/new"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl brand-gradient text-white font-bold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-md"
              >
                <span>Start Reviewing Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-[#DCE9F8] bg-white text-[#15265B] font-bold text-sm hover:bg-[#F4FAFF] hover:border-[#BED8F6] transition shadow-xs"
              >
                <span>Explore Executive Dashboard</span>
              </Link>

              <Link
                href="/architecture"
                className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-[#8064F5] hover:underline"
              >
                <Layers className="w-4 h-4" />
                <span>View System Architecture</span>
              </Link>
            </div>

            {/* Key badges matching slide 1 footer */}
            <div className="pt-6 border-t border-[#DCE9F8] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-[#15265B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72]" />
                <span>Consistent Brands</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8064F5]" />
                <span>Trusted Content</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2878F0]" />
                <span>Stronger Impact</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup matching PPT Slide 1 & 4 */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-white border border-[#DCE9F8] p-6 shadow-xl space-y-4">
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#15265B]">Inkloom AI Shield</div>
                    <div className="text-[10px] text-[#64748B]">Pre-Publication Governance</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F8F0] text-[#159B72]">
                  Live Analysis
                </span>
              </div>

              {/* Floating review card simulation */}
              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#DCE9F8] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#15265B]">NovaTech Cloud Q4 Launch</span>
                  <span className="font-extrabold text-[#E65378] bg-[#FFF0F5] px-2 py-0.5 rounded-md text-[11px]">
                    54 / 100
                  </span>
                </div>

                {/* Simulated violation card */}
                <div className="p-3 rounded-xl bg-white border border-[#FECDD3] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#E65378]">Prohibited Terminology</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-rose-800 font-bold">High</span>
                  </div>
                  <p className="text-[11px] text-[#15265B] italic">
                    &ldquo;cheapest cloud on the market with foolproof security...&rdquo;
                  </p>
                  <p className="text-[10px] text-[#159B72] font-semibold pt-1 border-t border-slate-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#159B72]" />
                    Fix: &ldquo;cost-optimized enterprise infrastructure with zero-trust security&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tone Checked
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Facts Verified
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Visual Rules
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Human Approval
                  </div>
                </div>

                <Link
                  href="/reviews/sub-101"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] transition"
                >
                  <span>Inspect Sample Review Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Verified pill */}
              <div className="text-center text-[11px] text-[#64748B]">
                <strong className="text-[#15265B]">Human-Led Sign-Off:</strong> No content is published without managerial authorization.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow Section matching PPT Slide 5 */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F2FF] text-[#2878F0] text-xs font-bold">
            <span>From Content Creation to Approval</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#15265B] tracking-tight">
            How Inkloom AI Governs Content
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            A five-step end-to-end pipeline ensuring brand consistency, factual accuracy, and human authority at every phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="pastel-card p-5 flex flex-col justify-between hover:scale-[1.02] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-[#15265B]">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#15265B] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5F2FF] flex items-center text-[11px] font-semibold text-[#2878F0]">
                  <span>Explore workflow</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem Statement & Analysis matching PPT Slide 2 & 3 */}
      <section className="pastel-card p-8 sm:p-10 bg-gradient-to-br from-white via-[#F8FBFF] to-[#E5F2FF]/30">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#E65378] text-xs font-bold border border-[#FECDD3]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>The Brand Governance Challenge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Why Modern Organisations Struggle with Brand Consistency
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Content is created across employees, agencies, freelancers, and AI tools—each with different styles, knowledge, and understanding. Without a centralized review system, organizations face serious brand drift.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {problemPoints.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#DCE9F8] shadow-xs space-y-2">
              <div className="text-2xl">{item.icon}</div>
              <h4 className="text-xs font-bold text-[#15265B] leading-snug">{item.title}</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* The Bottom Line card from PPT Slide 3 */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#E5F2FF] border border-[#BED8F6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl brand-gradient text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#15265B] uppercase tracking-wider">
                The Bottom Line
              </div>
              <p className="text-xs text-[#15265B] font-medium">
                Without a centralized review process and brand governance, organisations risk inconsistent messaging, loss of trust, and weakened brand value.
              </p>
            </div>
          </div>
          <Link
            href="/review/new"
            className="px-4 py-2 rounded-xl bg-[#2878F0] text-white text-xs font-bold hover:bg-[#1e62c9] whitespace-nowrap shadow-sm transition"
          >
            Review Your First Piece
          </Link>
        </div>
      </section>

      {/* Target Users matching PPT Slide 4 */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#15265B] tracking-tight">
            Built for Everyone Who Creates & Publishes
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Empowering cross-functional teams with role-tailored visibility, instant brand guidance, and verifiable sign-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetUsers.map((u, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${u.color} bg-white space-y-3 shadow-xs`}>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F2FF] text-[#2878F0]">
                {u.badge}
              </span>
              <h3 className="text-base font-bold text-[#15265B]">{u.role}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Originality & Innovation Pillars matching PPT Slide 6 */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EFFF] text-[#8064F5] text-xs font-bold border border-[#D7CCFC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Differentiating Factors</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#15265B] tracking-tight mt-1">
              Six Innovation Pillars
            </h2>
          </div>
          <Link
            href="/architecture"
            className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
          >
            View System Architecture Deep-Dive <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {innovationPillars.map((pillar, i) => (
            <div key={i} className="pastel-card p-6 space-y-3 hover:border-[#8064F5] transition">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pillar.color}`}>
                {pillar.badge}
              </span>
              <h3 className="text-sm font-bold text-[#15265B]">{pillar.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table: Traditional vs Inkloom AI matching PPT Slide 6 */}
      <section className="pastel-card p-6 sm:p-8 bg-white overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#15265B]">
            Overcomes Limitations of Existing Tools
          </h3>
          <p className="text-xs text-[#64748B]">
            Why standard spelling checkers and generic AI writing assistants fall short for brand governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Tools */}
          <div className="p-5 rounded-2xl bg-[#FFF0F5]/50 border border-[#FECDD3] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#E65378] pb-2 border-b border-[#FECDD3]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E65378]"></span>
              Traditional Tools / Manual Review
            </div>
            <ul className="space-y-2.5 text-xs text-[#15265B]">
              <li className="flex items-start gap-2">
                <span className="text-[#E65378] font-bold">✕</span>
                <span>Only checks text (no visual or accessibility evaluation)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E65378] font-bold">✕</span>
                <span>No organizational brand context or factual verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E65378] font-bold">✕</span>
                <span>Simple keyword flagging without explainability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E65378] font-bold">✕</span>
                <span>Limited collaboration, revision history, and sign-offs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E65378] font-bold">✕</span>
                <span>No recurring-issue insights or governance analytics</span>
              </li>
            </ul>
          </div>

          {/* Inkloom AI */}
          <div className="p-5 rounded-2xl bg-[#E4F8F0]/50 border border-[#A7F3D0] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#159B72] pb-2 border-b border-[#A7F3D0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#159B72]"></span>
              Inkloom AI Solution
            </div>
            <ul className="space-y-2.5 text-xs text-[#15265B]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                <span className="font-semibold">Multi-modal content analysis (text, docs, visual assets)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                <span className="font-semibold">Grounded in brand guidelines + verified internal facts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                <span className="font-semibold">Explains findings + cites exact rule + proposes intent-preserving fix</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                <span className="font-semibold">Full workflow with roles, threaded comments, diffs & approvals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                <span className="font-semibold">Provides governance insights & recurring-pattern reports</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hackathon Call-out & Demo Quick-Start */}
      <section className="pastel-card p-8 brand-gradient text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-extrabold tracking-tight">
            Ready to test the complete review and approval workflow?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Choose a sample violation draft, inspect real-time AI findings, apply suggestions with diff comparison, and submit for managerial approval.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/review/new"
            className="px-6 py-3 rounded-2xl bg-white text-[#2878F0] font-extrabold text-xs hover:bg-blue-50 transition shadow-md"
          >
            Launch Review Workspace
          </Link>
          <Link
            href="/approvals"
            className="px-5 py-3 rounded-2xl bg-white/20 border border-white/30 text-white font-bold text-xs hover:bg-white/30 transition"
          >
            Manager Approvals Queue
          </Link>
        </div>
      </section>
    </div>
  );
}
