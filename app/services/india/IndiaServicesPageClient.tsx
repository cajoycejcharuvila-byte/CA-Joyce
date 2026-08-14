"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUpRight, Calculator, ClipboardCheck, Landmark, Percent, Receipt, 
  ShieldAlert, Coins, ShieldCheck, Award, Scale, FileSpreadsheet, ArrowRight,
  ShoppingCart, Building, Factory, HeartPulse, Utensils, Briefcase, Rocket
} from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getIndiaServices, getIndustries, getFAQs, getCompanyInfo } from "@/lib/cms";
import { getProfessionalServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ServiceItem } from "@/types";
import { SEO_GRAPH } from "@/lib/seoGraph";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Helper to get service icon
function getServiceIcon(slug: string) {
  const iconProps = { className: "w-8 h-8 text-[#1B5283] shrink-0" };
  
  if (slug.includes("accounting") || slug.includes("bookkeeping")) {
    return <Calculator {...iconProps} />;
  }
  if (slug.includes("statutory-audit")) {
    return <ClipboardCheck {...iconProps} />;
  }
  if (slug.includes("bank")) {
    return <Landmark {...iconProps} />;
  }
  if (slug.includes("gst")) {
    return <Percent {...iconProps} />;
  }
  if (slug.includes("income-tax")) {
    return <Receipt {...iconProps} />;
  }
  if (slug.includes("tds")) {
    return <ShieldAlert {...iconProps} />;
  }
  if (slug.includes("project-finance")) {
    return <Coins {...iconProps} />;
  }
  if (slug.includes("internal-audit")) {
    return <ShieldCheck {...iconProps} />;
  }
  if (slug.includes("certification")) {
    return <Award {...iconProps} />;
  }
  if (slug.includes("valuation")) {
    return <Scale {...iconProps} />;
  }
  
  return <FileSpreadsheet {...iconProps} />;
}

// Helper to get category tag
function getCategoryTag(slug: string) {
  if (slug.includes("accounting") || slug.includes("bookkeeping")) return "Accounting";
  if (slug.includes("audit")) return "Audit";
  if (slug.includes("gst") || slug.includes("certification")) return "Compliance";
  if (slug.includes("tax") || slug.includes("tds")) return "Tax";
  if (slug.includes("finance") || slug.includes("valuation")) return "Advisory";
  return "Compliance";
}

// Helper to map slug to local image path
function getServiceImagePath(slug: string, serviceImage?: string) {
  if (serviceImage) return serviceImage;
  if (slug.includes("accounting-bookkeeping")) return "/images/services/india/accounting-bookkeeping-india.jpg";
  if (slug.includes("statutory-audit")) return "/images/services/india/statutory-audit.jpg";
  if (slug.includes("bank-concurrent")) return "/images/services/india/bank-concurrent-audit.jpg";
  if (slug.includes("gst-registration")) return "/images/services/india/gst-registration-filing.jpg";
  if (slug.includes("income-tax")) return "/images/services/india/income-tax-audit-return-filing.jpg";
  if (slug.includes("tds")) return "/images/services/india/tds-filing.jpg";
  if (slug.includes("project-finance")) return "/images/services/india/project-finance-loan-assistance.jpg";
  if (slug.includes("internal-audit")) return "/images/services/india/internal-audit-business-advisory.jpg";
  if (slug.includes("certification")) return "/images/services/india/certification-services.jpg";
  if (slug.includes("valuation")) return "/images/services/india/valuation-services.jpg";
  return "/images/services/audit-documents.webp"; // fallback
}

