"use client";

import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Product & Service Profitability Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2.5 py-1 rounded border border-slate-700 hover:bg-slate-800 transition text-xs font-mono"
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5 text-xs text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <h3 className="text-indigo-400 font-mono uppercase tracking-wider text-[11px] mb-1">
              01. Executive Purpose & Margin Intelligence
            </h3>
            <p>
              Identifies high-growth star offerings, high-margin cash cows, and margin-draining contracts across enterprise product and service lines. Synthesizes gross bookings, direct COGS, and return/rework SLA leakage to determine pure Net Contribution Margins and hourly delivery yields.
            </p>
          </div>

          <div>
            <h3 className="text-indigo-400 font-mono uppercase tracking-wider text-[11px] mb-1">
              02. Technical Architecture & Data Governance
            </h3>
            <p>
              The platform utilizes a decoupled full-stack architecture. A high-performance FastAPI analytical kernel processes multi-segment telemetry via Pandas, performing on-the-fly contribution margin calculations and strategic quadrant allocations. This feeds a Next.js (React 19) executive frontend utilizing Recharts and Tailwind CSS.
            </p>
          </div>

          <div>
            <h3 className="text-indigo-400 font-mono uppercase tracking-wider text-[11px] mb-2">
              03. Strategic Quadrant Decision Protocols
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="p-2.5 rounded bg-slate-950 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block">Star Offering (Scale & Invest)</span>
                High YoY growth (&ge; 20%) + High margin (&ge; 45%). Prime candidates for accelerated delivery capacity.
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-blue-500/30">
                <span className="text-blue-400 font-bold block">Cash Generator (Protect Margin)</span>
                Stable growth (&lt; 20%) + High margin (&ge; 45%). Maintain strict operational efficiency and protect margins.
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-amber-500/30">
                <span className="text-amber-400 font-bold block">Margin Trapped (Reprice / Automate)</span>
                High growth (&ge; 20%) + Low margin (&lt; 45%). Requires renegotiated scope or automation tooling.
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-rose-500/30">
                <span className="text-rose-400 font-bold block">Drain Offering (Sunset / Redesign)</span>
                Low growth (&lt; 20%) + Negative/Low margin (&lt; 45%). Review for strategic phase-out or immediate renegotiation.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Real Rails Batch 8 — Engineering PoC 27</span>
          <span>FastAPI + Next.js + Recharts</span>
        </div>
      </div>
    </div>
  );
}
