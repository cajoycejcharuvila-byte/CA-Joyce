"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare, PhoneCall, ChevronDown } from "lucide-react";
import { getCompanyInfo } from "@/lib/cms";
import { CompanyInfo } from "@/types";

interface NavbarProps {
  companyInfo?: CompanyInfo;
}

export default function Navbar({ companyInfo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [indiaExpanded, setIndiaExpanded] = useState(false);
  const [uaeExpanded, setUaeExpanded] = useState(false);

  const pathname = usePathname();
  const company = companyInfo || getCompanyInfo();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[90px] transition-all duration-500 flex items-center ${
          scrolled
            ? "bg-brand-glass backdrop-blur-[20px] border-b border-brand-divider shadow-soft"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center space-x-3.5 group z-50">
            <div className="relative w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-[1.05]">
              <Image
                src="/logo.png"
                alt="JOYCE J CHARUVILA & ASSOCIATES"
                fill
                className="object-contain animate-none"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl font-bold leading-none tracking-tight text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
                JOYCE J CHARUVILA & ASSOCIATES
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-secondary font-medium mt-1">
                Chartered Accountants
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/about"
              className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 ${
                pathname === "/about" ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative group py-4">
              <button
                className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 flex items-center space-x-1 cursor-pointer outline-none ${
                  pathname.startsWith("/services") ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-white border border-brand-border rounded-[32px] shadow-glass p-8 w-[720px] z-50 before:content-[''] before:absolute before:top-[-12px] before:left-0 before:right-0 before:h-[12px]">
                <div className="grid grid-cols-2 gap-8">
                  {/* India Services Column */}
                  <div>
                    <Link
                      href="/services/india"
                      className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-4 block hover:text-brand-primary transition-colors duration-200"
                    >
                      India Compliance Services
                    </Link>
                    <div className="space-y-2">
                      <Link
                        href="/services/india/accounting-bookkeeping-india"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Accounting & Bookkeeping
                      </Link>
                      <Link
                        href="/services/india/statutory-audit"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Statutory Audit
                      </Link>
                      <Link
                        href="/services/india/bank-concurrent-audit"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Bank Concurrent Audit
                      </Link>
                      <Link
                        href="/services/india/gst-registration-filing"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        GST Registration & Filing
                      </Link>
                      <Link
                        href="/services/india/income-tax-audit-return-filing"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Income Tax Audit & Return Filing
                      </Link>
                      <Link
                        href="/services/india/tds-filing"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        TDS Filing
                      </Link>
                      <Link
                        href="/services/india/project-finance-loan-assistance"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Project Finance & Loan Assistance
                      </Link>
                      <Link
                        href="/services/india/internal-audit-business-advisory"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Internal Audit & Advisory
                      </Link>
                      <Link
                        href="/services/india/certification-services"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Certification Services
                      </Link>
                      <Link
                        href="/services/india/valuation-services"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Valuation Services
                      </Link>
                    </div>
                  </div>

                  {/* UAE Services Column */}
                  <div>
                    <Link
                      href="/services/uae"
                      className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-4 block hover:text-brand-primary transition-colors duration-200"
                    >
                      UAE Compliance Services
                    </Link>
                    <div className="space-y-2">
                      <Link
                        href="/services/uae/accounting-bookkeeping-uae"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Accounting & Bookkeeping
                      </Link>
                      <Link
                        href="/services/uae/audit-support"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Audit Support Services
                      </Link>
                      <Link
                        href="/services/uae/vat-registration-deregistration"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        VAT Registration & De-registration
                      </Link>
                      <Link
                        href="/services/uae/vat-filing"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        VAT Filing & Compliance
                      </Link>
                      <Link
                        href="/services/uae/corporate-tax-registration"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Corporate Tax Registration
                      </Link>
                      <Link
                        href="/services/uae/corporate-tax-filing"
                        className="block font-sans text-sm text-brand-secondary hover:text-brand-primary transition-colors duration-200"
                      >
                        Corporate Tax Filing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/insights"
              className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 ${
                pathname.startsWith("/insights") ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              Insights
            </Link>

            <Link
              href="/contact"
              className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 ${
                pathname === "/contact" ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 border border-brand-border text-brand-primary hover:border-brand-primary px-5 py-2.5 rounded-[20px] font-sans text-sm font-medium transition-all duration-300 bg-white dark:bg-[#121826]"
            >
              <MessageSquare className="w-4 h-4 text-brand-accent" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white px-5 py-2.5 rounded-[20px] font-sans text-sm font-medium shadow-soft hover:shadow-glass hover:translate-y-[-2px] transition-all duration-300"
            >
              <span>Schedule Consultation</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-bg flex flex-col justify-between pt-[120px] pb-12 px-8 lg:hidden"
          >
            <div className="flex-1 overflow-y-auto pr-2 my-6 space-y-6 no-scrollbar">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Link
                  href="/about"
                  className="font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300"
                >
                  About
                </Link>
              </motion.div>

              {/* India Services Accordion */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col">
                <button
                  onClick={() => setIndiaExpanded(!indiaExpanded)}
                  className="w-full flex items-center justify-between text-left font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300 outline-none cursor-pointer"
                >
                  <span>India Services</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${indiaExpanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {indiaExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden pl-4 pr-2 mt-3 space-y-2.5 border-l border-brand-divider"
                    >
                      <Link
                        href="/services/india"
                        className="block font-sans text-sm font-bold text-brand-accent hover:text-brand-primary py-1"
                      >
                        All India Services →
                      </Link>
                      <Link
                        href="/services/india/accounting-bookkeeping-india"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Accounting & Bookkeeping
                      </Link>
                      <Link
                        href="/services/india/statutory-audit"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Statutory Audit
                      </Link>
                      <Link
                        href="/services/india/bank-concurrent-audit"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Bank Concurrent Audit
                      </Link>
                      <Link
                        href="/services/india/gst-registration-filing"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        GST Registration & Filing
                      </Link>
                      <Link
                        href="/services/india/income-tax-audit-return-filing"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Income Tax Audit & Return Filing
                      </Link>
                      <Link
                        href="/services/india/tds-filing"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        TDS Filing
                      </Link>
                      <Link
                        href="/services/india/project-finance-loan-assistance"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Project Finance & Loan Assistance
                      </Link>
                      <Link
                        href="/services/india/internal-audit-business-advisory"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Internal Audit & Advisory
                      </Link>
                      <Link
                        href="/services/india/certification-services"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Certification Services
                      </Link>
                      <Link
                        href="/services/india/valuation-services"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Valuation Services
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* UAE Services Accordion */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col">
                <button
                  onClick={() => setUaeExpanded(!uaeExpanded)}
                  className="w-full flex items-center justify-between text-left font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300 outline-none cursor-pointer"
                >
                  <span>UAE Services</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${uaeExpanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {uaeExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden pl-4 pr-2 mt-3 space-y-2.5 border-l border-brand-divider"
                    >
                      <Link
                        href="/services/uae"
                        className="block font-sans text-sm font-bold text-brand-accent hover:text-brand-primary py-1"
                      >
                        All UAE Services →
                      </Link>
                      <Link
                        href="/services/uae/accounting-bookkeeping-uae"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Accounting & Bookkeeping
                      </Link>
                      <Link
                        href="/services/uae/audit-support"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Audit Support Services
                      </Link>
                      <Link
                        href="/services/uae/vat-registration-deregistration"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        VAT Registration & De-registration
                      </Link>
                      <Link
                        href="/services/uae/vat-filing"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        VAT Filing & Compliance
                      </Link>
                      <Link
                        href="/services/uae/corporate-tax-registration"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Corporate Tax Registration
                      </Link>
                      <Link
                        href="/services/uae/corporate-tax-filing"
                        className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1"
                      >
                        Corporate Tax Filing
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Link
                  href="/insights"
                  className="font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300"
                >
                  Insights
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Link
                  href="/contact"
                  className="font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300"
                >
                  Contact
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.15)]"
            >
              <a
                href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-white dark:bg-[#121826] border border-brand-border py-4 rounded-[20px] font-sans font-medium text-brand-primary"
              >
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                <span>WhatsApp Consultation</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center space-x-3 bg-brand-accent py-4 rounded-[20px] font-sans font-medium text-white shadow-soft"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Request Consultation</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
