"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  PieChart as PieIcon,
  Filter,
  RefreshCw,
  Clock,
  Info
} from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from "recharts";
import AboutModal from "../components/AboutModal";

interface Offering {
  id: string;
  name: string;
  category: string;
  type: string;
  revenue: number;
  direct_cost: number;
  service_effort_hrs: number;
  growth_rate: number;
  returns_cost: number;
  target_segment: string;
  lifecycle: string;
  gross_profit: number;
  net_contribution: number;
  margin_pct: number;
  hourly_yield: number;
  strategic_quadrant: string;
}

interface PortfolioKPIs {
  total_revenue: number;
  total_direct_cost: number;
  total_net_contribution: number;
  portfolio_margin_pct: number;
  total_service_hours: number;
  active_offerings_count: number;
}

interface WaterfallStage {
  stage: string;
  amount: number;
  type: string;
}

export default function PortfolioDashboard() {
  const [data, setData] = useState<{ kpis: PortfolioKPIs; offerings: Offering[] } | null>(null);
  const [waterfall, setWaterfall] = useState<WaterfallStage[]>([]);
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await fetch(
        `http://127.0.0.1:8000/api/portfolio/summary?segment=${segmentFilter}&offering_type=${typeFilter}`
      );
      const summaryJson = await summaryRes.json();
      setData(summaryJson);
      if (summaryJson.offerings && summaryJson.offerings.length > 0) {
        setSelectedOffering(summaryJson.offerings[0]);
      }

      const waterfallRes = await fetch("http://127.0.0.1:8000/api/portfolio/waterfall");
      const waterfallJson = await waterfallRes.json();
      setWaterfall(waterfallJson);
    } catch (err) {
      console.error("Failed to load portfolio metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [segmentFilter, typeFilter]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded font-mono font-bold tracking-wider border border-indigo-500/30">
                POC-27
              </span>
              <span className="text-xs text-slate-400 font-medium">Business Success & Executive Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Product & Service Profitability Portfolio
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Margin vs. Growth Quadrants, Unit Economics, & Strategic Lifecycle Rationalization
            </p>
          </div>

          {/* Global Filters & Architecture Modal */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                aria-label="Filter by target segment"
                className="bg-transparent text-slate-200 outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Segments</option>
                <option value="Enterprise" className="bg-slate-900">Enterprise</option>
                <option value="Mid-Market" className="bg-slate-900">Mid-Market</option>
                <option value="SMB" className="bg-slate-900">SMB</option>
                <option value="Industrial" className="bg-slate-900">Industrial</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by offering type"
                className="bg-transparent text-slate-200 outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Formats</option>
                <option value="Product" className="bg-slate-900">Product</option>
                <option value="Service" className="bg-slate-900">Service</option>
              </select>
            </div>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors text-xs font-mono"
              title="System Architecture & Guidelines"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Info</span>
            </button>

            <button
              onClick={fetchData}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors"
              title="Refresh Intelligence Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* KPI Ribbons */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Gross Portfolio Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-white">
                {formatCurrency(data.kpis.total_revenue)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Across {data.kpis.active_offerings_count} active offerings</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Net Contribution Margin</span>
                <PieIcon className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-white">
                {formatCurrency(data.kpis.total_net_contribution)}
              </div>
              <div className="text-[11px] text-indigo-400 mt-1">
                Avg Margin: {data.kpis.portfolio_margin_pct}%
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Direct Operational COGS</span>
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-white">
                {formatCurrency(data.kpis.total_direct_cost)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Direct labor + infrastructure</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Delivery Capacity Invested</span>
                <Clock className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-white">
                {data.kpis.total_service_hours.toLocaleString()} hrs
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Total human effort committed</div>
            </div>
          </div>
        )}

        {/* Real Rails 70/30 Workspace Split */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* 70% Primary Stage: Strategic Matrix & Waterfall */}
          <div className="w-full lg:w-[70%] space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Margin vs. Growth Strategic Quadrant</h2>
                  <p className="text-[11px] text-slate-400">
                    Bubble radius = Net Revenue | Click bubble or table row to inspect unit economics
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                  Primary Stage (70%)
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      type="number"
                      dataKey="growth_rate"
                      name="Growth Rate"
                      unit="%"
                      stroke="#64748b"
                      fontSize={11}
                      label={{ value: "YoY Growth Rate (%)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="margin_pct"
                      name="Margin"
                      unit="%"
                      stroke="#64748b"
                      fontSize={11}
                      label={{ value: "Net Contribution Margin (%)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="revenue" range={[60, 450]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const item = payload[0].payload as Offering;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-slate-300">Category: {item.category} ({item.type})</p>
                              <p className="text-indigo-400">Quadrant: {item.strategic_quadrant.split(" (")[0]}</p>
                              <p className="text-emerald-400">Revenue: {formatCurrency(item.revenue)}</p>
                              <p className="text-slate-300">Net Margin: {item.margin_pct.toFixed(1)}%</p>
                              <p className="text-amber-400">YoY Growth: {item.growth_rate}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      name="Offerings"
                      data={data?.offerings || []}
                      onClick={(e) => e && e.payload && setSelectedOffering(e.payload as Offering)}
                      cursor="pointer"
                    >
                      {data?.offerings.map((entry, index) => {
                        let fill = "#6366f1";
                        if (entry.strategic_quadrant.includes("Star")) fill = "#10b981";
                        else if (entry.strategic_quadrant.includes("Drain")) fill = "#ef4444";
                        else if (entry.strategic_quadrant.includes("Margin Trapped")) fill = "#f59e0b";
                        return <Cell key={`cell-${index}`} fill={fill} stroke={selectedOffering?.id === entry.id ? "#ffffff" : "transparent"} strokeWidth={2} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Offerings Performance Table */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Offerings Profitability & Lifecycle Matrix</h2>
                <span className="text-xs text-slate-400 font-mono">{data?.offerings.length || 0} Offerings Tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-800">
                    <tr>
                      <th className="px-2.5 py-2.5">Offering Name</th>
                      <th className="px-2.5 py-2.5">Category</th>
                      <th className="px-2.5 py-2.5">Type</th>
                      <th className="px-2.5 py-2.5 text-right">Revenue</th>
                      <th className="px-2.5 py-2.5 text-right">Direct Cost</th>
                      <th className="px-2.5 py-2.5 text-right">Net Contribution</th>
                      <th className="px-2.5 py-2.5 text-right">Margin %</th>
                      <th className="px-2.5 py-2.5 text-right">Hourly Yield</th>
                      <th className="px-2.5 py-2.5">Strategic Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data?.offerings.map((item) => {
                      const isSelected = selectedOffering?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedOffering(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-indigo-950/40 border-l-2 border-indigo-400" : "hover:bg-slate-900/50"
                          }`}
                        >
                          <td className="px-2.5 py-2.5 font-medium text-white">{item.name}</td>
                          <td className="px-2.5 py-2.5 text-slate-400">{item.category}</td>
                          <td className="px-2.5 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap inline-block ${
                              item.type === "Product" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-2.5 py-2.5 text-right text-slate-200 font-mono">{formatCurrency(item.revenue)}</td>
                          <td className="px-2.5 py-2.5 text-right text-slate-400 font-mono">{formatCurrency(item.direct_cost)}</td>
                          <td className="px-2.5 py-2.5 text-right text-emerald-400 font-mono font-medium">{formatCurrency(item.net_contribution)}</td>
                          <td className="px-2.5 py-2.5 text-right font-mono">
                            <span className={item.margin_pct >= 40 ? "text-emerald-400 font-semibold" : item.margin_pct >= 20 ? "text-amber-400" : "text-rose-400"}>
                              {item.margin_pct.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-2.5 py-2.5 text-right text-slate-300 font-mono">
                            ${item.hourly_yield.toFixed(0)}/hr
                          </td>
                          <td className="px-2.5 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap inline-block ${
                              item.strategic_quadrant.includes("Star")
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : item.strategic_quadrant.includes("Cash")
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : item.strategic_quadrant.includes("Trapped")
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            }`}>
                              {item.strategic_quadrant.split(" (")[0]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 30% Intelligence Inspector & Waterfall */}
          <div className="w-full lg:w-[30%] space-y-6">
            {/* Contribution Waterfall Breakdown */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Contribution Waterfall</h2>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">P&L Flow</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfall} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="stage" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const row = payload[0].payload as WaterfallStage;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs">
                              <span className="text-slate-300">{row.stage}: </span>
                              <span className="font-bold text-white">{formatCurrency(row.amount)}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {waterfall.map((entry, idx) => (
                        <Cell
                          key={`bar-${idx}`}
                          fill={entry.amount >= 0 ? (entry.type === "final" ? "#10b981" : "#6366f1") : "#f43f5e"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tracks value degradation from gross bookings down to net contribution margin.
              </p>
            </div>

            {/* Selected Offering Unit Economics Inspector (30% Sidebar) */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Offering Inspector (30%)
                  </h3>
                </div>
                {selectedOffering && (
                  <span className="text-[10px] font-mono text-slate-400">{selectedOffering.id}</span>
                )}
              </div>

              {selectedOffering ? (
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <h4 className="text-white font-bold text-sm">{selectedOffering.name}</h4>
                    <p className="text-slate-400 text-[11px]">{selectedOffering.category} • {selectedOffering.target_segment}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Lifecycle Phase:</span>
                      <span className="text-indigo-300 font-mono font-medium">{selectedOffering.lifecycle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">YoY Growth:</span>
                      <span className={`font-mono font-bold ${selectedOffering.growth_rate >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {selectedOffering.growth_rate > 0 ? `+${selectedOffering.growth_rate}%` : `${selectedOffering.growth_rate}%`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Net Contribution:</span>
                      <span className="text-emerald-400 font-mono font-bold">{formatCurrency(selectedOffering.net_contribution)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Net Margin %:</span>
                      <span className="text-white font-mono font-bold">{selectedOffering.margin_pct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Hourly Yield:</span>
                      <span className="text-amber-300 font-mono font-bold">${selectedOffering.hourly_yield.toFixed(0)}/hr</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Strategic Protocol
                    </span>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                      {selectedOffering.strategic_quadrant}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Select an offering from the chart or table to inspect details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About / Architecture Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
