/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, MessageSquare, ShieldCheck, ChevronDown, 
  ClipboardCheck, Calculator, FileText, Briefcase, Globe
} from "lucide-react";
import ParallaxImage from "@/components/sections/ParallaxImage";
import GlassCard from "@/components/cards/GlassCard";
import { InsightItem } from "@/lib/cms";

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

  const heroImageSrc = `${homeSettings.heroImage || "/images/hero/hero-office.webp"}?v=1.1`;
  const founderImageSrc = `${aboutSettings.portraitImage || "/images/founder/portrait.webp"}?v=1.1`;

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

      {/* SECTION 01: HERO (Restored Premium Minimal Composition) */}
      <section className="relative min-h-[calc(100vh-90px)] flex items-center bg-brand-bg pt-10 pb-20 md:py-28 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Heading & Panels (70%) */}
            <div className="lg:col-span-8 flex flex-col justify-center text-left">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
                Firm Established {company.established}
              </span>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-brand-primary mb-8 max-w-3xl">
                {homeSettings.heroTitle || "JOYCE J CHARUVILA & ASSOCIATES"}
              </h1>
              
              <p className="font-sans text-lg md:text-xl text-brand-secondary font-medium mb-12 max-w-2xl leading-relaxed">
                {homeSettings.heroSubtitle || "Professional accounting, audit, taxation and advisory services for businesses and individuals in India and the United Arab Emirates."}
              </p>

              {/* INDIA & UAE DESTINATION CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-12">
                
                {/* UAE Destination Panel */}
                <Link href="/services/uae" className="group">
                  <div className="min-h-[240px] w-full bg-slate-50 border border-slate-200 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer shadow-soft hover:shadow-glass hover:border-brand-primary/20 text-left">
                    <div>
                      <span className="font-sans text-xs uppercase tracking-widest text-brand-accent font-bold mb-3 block">
                        UAE Services
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-normal text-brand-primary leading-tight">
                        Accounting & Corporate Tax
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-brand-secondary mt-2">
                        Professional Accounting, Corporate Tax, and VAT compliance services.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors pt-4 border-t border-brand-divider mt-6">
                      <span>Explore Services</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>

                {/* India Destination Panel */}
                <Link href="/services/india" className="group">
                  <div className="min-h-[240px] w-full bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer shadow-soft hover:shadow-glass hover:border-brand-primary/20 text-left">
                    <div>
                      <span className="font-sans text-xs uppercase tracking-widest text-brand-accent font-bold mb-3 block">
                        India Services
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-normal text-brand-primary leading-tight">
                        Audit & Tax Compliance
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-brand-secondary mt-2">
                        Statutory Audits, Taxation, and advisory services for businesses.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors pt-4 border-t border-brand-divider mt-6">
                      <span>Explore Services</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>
                
              </div>

              <div className="flex items-center space-x-8 pt-6 border-t border-brand-divider max-w-xl">
                <div>
                  <p className="font-sans text-xs text-brand-secondary uppercase tracking-widest font-semibold">Location</p>
                  <p className="font-sans text-sm text-brand-primary font-medium">{company.location.city}, {company.location.state}</p>
                </div>
                <div className="w-[1px] h-8 bg-brand-border" />
                <div>
                  <p className="font-sans text-xs text-brand-secondary uppercase tracking-widest font-semibold">Practice</p>
                  <p className="font-sans text-sm text-brand-primary font-medium">Dual-Jurisdiction India + UAE</p>
                </div>
              </div>
            </div>

            {/* Right Column - Architectural Photo (Shown on all screen sizes) */}
            <div className="lg:col-span-4 block mt-8 lg:mt-0 relative z-10">
              <div className="relative aspect-[16/9] sm:aspect-[4/3] lg:aspect-[3/4] w-full rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-glass">
                <img
                  src={heroImageSrc}
                  alt="Joyce J Charuvila & Associates Office Architecture"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-brand-border pointer-events-none rounded-[28px] sm:rounded-[32px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01.5: TRUST METRICS & KEY HIGHLIGHTS SHOWCASE */}
      <section className="py-12 md:py-20 bg-white border-y border-brand-divider">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-slate-50/80 border border-brand-border p-6 md:p-8 rounded-[24px] text-left transition-all duration-300 hover:shadow-soft">
              <span className="font-display text-4xl md:text-5xl font-bold text-brand-accent block mb-2">9+</span>
              <h4 className="font-sans text-xs md:text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">Years Experience</h4>
              <p className="font-sans text-xs text-brand-secondary">Auditing, taxation & statutory compliance across India and the UAE.</p>
            </div>
            <div className="bg-slate-50/80 border border-brand-border p-6 md:p-8 rounded-[24px] text-left transition-all duration-300 hover:shadow-soft">
              <span className="font-display text-4xl md:text-5xl font-bold text-brand-accent block mb-2">100%</span>
              <h4 className="font-sans text-xs md:text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">UDIN Compliant</h4>
              <p className="font-sans text-xs text-brand-secondary">Official ICAI Unique Document Identification Number verification on all filings.</p>
            </div>
            <div className="bg-slate-50/80 border border-brand-border p-6 md:p-8 rounded-[24px] text-left transition-all duration-300 hover:shadow-soft">
              <span className="font-display text-4xl md:text-5xl font-bold text-brand-accent block mb-2">Dual</span>
              <h4 className="font-sans text-xs md:text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">Jurisdiction</h4>
              <p className="font-sans text-xs text-brand-secondary">Cross-border accounting, Corporate Tax, and VAT filings in Dubai & Abu Dhabi.</p>
            </div>
            <div className="bg-slate-50/80 border border-brand-border p-6 md:p-8 rounded-[24px] text-left transition-all duration-300 hover:shadow-soft">
              <span className="font-display text-4xl md:text-5xl font-bold text-brand-accent block mb-2">Direct</span>
              <h4 className="font-sans text-xs md:text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">CA Consultation</h4>
              <p className="font-sans text-xs text-brand-secondary">Personalized oversight by CA Joyce J Charuvila for corporate & individual clients.</p>
            </div>
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

            {/* Parallax Founder Portrait */}
            <div className="lg:col-span-4 max-w-[360px] lg:max-w-none mx-auto w-full">
              <ParallaxImage 
                src={founderImageSrc}
                alt="CA Joyce J Charuvila"
                aspectClass="aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: AREAS OF PRACTICE */}
      <section className="py-16 md:py-28 bg-brand-bg" id="practice-areas">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Capabilities
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-normal text-brand-primary tracking-tight">
              Areas of Practice
            </h2>
            <p className="font-sans text-slate-500 max-w-lg mx-auto mt-4 text-sm md:text-base">
              Providing technical precision across audit, assurance, tax compliance, and business advisory assignments in India and the UAE.
            </p>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <GlassCard key={index} className="flex flex-col justify-between min-h-[320px] p-8 md:p-10 hover:shadow-glass group">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.04)]">
                    {practiceIcons[index % practiceIcons.length]}
                    <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-brand-primary mb-4 font-normal group-hover:text-brand-accent transition-colors duration-300">
                    {cap.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
                
                <Link
                  href={practiceLinks[index % practiceLinks.length]}
                  className="pt-6 flex items-center justify-between border-t border-brand-divider mt-6 w-full group/btn"
                >
                  <span className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors duration-300">
                    Learn More
                  </span>
                  <div 
                    className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary group-hover/btn:text-white group-hover/btn:bg-brand-accent group-hover/btn:border-brand-accent transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </GlassCard>
            ))}
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
                          src={articleImages[idx % articleImages.length]}
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
      <section className="py-16 md:py-28 bg-slate-50 border-t border-brand-divider">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-left">
          
          <div className="max-w-3xl mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Got Questions?
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-normal text-brand-primary tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {slicedFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white border border-brand-border rounded-[24px] overflow-hidden transition-all duration-300 shadow-soft"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-6 px-6 md:py-7 md:px-8 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-display text-xl md:text-2xl font-normal text-brand-primary pr-4">
                      {faq.question}
                    </span>
                    <div 
                      className={`w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary transition-all duration-300 shrink-0 ${isOpen ? "rotate-180 bg-brand-primary border-brand-primary text-white" : ""}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-2 border-t border-[rgba(15,23,42,0.04)] font-sans text-sm text-brand-secondary leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/faq"
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white px-8 py-4 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-4 h-4" />
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
                href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 border border-brand-border px-8 py-4 rounded-[20px] font-sans font-medium text-brand-primary transition-all duration-300 shadow-soft"
              >
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                <span>WhatsApp CA Joyce</span>
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-accent hover:bg-brand-primary text-white px-8 py-4 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft hover:shadow-glass hover:translate-y-[-2px]"
              >
                <span>Request Detailed Audit Call</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
