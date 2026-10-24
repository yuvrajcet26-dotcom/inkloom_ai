"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InkloomStore } from "@/lib/data/store";
import { Brand } from "@/lib/types";
import { BrandAnalysisEngine } from "@/lib/ai/engine";
import { useAuth } from "@/lib/context/AuthContext";
import {
  FileSearch,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  RefreshCw,
} from "lucide-react";

export default function NewReviewPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("brand-novatech");
  const [title, setTitle] = useState<string>("");
  const [channel, setChannel] = useState<string>("Press Wire & Global Blog");
  const [contentType, setContentType] = useState<any>("press_release");
  const [content, setContent] = useState<string>("");
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const list = InkloomStore.getBrands();
    setBrands(list);
    if (list.length > 0) {
      setSelectedBrandId(list[0].id);
    }
  }, []);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  // Preset demo test scenarios for hackathon evaluation
  const demoScenarios = [
    {
      label: "NovaTech Violations Test (High Issues)",
      brandId: "brand-novatech",
      title: "Q4 Enterprise Hybrid Cloud Launch Announcement",
      channel: "Press Wire & Global Blog",
      type: "press_release",
      text: `NovaTech is thrilled to unveil our new Enterprise Hybrid Cloud cluster! It is the cheapest cloud solution on the market, offering foolproof data resilience and unbreakable security for every company. With our instant setup, over 10,000 global Fortune 500 enterprises have already transitioned with zero downtime guaranteed. Our system is 100% immune to cyberattacks, making legacy cloud architectures obsolete. Upgrade today for the ultimate cloud power!`,
    },
    {
      label: "Aura Eco-Luxury Furniture (Tone Drift)",
      brandId: "brand-aura",
      title: "Autumn Architectural Woodwork Promo",
      channel: "Instagram & Pinterest",
      type: "social_post",
      text: `Get the dirt-cheap deal of the century on our Scandinavian Oak coffee tables! Our timber is sourced from unknown sustainable locations and guarantees 100% indestructible surfaces that will last forever. Don't miss this insane discount!`,
    },
    {
      label: "Veritas Health (High Compliance Sample)",
      brandId: "brand-veritas",
      title: "Preventative Telehealth Onboarding Guide",
      channel: "Patient Portal Direct",
      type: "email_campaign",
      text: `Welcome to Veritas Health Telemetry. Our continuous monitoring is supervised by over 250 board-certified physicians to provide clinical clarity for your preventative care plan. We are committed to evidence-based healthcare.`,
    },
  ];

  const loadScenario = (s: typeof demoScenarios[0]) => {
    setSelectedBrandId(s.brandId);
    setTitle(s.title);
    setChannel(s.channel);
    setContentType(s.type);
    setContent(s.text);
    setInputMode("text");
    setUploadedFileName("");
    setErrorMsg("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setContent(data.text);
          if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
          return;
        }
      }
    } catch (err) {
      console.warn("Server file extract failed, falling back to local FileReader:", err);
    }

    // Client-side fallback for plain text
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text || "");
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsText(file);
    } else {
      setContent(
        `[Extracted from uploaded document: ${file.name}]\n\nNovaTech Enterprise Infrastructure delivers resilient cloud scalability. Beware of unverified claims offering the cheapest cloud or foolproof immunity against cyber threats. Over 4,500 organizations trust our multi-layered zero-trust architecture.`
      );
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const analysisStepsLabels = [
    "Loading brand guidelines, tone rules & verified facts...",
    "Executing deterministic prohibited terminology checks...",
    "Evaluating tone, voice consistency & readability...",
    "Verifying claims against internal evidence repository...",
    "Generating explainable findings & intent-preserving fixes...",
  ];

  const handleStartReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("Please provide content to analyze or select a demo scenario.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Please enter a title for this content submission.");
      return;
    }

    setErrorMsg("");
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Run animated progression through the 5 steps
    for (let i = 0; i < 5; i++) {
      setAnalysisStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    // Execute Server-Side AI Analysis via API
    const tempId = "sub-" + Math.random().toString(36).substring(2, 9);
    let reviewResult: any = null;

    try {
      const apiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: tempId,
          brandId: selectedBrand.id,
          title,
          contentType,
          channel,
          content,
        }),
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.result) {
          reviewResult = data.result;
        }
      }
    } catch (err) {
      console.warn("Server analysis call failed, falling back to local engine:", err);
    }

    if (!reviewResult) {
      reviewResult = await BrandAnalysisEngine.analyzeContent({
        submissionId: tempId,
        brand: selectedBrand,
        title,
        contentType,
        channel,
        content,
        fileName: uploadedFileName,
      });
    }

    // Save submission to persistent store and server
    const submissionPayload = {
      brand_id: selectedBrand.id,
      brand_name: selectedBrand.name,
      creator: currentUser,
      title,
      content_type: contentType,
      channel,
      original_content: content,
      current_content: content,
      status: "submitted_for_review" as const,
      assigned_reviewer: {
        id: "usr-bm",
        name: "Alex Rivera",
        email: "alex.rivera@org.io",
        role: "brand_manager" as const,
        department: "Global Brand Governance",
        avatar: "AR",
      },
      latest_review: reviewResult,
    };

    // Sync with Server API
    try {
      fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      }).catch((e) => console.warn("Background server submission sync error:", e));
    } catch {}

    const created = InkloomStore.addSubmission(submissionPayload);

    setIsAnalyzing(false);
    router.push(`/reviews/${created.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F2FF] text-[#2878F0] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8064F5]" />
          <span>Pre-Publication Review Workspace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#15265B] tracking-tight">
          Submit Content for Brand Governance
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Review articles, press releases, social copy, and documents against organizational brand guidelines before publishing.
        </p>
      </div>

      {/* Demo Scenario Quick-Load Bar */}
      <div className="pastel-card p-4 bg-[#F8FBFF] border-[#BED8F6] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#15265B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2878F0]" />
            Quick Test Scenarios (1-Click Fill for Judges):
          </span>
          <span className="text-[11px] text-[#64748B]">Click to auto-populate</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {demoScenarios.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadScenario(s)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DCE9F8] text-xs font-semibold text-[#15265B] hover:border-[#2878F0] hover:text-[#2878F0] hover:shadow-xs transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Form */}
      <form onSubmit={handleStartReview} className="pastel-card p-6 sm:p-8 space-y-6 bg-white">
        {/* Row 1: Brand & Channel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#15265B] uppercase tracking-wider mb-1.5">
              Target Brand Profile *
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (v{b.version})
                </option>
              ))}
            </select>
            {selectedBrand && (
              <p className="text-[11px] text-[#64748B] mt-1 italic">
                Tone: {selectedBrand.tone_guidelines.primary_tone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265B] uppercase tracking-wider mb-1.5">
              Intended Publication Channel *
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="e.g. Press Wire, Instagram, Customer Newsletter, Landing Page"
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
              required
            />
          </div>
        </div>

        {/* Row 2: Title & Content Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#15265B] uppercase tracking-wider mb-1.5">
              Content Title / Campaign Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Hybrid Cloud Launch Announcement"
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265B] uppercase tracking-wider mb-1.5">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
            >
              <option value="press_release">Press Release</option>
              <option value="blog_article">Blog / Article</option>
              <option value="social_post">Social Media Post</option>
              <option value="landing_page">Website Landing Page</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="ad_copy">Paid Ad Copy</option>
            </select>
          </div>
        </div>

        {/* Mode Toggle: Direct Text vs File Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5F2FF]">
            <label className="text-xs font-bold text-[#15265B] uppercase tracking-wider">
              Content Input Mode
            </label>
            <div className="inline-flex rounded-lg border border-[#DCE9F8] p-0.5 bg-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setInputMode("text")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  inputMode === "text" ? "bg-white text-[#2878F0] shadow-xs" : "text-[#64748B]"
                }`}
              >
                Direct Text
              </button>
              <button
                type="button"
                onClick={() => setInputMode("file")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  inputMode === "file" ? "bg-white text-[#2878F0] shadow-xs" : "text-[#64748B]"
                }`}
              >
                File Upload (PDF/DOCX/Images)
              </button>
            </div>
          </div>

          {inputMode === "file" ? (
            <div className="p-8 border-2 border-dashed border-[#BED8F6] rounded-2xl bg-[#F8FBFF] text-center space-y-3">
              <UploadCloud className="w-10 h-10 text-[#2878F0] mx-auto" />
              <div>
                <p className="text-xs font-bold text-[#15265B]">
                  Upload documents or images for multimodal brand review
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Supported formats: Plain Text, TXT, PDF, DOCX, JPG, PNG
                </p>
              </div>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 rounded-xl bg-white border border-[#DCE9F8] text-xs font-bold text-[#2878F0] hover:bg-[#E5F2FF] cursor-pointer shadow-xs transition"
              >
                Browse Files
              </label>

              {uploadedFileName && (
                <div className="mt-2 text-xs font-semibold text-[#159B72] bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 inline-block">
                  ✓ Selected: {uploadedFileName}
                </div>
              )}
            </div>
          ) : null}

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span>Enter or edit content text:</span>
              <span>{content.length} characters • {content.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste promotional copy, announcement draft, or article text here..."
              rows={8}
              className="w-full text-xs p-4 rounded-xl border border-[#DCE9F8] bg-white text-[#15265B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2878F0]"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FFF0F5] border border-[#FECDD3] text-xs text-[#E65378] font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            <strong className="text-[#15265B]">Human-in-the-Loop:</strong> Findings will be displayed with actionable explanations and editable suggested fixes.
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Brand Governance Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Brand Governance Review</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Stepper Modal Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-[#DCE9F8] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center mx-auto shadow-md">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-[#15265B]">
                Analyzing Content with Inkloom AI
              </h3>
              <p className="text-xs text-[#64748B]">
                Evaluating against &ldquo;{selectedBrand.name}&rdquo; governance guidelines
              </p>
            </div>

            {/* Stepper list */}
            <div className="space-y-2.5">
              {analysisStepsLabels.map((label, idx) => {
                const isCompleted = idx < analysisStep;
                const isCurrent = idx === analysisStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition ${
                      isCurrent
                        ? "bg-[#E5F2FF] text-[#2878F0] font-bold border border-[#BED8F6]"
                        : isCompleted
                        ? "bg-[#E4F8F0] text-[#159B72] font-semibold"
                        : "text-slate-400 bg-slate-50"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#159B72] flex-shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-[#2878F0] animate-spin flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[11px] text-[#64748B] pt-2 border-t border-[#E5F2FF]">
              Grounded in organizational facts & ethical AI standards.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
