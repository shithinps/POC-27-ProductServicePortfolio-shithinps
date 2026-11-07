# POC-27: Product & Service Profitability Portfolio

**Rail:** Business Success & Executive Intelligence  
**Focus:** Margin vs. Growth Analysis, Contribution Waterfalls, & Offering Rationalization  
**Stack:** Next.js (App Router, Tailwind CSS, Recharts, Lucide) + FastAPI (Pandas, Pydantic, Uvicorn)

## Overview
POC-27 delivers an executive decision-support intelligence dashboard that analyzes portfolio profitability across products and services. It identifies high-growth "Star Offerings", margin-draining services, and cash generators to guide strategic capital and delivery capacity allocation.

## Architecture & Data Flow
1. **Analytics Engine (FastAPI & Pandas):** Computes gross margin, net contribution, return/rework leakage, and hourly delivery yields across segments.
2. **Interactive Executive UI (Next.js & Recharts):** Real-time scatter bubble matrix (margin vs. growth), contribution margin waterfall, and segment filtering.
3. **Data Integrity:** Clearly labelled synthetic P&L records benchmarked against enterprise service/product distributions.

## Getting Started

### 1. Backend Service
\\\powershell
cd backend
python -m uvicorn main:app --reload --port 8000
\\\

### 2. Frontend Interface
\\\powershell
cd frontend
npm run dev
\\\
Visit: \http://localhost:3000\
"@
Set-Content -Path VAR_REPORT.md -Value @"
# Verification & Architecture Report (VAR) — POC-27

## System Architecture Summary
- **Backend:** FastAPI (Python 3.14) serving clean REST endpoints with Pandas for real-time aggregations, contribution calculations, and quadrant classifications.
- **Frontend:** Next.js 16 (React 19) with Tailwind CSS styling and Recharts for responsive, interactive executive data visualizations.
- **Data Pipeline:** In-memory operational P&L ledger with dynamic query parameter filtering across segments and offering classifications.

## Component Verification Matrix
| Component | Status | Verification Detail |
|---|---|---|
| FastAPI Root & Docs | PASSED | \GET /\ returns status 200 with online kernel confirmation |
| Portfolio Summary API | PASSED | \GET /api/portfolio/summary\ aggregates revenue, margin, and hours |
| Waterfall API | PASSED | \GET /api/portfolio/waterfall\ outputs 4-stage contribution progression |
| Next.js Client Render | PASSED | Interactive scatter quadrant, waterfall bars, and filter dropdowns verified |
| Responsive Layout | PASSED | Mobile and desktop clean layout rendering |