export default function IndiaServicesPageClient() {
  const services = getIndiaServices();
  const industries = getIndustries();
  const allFaqs = getFAQs();
  const company = getCompanyInfo();

  // Filter top 3 FAQs matching Indian tax compliance context
  const contextualFaqs = allFaqs
    .filter(faq => 
      faq.question.toLowerCase().includes("gst") || 
      faq.question.toLowerCase().includes("income tax") ||
      faq.question.toLowerCase().includes("statutory audit")
    )
    .slice(0, 3);

  // India-specific professional process
  const processSteps = [
    {
      title: "Requirements Discussion",
      description: "Reviewing your business structure, turnover, and statutory compliance timeline."
    },
    {
      title: "Secure Document Intake",
      description: "Collecting financial invoices, bank statements, and tax registers via secure channels."
    },
    {
      title: "Reconciliation & Audit Reviews",
      description: "Matching books with GSTR-2B, reconciling tax ledgers, and performing audit checks."
    },
    {
      title: "Statutory Filing & Certification",
      description: "E-filing returns on official government portals and generating mandatory ICAI UDINs."
    }
  ];

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24 text-left">
      {/* Dynamic SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getProfessionalServiceSchema(
              "India Chartered Accountancy & Tax Compliance Services",
              "Professional statutory audits, GST filing, income tax consulting, concurrent audits, and business advisory services in India.",
              "/services/india"
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "India Services", path: "/services/india" },
            ])
          ),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            National Practice
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-[1.1] text-brand-primary tracking-tight">
            India Services
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Professional audit, taxation and advisory services for businesses, professionals and individuals across India.
          </p>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-brand-divider mb-20">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-normal mb-6">
              Indian Statutory & Tax Compliance
            </h2>
            <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-6">
              Maintaining tax compliance in India requires rigorous attention to timelines, tax reconciliations, and regulatory filings. Our Indian practice provides comprehensive assistance to ensure your books are audit-ready, filings are accurate, and tax audits comply with the Income Tax Act and GST regulations.
            </p>
            <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed">
              We handle end-to-end statutory audits under the Companies Act 2013, bank concurrent audits, GST returns, Income Tax e-filing, and generate official Unique Document Identification Numbers (UDIN) for all signed certifications.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-center">
            <GlassCard className="p-8 bg-white w-full" hoverLift={false}>
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-4">
                Quick Portal Links
              </h3>
              <ul className="space-y-4 font-sans text-sm text-brand-secondary">
                <li className="flex items-center justify-between py-2 border-b border-brand-divider">
                  <span>Income Tax E-filing Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </li>
                <li className="flex items-center justify-between py-2 border-b border-brand-divider">
                  <span>GST Common Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </li>
                <li className="flex items-center justify-between py-2">
                  <span>ICAI UDIN Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* SECTION 2: SERVICES GRID */}
        <div className="mb-24 md:mb-36">
          <div className="mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-2 block">
              Core Expertise
            </span>
            <h2 className="font-display text-4xl font-normal text-brand-primary">
              Our Professional Services in India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => (
              <Link 
                href={`/services/india/${service.slug}`} 
                key={service.slug}
                className="group relative bg-white border border-brand-border rounded-[32px] overflow-hidden hover:shadow-glass hover:-translate-y-2 transition-all duration-500 flex flex-col h-full min-h-[340px] p-8 md:p-10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-accent/10 transition-colors duration-500 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-10 z-10">
                  <div className="bg-brand-bg p-3.5 rounded-2xl border border-brand-border text-brand-primary group-hover:text-brand-accent group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {getServiceIcon(service.slug)}
                  </div>
                  <span className="font-mono text-xs text-brand-accent font-bold uppercase tracking-widest bg-brand-accent/5 px-3 py-1.5 rounded-full border border-brand-accent/10">
                    0{index + 1}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-end z-10">
                  <h3 className="font-display text-2xl md:text-3xl text-brand-primary mb-4 font-normal group-hover:text-brand-accent transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-secondary leading-relaxed mb-8 line-clamp-3">
                    {service.overview}
                  </p>
                  
                  <div className="flex items-center space-x-2 font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors mt-auto">
                    <span>Explore Service</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {services.length > 3 && (
            <div className="mt-16 pt-16 border-t border-brand-divider">
              <h3 className="font-display text-2xl text-brand-primary mb-8">Other Specialized Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(3).map((service) => (
                  <Link 
                    href={`/services/india/${service.slug}`} 
                    key={service.slug} 
                    className="group flex items-center p-4 bg-white border border-brand-border rounded-[20px] hover:border-brand-accent/30 hover:shadow-soft transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mr-4 text-brand-primary group-hover:bg-brand-accent/5 group-hover:text-brand-accent transition-colors border border-brand-border group-hover:border-brand-accent/20">
                      {getServiceIcon(service.slug)}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <h4 className="font-sans text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                        {service.title.replace(" (India)", "")}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-accent group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: INDUSTRIES SERVED */}
        <div className="mb-24 md:mb-36 border-t border-brand-divider pt-16 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-4 block">
                Industry Experience
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-normal text-brand-primary mb-6">
                Sectors We Serve
              </h2>
              <p className="font-sans text-sm md:text-base text-brand-secondary leading-relaxed">
                Applying cross-industry financial knowledge to optimize your regulatory and tax structures.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0 border-t border-brand-divider sm:border-t-0">
                {industries.map((ind, idx) => {
                  let Icon = ArrowRight;
                  if (ind.name === "Trading") Icon = ArrowUpRight;
                  if (ind.name === "Retail") Icon = ShoppingCart;
                  if (ind.name === "Construction") Icon = Building;
                  if (ind.name === "Manufacturing") Icon = Factory;
                  if (ind.name === "Healthcare") Icon = HeartPulse;
                  if (ind.name === "Hospitality") Icon = Utensils;
                  if (ind.name === "Small Businesses") Icon = Briefcase;
                  if (ind.name === "Startups") Icon = Rocket;

                  return (
                    <div key={idx} className="group border-b border-brand-divider py-8 flex items-start space-x-5">
                      <div className="w-10 h-10 shrink-0 rounded-full border border-brand-divider flex items-center justify-center bg-white group-hover:border-brand-accent transition-colors duration-300 mt-0.5">
                        <Icon className="w-4 h-4 text-brand-secondary group-hover:text-brand-accent transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-brand-primary mb-2 group-hover:text-brand-accent transition-colors">
                          {ind.name}
                        </h3>
                        <p className="font-sans text-sm text-brand-secondary leading-relaxed">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PROFESSIONAL PROCESS */}
        <div className="bg-brand-dark text-white rounded-[40px] p-8 md:p-16 mb-24 md:mb-36 shadow-glass relative overflow-hidden grain-bg">
          <div className="max-w-3xl mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Execution Path
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-white">
              Engagement Lifecycle
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="border-t border-slate-800 pt-6">
                <span className="font-mono text-2xs text-brand-accent font-bold uppercase block mb-3">
                  Stage 0{idx + 1}
                </span>
                <h3 className="font-sans text-sm font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: CONTEXTUAL FAQs */}
        {contextualFaqs.length > 0 && (
          <div className="mb-24 md:mb-36">
            <div className="text-center mb-16">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-2 block">
                FAQ
              </span>
              <h2 className="font-display text-4xl font-normal text-brand-primary">
                Indian Compliance Q&A
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {contextualFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-brand-border rounded-[24px] p-6 text-left shadow-sm">
                  <h3 className="font-sans text-sm font-semibold text-brand-primary mb-2">
                    {faq.question}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-brand-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/faq"
                className="inline-flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-accent hover:underline"
              >
                <span>View All FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* SECTION 6: CONSULTATION SECTION */}
        <div className="bg-white border border-brand-border rounded-[40px] p-8 md:p-16 shadow-soft text-center max-w-4xl mx-auto">
          <h2 className="font-display text-4xl text-brand-primary font-normal mb-4">
            Consult a Chartered Accountant
          </h2>
          <p className="font-sans text-brand-secondary text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Ensure your filings conform to local provisions and are processed well before statutory deadlines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I have an enquiry regarding Indian compliance services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white px-8 py-4 rounded-[20px] font-sans text-sm font-medium transition-colors duration-300 shadow-soft focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
            >
              <span>WhatsApp Consultation</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center space-x-2 border border-brand-border hover:border-brand-primary text-brand-primary px-8 py-4 rounded-[20px] font-sans text-sm font-medium transition-colors duration-300 bg-slate-50"
            >
              <span>Request Callback</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
