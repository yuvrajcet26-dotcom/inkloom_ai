import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Award, Sparkles, Lock, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#DCE9F8] mt-16 pt-12 pb-8 text-[#64748B] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-[#15265B]">
                Inkloom<span className="text-[#2878F0]">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#64748B]">
              Intelligent Brand Governance Platform that prevents off-brand, inaccurate, and unverified content from being published.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#159B72] bg-[#E4F8F0] px-2.5 py-1 rounded-lg w-fit border border-[#A7F3D0]">
              <Lock className="w-3.5 h-3.5" /> Human-in-the-Loop Verified
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#15265B] mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-[#2878F0] transition">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/review/new" className="hover:text-[#2878F0] transition">
                  Content Review Workspace
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#2878F0] transition">
                  Brand Guidelines & Rules
                </Link>
              </li>
              <li>
                <Link href="/approvals" className="hover:text-[#2878F0] transition">
                  Manager Review & Approval
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#2878F0] transition">
                  Governance Insights & Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Innovation Pillars */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#15265B] mb-3">
              Six Innovation Pillars
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#2878F0]" /> Context-Aware Brand Intelligence
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#8064F5]" /> Multi-Modal Review (Text, Docs, Images)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#159B72]" /> Explainable & Actionable Feedback
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#E9A23B]" /> Human-in-the-Loop Approval
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#2878F0]" /> Governance Insights & Recurring Issues
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#E65378]" /> Secure, Confidential & RBAC Protected
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Credentials */}
          <div className="p-4 rounded-2xl bg-[#F4FAFF] border border-[#DCE9F8] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15265B]">
              <Award className="w-4 h-4 text-[#8064F5]" />
              <span>SVKM IOT, Dhule</span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Department of Computer Engineering (TY Students)
            </p>
            <div className="text-[11px] text-[#15265B] space-y-1 pt-1 border-t border-[#DCE9F8]">
              <div className="font-bold text-[#2878F0]">Team Members:</div>
              <div>• Yuvraj Nandu Patil (Team Leader)</div>
              <div>• Yash Narendra Pawar</div>
              <div>• Tushar Kishor Salunkhe</div>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 font-medium">
              Inkloom AI Hackathon | Brand Governance Challenge
            </div>
          </div>
        </div>

        {/* Responsible AI Disclaimer & Bottom line */}
        <div className="pt-6 border-t border-[#DCE9F8] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-500 text-center md:text-left">
            <strong className="text-[#15265B]">Responsible AI Notice:</strong> Inkloom AI provides decision-support analysis grounded in organizational guidelines. AI never automatically publishes content; all authorization remains strictly under human reviewer control.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/architecture" className="hover:text-[#2878F0]">
              Architecture
            </Link>
            <span>•</span>
            <Link href="/settings" className="hover:text-[#2878F0]">
              Audit Logs
            </Link>
            <span>•</span>
            <span>© 2026 Inkloom AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
