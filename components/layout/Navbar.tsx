"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare, PhoneCall, ChevronDown, ArrowRight, Search } from "lucide-react";
import { getCompanyInfo } from "@/lib/cms";
import { CompanyInfo } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import SearchModal from "@/components/ui/SearchModal";

interface NavbarProps {
  companyInfo?: CompanyInfo;
}

export default function Navbar({ companyInfo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [indiaExpanded, setIndiaExpanded] = useState(false);
  const [uaeExpanded, setUaeExpanded] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
      setIsServicesMenuOpen(false);
    }, 0);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsServicesMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1300px] h-[72px] transition-all duration-500 rounded-full flex items-center px-6 md:px-8 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border border-brand-border shadow-glass"
            : "bg-transparent border border-transparent"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center space-x-3 group z-50">
            <div className="relative w-9 h-9 shrink-0 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Image
                src="/logo.png"
                alt="JOYCE J CHARUVILA & ASSOCIATES"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-bold leading-none tracking-tight text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
                JOYCE J CHARUVILA & ASSOCIATES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/about"
              className={`font-sans text-sm font-medium tracking-wide transition-all duration-300 relative py-2 px-1 hover:-translate-y-0.5 ${
                pathname === "/about" ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <button
                aria-haspopup="true"
                aria-expanded={isServicesMenuOpen}
                aria-controls="services-mega-menu"
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className={`font-sans text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md px-1 hover:-translate-y-0.5 ${
                  pathname.startsWith("/services") ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isServicesMenuOpen ? 'rotate-180 text-brand-accent' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesMenuOpen && (
                  <motion.div 
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    id="services-mega-menu" 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-brand-primary backdrop-blur-2xl border border-slate-800 rounded-[32px] shadow-2xl p-10 w-[850px] z-50 before:content-[''] before:absolute before:top-[-20px] before:left-0 before:right-0 before:h-[20px]"
                  >
                    <div className="grid grid-cols-2 gap-16 text-left">
                      
                      {/* India Practice */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="w-8 h-px bg-brand-accent"></span>
                          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold">
                            India Practice
                          </span>
                        </div>
                        <motion.ul className="space-y-5">
                          {[
                            { name: "Statutory Audit", sub: "Companies Act audit & financials", href: "/services/india/statutory-audit" },
                            { name: "GST Registration & Filing", sub: "GSTR 1, 3B & annual reconciliation", href: "/services/india/gst-registration-filing" },
                            { name: "Income Tax & Tax Audit", sub: "Form 3CD & annual tax return filing", href: "/services/india/income-tax-audit-return-filing" },
                            { name: "Accounting & Bookkeeping", sub: "Monthly ledger & MIS statements", href: "/services/india/accounting-bookkeeping-india" },
                            { name: "Bank Concurrent Audit", sub: "Branch audits & loan portfolio review", href: "/services/india/bank-concurrent-audit" },
                          ].map((item, idx) => (
                            <motion.li key={idx} variants={itemVariants}>
                              <Link href={item.href} className="group block">
                                <h4 className="font-display text-lg text-white group-hover:text-brand-accent transition-colors duration-300 flex items-center justify-between">
                                  <span>{item.name}</span>
                                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-accent" />
                                </h4>
                                <p className="font-sans text-xs text-slate-400 mt-0.5">{item.sub}</p>
                                <div className="h-[1px] w-0 bg-brand-accent/40 mt-3 group-hover:w-full transition-all duration-500"></div>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                        <div className="mt-6">
                          <Link href="/services/india" className="font-sans text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 group/link">
                            <span>Explore all India services</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* UAE Practice */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="w-8 h-px bg-emerald-600"></span>
                          <span className="font-sans text-xs uppercase tracking-[0.2em] text-emerald-700 font-bold">
                            UAE Practice
                          </span>
                        </div>
                        <motion.ul className="space-y-5">
                          {[
                            { name: "Corporate Tax Filing", sub: "Decree-Law No. 47 annual tax return", href: "/services/uae/corporate-tax-filing" },
                            { name: "Corporate Tax Registration", sub: "FTA EmaraTax TRN registration", href: "/services/uae/corporate-tax-registration" },
                            { name: "VAT Filing & Compliance", sub: "Quarterly VAT201 return submissions", href: "/services/uae/vat-filing" },
                            { name: "Accounting & Bookkeeping", sub: "IFRS compliant financial accounts", href: "/services/uae/accounting-bookkeeping-uae" },
                            { name: "Audit Support Services", sub: "Mainland & Free Zone audit assistance", href: "/services/uae/audit-support" },
                          ].map((item, idx) => (
                            <motion.li key={idx} variants={itemVariants}>
                              <Link href={item.href} className="group block">
                                <h4 className="font-display text-lg text-white group-hover:text-emerald-400 transition-colors duration-300 flex items-center justify-between">
                                  <span>{item.name}</span>
                                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-400" />
                                </h4>
                                <p className="font-sans text-xs text-slate-400 mt-0.5">{item.sub}</p>
                                <div className="h-[1px] w-0 bg-emerald-500/40 mt-3 group-hover:w-full transition-all duration-500"></div>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                        <div className="mt-6">
                          <Link href="/services/uae" className="font-sans text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 group/link">
                            <span>Explore all UAE services</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/insights"
              className={`font-sans text-sm font-medium tracking-wide transition-all duration-300 relative py-2 px-1 hover:-translate-y-0.5 ${
                pathname.startsWith("/insights") ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              Insights
            </Link>

            <Link
              href="/contact"
              className={`font-sans text-sm font-medium tracking-wide transition-all duration-300 relative py-2 px-1 hover:-translate-y-0.5 ${
                pathname === "/contact" ? "text-brand-accent" : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-brand-border bg-white hover:border-brand-accent hover:bg-brand-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none shadow-sm hover:shadow-soft"
              aria-label="Search Services"
            >
              <Search className="w-4 h-4 text-brand-primary group-hover:text-white transition-colors" />
            </button>
            <a
              href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I would like to schedule a consultation with Joyce J Charuvila & Associates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-brand-border bg-white hover:border-brand-accent hover:bg-brand-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none shadow-sm hover:shadow-soft"
              aria-label="WhatsApp Consultation"
            >
              <MessageSquare className="w-4 h-4 text-brand-accent group-hover:text-white transition-colors" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white px-5 py-2.5 rounded-full font-sans text-sm font-medium shadow-soft hover:shadow-glass hover:scale-105 transition-all duration-300"
            >
              <span>Consult Now</span>
            </Link>
          </div>

          {/* Mobile hamburger & Search */}
          <div className="lg:hidden flex items-center z-50 space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md"
              aria-label="Search Services"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="p-2 text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md"
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
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col justify-between pt-[100px] pb-12 px-8 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Same mobile menu structure as before */}
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
                      <Link href="/services/india" className="block font-sans text-sm font-bold text-brand-accent hover:text-brand-primary py-1">All India Services →</Link>
                      <Link href="/services/india/accounting-bookkeeping-india" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">Accounting & Bookkeeping</Link>
                      <Link href="/services/india/statutory-audit" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">Statutory Audit</Link>
                      <Link href="/services/india/bank-concurrent-audit" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">Bank Concurrent Audit</Link>
                      <Link href="/services/india/gst-registration-filing" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">GST Registration & Filing</Link>
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
                      <Link href="/services/uae" className="block font-sans text-sm font-bold text-brand-accent hover:text-brand-primary py-1">All UAE Services →</Link>
                      <Link href="/services/uae/accounting-bookkeeping-uae" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">Accounting & Bookkeeping</Link>
                      <Link href="/services/uae/corporate-tax-filing" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">Corporate Tax Filing</Link>
                      <Link href="/services/uae/vat-filing" className="block font-sans text-base text-brand-secondary hover:text-brand-primary py-1">VAT Filing & Compliance</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Link href="/insights" className="font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300">Insights</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Link href="/contact" className="font-display text-4xl font-bold text-brand-primary hover:text-brand-accent transition-colors duration-300">Contact</Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)]"
            >
              <a
                href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I would like to schedule a consultation with Joyce J Charuvila & Associates.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-white border border-brand-border py-4 rounded-full font-sans font-medium text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
              >
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                <span>WhatsApp Consultation</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center space-x-3 bg-brand-primary py-4 rounded-full font-sans font-medium text-white shadow-soft"
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
