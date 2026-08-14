"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Info,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

type TaxCategory = "GST" | "Income Tax" | "TDS" | "Advance Tax" | "Tax Audit";

interface TaxEventTemplate {
  id: string;
  category: TaxCategory;
  name: string;
  description: string;
  taxpayers: string;
  frequency: "Monthly" | "Quarterly" | "Annual" | "Specific";
  dueDay?: number; // For monthly
  specificDates?: { month: number; day: number }[]; // 0-indexed month
}

// Master list of compliance events as requested
const TAX_EVENTS: TaxEventTemplate[] = [
  {
    id: "gst-1",
    category: "GST",
    name: "GSTR-1",
    description: "Details of outward supplies of goods or services.",
    taxpayers: "Registered regular taxpayers",
    frequency: "Monthly",
    dueDay: 11,
  },
  {
    id: "gst-3b",
    category: "GST",
    name: "GSTR-3B & Payment",
    description: "Summary return of outward supplies and input tax credit declared, along with tax payment.",
    taxpayers: "Registered regular taxpayers",
    frequency: "Monthly",
    dueDay: 20,
  },
  {
    id: "gst-9",
    category: "GST",
    name: "GSTR-9 & GSTR-9C",
    description: "Annual return and reconciliation statement.",
    taxpayers: "Registered taxpayers (subject to turnover limits)",
    frequency: "Annual",
    specificDates: [{ month: 11, day: 31 }], // December 31
  },
  {
    id: "tds-dep",
    category: "TDS",
    name: "TDS Deposit",
    description: "Deposit of tax deducted at source for the previous month.",
    taxpayers: "All deductors",
    frequency: "Monthly",
    dueDay: 7,
  },
  {
    id: "tds-ret",
    category: "TDS",
    name: "TDS Return",
    description: "Quarterly TDS statement.",
    taxpayers: "All deductors",
    frequency: "Quarterly",
    specificDates: [
      { month: 4, day: 31 }, // May 31 (Q4)
      { month: 6, day: 31 }, // July 31 (Q1)
      { month: 9, day: 31 }, // Oct 31 (Q2)
      { month: 0, day: 31 }, // Jan 31 (Q3)
    ],
  },
  {
    id: "adv-tax",
    category: "Advance Tax",
    name: "Advance Tax Installment",
    description: "Payment of advance income tax.",
    taxpayers: "Taxpayers with estimated tax liability ≥ ₹10,000",
    frequency: "Quarterly",
    specificDates: [
      { month: 5, day: 15 }, // June 15
      { month: 8, day: 15 }, // Sept 15
      { month: 11, day: 15 }, // Dec 15
      { month: 2, day: 15 }, // Mar 15
    ],
  },
  {
    id: "it-indiv",
    category: "Income Tax",
    name: "ITR (Individual)",
    description: "Income Tax Return filing for individuals not subject to audit.",
    taxpayers: "Individuals, HUF",
    frequency: "Annual",
    specificDates: [{ month: 6, day: 31 }], // July 31
  },
  {
    id: "it-non-audit",
    category: "Income Tax",
    name: "ITR (Non-audit cases)",
    description: "Income Tax Return filing for non-audit cases.",
    taxpayers: "Non-corporate taxpayers not subject to audit",
    frequency: "Annual",
    specificDates: [{ month: 7, day: 31 }], // August 31
  },
  {
    id: "it-audit",
    category: "Income Tax",
    name: "ITR (Audit cases)",
    description: "Income Tax Return filing for cases requiring tax audit.",
    taxpayers: "Companies, taxpayers subject to tax audit",
    frequency: "Annual",
    specificDates: [{ month: 9, day: 31 }], // October 31
  },
  {
    id: "tax-audit",
    category: "Tax Audit",
    name: "Tax Audit Report",
    description: "Filing of Tax Audit Report.",
    taxpayers: "Businesses crossing turnover thresholds",
    frequency: "Annual",
    specificDates: [{ month: 9, day: 31 }], // October 31
  },
];

