/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, HelpCircle, MessageSquare, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General Practices" },
  { id: "india", label: "India Compliance" },
  { id: "uae", label: "UAE Taxation" },
  { id: "accounting", label: "Accounting & Books" },
  { id: "audit", label: "Audits & Finance" },
];

interface FAQPageClientProps {
  allFaqs: any[];
  company: any;
}

export default function FAQPageClient({ allFaqs, company }: FAQPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Map FAQs to categories manually for rich filtering
  const mappedFaqs = useMemo(() => {
    return allFaqs.map((faq, index) => {
      let category = "general";
      const q = faq.question.toLowerCase();

      if (q.includes("gst") || q.includes("income tax") || q.includes("india")) {
        category = "india";
      } else if (q.includes("vat") || q.includes("corporate tax") || q.includes("uae")) {
        category = "uae";
      } else if (q.includes("bookkeeping") || q.includes("accounting") || q.includes("outsource")) {
        category = "accounting";
      } else if (q.includes("audit") || q.includes("project finance")) {
        category = "audit";
      }

      return {
        ...faq,
        id: index,
        category,
      };
    });
  }, [allFaqs]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return mappedFaqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [mappedFaqs, activeCategory, searchTerm]);

  const toggleFAQ = (id: number) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": allFaqs.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer,
              },
            })),
          }),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Resource Library
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-tight text-brand-primary tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Technical answers to common regulatory, tax compliance, and business setup questions for India and the UAE.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-brand-border outline-none pl-11 pr-4 py-3 rounded-[18px] w-full font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="lg:col-span-8 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`px-4.5 py-2.5 rounded-[14px] font-sans text-xs font-semibold capitalize transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-brand-primary text-white shadow-soft"
                      : "bg-white text-brand-secondary border border-brand-border hover:border-brand-primary/45"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Accordion List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-brand-border rounded-[32px] p-12 text-center shadow-soft">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-sans text-sm font-semibold text-brand-primary">No questions found</h3>
                <p className="font-sans text-xs text-brand-secondary mt-1">
                  Try broadening your search term or select another category filter.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIndex === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-brand-border rounded-[24px] overflow-hidden shadow-soft transition-all duration-300 hover:border-slate-300/80 text-left"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left font-sans font-medium text-brand-primary text-sm md:text-base cursor-pointer select-none"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 w-6 h-6 rounded-full bg-slate-50 border border-brand-border flex items-center justify-center text-brand-accent"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-brand-divider pt-4 font-sans text-xs md:text-sm text-brand-secondary leading-relaxed bg-slate-50/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-[130px]">
            <div className="p-8 bg-slate-50 border border-brand-divider rounded-[24px] text-left">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-2 block">
                Still have questions?
              </span>
              <h3 className="font-display text-2xl text-brand-primary font-normal mb-4">
                Schedule a Call
              </h3>
              <p className="font-sans text-xs text-brand-secondary leading-relaxed mb-6">
                Consult with our CA team directly. We are happy to clarify specific corporate structures, tax positions, and audit requirements.
              </p>
              
              <div className="space-y-3">
                <a
                  href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I have an enquiry regarding tax compliance services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white px-4 py-3.5 rounded-[16px] font-sans text-sm font-medium transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center space-x-2 border border-brand-border hover:border-brand-primary text-brand-primary py-3.5 rounded-[16px] font-sans text-sm font-medium transition-colors duration-300 bg-white"
                >
                  <PhoneCall className="w-4 h-4 text-brand-accent" />
                  <span>Request Callback</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
