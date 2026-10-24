"use client";

import React from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { RoleBadge } from "@/components/common/Badge";
import { Users, Shield, UserPlus, CheckCircle2, Lock } from "lucide-react";

export default function TeamPage() {
  const { allUsers, currentUser, switchUser } = useAuth();

  const roleDefinitions = [
    {
      role: "admin",
      title: "Administrator",
      desc: "Manages organization settings, team permissions, AI engine configurations, and security audit logs.",
      color: "bg-[#F2EFFF] text-[#8064F5]",
    },
    {
      role: "brand_manager",
      title: "Brand Manager",
      desc: "Maintains brand guidelines, adds approved facts and terminology, reviews submissions, and issues approvals.",
      color: "bg-[#E5F2FF] text-[#2878F0]",
    },
    {
      role: "reviewer",
      title: "Reviewer / Editor",
      desc: "Reviews assigned content submissions, checks factual citations, adds comments, and suggests adjustments.",
      color: "bg-[#E4F8F0] text-[#159B72]",
    },
    {
      role: "creator",
      title: "Content Creator",
      desc: "Submits draft copy and documents, inspects explainable AI findings, accepts corrections, and creates revisions.",
      color: "bg-[#FFF7DF] text-[#D97706]",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              Governance Administration
            </span>
            <span className="text-xs text-[#64748B]">• Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Team & Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage member permissions, review privileges, and test role-tailored workspaces.
          </p>
        </div>
      </div>

      {/* Role Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleDefinitions.map((rd) => (
          <div key={rd.role} className="pastel-card p-5 bg-white space-y-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rd.color}`}>
              {rd.title}
            </span>
            <p className="text-xs text-[#64748B] leading-relaxed pt-1">{rd.desc}</p>
          </div>
        ))}
      </div>

      {/* Team Members List */}
      <div className="pastel-card bg-white overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
          <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2878F0]" />
            <span>Organization Members ({allUsers.length})</span>
          </h3>
          <span className="text-xs text-[#64748B]">Click &ldquo;Switch Persona&rdquo; to test workflows</span>
        </div>

        <div className="divide-y divide-[#E5F2FF]">
          {allUsers.map((u) => {
            const isCurrent = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                className={`py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition ${
                  isCurrent ? "bg-[#E5F2FF]/40" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2878F0] to-[#8064F5] text-white font-bold flex items-center justify-center text-xs">
                    {u.avatar || u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#15265B]">{u.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-[#159B72] bg-[#E4F8F0] px-2 py-0.5 rounded-full">
                          Active Persona
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B]">{u.email} • {u.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RoleBadge role={u.role} />
                  {!isCurrent && (
                    <button
                      onClick={() => switchUser(u.role)}
                      className="px-3 py-1.5 rounded-lg border border-[#BED8F6] text-[#2878F0] text-xs font-semibold hover:bg-[#E5F2FF] transition"
                    >
                      Switch Persona
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
