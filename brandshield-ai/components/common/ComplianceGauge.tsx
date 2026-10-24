"use client";

import React from "react";

interface ComplianceGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ComplianceGauge({ score, size = "md", showLabel = true }: ComplianceGaugeProps) {
  const normalized = Math.max(0, Math.min(100, score));

  // Determine colors based on score
  let strokeColor = "#159B72"; // mint green
  let bgColor = "#E4F8F0";
  let label = "High Compliance";

  if (normalized < 60) {
    strokeColor = "#E65378"; // error pink/red
    bgColor = "#FFF0F5";
    label = "Non-Compliant";
  } else if (normalized < 85) {
    strokeColor = "#E9A23B"; // warning yellow
    bgColor = "#FFF7DF";
    label = "Needs Revisions";
  }

  const dimensions = {
    sm: { radius: 26, stroke: 5, width: 64, text: "text-sm", fontClass: "text-xs" },
    md: { radius: 46, stroke: 8, width: 112, text: "text-2xl font-bold", fontClass: "text-xs" },
    lg: { radius: 70, stroke: 12, width: 170, text: "text-4xl font-extrabold", fontClass: "text-sm" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke="#E5F2FF"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`${dimensions.text} text-[#15265B]`}>{normalized}</span>
          {size !== "sm" && <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Score</span>}
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              normalized >= 85
                ? "bg-[#E4F8F0] text-[#159B72]"
                : normalized >= 60
                ? "bg-[#FFF7DF] text-[#D97706]"
                : "bg-[#FFF0F5] text-[#E65378]"
            }`}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
