"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ArrowRight, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// --- DATA STRUCTURES ---

type Jurisdiction = "india" | "uae";

interface ComplianceMilestone {
  id: string;
  jurisdiction: Jurisdiction;
  category: "income-tax" | "gst" | "advance-tax" | "corporate-tax" | "vat" | "esr";
  categoryLabel: string;
  day: number;
  month?: number; // 0-indexed: 0 = Jan, 11 = Dec. If undefined, recurring monthly
  isMonthly?: boolean;
  name: string;
  statutorySection: string;
  shortSummary: string;
  applicability: string;
  penaltyClause: string;
  requiredDocuments: string[];
}

const MILESTONES: ComplianceMilestone[] = [
  // ── INDIA JURISDICTION ─────────────────────────────────────────────
  {
    id: "in-tds-monthly",
    jurisdiction: "india",
    category: "advance-tax",
    categoryLabel: "TDS / TCS",
    day: 7,
    isMonthly: true,
    name: "TDS & TCS Monthly Deposit",
    statutorySection: "Section 200(3) • Challan ITNS 281",
    shortSummary: "Deposit of tax deducted or collected at source for all payments made in the preceding month.",
    applicability: "All corporate assesses, partnership firms, and individuals with tax deduction liabilities under Chapter XVII-B.",
    penaltyClause: "Interest at 1.5% per month u/s 201(1A) from the date of deduction to the date of deposit.",
    requiredDocuments: ["Monthly payroll deduction summary", "Vendor invoices with tax deduction", "Contractor payout schedules"],
  },
  {
    id: "in-gst-1",
    jurisdiction: "india",
    category: "gst",
    categoryLabel: "GST",
    day: 11,
    isMonthly: true,
    name: "GSTR-1 Outward Supplies Return",
    statutorySection: "Section 37, CGST Act",
    shortSummary: "Statement detailing outward supplies of goods and professional services provided during the preceding month.",
    applicability: "Regular registered taxpayers with aggregate annual turnover exceeding ₹5 Crore, or monthly filers.",
    penaltyClause: "Late fee of ₹50 per day of delay (₹20/day for NIL returns) plus suspension of E-Way Bill generation.",
    requiredDocuments: ["Sales register", "B2B tax invoices", "Credit and debit notes", "Export shipping bills"],
  },
  {
    id: "in-gst-3b",
    jurisdiction: "india",
    category: "gst",
    categoryLabel: "GST",
    day: 20,
    isMonthly: true,
    name: "GSTR-3B Summary Return & Tax Settlement",
    statutorySection: "Section 39, CGST Act",
    shortSummary: "Monthly self-assessed summary return covering outward supplies, eligible Input Tax Credit (ITC), and net tax payment.",
    applicability: "Mandatory for every taxpayer registered under the standard GST regime in India.",
    penaltyClause: "Interest at 18% per annum u/s 50 on net cash liability, plus late fee up to ₹5,000 per return.",
    requiredDocuments: ["GSTR-2B Input Tax Credit reconciliation", "Cash and credit electronic ledger summary", "Reverse charge payment tally"],
  },
  {
    id: "in-adv-q1",
    jurisdiction: "india",
    category: "advance-tax",
    categoryLabel: "Advance Tax",
    day: 15,
    month: 5, // June
    name: "Advance Tax — 1st Installment (15%)",
    statutorySection: "Section 208 / 211, Income Tax Act",
    shortSummary: "First installment of estimated annual income tax payable for the current financial year.",
    applicability: "Corporate entities and all individuals whose estimated net tax liability after TDS exceeds ₹10,000.",
    penaltyClause: "Simple interest at 1% per month u/s 234C on the shortfall below 15% of the total assessed tax.",
    requiredDocuments: ["Projected profit and loss statement", "Form 26AS TDS credits to date", "Advance tax calculation working sheet"],
  },
  {
    id: "in-itr-non-audit",
    jurisdiction: "india",
    category: "income-tax",
    categoryLabel: "Income Tax",
    day: 31,
    month: 6, // July
    name: "Income Tax Return (Non-Audit Cases)",
    statutorySection: "Section 139(1), Income Tax Act",
    shortSummary: "Statutory deadline for filing annual income tax returns for individuals and entities not subject to tax audit.",
    applicability: "Salaried individuals, HUFs, partnership firms, and non-audit LLPs across India.",
    penaltyClause: "Late fee u/s 234F up to ₹5,000, interest u/s 234A on unpaid tax, and forfeiture of carry-forward business losses.",
    requiredDocuments: ["Form 16 / 16A", "Annual Information Statement (AIS / TIS)", "Bank account statements for all accounts", "Capital gains statements"],
  },
  {
    id: "in-adv-q2",
    jurisdiction: "india",
    category: "advance-tax",
    categoryLabel: "Advance Tax",
    day: 15,
    month: 8, // September
    name: "Advance Tax — 2nd Installment (45%)",
    statutorySection: "Section 208 / 211, Income Tax Act",
    shortSummary: "Second milestone for advance tax computation, bringing cumulative payment to 45% of total estimated liability.",
    applicability: "All tax assesses with estimated annual net tax liability exceeding ₹10,000.",
    penaltyClause: "Interest at 1% per month u/s 234C on any shortfall below the cumulative 45% threshold.",
    requiredDocuments: ["Q1 & Q2 interim financial statements", "TDS reconciliation against 26AS/AIS", "Challan ITNS 280 payment proofs"],
  },
  {
    id: "in-tax-audit",
    jurisdiction: "india",
    category: "income-tax",
    categoryLabel: "Statutory Audit",
    day: 30,
    month: 8, // September
    name: "Tax Audit Report (Form 3CA / 3CD)",
    statutorySection: "Section 44AB, Income Tax Act",
    shortSummary: "Mandatory attestation and filing of audited financial accounts by a practicing Chartered Accountant.",
    applicability: "Businesses with turnover exceeding ₹1 Crore (₹10 Crore if 95% transactions are digital) and professionals exceeding ₹50 Lakhs.",
    penaltyClause: "Penalty of 0.5% of total turnover or ₹1,50,000 (whichever is less) under Section 271B.",
    requiredDocuments: ["Signed balance sheet & profit/loss account", "Fixed asset depreciation schedules", "Related-party transaction register", "Statutory dues compliance proof"],
  },
  {
    id: "in-itr-corporate",
    jurisdiction: "india",
    category: "income-tax",
    categoryLabel: "Income Tax",
    day: 31,
    month: 9, // October
    name: "Income Tax Return (Corporate & Audit Cases)",
    statutorySection: "Section 139(1), Income Tax Act",
    shortSummary: "Annual income tax return submission for corporate companies and all assesses whose accounts require statutory audit.",
    applicability: "Private and public limited companies, audited partnership firms, and working partners of audited entities.",
    penaltyClause: "Penal interest u/s 234A, late filing fee u/s 234F, and loss of eligibility to carry forward business and capital losses.",
    requiredDocuments: ["Uploaded Form 3CA/3CD Tax Audit Report", "Director's Report & MCA disclosures", "Tax payment challans & computation"],
  },
  {
    id: "in-adv-q3",
    jurisdiction: "india",
    category: "advance-tax",
    categoryLabel: "Advance Tax",
    day: 15,
    month: 11, // December
    name: "Advance Tax — 3rd Installment (75%)",
    statutorySection: "Section 208 / 211, Income Tax Act",
    shortSummary: "Penultimate milestone requiring cumulative payment of 75% of the annual estimated tax liability.",
    applicability: "All corporate and non-salaried taxpayers liable under Section 208.",
    penaltyClause: "Interest at 1% per month u/s 234C on deficit below the 75% threshold.",
    requiredDocuments: ["Nine-month financial review", "Forecasted fourth-quarter revenues", "Form 26AS quarterly update"],
  },
  {
    id: "in-gst-annual",
    jurisdiction: "india",
    category: "gst",
    categoryLabel: "GST Annual",
    day: 31,
    month: 11, // December
    name: "GSTR-9 & GSTR-9C Annual Reconciliation",
    statutorySection: "Section 44, CGST Act",
    shortSummary: "Consolidated annual return and reconciliation statement matching audited accounts with filed monthly returns.",
    applicability: "GSTR-9 mandatory for turnover exceeding ₹2 Crore; GSTR-9C self-certified reconciliation for turnover exceeding ₹5 Crore.",
    penaltyClause: "Late fee of ₹200 per day (subject to a maximum of 0.50% of turnover in state).",
    requiredDocuments: ["Audited financial statements", "Monthly GSTR-1 & 3B filed copies", "Input Tax Credit variance report"],
  },
  {
    id: "in-adv-q4",
    jurisdiction: "india",
    category: "advance-tax",
    categoryLabel: "Advance Tax",
    day: 15,
    month: 2, // March
    name: "Advance Tax — 4th Installment (100%)",
    statutorySection: "Section 208 / 211, Income Tax Act",
    shortSummary: "Final installment settling 100% of the estimated annual tax liability before the financial year closes.",
    applicability: "All taxpayers liable for advance tax under Section 208.",
    penaltyClause: "Interest u/s 234B (1% per month) if total advance tax paid falls below 90% of assessed tax.",
    requiredDocuments: ["Full-year profit estimation", "Comprehensive TDS deduction credit report", "Final tax settlement computation"],
  },

  // ── UAE JURISDICTION ───────────────────────────────────────────────
  {
    id: "uae-vat-q1",
    jurisdiction: "uae",
    category: "vat",
    categoryLabel: "VAT",
    day: 28,
    month: 3, // April
    name: "UAE VAT 201 Return (First Quarter)",
    statutorySection: "Federal Decree-Law No. (8) of 2017",
    shortSummary: "Quarterly declaration of standard-rated 5% supplies, zero-rated exports, and input VAT recovery for Jan–Mar.",
    applicability: "All VAT-registered mainland and free zone entities operating within the UAE.",
    penaltyClause: "Late filing administrative penalty of AED 1,000 (first offense) and AED 2,000 for repeats, plus monthly unpaid tax interest.",
    requiredDocuments: ["Sales invoices with valid TRN", "Import declarations from Federal Customs", "Input VAT purchase invoices", "EmaraTax portal access"],
  },
  {
    id: "uae-esr-notification",
    jurisdiction: "uae",
    category: "esr",
    categoryLabel: "ESR",
    day: 30,
    month: 5, // June
    name: "Economic Substance (ESR) Notification",
    statutorySection: "Cabinet Resolution No. 57 of 2020",
    shortSummary: "Annual notification filing via the Ministry of Finance portal within six months from the end of the financial year.",
    applicability: "Licensees undertaking Relevant Activities (banking, insurance, fund management, lease-finance, distribution, shipping, holding company).",
    penaltyClause: "Administrative penalty of AED 20,000 for failure to submit the notification on time.",
    requiredDocuments: ["Commercial trade license", "Shareholder register & organizational chart", "Financial statement confirming gross income from Relevant Activities"],
  },
  {
    id: "uae-vat-q2",
    jurisdiction: "uae",
    category: "vat",
    categoryLabel: "VAT",
    day: 28,
    month: 6, // July
    name: "UAE VAT 201 Return (Second Quarter)",
    statutorySection: "Federal Decree-Law No. (8) of 2017",
    shortSummary: "Quarterly VAT filing covering standard and exempt supplies executed between April 1 and June 30.",
    applicability: "All VAT-registered businesses with quarterly tax periods.",
    penaltyClause: "Administrative penalty of AED 1,000 for late submission plus late payment interest.",
    requiredDocuments: ["Tax invoices for supplies within UAE", "Commercial export proof (customs exit certificates)", "EmaraTax statement"],
  },
  {
    id: "uae-ct-return",
    jurisdiction: "uae",
    category: "corporate-tax",
    categoryLabel: "Corporate Tax",
    day: 30,
    month: 8, // September
    name: "UAE Corporate Tax Return & Settlement",
    statutorySection: "Federal Decree-Law No. 47 of 2022",
    shortSummary: "Mandatory corporate tax return filing and payment within nine months from the end of the applicable tax period.",
    applicability: "All taxable persons, including mainland companies, foreign branches, and Qualifying Free Zone Persons.",
    penaltyClause: "Administrative penalty of AED 500/month for failure to file on time, escalating to AED 1,000/month after seven months.",
    requiredDocuments: ["IFRS-compliant audited financial statements", "Tax adjustment schedules for non-deductible expenses", "Qualifying income documentation for Free Zone entities"],
  },
  {
    id: "uae-vat-q3",
    jurisdiction: "uae",
    category: "vat",
    categoryLabel: "VAT",
    day: 28,
    month: 9, // October
    name: "UAE VAT 201 Return (Third Quarter)",
    statutorySection: "Federal Decree-Law No. (8) of 2017",
    shortSummary: "Quarterly VAT filing covering supplies, input tax recovery, and adjustments for July 1 through September 30.",
    applicability: "All active VAT registrants under FTA jurisdiction.",
    penaltyClause: "Late filing fee of AED 1,000 plus interest on any outstanding tax balances.",
    requiredDocuments: ["Quarterly sales register", "Expense invoices showing vendor TRNs", "Customs declaration matching records"],
  },
  {
    id: "uae-esr-report",
    jurisdiction: "uae",
    category: "esr",
    categoryLabel: "ESR Report",
    day: 31,
    month: 11, // December
    name: "ESR Detailed Annual Report Submission",
    statutorySection: "Cabinet Resolution No. 57 of 2020",
    shortSummary: "Comprehensive economic substance report demonstrating adequate employees, premises, and expenditure within the UAE.",
    applicability: "Licensees that earn gross income from Relevant Activities and are not exempt under the regulations.",
    penaltyClause: "Severe administrative fine of AED 50,000 for failure to submit the report within 12 months from financial year end.",
    requiredDocuments: ["Audited financial reports", "Employee headcount & payroll records", "Lease agreement for UAE office/facility", "Board meeting minutes held in the UAE"],
  },
  {
    id: "uae-vat-q4",
    jurisdiction: "uae",
    category: "vat",
    categoryLabel: "VAT",
    day: 28,
    month: 0, // January
    name: "UAE VAT 201 Return (Fourth Quarter)",
    statutorySection: "Federal Decree-Law No. (8) of 2017",
    shortSummary: "Quarterly VAT return for the final period covering October 1 through December 31.",
    applicability: "All registered UAE businesses.",
    penaltyClause: "Late return fee of AED 1,000 plus statutory interest on overdue amounts.",
    requiredDocuments: ["Fourth-quarter sales ledger", "Annual VAT reconciliation", "Input tax credit adjustment sheets"],
  }
];

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TaxComplianceCalendar() {
  const [isClient, setIsClient] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("in-tax-audit"); // Default open for demonstration

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter categories by jurisdiction
  const filterOptions = useMemo(() => {
    if (jurisdiction === "india") {
      return [
        { id: "all", label: "All Deadlines" },
        { id: "income-tax", label: "Income Tax & Audit" },
        { id: "gst", label: "GST Returns" },
        { id: "advance-tax", label: "TDS & Advance Tax" }
      ];
    }
    return [
      { id: "all", label: "All Deadlines" },
      { id: "corporate-tax", label: "Corporate Tax" },
      { id: "vat", label: "VAT Filings" },
      { id: "esr", label: "ESR & Substance" }
    ];
  }, [jurisdiction]);

  const handleJurisdictionChange = (jur: Jurisdiction) => {
    setJurisdiction(jur);
    setActiveCategory("all");
    // Open a relevant default milestone in the new jurisdiction
    setExpandedId(jur === "india" ? "in-tax-audit" : "uae-ct-return");
  };

  // Filtered milestones list
  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      if (m.jurisdiction !== jurisdiction) return false;
      if (activeCategory !== "all" && m.category !== activeCategory) return false;
      return true;
    }).sort((a, b) => {
      // Monthly recurring first or chronological
      if (a.isMonthly && !b.isMonthly) return -1;
      if (!a.isMonthly && b.isMonthly) return 1;
      if (a.month !== undefined && b.month !== undefined) {
        if (a.month !== b.month) return a.month - b.month;
      }
      return a.day - b.day;
    });
  }, [jurisdiction, activeCategory]);

  // Compute next immediate milestone for spotlight card
  const upcomingSpotlight = useMemo(() => {
    if (!isClient) return MILESTONES[6]; // Fallback to Tax Audit
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Look for upcoming milestones in the current jurisdiction
    const futureEvents = MILESTONES.filter((m) => {
      if (m.jurisdiction !== jurisdiction) return false;
      if (m.isMonthly) return m.day >= currentDay;
      if (m.month === undefined) return false;
      if (m.month > currentMonth) return true;
      if (m.month === currentMonth) return m.day >= currentDay;
      return false;
    }).sort((a, b) => {
      const aMonth = a.month !== undefined ? a.month : currentMonth;
      const bMonth = b.month !== undefined ? b.month : currentMonth;
      if (aMonth !== bMonth) return aMonth - bMonth;
      return a.day - b.day;
    });

    return futureEvents[0] || MILESTONES.find(m => m.jurisdiction === jurisdiction && !m.isMonthly) || MILESTONES[0];
  }, [isClient, jurisdiction]);

  // Calculate days remaining to spotlight
  const spotlightDaysRemaining = useMemo(() => {
    if (!isClient || !upcomingSpotlight) return null;
    const today = new Date();
    const currentYear = today.getFullYear();
    const targetMonth = upcomingSpotlight.month !== undefined ? upcomingSpotlight.month : today.getMonth();
    const targetDate = new Date(currentYear, targetMonth, upcomingSpotlight.day);
    
    // If target date in the past, roll to next month/year
    if (targetDate < today) {
      if (upcomingSpotlight.isMonthly) {
        targetDate.setMonth(targetDate.getMonth() + 1);
      } else {
        targetDate.setFullYear(currentYear + 1);
      }
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [isClient, upcomingSpotlight]);

  if (!isClient) {
    return (
      <div className="w-full py-16 text-left">
        <div className="h-6 w-36 bg-brand-divider/40 rounded animate-pulse mb-4" />
        <div className="h-12 w-96 bg-brand-divider/40 rounded animate-pulse mb-8" />
        <div className="h-64 w-full bg-white rounded-2xl border border-brand-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full text-left" id="tax-calendar">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* ── LEFT COLUMN: STICKY EDITORIAL CONTEXT ───────────────────── */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Compliance Chronology
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-brand-primary tracking-tight leading-tight">
              Tax & Statutory Deadlines
            </h2>
            <p className="font-sans text-brand-secondary mt-6 text-base md:text-lg leading-relaxed">
              Mandatory filing windows, advance tax installments, and audit deadlines governing businesses across India and the United Arab Emirates.
            </p>
          </div>

          {/* Understated Minimalist Jurisdiction Segment */}
          <div className="border border-brand-border bg-white rounded-2xl p-1.5 flex items-center shadow-soft">
            <button
              onClick={() => handleJurisdictionChange("india")}
              className={`flex-1 py-3 px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-300 text-center ${
                jurisdiction === "india"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              India Practice
            </button>
            <button
              onClick={() => handleJurisdictionChange("uae")}
              className={`flex-1 py-3 px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-300 text-center ${
                jurisdiction === "uae"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              UAE Practice
            </button>
          </div>

          {/* Next Milestone Spotlight Card */}
          {upcomingSpotlight && (
            <div className="bg-white border border-brand-border rounded-[28px] p-6 sm:p-7 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xs uppercase tracking-widest text-brand-accent font-bold bg-brand-accent/10 px-2.5 py-1 rounded-md">
                  Upcoming Statutory Milestone
                </span>
                {spotlightDaysRemaining !== null && (
                  <span className="font-mono text-xs text-brand-secondary">
                    {spotlightDaysRemaining === 0
                      ? "Due Today"
                      : spotlightDaysRemaining === 1
                      ? "Due Tomorrow"
                      : `${spotlightDaysRemaining} days remaining`}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-4xl text-brand-primary font-normal">
                    {upcomingSpotlight.day.toString().padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-wider font-semibold text-brand-primary">
                    {upcomingSpotlight.month !== undefined
                      ? MONTH_FULL[upcomingSpotlight.month]
                      : "Of Every Month"}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-brand-primary font-normal leading-snug">
                  {upcomingSpotlight.name}
                </h3>
                <p className="font-mono text-xs text-brand-accent mt-1">
                  {upcomingSpotlight.statutorySection}
                </p>
                <p className="font-sans text-xs sm:text-sm text-brand-secondary mt-3 leading-relaxed">
                  {upcomingSpotlight.shortSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-divider flex items-center justify-between">
                <span className="font-sans text-xs text-brand-secondary">
                  Partner-led review available
                </span>
                <a
                  href={buildWhatsAppUrl(
                    "+919061680043",
                    `Hello CA Joyce, I would like to consult on the upcoming ${upcomingSpotlight.name} deadline.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors group"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          )}

          {/* General ICAI / FTA Notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-bg border border-brand-border text-brand-secondary">
            <CalendarDays className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <p className="font-sans text-xs leading-relaxed">
              Statutory deadlines are subject to circular extensions by the Central Board of Direct Taxes (CBDT), GST Council, and the UAE Federal Tax Authority (FTA).
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN: CHRONOLOGICAL COMPLIANCE LEDGER ──────────── */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Subtle Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-divider no-scrollbar">
            {filterOptions.map((opt) => {
              const isActive = activeCategory === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveCategory(opt.id)}
                  className={`px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-white text-brand-secondary border border-brand-border hover:border-brand-primary/40 hover:text-brand-primary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Ledger Table Rows */}
          <div className="divide-y divide-brand-divider border-y border-brand-divider">
            <AnimatePresence mode="wait">
              {filteredMilestones.map((item) => {
                const isExpanded = expandedId === item.id;
                const monthLabel = item.isMonthly 
                  ? "MONTHLY" 
                  : (item.month !== undefined ? MONTH_NAMES[item.month] : "ANNUAL");

                return (
                  <div
                    key={item.id}
                    className={`transition-colors duration-200 ${
                      isExpanded ? "bg-white/80" : "hover:bg-white/40"
                    }`}
                  >
                    {/* Main Row Header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="w-full py-6 px-2 sm:px-4 flex items-start gap-4 sm:gap-6 text-left focus:outline-none group"
                      aria-expanded={isExpanded}
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-14 sm:w-16 shrink-0 pt-0.5">
                        <span className="font-display text-3xl sm:text-4xl font-normal text-brand-primary leading-none group-hover:text-brand-accent transition-colors">
                          {item.day.toString().padStart(2, "0")}
                        </span>
                        <span className="font-mono text-3xs font-bold tracking-widest text-brand-accent mt-1">
                          {monthLabel}
                        </span>
                      </div>

                      {/* Title and Summary */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-mono text-3xs text-brand-secondary bg-brand-bg px-2 py-0.5 rounded border border-brand-border">
                            {item.categoryLabel}
                          </span>
                          <span className="font-mono text-3xs text-slate-500">
                            {item.statutorySection}
                          </span>
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl text-brand-primary font-normal leading-snug group-hover:text-brand-accent transition-colors">
                          {item.name}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-brand-secondary mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {item.shortSummary}
                        </p>
                      </div>

                      {/* Expand / Collapse Icon */}
                      <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary group-hover:text-brand-primary group-hover:border-brand-primary/40 transition-all shrink-0 mt-2">
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-brand-accent" : ""
                          }`} 
                        />
                      </div>
                    </button>

                    {/* Expandable Technical Details Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-8 pb-8 pt-2 space-y-6 text-xs sm:text-sm">
                            
                            {/* Applicability & Penalties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                              
                              {/* Applicability */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-brand-primary font-semibold text-xs">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Who Must File</span>
                                </div>
                                <p className="font-sans text-xs text-brand-secondary leading-relaxed pl-5.5">
                                  {item.applicability}
                                </p>
                              </div>

                              {/* Penalties */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-brand-primary font-semibold text-xs">
                                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Statutory Non-Compliance Penalties</span>
                                </div>
                                <p className="font-sans text-xs text-brand-secondary leading-relaxed pl-5.5">
                                  {item.penaltyClause}
                                </p>
                              </div>

                            </div>

                            {/* Required Records */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-wider font-mono">
                                <FileText className="w-3.5 h-3.5 text-brand-accent" />
                                <span>Key Verification Documents & Schedules</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.requiredDocuments.map((doc, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-lg bg-white border border-brand-border text-xs text-brand-secondary"
                                  >
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Direct WhatsApp Consultation CTA */}
                            <div className="pt-3 border-t border-brand-divider flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <span className="font-sans text-xs text-brand-secondary">
                                Have questions regarding eligibility or calculations for this filing?
                              </span>
                              <a
                                href={buildWhatsAppUrl(
                                  "+919061680043",
                                  `Hi CA Joyce, I would like to discuss our compliance status for ${item.name} (${item.statutorySection}).`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white font-sans text-xs font-semibold transition-all duration-300 self-start sm:self-auto"
                              >
                                <span>Consult with CA Joyce</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-brand-secondary">
            <p>
              Looking for corporate annual compliance packages?
            </p>
            <a
              href="/contact"
              className="font-semibold text-brand-primary hover:text-brand-accent underline underline-offset-4 transition-colors"
            >
              Schedule a Firm Compliance Review →
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
