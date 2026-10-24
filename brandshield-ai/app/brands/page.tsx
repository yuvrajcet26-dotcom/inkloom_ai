"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InkloomStore } from "@/lib/data/store";
import { Brand } from "@/lib/types";
import {
  BookOpen,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Sliders,
} from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    setBrands(InkloomStore.getBrands());
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Brand Knowledge Base
            </span>
            <span className="text-xs text-[#64748B]">• Multi-Brand Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Brand Guidelines & Governance Profiles
          </h1>
          <p className="text-xs text-[#64748B]">
            Maintain tone rules, verified internal facts, prohibited terminology, and visual standards for each brand entity.
          </p>
        </div>

        <Link
          href="/brands/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Brand Profile</span>
        </Link>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="pastel-card p-6 bg-white flex flex-col justify-between space-y-4 hover:border-[#2878F0] transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E5F2FF] text-[#2878F0]">
                    Version {brand.version}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#15265B] mt-1.5">{brand.name}</h3>
                  <p className="text-xs text-[#8064F5] font-semibold">{brand.tagline}</p>
                </div>
                <div className="w-9 h-9 rounded-xl brand-gradient-subtle flex items-center justify-center text-[#2878F0]">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">{brand.description}</p>

              {/* Tone summary */}
              <div className="p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] text-xs space-y-1">
                <div className="font-bold text-[#15265B] text-[11px]">Primary Tone:</div>
                <p className="text-[#64748B] italic">{brand.tone_guidelines.primary_tone}</p>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <span className="font-bold text-[#15265B] text-sm block">
                    {brand.terminology_rules?.length || 0}
                  </span>
                  <span className="text-[10px] text-[#64748B]">Terminology Rules</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <span className="font-bold text-[#15265B] text-sm block">
                    {brand.approved_facts?.length || 0}
                  </span>
                  <span className="text-[10px] text-[#64748B]">Approved Facts</span>
                </div>
              </div>
            </div>

            {/* Bottom link */}
            <div className="pt-3 border-t border-[#E5F2FF] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Updated {new Date(brand.updated_at).toLocaleDateString()}
              </span>
              <Link
                href={`/brands/${brand.id}`}
                className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1"
              >
                <span>Manage Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
