"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon, Info } from "lucide-react";

// --- DATA STRUCTURES ---

type TaxCategory = "GST" | "TDS" | "Advance Tax" | "Income Tax" | "Audit";

interface ComplianceEvent {
  id: string;
  category: TaxCategory;
  name: string;
  description: string;
  // If month is undefined, it occurs every month on the 'day'
  // If month is defined (0-11), it occurs annually on that month/day
  day: number; 
  month?: number; 
}

const COMPLIANCE_EVENTS: ComplianceEvent[] = [
  // GST
  { id: "gst-1", category: "GST", name: "GSTR-1", description: "Monthly Return", day: 11 },
  { id: "gst-3b", category: "GST", name: "GSTR-3B & Payment", description: "Monthly Return", day: 20 },
  { id: "gst-9", category: "GST", name: "GSTR-9", description: "Annual Return", day: 31, month: 11 }, // Dec 31
  { id: "gst-9c", category: "GST", name: "GSTR-9C", description: "Reconciliation Statement", day: 31, month: 11 },
  
  // TDS
  { id: "tds-1", category: "TDS", name: "TDS Deposit", description: "Monthly Deposit", day: 7 },
  
  // Advance Tax
  { id: "adv-1", category: "Advance Tax", name: "Advance Tax", description: "1st Installment", day: 15, month: 5 }, // Jun 15
  { id: "adv-2", category: "Advance Tax", name: "Advance Tax", description: "2nd Installment", day: 15, month: 8 }, // Sep 15
  { id: "adv-3", category: "Advance Tax", name: "Advance Tax", description: "3rd Installment", day: 15, month: 11 }, // Dec 15
  { id: "adv-4", category: "Advance Tax", name: "Advance Tax", description: "4th Installment", day: 15, month: 2 }, // Mar 15

  // Income Tax
  { id: "it-1", category: "Income Tax", name: "Income Tax Return", description: "Individual Filing", day: 31, month: 6 }, // Jul 31
  { id: "it-2", category: "Income Tax", name: "Income Tax Return", description: "Non-audit Cases", day: 31, month: 7 }, // Aug 31
  { id: "it-3", category: "Income Tax", name: "Income Tax Return", description: "Audit Cases", day: 31, month: 9 }, // Oct 31

  // Audit
  { id: "audit-1", category: "Audit", name: "Tax Audit Report", description: "Filing Deadline", day: 31, month: 9 }, // Oct 31
];

// Month names mapping
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const CATEGORY_COLORS: Record<TaxCategory, string> = {
  GST: "bg-blue-50 text-blue-700 border-blue-100",
  TDS: "bg-purple-50 text-purple-700 border-purple-100",
  "Advance Tax": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Income Tax": "bg-amber-50 text-amber-700 border-amber-100",
  Audit: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function TaxComplianceCalendar() {
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Compute "Due This Month"
  const thisMonthEvents = useMemo(() => {
    if (!isClient) return [];
    const today = new Date();
    const currentMonth = today.getMonth();
    
    // Filter events that happen this month (either recurring or matching month)
    const events = COMPLIANCE_EVENTS.filter(
      (e) => e.month === undefined || e.month === currentMonth
    );
    
    // Sort by day
    return events.sort((a, b) => a.day - b.day);
  }, [isClient]);

  // Compute "Annual Roadmap" (Only events with specific months)
  const annualEvents = useMemo(() => {
    const events = COMPLIANCE_EVENTS.filter((e) => e.month !== undefined);
    // Sort chronologically by month then day
    return events.sort((a, b) => {
      if (a.month! !== b.month!) return a.month! - b.month!;
      return a.day - b.day;
    });
  }, []);

  if (!isClient) {
    return <div className="min-h-[400px] w-full bg-brand-bg rounded-2xl animate-pulse" />;
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-dark mb-4">
          Stay Ahead of Every Tax Deadline
        </h2>
        <p className="text-brand-dark/70 text-lg">
          Track GST, TDS, Income Tax, and Audit due dates in one place.
        </p>
      </div>

      {/* COMPACT ROW: Due This Month */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="w-5 h-5 text-brand-primary" />
          <h3 className="text-xl font-medium text-brand-dark">Due This Month</h3>
        </div>
        
        <div className="bg-white border border-brand-divider rounded-2xl p-4 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 overflow-x-auto hide-scrollbar">
            {thisMonthEvents.map((event, i) => (
              <div 
                key={`${event.id}-this-month`}
                className="flex items-center gap-3 shrink-0 whitespace-nowrap"
              >
                <div className="text-xl font-display font-semibold text-brand-primary">
                  {event.day.toString().padStart(2, '0')}
                </div>
                <ArrowRight className="w-4 h-4 text-brand-dark/30" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-dark">{event.name}</span>
                  <span className="text-xs text-brand-dark/50">{event.category}</span>
                </div>
                
                {i < thisMonthEvents.length - 1 && (
                  <div className="hidden md:block w-px h-8 bg-brand-divider ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HORIZONTAL ROADMAP: Annual Compliance */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-brand-dark">Annual Tax Compliance Roadmap</h3>
          <span className="text-xs text-brand-dark/50 hidden md:block">Scroll to view all →</span>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {annualEvents.map((event, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              key={`${event.id}-annual`}
              className="group relative flex-shrink-0 w-[280px] md:w-[320px] bg-white border border-brand-divider rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 snap-start hover:-translate-y-1"
            >
              {/* Category Badge */}
              <div className="mb-8">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[event.category]}`}>
                  {event.category}
                </span>
              </div>
              
              {/* Large Date */}
              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-display font-medium text-brand-dark tracking-tight">
                  {event.day} {MONTH_NAMES[event.month!]}
                </div>
              </div>
              
              {/* Details */}
              <div>
                <h4 className="text-lg font-medium text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">
                  {event.name}
                </h4>
                <p className="text-sm text-brand-dark/60">
                  {event.description}
                </p>
              </div>
              
              {/* Decorative line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-divider to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8 flex items-start gap-2 text-brand-dark/50 bg-brand-dark/5 p-4 rounded-xl">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          These dates are for general reference and apply to standard tax scenarios in India. Deadlines may be extended or changed by the government. Always consult with your tax advisor to ensure your compliance obligations are met on time.
        </p>
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
