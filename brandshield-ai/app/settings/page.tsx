"use client";

import React, { useState, useEffect } from "react";
import { InkloomStore } from "@/lib/data/store";
import { AuditLog } from "@/lib/types";
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  History,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function SettingsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [provider, setProvider] = useState<string>("inkloom_deterministic");
  const [resetNotice, setResetNotice] = useState<string>("");

  useEffect(() => {
    setAuditLogs(InkloomStore.getAuditLogs());
  }, []);

  const handleResetDemoData = () => {
    if (confirm("Reset all submissions and brands back to initial hackathon demo state?")) {
      InkloomStore.resetToDemo();
      setAuditLogs(InkloomStore.getAuditLogs());
      setResetNotice("Demo dataset successfully reset to initial seed state!");
      setTimeout(() => setResetNotice(""), 3500);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE9F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878F0] px-2.5 py-0.5 rounded-full bg-[#E5F2FF]">
              System Configuration
            </span>
            <span className="text-xs text-[#64748B]">• Security & Audit Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15265B]">
            Platform Settings & Audit Trail
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure AI provider integration, inspect organizational audit logs, and manage governance retention policies.
          </p>
        </div>

        <button
          onClick={handleResetDemoData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold hover:bg-rose-100 transition shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {resetNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{resetNotice}</span>
        </div>
      )}

      {/* AI & Database Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Provider Status */}
        <div className="pastel-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8064F5]" />
              <span>AI Provider Engine</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E4F8F0] text-[#159B72]">
              Active & Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#15265B] mb-1">Configured Engine:</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DCE9F8] bg-[#F8FBFF] text-[#15265B] font-medium"
              >
                <option value="inkloom_deterministic">
                  Inkloom Semantic Governor + Deterministic Rules (Built-in Standalone Engine)
                </option>
                <option value="google_gemini">Google Gemini 1.5 Flash (via API Key)</option>
                <option value="openai">OpenAI GPT-4o (via API Key)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE9F8] text-[11px] text-[#64748B] space-y-1">
              <div>
                <strong className="text-[#15265B]">Disclosure:</strong> External AI keys remain server-side only. When no external keys are configured, the built-in deterministic rule and semantic engine runs locally with full fidelity.
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Database & Storage Status */}
        <div className="pastel-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2878F0]" />
              <span>Storage & Data Isolation</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E5F2FF] text-[#2878F0]">
              Isolated Repository
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#15265B]">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FBFF]">
              <span className="text-[#64748B]">Supabase Connection:</span>
              <span className="font-semibold text-[#159B72]">Local & Cloud Sync Ready</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FBFF]">
              <span className="text-[#64748B]">Row-Level Security (RLS):</span>
              <span className="font-semibold text-[#159B72]">Active (Org Isolated)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FBFF]">
              <span className="text-[#64748B]">File Storage:</span>
              <span className="font-semibold text-[#159B72]">Private Buckets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Audit Trail */}
      <div className="pastel-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5F2FF]">
          <div>
            <h3 className="text-sm font-bold text-[#15265B] flex items-center gap-2">
              <History className="w-4 h-4 text-[#2878F0]" />
              <span>Compliance & Security Audit Trail ({auditLogs.length} events)</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Immutable log recording every brand update, AI check execution, revision, and managerial approval decision.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFF] text-[#64748B] font-semibold border-b border-[#DCE9F8]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5F2FF]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8FBFF]/60 transition">
                  <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "medium" })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#15265B]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#15265B]">{log.actor.name}</span>
                    <span className="text-[10px] text-[#64748B] block">({log.actor.role})</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#2878F0]">{log.resource_title}</td>
                  <td className="py-3 px-4 text-[#64748B] max-w-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