const CATEGORY_COLORS: Record<TaxCategory, string> = {
  "GST": "bg-emerald-500",
  "Income Tax": "bg-blue-500",
  "TDS": "bg-indigo-500",
  "Advance Tax": "bg-amber-500",
  "Tax Audit": "bg-rose-500",
};

interface GeneratedEvent extends TaxEventTemplate {
  date: Date;
}

export default function TaxComplianceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<TaxCategory | "All">("All");
  
  // To handle hydration mismatch, use a state that tells us if we're on client
  const [isClient, setIsClient] = useState(false);
  React.useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true); 
  }, []);

  // Generate events for the currently viewed month
  const currentMonthEvents = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    let generated: GeneratedEvent[] = [];
    
    TAX_EVENTS.forEach(template => {
      if (template.frequency === "Monthly" && template.dueDay) {
        generated.push({
          ...template,
          date: new Date(year, month, template.dueDay)
        });
      } else if (template.specificDates) {
        template.specificDates.forEach(sd => {
          if (sd.month === month) {
            generated.push({
              ...template,
              date: new Date(year, month, sd.day)
            });
          }
        });
      }
    });
    
    // Filter by active category
    if (activeFilter !== "All") {
      generated = generated.filter(e => e.category === activeFilter);
    }
    
    return generated.sort((a, b) => a.date.getDate() - b.date.getDate());
  }, [currentDate, activeFilter]);

  // Identify upcoming deadlines (next 7 days) globally, not just in current view
  const upcomingDeadlines = useMemo(() => {
    if (!isClient) return [];
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    let upcoming: GeneratedEvent[] = [];
    
    TAX_EVENTS.forEach(template => {
      if (template.frequency === "Monthly" && template.dueDay) {
        // Check this month and next month
        for (let mOffset = 0; mOffset <= 1; mOffset++) {
          const checkDate = new Date(today.getFullYear(), today.getMonth() + mOffset, template.dueDay);
          if (checkDate >= today && checkDate <= nextWeek) {
            upcoming.push({ ...template, date: checkDate });
          }
        }
      } else if (template.specificDates) {
        template.specificDates.forEach(sd => {
          const checkDate = new Date(today.getFullYear(), sd.month, sd.day);
          // If the date has passed this year, check next year
          if (checkDate < today && today.getMonth() === 11) {
             checkDate.setFullYear(today.getFullYear() + 1);
          }
          if (checkDate >= today && checkDate <= nextWeek) {
            upcoming.push({ ...template, date: checkDate });
          }
        });
      }
    });
    
    if (activeFilter !== "All") {
      upcoming = upcoming.filter(e => e.category === activeFilter);
    }
    
    return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [isClient, activeFilter]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun, 1 = Mon
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to render grid days
  const renderCalendarGrid = () => {
    const grid = [];
    let currentDay = 1;
    
    // Total cells in grid (usually 35 or 42)
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth || currentDay > daysInMonth) {
        // Empty cell
        grid.push(<div key={`empty-${i}`} className="bg-slate-50/50 border border-slate-100 p-2 min-h-[100px] opacity-50" />);
      } else {
        const dateNum = currentDay;
        const dayEvents = currentMonthEvents.filter(e => e.date.getDate() === dateNum);
        const isToday = isClient && 
          new Date().getDate() === dateNum && 
          new Date().getMonth() === currentDate.getMonth() && 
          new Date().getFullYear() === currentDate.getFullYear();
        
        grid.push(
          <div 
            key={`day-${dateNum}`} 
            className={`relative bg-white border border-slate-100 p-3 min-h-[120px] transition-all hover:shadow-md group ${isToday ? 'ring-1 ring-brand-primary' : ''}`}
          >
            <span className={`font-mono text-sm font-semibold mb-2 block ${isToday ? 'text-brand-primary' : 'text-slate-500'}`}>
              {dateNum}
            </span>
            
            <div className="space-y-1.5 mt-2">
              {dayEvents.map((evt, idx) => (
                <div key={`${evt.id}-${idx}`} className="relative group/tooltip">
                  <div className={`px-2 py-1.5 rounded text-[10px] font-sans font-medium text-white shadow-sm cursor-pointer truncate ${CATEGORY_COLORS[evt.category]}`}>
                    {evt.category}: {evt.name}
                  </div>
                  
                  {/* Custom Tooltip */}
                  <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-brand-dark text-white p-4 rounded-xl shadow-glass opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1 block">
                      {evt.category}
                    </span>
                    <p className="font-display text-sm font-medium mb-2">{evt.name}</p>
                    <p className="font-sans text-xs text-slate-300 mb-2 leading-relaxed">{evt.description}</p>
                    <div className="pt-2 border-t border-slate-700">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Applicable to:</span>
                      <span className="text-xs font-medium text-slate-200">{evt.taxpayers}</span>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-brand-dark"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        currentDay++;
      }
    }
    return grid;
  };

  const categories: (TaxCategory | "All")[] = ["All", "GST", "Income Tax", "TDS", "Advance Tax", "Tax Audit"];

  return (
    <div className="w-full">
      {/* Filters and Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Compliance Tracker
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-normal text-brand-primary tracking-tight">
            Tax Calendar
          </h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all duration-300 ${
                activeFilter === cat 
                  ? "bg-brand-primary text-white shadow-md" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Highlight Panel */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-lg text-amber-900 mb-2">Upcoming Deadlines (Next 7 Days)</h4>
            <div className="flex flex-wrap gap-3">
              {upcomingDeadlines.map((evt, idx) => (
                <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[evt.category]}`}></span>
                  <span className="font-sans text-xs font-semibold text-slate-700">{evt.name}</span>
                  <span className="font-mono text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    {evt.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Dashboard Frame */}
      <div className="bg-white rounded-[32px] border border-brand-border shadow-soft overflow-hidden">
        
        {/* Dashboard Toolbar */}
        <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-5 h-5 text-brand-accent" />
            <span className="font-display text-xl font-medium text-brand-primary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1 rounded hover:bg-slate-100 text-xs font-bold font-sans text-brand-primary transition-colors"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP GRID VIEW (hidden on mobile) */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-b border-brand-border bg-slate-50">
            {dayNames.map(day => (
              <div key={day} className="py-3 px-4 text-center font-sans text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-brand-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-slate-100/50 gap-[1px]">
            {renderCalendarGrid()}
          </div>
        </div>

        {/* MOBILE TIMELINE VIEW (hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {currentMonthEvents.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-sans text-sm">
              No compliance deadlines for this filter in {monthNames[currentDate.getMonth()]}.
            </div>
          ) : (
            currentMonthEvents.map((evt, idx) => (
              <MobileEventCard key={`${evt.id}-${idx}`} evt={evt} />
            ))
          )}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          Due dates are subject to change based on notifications issued by the relevant tax authorities. This calendar serves as a general guide. Please consult a tax professional for the latest compliance requirements tailored to your business.
        </p>
      </div>
    </div>
  );
}

// Sub-component for Mobile Expandable Card
function MobileEventCard({ evt }: { evt: GeneratedEvent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white transition-colors">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center shrink-0">
            <span className="font-mono text-sm font-bold text-brand-primary leading-none">{evt.date.getDate()}</span>
            <span className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              {evt.date.toLocaleDateString('en-IN', { weekday: 'short' })}
            </span>
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
               evt.category === 'GST' ? 'text-emerald-600' :
               evt.category === 'Income Tax' ? 'text-blue-600' :
               evt.category === 'TDS' ? 'text-indigo-600' :
               evt.category === 'Advance Tax' ? 'text-amber-600' :
               'text-rose-600'
            }`}>
              {evt.category}
            </span>
            <h4 className="font-display text-lg text-brand-primary">{evt.name}</h4>
          </div>
        </div>
        <ChevronRightIcon className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 ml-16">
              <p className="font-sans text-sm text-slate-500 mb-3 leading-relaxed">
                {evt.description}
              </p>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Applicable to</span>
                <span className="font-sans text-xs text-brand-primary font-medium">{evt.taxpayers}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
