/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, MessageSquare, ShieldCheck, 
  ClipboardCheck, Calculator, FileText, Briefcase, Globe
} from "lucide-react";
import ParallaxImage from "@/components/sections/ParallaxImage";
import { InsightItem } from "@/lib/cms";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface HomePageClientProps {
  company: any;
  homeSettings: any;
  aboutSettings: any;
  insights: InsightItem[];
  capabilities: any[];
  faqs: any[];
}

export default function HomePageClient({
  company,
  homeSettings,
  aboutSettings,
  insights,
  capabilities,
  faqs
}: HomePageClientProps) {
  // FAQs list for top six
  const slicedFaqs = faqs.slice(0, 6);

  // Articles segmentation
  const featuredArticle = insights[0];
  const latestArticles = insights.slice(1, 4);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const practiceIcons = [
    <ClipboardCheck className="w-7 h-7 text-brand-accent shrink-0" key="audit" />,
    <Calculator className="w-7 h-7 text-brand-accent shrink-0" key="tax" />,
    <FileText className="w-7 h-7 text-brand-accent shrink-0" key="report" />,
    <Briefcase className="w-7 h-7 text-brand-accent shrink-0" key="advisory" />,
    <Globe className="w-7 h-7 text-brand-accent shrink-0" key="crossborder" />,
    <ShieldCheck className="w-7 h-7 text-brand-accent shrink-0" key="internal" />
  ];

  const practiceLinks = [
    "/services/india/statutory-audit",
    "/services/india/gst-registration-filing",
    "/services/india/accounting-bookkeeping-india",
    "/services/uae/audit-support",
    "/services/uae/corporate-tax-filing",
    "/services/india/statutory-audit"
  ];

  const heroImageSrc = homeSettings.heroImage || "/images/hero/hero-office.webp";
  const founderImageSrc = aboutSettings.portraitImage || "/images/founder/portrait.webp";

  return (
    <div className="flex flex-col w-full text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://joyceca.in/#firm",
                "name": "JOYCE J CHARUVILA & ASSOCIATES",
                "alternateName": "Joyce J Charuvila & Associates, Chartered Accountants",
                "image": "https://joyceca.in" + heroImageSrc,
                "logo": "https://joyceca.in/logo.png",
                "telephone": company.contact.phoneDisplay,
                "email": company.contact.email,
                "url": "https://joyceca.in",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": company.contact.address,
                  "addressLocality": company.location.city,
                  "addressRegion": company.location.state,
                  "addressCountry": "IN"
                },
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "17:30"
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Saturday",
                    "opens": "09:00",
                    "closes": "13:30"
                  }
                ],
                "priceRange": "$$"
              },
              {
                "@type": "WebSite",
                "@id": "https://joyceca.in/#website",
                "url": "https://joyceca.in",
                "name": "JOYCE J CHARUVILA & ASSOCIATES",
                "publisher": { "@id": "https://joyceca.in/#firm" }
              }
            ]
          })
        }}
      />

      {/* SECTION 01: HERO (Split Layout with Image) */}
      <section className="relative bg-brand-bg pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text & Cards */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-6 block">
                Firm Established {company.established}
              </span>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-brand-primary mb-8">
                {homeSettings.heroTitle || "JOYCE J CHARUVILA & ASSOCIATES"}
              </h1>
              
              <p className="font-sans text-lg md:text-xl text-brand-secondary font-medium leading-relaxed max-w-xl mb-12">
                {homeSettings.heroSubtitle || "Professional accounting, audit, taxation and advisory services for businesses and individuals in India and the United Arab Emirates."}
              </p>

              {/* Destination Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-4">
                
                {/* UAE Services */}
                <Link href="/services/uae" className="group/card block">
                  <div className="bg-white border border-brand-border rounded-[24px] p-6 h-full transition-all duration-300 hover:shadow-glass hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <span className="font-sans text-3xs uppercase tracking-widest text-brand-accent font-bold mb-2 block">
                        UAE
                      </span>
                      <h3 className="font-display text-xl text-brand-primary mb-2">Accounting & Tax</h3>
                      <p className="font-sans text-xs text-brand-secondary">Corporate Tax, and VAT compliance.</p>
                    </div>
                    <div className="flex items-center space-x-1 font-sans text-xs font-semibold text-brand-primary group-hover/card:text-brand-accent mt-4">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                    </div>
                  </div>
                </Link>

                {/* India Services */}
                <Link href="/services/india" className="group/card block">
                  <div className="bg-white border border-brand-border rounded-[24px] p-6 h-full transition-all duration-300 hover:shadow-glass hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <span className="font-sans text-3xs uppercase tracking-widest text-brand-accent font-bold mb-2 block">
                        India
                      </span>
                      <h3 className="font-display text-xl text-brand-primary mb-2">Audit & Compliance</h3>
                      <p className="font-sans text-xs text-brand-secondary">Statutory Audits and advisory.</p>
                    </div>
                    <div className="flex items-center space-x-1 font-sans text-xs font-semibold text-brand-primary group-hover/card:text-brand-accent mt-4">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                    </div>
                  </div>
                </Link>

              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-6 relative h-[500px] md:h-[650px] lg:h-[750px] w-full rounded-[32px] overflow-hidden shadow-glass group">
              <Image
                src={heroImageSrc}
                alt="Joyce J Charuvila & Associates Office Architecture"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-brand-border pointer-events-none rounded-[32px]" />
              <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none mix-blend-multiply" />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 01.5: CLIENT PREPARATION & REQUIRED DOCUMENTS CHECKLIST */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Abstract background shapes for premium feel */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
          >
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-6">
              Preparation
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-normal text-brand-primary tracking-tight mb-6">
              Client Documents Checklist
            </h2>
            <p className="font-sans text-base md:text-lg text-brand-secondary">
              Prepare these core records in advance to streamline your annual audit, tax filing, or compliance consultation. Organized documentation ensures rapid processing and complete statutory compliance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: India Tax */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[32px] border border-brand-border p-8 md:p-10 shadow-soft hover:shadow-glass hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-display text-2xl text-brand-primary mb-2">India Tax & GST</h3>
              <p className="font-sans text-sm text-brand-secondary mb-8 h-10">Essential documents for corporate income tax and GST filings.</p>
              
              <ul className="space-y-4">
                {[
                  "PAN Card & Aadhaar of Signatory",
                  "Bank Statements (Full FY)",
                  "Form 26AS, AIS & TIS Summaries",
                  "Monthly Sales & Purchase Invoices"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:border-brand-accent/20 transition-colors duration-300">
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5 text-brand-accent">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    <span className="font-sans text-sm text-brand-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-brand-divider">
                <Link href="/services/india/gst-registration-filing" className="font-sans text-xs font-bold text-brand-accent hover:text-brand-primary flex items-center space-x-1 group/link">
                  <span>Explore India Tax Services</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Column 2: India Audit */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-brand-primary rounded-[32px] p-8 md:p-10 shadow-glass hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-2xl text-white mb-2">Statutory Audit</h3>
                <p className="font-sans text-sm text-slate-400 mb-8 h-10">Records required for financial audits and statutory certifications.</p>
                
                <ul className="space-y-4">
                  {[
                    "Final Trial Balance & Ledger",
                    "Certificate of Incorporation",
                    "Prior Year Audit Reports",
                    "Fixed Asset & Loan Registers"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 bg-white/5 rounded-xl p-3 border border-white/10 group-hover:border-white/20 transition-colors duration-300">
                      <div className="w-5 h-5 rounded-full bg-brand-accent shadow-sm flex items-center justify-center shrink-0 mt-0.5 text-white">
                        <span className="text-[10px] font-bold">✓</span>
                      </div>
                      <span className="font-sans text-sm text-slate-200 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link href="/services/india/statutory-audit" className="font-sans text-xs font-bold text-white hover:text-slate-300 flex items-center space-x-1 group/link">
                    <span>Explore Audit Services</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Column 3: UAE Compliance */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[32px] border border-brand-border p-8 md:p-10 shadow-soft hover:shadow-glass hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-display text-2xl text-brand-primary mb-2">UAE Compliance</h3>
              <p className="font-sans text-sm text-brand-secondary mb-8 h-10">Mandatory documentation for UAE Corporate Tax and VAT.</p>
              
              <ul className="space-y-4">
                {[
                  "Valid UAE Trade License",
                  "Partner Emirates IDs & Passports",
                  "Secure EmaraTax Integration",
                  "Audited Accounts & Statements"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:border-emerald-500/20 transition-colors duration-300">
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                    <span className="font-sans text-sm text-brand-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-brand-divider">
                <Link href="/services/uae/corporate-tax-filing" className="font-sans text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 group/link">
                  <span>Explore UAE Compliance</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 02: FOUNDER STATEMENT */}
      <section className="bg-brand-dark text-white py-16 md:py-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Biography Text */}
            <div className="lg:col-span-8">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-6 block">
                Firm Objective
              </span>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-white mb-10">
                {homeSettings.objectiveText || "Providing businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters..."}
              </h2>
              
              <div className="border-t border-slate-800 pt-8 mt-12">
                <p className="font-display text-2xl font-semibold text-white block">
                  {aboutSettings.heading ? aboutSettings.heading.split(",")[0] : "CA Joyce J Charuvila"}
                </p>
                <p className="font-sans text-xs uppercase tracking-wider text-brand-accent font-bold mt-1 mb-4">
                  {aboutSettings.heading ? aboutSettings.heading.substring(aboutSettings.heading.indexOf(",") + 1).trim() : "MCom, ACA, CMA Final"}
                </p>
                <p className="font-sans text-sm text-slate-400 max-w-xl leading-relaxed">
                  {aboutSettings.bioParagraphs ? aboutSettings.bioParagraphs[0] : "Chartered Accountant with over nine years of professional experience in auditing, accounting, financial reporting and taxation assignments across India and the UAE."}
                </p>
              </div>
            </div>

            {/* Founder Portrait (Static to prevent head crop) */}
            <div className="lg:col-span-4 max-w-[360px] lg:max-w-none mx-auto w-full">
              <div className="relative overflow-hidden rounded-[32px] aspect-[4/5] border border-brand-border">
                <Image 
                  src={founderImageSrc}
                  alt="CA Joyce J Charuvila"
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: AREAS OF PRACTICE */}
      <section className="py-16 md:py-28 bg-brand-bg border-t border-brand-divider" id="practice-areas">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Large Statement */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
                Capabilities
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-brand-primary tracking-tight leading-tight">
                Areas of Practice
              </h2>
              <p className="font-sans text-brand-secondary mt-6 text-base md:text-lg max-w-md leading-relaxed">
                Providing technical precision across audit, assurance, tax compliance, and business advisory assignments in India and the United Arab Emirates.
              </p>
            </div>

            {/* Right: List of capabilities */}
            <div className="lg:col-span-7 flex flex-col">
              {capabilities.map((cap, index) => (
                <Link
                  key={index}
                  href={practiceLinks[index % practiceLinks.length]}
                  className="group block border-b border-brand-divider last:border-b-0 py-8 first:pt-0"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    {/* Number & Icon */}
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-sm text-brand-accent font-bold uppercase tracking-widest bg-brand-accent/5 px-3 py-1.5 rounded-full border border-brand-accent/10">
                        0{index + 1}
                      </span>
                      <div className="bg-white p-2.5 rounded-xl border border-brand-border text-brand-primary group-hover:text-brand-accent transition-colors shadow-soft">
                        {practiceIcons[index % practiceIcons.length]}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl text-brand-primary mb-2 font-normal group-hover:text-brand-accent transition-colors duration-300">
                          {cap.title}
                        </h3>
                        <p className="font-sans text-sm md:text-base text-brand-secondary leading-relaxed max-w-md">
                          {cap.description}
                        </p>
                      </div>
                      <div className="w-10 h-10 shrink-0 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary group-hover:text-white group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-300 self-start sm:self-center mt-2 sm:mt-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 04: UPDATES & INSIGHTS (Editorial Split Layout) */}
      <section className="py-16 md:py-28 bg-white border-t border-brand-divider">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
                Resource Library
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-normal text-brand-primary tracking-tight">
                Updates & Insights
              </h2>
            </div>
            <Link 
              href="/insights" 
              className="font-sans text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1"
            >
              <span>View all bulletins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left: Featured Article (6 cols) */}
            <div className="lg:col-span-6">
              {featuredArticle && (
                <Link href={`/insights/${featuredArticle.slug}`} className="block group h-full">
                  <div className="bg-brand-bg border border-brand-border rounded-[32px] overflow-hidden shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-500 h-full flex flex-col justify-between">
                    
                    <div className="relative w-full h-[240px] md:h-[280px] bg-slate-100 overflow-hidden">
                      <Image
                        src="/images/services/audit-documents.webp"
                        alt={featuredArticle.title}
                        fill
                        sizes="(max-w-768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest bg-brand-primary text-white px-3 py-1.5 rounded-full font-bold">
                          Featured - {featuredArticle.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 md:p-10 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <span className="font-mono text-3xs text-slate-400 block mb-3">{featuredArticle.date}</span>
                        <h3 className="font-display text-2xl md:text-3xl font-normal text-brand-primary mb-4 leading-tight group-hover:text-brand-accent transition-colors">
                          {featuredArticle.title}
                        </h3>
                        <p className="font-sans text-sm text-brand-secondary leading-relaxed line-clamp-3 mb-6">
                          {featuredArticle.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors pt-4 border-t border-brand-divider">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>

                  </div>
                </Link>
              )}
            </div>

            {/* Right: Latest 3 Articles stacked list with Image Cards (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              {latestArticles.map((article, idx) => {
                const articleImages = [
                  "/images/services/tax-filing.webp",
                  "/images/hero/hero-office.webp",
                  "/images/services/audit-documents.webp"
                ];
                return (
                  <Link key={article.slug} href={`/insights/${article.slug}`} className="block group">
                    <div className="bg-brand-bg border border-brand-border rounded-[24px] p-6 md:p-8 shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-300 flex flex-col sm:flex-row gap-6 text-left">
                      <div className="relative w-full sm:w-32 h-28 shrink-0 rounded-[16px] overflow-hidden bg-slate-100">
                        <Image
                          src={article.image || articleImages[idx % articleImages.length]}
                          alt={article.title}
                          fill
                          sizes="128px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-sans text-3xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full uppercase tracking-wider">
                              {article.category}
                            </span>
                            <span className="font-mono text-3xs text-slate-400">{article.date}</span>
                          </div>
                          <h3 className="font-display text-xl md:text-2xl font-normal text-brand-primary mb-2 leading-snug group-hover:text-brand-accent transition-colors">
                            {article.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-1 font-sans text-2xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors pt-2 border-t border-brand-divider mt-3">
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 05: COMMON FAQs ACCORDION */}
      <section className="py-16 md:py-28 bg-brand-bg border-t border-brand-divider">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 text-left">
          
          <div className="mb-16">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Got Questions?
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-brand-primary tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-0">
            {slicedFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="border-b border-brand-divider transition-all duration-300 group"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-display text-xl md:text-2xl font-normal text-brand-primary pr-8 group-hover:text-brand-accent transition-colors duration-300">
                      {faq.question}
                    </span>
                    <div 
                      className={`relative w-6 h-6 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    >
                      <span className="absolute w-full h-[1.5px] bg-brand-primary group-hover:bg-brand-accent transition-colors"></span>
                      <span className="absolute h-full w-[1.5px] bg-brand-primary group-hover:bg-brand-accent transition-colors"></span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pr-12 font-sans text-sm md:text-base text-brand-secondary leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-16">
            <Link 
              href="/faq"
              className="inline-flex items-center space-x-2 font-sans text-sm font-semibold text-brand-accent hover:text-brand-primary transition-colors group"
            >
              <span className="border-b border-brand-accent/30 group-hover:border-brand-primary/30 pb-0.5">View All FAQs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 06: FINAL CALL TO ACTION */}
      <section className="py-16 md:py-28 bg-brand-bg relative overflow-hidden border-t border-brand-divider">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 z-10 relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Schedule Consultation
            </span>
            <h2 className="font-display text-4xl md:text-7xl font-normal text-brand-primary tracking-tight mb-8">
              Enterprise-Grade Tax and Compliance Advisory
            </h2>
            <p className="font-sans text-base md:text-xl text-brand-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              Contact our offices in Pathanamthitta to coordinate dual-jurisdiction tax filings, audits, or structural business advisory.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I would like to schedule a consultation with Joyce J Charuvila & Associates.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 border border-brand-border px-8 py-4 rounded-[20px] font-sans font-medium text-brand-primary transition-all duration-300 shadow-soft focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
              >
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                <span>WhatsApp Consultation</span>
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-accent hover:bg-brand-primary text-white px-8 py-4 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft hover:shadow-glass hover:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
              >
                <span>Request Callback</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
