"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InkloomStore } from "@/lib/data/store";
import { Brand } from "@/lib/types";
import { ChevronLeft, PlusCircle, Sparkles } from "lucide-react";

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [primaryTone, setPrimaryTone] = useState("Professional, authoritative, and clear");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = "brand-" + name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const newBrand: Brand = {
      id,
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      version: "1.0.0",
      updated_at: new Date().toISOString(),
      tone_guidelines: {
        primary_tone: primaryTone,
        secondary_tones: ["Clear", "Consistent"],
        voice_attributes: [
          { attribute: "Clarity", description: "Straightforward communication." },
        ],
        avoid_tones: ["Overly casual slang", "Unsubstantiated claims"],
      },
      terminology_rules: [],
      approved_facts: [],
      assets: [],
      accessibility_standards: ["Maintain WCAG AA compliance standards"],
    };

    InkloomStore.saveBrand(newBrand);
    router.push(`/brands/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <Link href="/brands" className="text-xs font-bold text-[#2878F0] hover:underline flex items-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Brands
      </Link>

      <div className="pastel-card p-6 sm:p-8 bg-white space-y-5">
        <h1 className="text-2xl font-extrabold text-[#15265B]">Create Brand Governance Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#15265B] mb-1">Brand Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zenith Dynamics"
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265B] mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Shaping Intelligent Future Horizons"
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265B] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brand purpose and background..."
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#15265B] mb-1">Primary Tone Standard</label>
            <input
              type="text"
              value={primaryTone}
              onChange={(e) => setPrimaryTone(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Link href="/brands" className="px-4 py-2 text-xs text-slate-600 rounded-xl">
              Cancel
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
