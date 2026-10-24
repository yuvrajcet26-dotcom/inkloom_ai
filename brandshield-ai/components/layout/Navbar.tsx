"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { UserRole } from "@/lib/types";
import { RoleBadge } from "@/components/common/Badge";
import { InkloomStore } from "@/lib/data/store";
import {
  ShieldCheck,
  LayoutDashboard,
  FileSearch,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Layers,
  Settings,
  PlusCircle,
  Users,
  ChevronDown,
  Sparkles,
  Library,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUser, allUsers } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  useEffect(() => {
    // Count pending approvals
    const submissions = InkloomStore.getSubmissions();
    const pending = submissions.filter(
      (s) => s.status === "submitted_for_review" || s.status === "resubmitted" || s.status === "in_review"
    ).length;
    setPendingApprovalsCount(pending);
  }, [pathname]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/review/new", label: "New Review", icon: FileSearch },
    { href: "/content", label: "Content Library", icon: Library },
    { href: "/brands", label: "Brand Guidelines", icon: BookOpen },
    {
      href: "/approvals",
      label: "Approvals",
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { href: "/insights", label: "Insights", icon: BarChart3 },
    { href: "/architecture", label: "Architecture", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCE9F8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#15265B] tracking-tight">
                    Inkloom<span className="text-[#2878F0]">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E5F2FF] text-[#2878F0]">
                    BrandShield
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] font-medium leading-none">
                  Create Freely. Publish Confidently.
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#E5F2FF] text-[#2878F0] shadow-xs"
                        : "text-[#64748B] hover:text-[#15265B] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#2878F0]" : "text-[#64748B]"}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E65378] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side controls: Role Switcher, Quick Action, Settings */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] hover:bg-[#E5F2FF]/60 transition text-xs"
                title="Switch demo persona to test role-based access"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2878F0] to-[#8064F5] text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-[#15265B] text-xs leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                    <RoleBadge role={currentUser.role} />
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#DCE9F8] shadow-lg py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-[#E5F2FF]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Demo Persona Switcher
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Switch roles to test permissions & review workflows.
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          currentUser.id === u.id ? "bg-[#E5F2FF] text-[#2878F0]" : "hover:bg-slate-50 text-[#15265B]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {u.avatar}
                          </div>
                          <div>
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-[10px] text-[#64748B]">{u.department}</div>
                          </div>
                        </div>
                        <RoleBadge role={u.role} />
                      </button>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-[#E5F2FF] bg-[#F8FBFF] flex items-center justify-between">
                    <Link
                      href="/team"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="text-[11px] text-[#2878F0] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" /> Manage Team & RBAC
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick CTA: New Review */}
            <Link
              href="/review/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-bold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Start Review</span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              className={`p-2 rounded-xl border border-[#DCE9F8] transition ${
                pathname.startsWith("/settings")
                  ? "bg-[#E5F2FF] text-[#2878F0]"
                  : "text-[#64748B] hover:text-[#15265B] hover:bg-slate-50"
              }`}
              title="System & AI Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav bottom bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-[#DCE9F8] px-3 py-1.5 gap-1 bg-[#F8FBFF]">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                isActive ? "bg-[#2878F0] text-white" : "text-[#64748B] hover:bg-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
