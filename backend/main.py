from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd

app = FastAPI(
    title="Product & Service Profitability Portfolio Engine",
    description="Executive decision-support telemetry and margin intelligence API for Real Rails POC-27",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PORTFOLIO_ITEMS = [
    {"id": "OFF-101", "name": "Enterprise Cloud Migration", "category": "Cloud Services", "type": "Service", "revenue": 1420000, "direct_cost": 810000, "service_effort_hrs": 3800, "growth_rate": 28.4, "returns_cost": 12000, "target_segment": "Enterprise", "lifecycle": "Growth"},
    {"id": "OFF-102", "name": "Managed Threat Defense (MDR)", "category": "Cybersecurity", "type": "Service", "revenue": 980000, "direct_cost": 410000, "service_effort_hrs": 1950, "growth_rate": 34.2, "returns_cost": 5000, "target_segment": "Enterprise", "lifecycle": "Growth"},
    {"id": "OFF-103", "name": "AI Predictive Maintenance Suite", "category": "AI & Analytics", "type": "Product", "revenue": 1650000, "direct_cost": 520000, "service_effort_hrs": 1200, "growth_rate": 45.0, "returns_cost": 18000, "target_segment": "Mid-Market", "lifecycle": "Introduction"},
    {"id": "OFF-104", "name": "Legacy ERP Maintenance", "category": "Enterprise Software", "type": "Service", "revenue": 820000, "direct_cost": 640000, "service_effort_hrs": 4200, "growth_rate": -6.5, "returns_cost": 42000, "target_segment": "Enterprise", "lifecycle": "Decline"},
    {"id": "OFF-105", "name": "Edge IoT Gateway Appliance", "category": "Hardware & Embedded", "type": "Product", "revenue": 740000, "direct_cost": 490000, "service_effort_hrs": 850, "growth_rate": 14.8, "returns_cost": 31000, "target_segment": "Industrial", "lifecycle": "Mature"},
    {"id": "OFF-106", "name": "Compliance & ESG Reporting Hub", "category": "SaaS Platform", "type": "Product", "revenue": 610000, "direct_cost": 180000, "service_effort_hrs": 620, "growth_rate": 52.1, "returns_cost": 4000, "target_segment": "Mid-Market", "lifecycle": "Growth"},
    {"id": "OFF-107", "name": "Virtual CISO Advisory Retainer", "category": "Cybersecurity", "type": "Service", "revenue": 450000, "direct_cost": 210000, "service_effort_hrs": 1400, "growth_rate": 19.5, "returns_cost": 2500, "target_segment": "SMB", "lifecycle": "Mature"},
    {"id": "OFF-108", "name": "Custom Full-Stack Web Development", "category": "Consulting", "type": "Service", "revenue": 890000, "direct_cost": 720000, "service_effort_hrs": 5100, "growth_rate": 3.2, "returns_cost": 58000, "target_segment": "SMB", "lifecycle": "Mature"},
    {"id": "OFF-109", "name": "Data Lakehouse Warehouse Engine", "category": "AI & Analytics", "type": "Product", "revenue": 1280000, "direct_cost": 440000, "service_effort_hrs": 980, "growth_rate": 39.0, "returns_cost": 9500, "target_segment": "Enterprise", "lifecycle": "Growth"},
    {"id": "OFF-110", "name": "On-Prem Backup Infrastructure", "category": "Infrastructure", "type": "Product", "revenue": 390000, "direct_cost": 310000, "service_effort_hrs": 1100, "growth_rate": -14.2, "returns_cost": 24000, "target_segment": "Industrial", "lifecycle": "Decline"},
]

def calculate_portfolio_metrics(items):
    df = pd.DataFrame(items)
    df["gross_profit"] = df["revenue"] - df["direct_cost"]
    df["net_contribution"] = df["gross_profit"] - df["returns_cost"]
    df["margin_pct"] = (df["net_contribution"] / df["revenue"]) * 100
    df["hourly_yield"] = df["net_contribution"] / df["service_effort_hrs"]
    
    def classify(row):
        high_growth = row["growth_rate"] >= 20.0
        high_margin = row["margin_pct"] >= 45.0
        if high_growth and high_margin:
            return "Star Offering (Scale & Invest)"
        elif not high_growth and high_margin:
            return "Cash Generator (Protect Margin)"
        elif high_growth and not high_margin:
            return "Margin Trapped (Reprice / Automate)"
        else:
            return "Drain Offering (Sunsetting / Redesign)"
            
    df["strategic_quadrant"] = df.apply(classify, axis=1)
    return df

@app.get("/")
def read_root():
    return {
        "poc_id": "POC-27",
        "system": "Product & Service Profitability Portfolio",
        "status": "online",
        "engine": "FastAPI + Pandas Analytical Kernel"
    }

@app.get("/api/portfolio/summary")
def get_portfolio_summary(segment: Optional[str] = None, offering_type: Optional[str] = None):
    df = calculate_portfolio_metrics(PORTFOLIO_ITEMS)
    
    if segment and segment != "All":
        df = df[df["target_segment"] == segment]
    if offering_type and offering_type != "All":
        df = df[df["type"] == offering_type]
        
    total_rev = float(df["revenue"].sum())
    total_cost = float(df["direct_cost"].sum())
    total_net_contrib = float(df["net_contribution"].sum())
    avg_margin = float(df["margin_pct"].mean()) if len(df) > 0 else 0.0
    total_hours = float(df["service_effort_hrs"].sum())
    
    records = df.to_dict(orient="records")
    
    return {
        "kpis": {
            "total_revenue": total_rev,
            "total_direct_cost": total_cost,
            "total_net_contribution": total_net_contrib,
            "portfolio_margin_pct": round(avg_margin, 2),
            "total_service_hours": total_hours,
            "active_offerings_count": len(df)
        },
        "offerings": records
    }

@app.get("/api/portfolio/waterfall")
def get_waterfall_breakdown():
    df = calculate_portfolio_metrics(PORTFOLIO_ITEMS)
    gross_rev = float(df["revenue"].sum())
    cogs = float(df["direct_cost"].sum())
    returns_rework = float(df["returns_cost"].sum())
    net_contrib = gross_rev - cogs - returns_rework
    
    return [
        {"stage": "Gross Bookings", "amount": gross_rev, "type": "total"},
        {"stage": "Direct Cost / COGS", "amount": -cogs, "type": "deduction"},
        {"stage": "Returns & SLA Rework", "amount": -returns_rework, "type": "deduction"},
        {"stage": "Net Contribution Margin", "amount": net_contrib, "type": "final"}
    ]