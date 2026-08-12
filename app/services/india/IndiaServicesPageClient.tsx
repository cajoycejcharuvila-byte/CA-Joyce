"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, Calculator, ClipboardCheck, Landmark, Percent, Receipt, 
  ShieldAlert, Coins, ShieldCheck, Award, Scale, FileSpreadsheet, ArrowRight 
} from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getIndiaServices, getIndustries, getFAQs, getCompanyInfo } from "@/lib/cms";
import { getProfessionalServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ServiceItem } from "@/types";
import { SEO_GRAPH } from "@/lib/seoGraph";

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

// Sub-component for interactive services preview
function InteractiveServiceCard({ service }: { service: ServiceItem }) {
  const [expanded, setExpanded] = useState(false);
  const icon = getServiceIcon(service.slug);
  const category = getCategoryTag(service.slug);
  const imageSrc = getServiceImagePath(service.slug, service.image);
  const seoNode = SEO_GRAPH[service.slug];

  return (
    <div 
      className={`bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-500 flex flex-col justify-between p-0 cursor-pointer h-full min-h-[380px] select-none ${
        expanded ? "ring-1 ring-brand-accent/20 -translate-y-2 scale-[1.01]" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        {/* Header Image */}
        <div className="relative w-full h-[200px] bg-slate-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={service.title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 grayscale-[20%]"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="font-sans text-[10px] uppercase tracking-widest bg-brand-primary text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 pb-6">
          {/* Icon & Title */}
          <div className="flex items-start space-x-3.5 mb-4">
            <div className="p-2.5 bg-slate-50 rounded-[14px] border border-brand-border">
              {icon}
            </div>
            <h3 className="font-display text-[26px] md:text-[28px] font-normal leading-tight text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
              {service.title.replace(" (India)", "")}
            </h3>
          </div>

          {/* Short Description */}
          <p className="font-sans text-[16px] text-brand-secondary leading-relaxed mb-4">
            {service.overview.split(". ")[0]}.
          </p>
        </div>
      </div>

      {/* Expandable Preview Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-10 pb-8 border-t border-brand-divider pt-4 bg-slate-50/50 space-y-4"
          >
            {seoNode ? (
              <>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold text-brand-accent mb-0.5">What It Is</p>
                  <p className="font-sans text-xs text-brand-secondary leading-relaxed">{seoNode.definition}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold text-brand-accent mb-0.5">Who It Is For</p>
                  <p className="font-sans text-xs text-brand-secondary leading-relaxed">{seoNode.targetUser}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold text-brand-accent mb-0.5">When Needed</p>
                  <p className="font-sans text-xs text-brand-secondary leading-relaxed">{seoNode.whenNeeded}</p>
                </div>
                <div className="bg-red-50/60 border border-red-100/80 rounded-xl p-3">
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold text-red-600 mb-0.5">Statutory Urgency</p>
                  <p className="font-sans text-xs text-red-700 leading-relaxed font-medium">{seoNode.urgencyTrigger}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="font-sans text-[10px] uppercase tracking-wider font-semibold text-brand-accent mb-1">Who Needs This</p>
                <p className="font-sans text-xs text-brand-secondary leading-relaxed">{service.who_needs_this}</p>
              </div>
            )}
            <div className="pt-2">
              <Link 
                href={`/services/india/${service.slug}`}
                onClick={(e) => e.stopPropagation()} // Prevent double clicks
                className="inline-flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
              >
                <span>Full Scope & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static CTA Bar when not expanded */}
      {!expanded && (
        <div className="px-10 pb-8 pt-2">
          <div className="flex items-center space-x-1.5 font-sans text-xs font-semibold text-brand-primary border-t border-brand-divider pt-4">
            <span>Click to Expand</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <InteractiveServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>

        {/* SECTION 3: INDUSTRIES SERVED */}
        <div className="mb-24 md:mb-36">
          <div className="text-center mb-16">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-2 block">
              Industry Experience
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-brand-primary">
              Sectors We Serve
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => (
              <GlassCard key={idx} className="p-6 bg-white flex flex-col justify-between relative overflow-hidden group min-h-[220px]" hoverLift={true}>
                {ind.image && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <Image
                      src={ind.image}
                      alt={ind.name}
                      fill
                      className="object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95" />
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-semibold text-brand-primary mb-2.5">
                    {ind.name}
                  </h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed font-medium">
                    {ind.description}
                  </p>
                </div>
              </GlassCard>
            ))}
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
              href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20have%20an%20enquiry%20regarding%20Indian%20compliance%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white px-8 py-4 rounded-[20px] font-sans text-sm font-medium transition-colors duration-300 shadow-soft"
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
