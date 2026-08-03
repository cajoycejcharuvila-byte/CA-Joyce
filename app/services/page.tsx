"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Calculator, Building2, FileSpreadsheet } from "lucide-react";

export default function ServicesLandingPage() {
  return (
    <div className="w-full bg-brand-bg py-12 md:py-24 text-left">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        
        {/* Page Title & Subtitle Header */}
        <div className="max-w-4xl mb-16 md:mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Dual-Jurisdiction Advisory & Assurance
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-normal leading-[1.1] text-brand-primary tracking-tight mb-6">
            Services & Practice Areas
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg max-w-2xl leading-relaxed">
            Professional accounting, statutory auditing, tax compliance, and business advisory services tailored for enterprises in India and the United Arab Emirates.
          </p>
        </div>

        {/* 2-Column High-Impact Image Banner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20">
          
          {/* India Practice Banner Card */}
          <Link href="/services/india" className="group block">
            <div className="bg-white border border-slate-200/90 rounded-[32px] overflow-hidden shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-500 flex flex-col justify-between h-full">
              <div className="relative w-full h-[260px] md:h-[300px] bg-slate-100 overflow-hidden">
                <Image
                  src="/images/services/audit-documents.webp"
                  alt="India Compliance Services"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-6 left-6">
                  <span className="font-sans text-xs uppercase tracking-widest bg-amber-500 text-white px-3.5 py-1.5 rounded-full font-bold shadow-sm">
                    India Practice
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-normal mb-4 group-hover:text-brand-accent transition-colors duration-300">
                    India Compliance & Audit
                  </h2>
                  <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-6">
                    Statutory Audits under the Companies Act 2013, Income Tax return filings, GST registrations & monthly GSTR-3B filings, Bank Concurrent Audits, and ICAI UDIN certifications.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-sans text-brand-primary mb-8">
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ Statutory Audits</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ Income Tax & 3CD</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ GST Registration & Filing</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ Bank Concurrent Audits</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-6 border-t border-slate-200 font-sans text-sm font-semibold text-brand-accent group-hover:text-brand-primary transition-colors duration-300">
                  <span>Explore India Services Directory</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* UAE Practice Banner Card */}
          <Link href="/services/uae" className="group block">
            <div className="bg-white border border-slate-200/90 rounded-[32px] overflow-hidden shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-500 flex flex-col justify-between h-full">
              <div className="relative w-full h-[260px] md:h-[300px] bg-slate-100 overflow-hidden">
                <Image
                  src="/images/services/corporate-tax.webp"
                  alt="UAE Corporate Tax & VAT Compliance"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-6 left-6">
                  <span className="font-sans text-xs uppercase tracking-widest bg-emerald-600 text-white px-3.5 py-1.5 rounded-full font-bold shadow-sm">
                    UAE Practice
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-normal mb-4 group-hover:text-brand-accent transition-colors duration-300">
                    UAE Corporate Tax & VAT
                  </h2>
                  <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-6">
                    Corporate Tax registration & annual returns under Decree-Law No. 47, quarterly VAT201 submissions, IFRS bookkeeping, and Free Zone audit support.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-sans text-brand-primary mb-8">
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ Corporate Tax Filings</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ VAT Registration & Returns</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ IFRS Bookkeeping</span>
                    <span className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-[12px]">✓ Free Zone Audit Support</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-6 border-t border-slate-200 font-sans text-sm font-semibold text-brand-accent group-hover:text-brand-primary transition-colors duration-300">
                  <span>Explore UAE Services Directory</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Practice Categories Quick Access Section */}
        <div className="bg-white border border-slate-200/90 rounded-[32px] p-8 md:p-12 shadow-soft">
          <div className="mb-10">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-2 block">
              Service Categories
            </span>
            <h3 className="font-display text-3xl text-brand-primary font-normal">
              Explore Practice Disciplines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/services/india/statutory-audit" className="group p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="p-3 bg-white border border-slate-200 rounded-[14px] w-fit mb-4 text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-normal text-brand-primary mb-2 group-hover:text-brand-accent">Audit & Assurance</h4>
              <p className="font-sans text-xs text-brand-secondary">Statutory audits, bank concurrent audits, and internal compliance reviews.</p>
            </Link>

            <Link href="/services/india/gst-registration-filing" className="group p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="p-3 bg-white border border-slate-200 rounded-[14px] w-fit mb-4 text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-normal text-brand-primary mb-2 group-hover:text-brand-accent">Taxation & GST</h4>
              <p className="font-sans text-xs text-brand-secondary">Income Tax audits, GSTR returns, TDS compliance, and Tax advisory.</p>
            </Link>

            <Link href="/services/uae/corporate-tax-filing" className="group p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="p-3 bg-white border border-slate-200 rounded-[14px] w-fit mb-4 text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-normal text-brand-primary mb-2 group-hover:text-brand-accent">UAE Corporate Tax</h4>
              <p className="font-sans text-xs text-brand-secondary">EmaraTax registration, corporate tax returns, and VAT201 filing.</p>
            </Link>

            <Link href="/services/india/accounting-bookkeeping-india" className="group p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="p-3 bg-white border border-slate-200 rounded-[14px] w-fit mb-4 text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Calculator className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-normal text-brand-primary mb-2 group-hover:text-brand-accent">Accounting & Advisory</h4>
              <p className="font-sans text-xs text-brand-secondary">IFRS bookkeeping, MIS reporting, financial valuation, and certifications.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
