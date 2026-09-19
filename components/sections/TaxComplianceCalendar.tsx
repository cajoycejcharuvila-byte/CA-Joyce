"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Globe, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// --- DATA STRUCTURES ---

type Jurisdiction = "india" | "uae";
type IndiaCategory = "All" | "GST" | "TDS" | "Advance Tax" | "Income Tax" | "Audit";
type UAECategory = "All" | "Corporate Tax" | "VAT" | "ESR & Audit";

interface ComplianceEvent {
  id: string;
  jurisdiction: Jurisdiction;
  category: string;
  quarter?: string;
  name: string;
  subTitle: string;
  description: string;
  statutoryRef: string;
  applicableTo: string;
  day: number;
  month?: number; // 0-indexed: 0 = Jan, 11 = Dec. If undefined, recurring monthly
}

// Full Statutory Tax Milestones
const COMPLIANCE_EVENTS: ComplianceEvent[] = [
  // ── INDIA COMPLIANCE ──────────────────────────────────────────────
  // Monthly recurring
  {
    id: "in-tds-monthly",
    jurisdiction: "india",
    category: "TDS",
    name: "TDS / TCS Deposit",
    subTitle: "Monthly Tax Deducted at Source",
    description: "Deposit of tax deducted/collected for the previous month under Income Tax Act.",
    statutoryRef: "Challan ITNS 281",
    applicableTo: "All Deductors (Corporate & Non-Corporate)",
    day: 7,
  },
  {
    id: "in-gst-r1",
    jurisdiction: "india",
    category: "GST",
    name: "GSTR-1 Return",
    subTitle: "Monthly Outward Supplies",
    description: "Filing details of outward supplies of goods and services for monthly filers.",
    statutoryRef: "Section 37, CGST Act",
    applicableTo: "Regular Taxpayers (Turnover > ₹5 Cr or monthly opt-in)",
    day: 11,
  },
  {
    id: "in-gst-3b",
    jurisdiction: "india",
    category: "GST",
    name: "GSTR-3B & Tax Payment",
    subTitle: "Monthly Summary & Tax Settlement",
    description: "Summary return of outward and inward supplies along with payment of net GST liability.",
    statutoryRef: "Section 39, CGST Act",
    applicableTo: "All Registered Regular Taxpayers",
    day: 20,
  },

  // Annual & Quarterly India Milestones
  {
    id: "in-adv-q1",
    jurisdiction: "india",
    category: "Advance Tax",
    quarter: "Q1 • FY 2026-27",
    name: "Advance Tax — 1st Installment",
    subTitle: "15% of Estimated Annual Tax Liability",
    description: "First installment of advance income tax payable by corporate and non-salaried assesses.",
    statutoryRef: "Section 208 / 211",
    applicableTo: "Corporate Assesses & Individuals with tax > ₹10,000",
    day: 15,
    month: 5, // June 15
  },
  {
    id: "in-itr-non-audit",
    jurisdiction: "india",
    category: "Income Tax",
    quarter: "Q2 • Assessment Year",
    name: "Income Tax Return (Non-Audit)",
    subTitle: "Annual Tax Return Filing",
    description: "Statutory deadline for filing personal and partnership tax returns where audit is not mandated.",
    statutoryRef: "Section 139(1)",
    applicableTo: "Salaried Individuals, HUFs, Firms & Non-Audit LLPs",
    day: 31,
    month: 6, // July 31
  },
  {
    id: "in-adv-q2",
    jurisdiction: "india",
    category: "Advance Tax",
    quarter: "Q2 • FY 2026-27",
    name: "Advance Tax — 2nd Installment",
    subTitle: "Cumulative 45% of Tax Liability",
    description: "Second milestone for advance tax computation to avoid Section 234C interest penalties.",
    statutoryRef: "Section 208 / 211",
    applicableTo: "All Tax Assesses liable for Advance Tax",
    day: 15,
    month: 8, // September 15
  },
  {
    id: "in-tax-audit",
    jurisdiction: "india",
    category: "Audit",
    quarter: "Q2 • Statutory Audit",
    name: "Tax Audit Report (Form 3CA/3CD)",
    subTitle: "Chartered Accountant Attestation",
    description: "Submission of audit report by practicing Chartered Accountant for accounts covered under audit limits.",
    statutoryRef: "Section 44AB",
    applicableTo: "Businesses with turnover > ₹1 Cr (₹10 Cr if 95% digital) & Professionals > ₹50L",
    day: 30,
    month: 8, // September 30
  },
  {
    id: "in-itr-corporate",
    jurisdiction: "india",
    category: "Income Tax",
    quarter: "Q3 • Corporate Filings",
    name: "Income Tax Return (Corporate / Audit)",
    subTitle: "Audited Entity Return Filing",
    description: "Filing income tax return for corporate companies and accounts required to get audited under any law.",
    statutoryRef: "Section 139(1)",
    applicableTo: "Private & Public Limited Companies, Audited Firms & Partners",
    day: 31,
    month: 9, // October 31
  },
  {
    id: "in-adv-q3",
    jurisdiction: "india",
    category: "Advance Tax",
    quarter: "Q3 • FY 2026-27",
    name: "Advance Tax — 3rd Installment",
    subTitle: "Cumulative 75% of Tax Liability",
    description: "Penultimate advance tax installment for the current financial year.",
    statutoryRef: "Section 208 / 211",
    applicableTo: "All Advance Tax Assesses",
    day: 15,
    month: 11, // December 15
  },
  {
    id: "in-gst-annual",
    jurisdiction: "india",
    category: "GST",
    quarter: "Q3 • Annual Reconciliation",
    name: "GSTR-9 & GSTR-9C Annual Return",
    subTitle: "Annual GST Audit & Reconciliation",
    description: "Consolidated annual return and self-certified reconciliation statement for financial year.",
    statutoryRef: "Section 44, CGST Act",
    applicableTo: "GSTR-9: Aggregate Turnover > ₹2 Cr | GSTR-9C: Turnover > ₹5 Cr",
    day: 31,
    month: 11, // December 31
  },
  {
    id: "in-adv-q4",
    jurisdiction: "india",
    category: "Advance Tax",
    quarter: "Q4 • Year End",
    name: "Advance Tax — 4th Installment",
    subTitle: "Final 100% Tax Settlement",
    description: "Final advance tax milestone to settle estimated tax before the close of financial year.",
    statutoryRef: "Section 208 / 211",
    applicableTo: "All Tax Assesses liable for Advance Tax",
    day: 15,
    month: 2, // March 15
  },

  // ── UAE COMPLIANCE ────────────────────────────────────────────────
  {
    id: "uae-vat-q1",
    jurisdiction: "uae",
    category: "VAT",
    quarter: "Q1 • EmaraTax Filing",
    name: "UAE VAT 201 Return (Q1)",
    subTitle: "Quarterly VAT Return & Payment",
    description: "Submission of VAT return and payment of 5% tax for the tax period ending March 31.",
    statutoryRef: "Federal Decree-Law No. (8) of 2017",
    applicableTo: "All VAT-Registered UAE Businesses & Free Zone Entities",
    day: 28,
    month: 3, // April 28
  },
  {
    id: "uae-esr-notification",
    jurisdiction: "uae",
    category: "ESR & Audit",
    quarter: "Q2 • Regulatory",
    name: "ESR Notification Filing",
    subTitle: "Economic Substance Regulations",
    description: "Annual ESR notification via Ministry of Finance portal within 6 months from financial year end.",
    statutoryRef: "Cabinet Resolution No. 57 of 2020",
    applicableTo: "Licensees undertaking Relevant Activities in UAE & Free Zones",
    day: 30,
    month: 5, // June 30
  },
  {
    id: "uae-vat-q2",
    jurisdiction: "uae",
    category: "VAT",
    quarter: "Q2 • EmaraTax Filing",
    name: "UAE VAT 201 Return (Q2)",
    subTitle: "Quarterly VAT Return & Payment",
    description: "Filing VAT return for period April–June via EmaraTax portal.",
    statutoryRef: "Federal Decree-Law No. (8) of 2017",
    applicableTo: "All VAT-Registered Businesses",
    day: 28,
    month: 6, // July 28
  },
  {
    id: "uae-ct-return",
    jurisdiction: "uae",
    category: "Corporate Tax",
    quarter: "Q3 • Corporate Tax",
    name: "UAE Corporate Tax Return & Payment",
    subTitle: "9% Corporate Tax Return Filing",
    description: "Statutory tax return filing and tax payment within 9 months from the end of tax period.",
    statutoryRef: "Federal Decree-Law No. 47 of 2022",
    applicableTo: "All Taxable Persons (Mainland & Qualifying Free Zone Entities)",
    day: 30,
    month: 8, // September 30 (for Dec FY end)
  },
  {
    id: "uae-vat-q3",
    jurisdiction: "uae",
    category: "VAT",
    quarter: "Q3 • EmaraTax Filing",
    name: "UAE VAT 201 Return (Q3)",
    subTitle: "Quarterly VAT Return & Payment",
    description: "Filing VAT return for period July–September via EmaraTax portal.",
    statutoryRef: "Federal Decree-Law No. (8) of 2017",
    applicableTo: "All VAT-Registered Businesses",
    day: 28,
    month: 9, // October 28
  },
  {
    id: "uae-esr-report",
    jurisdiction: "uae",
    category: "ESR & Audit",
    quarter: "Q4 • Compliance Report",
    name: "ESR Annual Report Submission",
    subTitle: "Substance Proof & Audited Accounts",
    description: "Filing detailed ESR report and audited accounts within 12 months of financial year end.",
    statutoryRef: "Cabinet Resolution No. 57 of 2020",
    applicableTo: "Relevant Activity Licensees earning gross income",
    day: 31,
    month: 11, // December 31
  },
  {
    id: "uae-vat-q4",
    jurisdiction: "uae",
    category: "VAT",
    quarter: "Q4 • EmaraTax Filing",
    name: "UAE VAT 201 Return (Q4)",
    subTitle: "Quarterly VAT Return & Payment",
    description: "Filing VAT return for period October–December via EmaraTax portal.",
    statutoryRef: "Federal Decree-Law No. (8) of 2017",
    applicableTo: "All VAT-Registered Businesses",
    day: 28,
    month: 0, // January 28
  }
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Color mapping for category pills with refined editorial styling
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  GST: { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-500/20", accent: "bg-blue-500" },
  TDS: { bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-500/20", accent: "bg-purple-500" },
  "Advance Tax": { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-500/20", accent: "bg-emerald-500" },
  "Income Tax": { bg: "bg-amber-500/10", text: "text-amber-800", border: "border-amber-500/20", accent: "bg-amber-600" },
  Audit: { bg: "bg-rose-500/10", text: "text-rose-700", border: "border-rose-500/20", accent: "bg-rose-500" },
  "Corporate Tax": { bg: "bg-indigo-500/10", text: "text-indigo-700", border: "border-indigo-500/20", accent: "bg-indigo-500" },
  VAT: { bg: "bg-teal-500/10", text: "text-teal-700", border: "border-teal-500/20", accent: "bg-teal-500" },
  "ESR & Audit": { bg: "bg-orange-500/10", text: "text-orange-800", border: "border-orange-500/20", accent: "bg-orange-500" },
};

export default function TaxComplianceCalendar() {
  const [isClient, setIsClient] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update category options based on jurisdiction
  const categories = useMemo(() => {
    if (jurisdiction === "india") {
      return ["All", "GST", "TDS", "Advance Tax", "Income Tax", "Audit"] as IndiaCategory[];
    }
    return ["All", "Corporate Tax", "VAT", "ESR & Audit"] as UAECategory[];
  }, [jurisdiction]);

  // Reset category filter when changing jurisdiction
  const handleJurisdictionChange = (jur: Jurisdiction) => {
    setJurisdiction(jur);
    setSelectedCategory("All");
  };

  // Compute "Due This Month" dynamically
  const thisMonthEvents = useMemo(() => {
    if (!isClient) return [];
    const today = new Date();
    const currentMonth = today.getMonth();

    const filtered = COMPLIANCE_EVENTS.filter((e) => {
      if (e.jurisdiction !== jurisdiction) return false;
      return e.month === undefined || e.month === currentMonth;
    });

    return filtered.sort((a, b) => a.day - b.day);
  }, [isClient, jurisdiction]);

  // Compute Annual Roadmap events
  const annualEvents = useMemo(() => {
    const filtered = COMPLIANCE_EVENTS.filter((e) => {
      if (e.jurisdiction !== jurisdiction) return false;
      if (e.month === undefined) return false; // roadmap emphasizes key milestone dates
      if (selectedCategory !== "All" && e.category !== selectedCategory) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (a.month! !== b.month!) return a.month! - b.month!;
      return a.day - b.day;
    });
  }, [jurisdiction, selectedCategory]);

  // Carousel scroll handling
  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability);
      return () => el.removeEventListener("scroll", checkScrollability);
    }
  }, [annualEvents]);

  // Current month string
  const currentMonthName = useMemo(() => {
    if (!isClient) return "Current Month";
    const today = new Date();
    return `${MONTH_FULL[today.getMonth()]} ${today.getFullYear()}`;
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="w-full min-h-[500px] bg-brand-bg/40 rounded-[32px] animate-pulse border border-brand-divider flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest text-brand-secondary">
            Synchronizing Statutory Calendars...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      {/* ── 1. LUXURY EDITORIAL HEADER ─────────────────────────────── */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="max-w-2xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-dark/5 border border-brand-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-3xs uppercase tracking-[0.2em] font-semibold text-brand-secondary">
              Statutory Compliance Schedule • FY 2026-27
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-primary leading-[1.08]">
            Statutory Tax & Compliance Calendar
          </h2>

          <p className="font-sans text-base sm:text-lg text-brand-secondary leading-relaxed max-w-xl">
            Key filing thresholds, advance tax installments, and statutory audit deadlines across India and the UAE to ensure penalty-free compliance.
          </p>
        </div>

        {/* Dual Jurisdiction Segmented Control */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white border border-brand-border shadow-soft self-start md:self-end">
          <button
            onClick={() => handleJurisdictionChange("india")}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-300 ${
              jurisdiction === "india"
                ? "text-white"
                : "text-brand-secondary hover:text-brand-primary"
            }`}
          >
            {jurisdiction === "india" && (
              <motion.div
                layoutId="active-jurisdiction-pill"
                className="absolute inset-0 bg-brand-primary rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-base">🇮🇳</span> India Practice
            </span>
          </button>

          <button
            onClick={() => handleJurisdictionChange("uae")}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-300 ${
              jurisdiction === "uae"
                ? "text-white"
                : "text-brand-secondary hover:text-brand-primary"
            }`}
          >
            {jurisdiction === "uae" && (
              <motion.div
                layoutId="active-jurisdiction-pill"
                className="absolute inset-0 bg-brand-primary rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-base">🇦🇪</span> UAE Practice
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. EXECUTIVE URGENCY BAR: DUE THIS MONTH ─────────────────── */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0c1424] via-[#0f172a] to-[#141e33] border border-white/10 shadow-glass text-white p-6 sm:p-8">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-brand-accent">
                <CalendarIcon className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-normal text-white tracking-wide">
                    Due This Month
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-3xs font-mono font-medium text-sky-300">
                    {currentMonthName}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-300 mt-0.5">
                  {thisMonthEvents.length} mandatory compliance filings scheduled for {jurisdiction === "india" ? "Indian entities" : "UAE corporations"}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Timely filings avoid interest & penalty notices</span>
            </div>
          </div>

          {/* Events Horizontal Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {thisMonthEvents.map((event, index) => {
              const style = CATEGORY_STYLES[event.category] || {
                bg: "bg-white/10",
                text: "text-white",
                border: "border-white/20",
                accent: "bg-sky-400"
              };

              // Compute Days Remaining in Current Month
              const today = new Date();
              const daysLeft = event.day - today.getDate();
              const isPast = daysLeft < 0;
              const isToday = daysLeft === 0;

              return (
                <motion.div
                  key={`${event.id}-this-month`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="group relative bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-sky-400/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Date & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-3xl font-medium text-white group-hover:text-sky-300 transition-colors">
                          {event.day.toString().padStart(2, "0")}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                          {MONTH_NAMES[today.getMonth()]}
                        </span>
                      </div>

                      <span
                        className={`text-3xs font-mono font-semibold px-2 py-0.5 rounded-full border ${
                          isPast
                            ? "bg-slate-700/60 text-slate-400 border-slate-600"
                            : isToday
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                            : daysLeft <= 5
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                        }`}
                      >
                        {isPast
                          ? "Completed"
                          : isToday
                          ? "Due Today"
                          : `${daysLeft}d left`}
                      </span>
                    </div>

                    {/* Title & Category */}
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-white leading-snug line-clamp-1">
                        {event.name}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Statutory Reference / Action */}
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-3xs font-mono text-slate-400">
                    <span className="truncate max-w-[120px]">{event.statutoryRef}</span>
                    <a
                      href={buildWhatsAppUrl(
                        `Hello CA Joyce, I have a question regarding upcoming ${event.name} deadline (due ${event.day} ${MONTH_NAMES[today.getMonth()]}). Could you assist?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors group-hover:translate-x-0.5"
                      title="Consult on this filing"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. ANNUAL COMPLIANCE ROADMAP (INTERACTIVE CAROUSEL) ─────── */}
      <div className="space-y-6">
        {/* Roadmap Toolbar: Filters + Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <span className="font-mono text-xs text-brand-secondary mr-2 shrink-0 font-medium">
              Filter By:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-medium transition-all duration-200 shrink-0 border ${
                    isSelected
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                      : "bg-white text-brand-secondary border-brand-border hover:border-brand-primary/40 hover:text-brand-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3">
            <span className="font-mono text-xs text-brand-secondary hidden sm:inline-block">
              {annualEvents.length} Major Milestones
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous Milestones"
                className={`p-2.5 rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? "bg-white border-brand-border text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent shadow-sm"
                    : "bg-brand-bg border-brand-divider text-brand-secondary/30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next Milestones"
                className={`p-2.5 rounded-full border transition-all duration-200 ${
                  canScrollRight
                    ? "bg-white border-brand-border text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent shadow-sm"
                    : "bg-brand-bg border-brand-divider text-brand-secondary/30 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Cards Horizon */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence mode="popLayout">
            {annualEvents.map((event, index) => {
              const style = CATEGORY_STYLES[event.category] || {
                bg: "bg-slate-100",
                text: "text-slate-800",
                border: "border-slate-200",
                accent: "bg-slate-800"
              };

              return (
                <motion.div
                  key={`${event.id}-annual`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative flex-shrink-0 w-[300px] sm:w-[340px] bg-white border border-brand-border rounded-[28px] p-6 shadow-soft hover:shadow-glass hover:-translate-y-2 transition-all duration-300 snap-start flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Glow on Card Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Meta: Quarter & Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className="font-mono text-3xs uppercase tracking-wider text-brand-secondary font-medium">
                        {event.quarter || "Statutory Milestone"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {event.category}
                      </span>
                    </div>

                    {/* Elegant Date Presentation */}
                    <div className="mb-6 flex items-baseline gap-2.5">
                      <span className="font-display text-5xl sm:text-6xl font-normal text-brand-primary tracking-tight group-hover:text-brand-accent transition-colors">
                        {event.day}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm uppercase tracking-widest font-semibold text-brand-primary">
                          {MONTH_NAMES[event.month!]}
                        </span>
                        <span className="font-sans text-3xs text-brand-secondary">
                          Annual Milestone
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-2">
                      <h4 className="font-sans text-base font-semibold text-brand-primary group-hover:text-brand-accent transition-colors leading-snug">
                        {event.name}
                      </h4>
                      <p className="font-sans text-xs text-brand-secondary leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Scope / Who Must Comply */}
                    <div className="mt-4 pt-3 border-t border-brand-divider space-y-1.5">
                      <span className="font-mono text-3xs uppercase tracking-wider text-brand-secondary/80 block">
                        Applicable To:
                      </span>
                      <p className="font-sans text-xs text-brand-primary font-medium line-clamp-2">
                        {event.applicableTo}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Statutory Form & Inquire Link */}
                  <div className="mt-6 pt-4 border-t border-brand-divider flex items-center justify-between text-xs">
                    <span className="font-mono text-3xs text-brand-secondary bg-brand-bg px-2 py-1 rounded-md border border-brand-border">
                      {event.statutoryRef}
                    </span>

                    <a
                      href={buildWhatsAppUrl(
                        `Hi CA Joyce, I would like to schedule compliance support for ${event.name} scheduled on ${event.day} ${MONTH_NAMES[event.month!]}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 4. STATUTORY ADVISORY & CONSULTATION BANNER ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-[28px] bg-white border border-brand-border shadow-soft">
        <div className="lg:col-span-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0 text-brand-accent mt-0.5">
            <ShieldCheck className="w-5 h-5 text-brand-accent" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-sans text-sm sm:text-base font-semibold text-brand-primary">
              Proactive Audit & Tax Planning Advisory
            </h4>
            <p className="font-sans text-xs sm:text-sm text-brand-secondary leading-relaxed">
              Statutory deadlines are subject to government notifications, extension circulars, and turnover classifications under ICAI and FTA regulations. Schedule a preliminary session to prepare books of accounts ahead of peak filing periods.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
          <a
            href={buildWhatsAppUrl(
              "Hello CA Joyce, I would like to consult on my upcoming tax filings and statutory compliance requirements."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-accent text-white font-sans text-xs sm:text-sm font-semibold transition-all duration-300 shadow-soft"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult on WhatsApp</span>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-bg hover:bg-white text-brand-primary border border-brand-border font-sans text-xs sm:text-sm font-semibold transition-all duration-300"
          >
            <span>Request Schedule Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
