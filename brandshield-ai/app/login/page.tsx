"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { UserRole } from "@/lib/types";
import { ShieldCheck, ArrowRight, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, switchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickLogin = (role: UserRole) => {
    switchUser(role);
    router.push("/dashboard");
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Brand Manager
    switchUser("brand_manager");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#15265B]">Sign In to Inkloom AI</h1>
        <p className="text-xs text-[#64748B]">Intelligent Pre-Publication Brand Governance Platform</p>
      </div>

      {/* 1-Click Quick Demo Login for Judges */}
      <div className="pastel-card p-5 bg-[#F8FBFF] border-[#BED8F6] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#15265B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2878F0]" />
            Quick Demo Persona Login (For Judges):
          </span>
        </div>
        <p className="text-[11px] text-[#64748B]">
          Instantly sign in with pre-configured role permissions:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {allUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => handleQuickLogin(u.role)}
              className="p-2.5 rounded-xl bg-white border border-[#DCE9F8] text-left hover:border-[#2878F0] hover:shadow-xs transition"
            >
              <div className="text-xs font-bold text-[#15265B] leading-tight">{u.name}</div>
              <div className="text-[10px] text-[#2878F0] font-semibold capitalize mt-0.5">
                {u.role.replace("_", " ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleEmailLogin} className="pastel-card p-6 bg-white space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#15265B] mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.rivera@org.io"
            className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#15265B] mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl brand-gradient text-white text-xs font-bold hover:shadow-md transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
