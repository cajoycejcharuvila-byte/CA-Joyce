"use client";

import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";

export default function ServicesLandingPage() {
  return (
    <div className="w-full bg-brand-bg py-16 md:py-28 min-h-[calc(100vh-90px)] flex items-center">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Dual-Jurisdiction Practice
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-[1.1] text-brand-primary tracking-tight">
            Compliance & Advisory
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Select your operating jurisdiction to review accounting standards, tax filing deadlines, and statutory audit frameworks.
          </p>
        </div>

        {/* Split Selection Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* India panel */}
          <Link href="/services/india" className="group block">
            <GlassCard className="p-10 md:p-12 hover:shadow-glass hover:border-brand-primary/20 bg-white min-h-[380px] flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-divider">
                  <Landmark className="w-8 h-8 text-brand-accent" />
                  <span className="font-sans text-xs uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-bold">
                    India
                  </span>
                </div>
                <h2 className="font-display text-4xl text-brand-primary font-normal mb-4 group-hover:text-brand-accent transition-colors duration-300">
                  India Practice
                </h2>
                <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed">
                  Statutory audits under the Companies Act 2013, GST registrations, Income Tax filings, TDS compliances, concurrent bank audits, and UDIN certifications.
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-6 font-sans text-sm font-semibold text-brand-accent group-hover:text-brand-primary transition-colors duration-300">
                <span>Explore India Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </GlassCard>
          </Link>

          {/* UAE panel */}
          <Link href="/services/uae" className="group block">
            <GlassCard className="p-10 md:p-12 hover:shadow-glass hover:border-brand-primary/20 bg-white min-h-[380px] flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-divider">
                  <Landmark className="w-8 h-8 text-brand-accent" />
                  <span className="font-sans text-xs uppercase tracking-widest bg-emerald-50 text-brand-accent border border-emerald-200 px-3 py-1 rounded-full font-bold">
                    United Arab Emirates
                  </span>
                </div>
                <h2 className="font-display text-4xl text-brand-primary font-normal mb-4 group-hover:text-brand-accent transition-colors duration-300">
                  UAE Practice
                </h2>
                <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed">
                  Corporate Tax registration and annual filings under Decree-Law No. 47, VAT return submission (VAT201), bookkeeping maintenance, and Free Zone audit support.
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-6 font-sans text-sm font-semibold text-brand-accent group-hover:text-brand-primary transition-colors duration-300">
                <span>Explore UAE Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </GlassCard>
          </Link>

        </div>

      </div>
    </div>
  );
}
