"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";

// --- DATA STRUCTURES ---

type Jurisdiction = "india" | "uae";
type TaxCategory = "GST" | "TDS" | "Advance Tax" | "Income Tax" | "Audit" | "VAT" | "Corporate Tax" | "ESR";

interface ComplianceEvent {
  id: string;
  jurisdiction: Jurisdiction;
  category: TaxCategory;
  name: string;
  subTitle: string;
  day: number;
  month?: number; // 0-indexed: 0 = Jan, 11 = Dec. Undefined = monthly
}

const EVENTS: ComplianceEvent[] = [
  // ── INDIA ─────────────────────────────────────────────────────────
  { id: "in-tds", jurisdiction: "india", category: "TDS", name: "TDS Deposit", subTitle: "Monthly Tax Deduction", day: 7 },
  { id: "in-gst-1", jurisdiction: "india", category: "GST", name: "GSTR-1", subTitle: "Monthly Outward Supplies", day: 11 },
  { id: "in-gst-3b", jurisdiction: "india", category: "GST", name: "GSTR-3B & Payment", subTitle: "Monthly Tax Settlement", day: 20 },
  
  // Roadmap
  { id: "in-adv-4", jurisdiction: "india", category: "Advance Tax", name: "Advance Tax", subTitle: "4th Installment (100%)", day: 15, month: 2 }, // Mar 15
  { id: "in-adv-1", jurisdiction: "india", category: "Advance Tax", name: "Advance Tax", subTitle: "1st Installment (15%)", day: 15, month: 5 }, // Jun 15
  { id: "in-itr-ind", jurisdiction: "india", category: "Income Tax", name: "Income Tax Return", subTitle: "Individual & Non-Audit", day: 31, month: 6 }, // Jul 31
  { id: "in-adv-2", jurisdiction: "india", category: "Advance Tax", name: "Advance Tax", subTitle: "2nd Installment (45%)", day: 15, month: 8 }, // Sep 15
  { id: "in-audit", jurisdiction: "india", category: "Audit", name: "Tax Audit Report", subTitle: "Form 3CA / 3CD", day: 30, month: 8 }, // Sep 30
  { id: "in-itr-corp", jurisdiction: "india", category: "Income Tax", name: "Income Tax Return", subTitle: "Corporate & Audit Cases", day: 31, month: 9 }, // Oct 31
  { id: "in-adv-3", jurisdiction: "india", category: "Advance Tax", name: "Advance Tax", subTitle: "3rd Installment (75%)", day: 15, month: 11 }, // Dec 15
  { id: "in-gst-annual", jurisdiction: "india", category: "GST", name: "GSTR-9 & 9C", subTitle: "Annual Reconciliation", day: 31, month: 11 }, // Dec 31

  // ── UAE ───────────────────────────────────────────────────────────
  { id: "uae-vat-q1", jurisdiction: "uae", category: "VAT", name: "UAE VAT Return", subTitle: "Q1 Filing (Jan–Mar)", day: 28, month: 3 }, // Apr 28
  { id: "uae-esr-notif", jurisdiction: "uae", category: "ESR", name: "ESR Notification", subTitle: "Annual MoF Notification", day: 30, month: 5 }, // Jun 30
  { id: "uae-vat-q2", jurisdiction: "uae", category: "VAT", name: "UAE VAT Return", subTitle: "Q2 Filing (Apr–Jun)", day: 28, month: 6 }, // Jul 28
  { id: "uae-ct-return", jurisdiction: "uae", category: "Corporate Tax", name: "Corporate Tax Return", subTitle: "9% Corporate Tax Settlement", day: 30, month: 8 }, // Sep 30
  { id: "uae-vat-q3", jurisdiction: "uae", category: "VAT", name: "UAE VAT Return", subTitle: "Q3 Filing (Jul–Sep)", day: 28, month: 9 }, // Oct 28
  { id: "uae-esr-rep", jurisdiction: "uae", category: "ESR", name: "ESR Annual Report", subTitle: "Detailed Economic Substance", day: 31, month: 11 }, // Dec 31
  { id: "uae-vat-q4", jurisdiction: "uae", category: "VAT", name: "UAE VAT Return", subTitle: "Q4 Filing (Oct–Dec)", day: 28, month: 0 }, // Jan 28
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CATEGORY_COLORS: Record<TaxCategory, string> = {
  GST: "bg-blue-50 text-blue-700 border-blue-200/60",
  TDS: "bg-purple-50 text-purple-700 border-purple-200/60",
  "Advance Tax": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "Income Tax": "bg-amber-50 text-amber-700 border-amber-200/60",
  Audit: "bg-rose-50 text-rose-700 border-rose-200/60",
  VAT: "bg-teal-50 text-teal-700 border-teal-200/60",
  "Corporate Tax": "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  ESR: "bg-orange-50 text-orange-700 border-orange-200/60",
};

export default function TaxComplianceCalendar() {
  const [isClient, setIsClient] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Compute "Due This Month"
  const thisMonthEvents = useMemo(() => {
    if (!isClient) return [];
    const today = new Date();
    const currentMonth = today.getMonth();

    const filtered = EVENTS.filter((e) => {
      if (e.jurisdiction !== jurisdiction) return false;
      return e.month === undefined || e.month === currentMonth;
    });

    return filtered.sort((a, b) => a.day - b.day);
  }, [isClient, jurisdiction]);

  // Compute "Annual Roadmap"
  const annualEvents = useMemo(() => {
    const filtered = EVENTS.filter(
      (e) => e.jurisdiction === jurisdiction && e.month !== undefined
    );

    return filtered.sort((a, b) => {
      if (a.month! !== b.month!) return a.month! - b.month!;
      return a.day - b.day;
    });
  }, [jurisdiction]);

  // Scroll controls
  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = dir === "left" ? -300 : 300;
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

  if (!isClient) {
    return <div className="min-h-[380px] w-full bg-brand-bg rounded-2xl animate-pulse" />;
  }

  const today = new Date();
  const currentMonthDisplay = `${MONTH_FULL[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <div className="w-full text-left space-y-12">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-normal text-brand-primary tracking-tight mb-3">
          Stay Ahead of Every Tax Deadline
        </h2>
        <p className="font-sans text-base sm:text-lg text-brand-secondary leading-relaxed">
          Track GST, TDS, Income Tax, and Audit due dates in one place.
        </p>

        {/* Minimalist Switcher */}
        <div className="inline-flex items-center p-1 bg-white border border-brand-border rounded-full shadow-soft mt-6">
          <button
            onClick={() => setJurisdiction("india")}
            className={`px-5 py-2 rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
              jurisdiction === "india"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-brand-secondary hover:text-brand-primary"
            }`}
          >
            India Compliance
          </button>
          <button
            onClick={() => setJurisdiction("uae")}
            className={`px-5 py-2 rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
              jurisdiction === "uae"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-brand-secondary hover:text-brand-primary"
            }`}
          >
            UAE Compliance
          </button>
        </div>
      </div>

      {/* ── SECTION 1: DUE THIS MONTH ──────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-4 h-4 text-brand-accent" />
          <h3 className="font-sans text-base sm:text-lg font-semibold text-brand-primary">
            Due This Month
          </h3>
          <span className="font-mono text-3xs text-brand-secondary bg-white px-2 py-0.5 rounded-full border border-brand-border ml-1">
            {currentMonthDisplay}
          </span>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {thisMonthEvents.map((event, i) => (
              <div 
                key={`${event.id}-month`}
                className="flex items-center gap-3 shrink-0 whitespace-nowrap group"
              >
                <div className="text-2xl font-display font-medium text-brand-primary group-hover:text-brand-accent transition-colors">
                  {event.day.toString().padStart(2, "0")}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-secondary/40" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-primary">{event.name}</span>
                  <span className="text-xs text-brand-secondary">{event.category}</span>
                </div>

                {i < thisMonthEvents.length - 1 && (
                  <div className="hidden md:block w-px h-8 bg-brand-divider ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: ANNUAL COMPLIANCE ROADMAP ───────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans text-base sm:text-lg font-semibold text-brand-primary">
            Annual Tax Compliance Roadmap
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-secondary hidden sm:inline-block">
              Scroll to view all →
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
                className={`p-1.5 rounded-full border transition-all ${
                  canScrollLeft
                    ? "bg-white border-brand-border text-brand-primary hover:bg-brand-primary hover:text-white"
                    : "bg-brand-bg border-brand-divider text-brand-secondary/30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next"
                className={`p-1.5 rounded-full border transition-all ${
                  canScrollRight
                    ? "bg-white border-brand-border text-brand-primary hover:bg-brand-primary hover:text-white"
                    : "bg-brand-bg border-brand-divider text-brand-secondary/30 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-5 pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence mode="popLayout">
            {annualEvents.map((event, i) => (
              <motion.div
                key={`${event.id}-card`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="group flex-shrink-0 w-[260px] sm:w-[280px] bg-white border border-brand-border rounded-2xl p-6 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300 snap-start flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[event.category]}`}>
                      {event.category}
                    </span>
                  </div>

                  {/* Large Typography Date */}
                  <div className="text-4xl sm:text-5xl font-display font-normal text-brand-primary tracking-tight mb-4 group-hover:text-brand-accent transition-colors">
                    {event.day} {MONTH_NAMES[event.month!]}
                  </div>

                  {/* Details */}
                  <h4 className="text-base font-semibold text-brand-primary leading-snug">
                    {event.name}
                  </h4>
                  <p className="text-xs text-brand-secondary mt-1">
                    {event.subTitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── DISCLAIMER ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-white/70 border border-brand-border text-brand-secondary text-xs leading-relaxed">
        <Info className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
        <p>
          These dates are for general reference and apply to standard tax scenarios in {jurisdiction === "india" ? "India" : "the UAE"}. Deadlines may be extended or changed by the government. Always consult with your tax advisor to ensure your compliance obligations are met on time.
        </p>
      </div>

    </div>
  );
}
