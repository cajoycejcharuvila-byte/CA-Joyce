"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, Calculator, ClipboardCheck, Percent, FileCheck, 
  Building2, FileSpreadsheet, ArrowRight 
} from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getUAEServices, getIndustries, getFAQs, getCompanyInfo } from "@/lib/cms";
import { getProfessionalServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ServiceItem } from "@/types";
import { SEO_GRAPH } from "@/lib/seoGraph";

// Helper to get service icon
function getServiceIcon(slug: string) {
  const iconProps = { className: "w-8 h-8 text-[#1B5283] shrink-0" };
  
  if (slug.includes("accounting") || slug.includes("bookkeeping")) {
    return <Calculator {...iconProps} />;
  }
  if (slug.includes("audit")) {
    return <ClipboardCheck {...iconProps} />;
  }
  if (slug.includes("vat-registration")) {
    return <Percent {...iconProps} />;
  }
  if (slug.includes("vat-filing")) {
    return <FileCheck {...iconProps} />;
  }
  if (slug.includes("corporate-tax-registration") || slug.includes("corporate-tax-filing")) {
    return <Building2 {...iconProps} />;
  }
  
  return <FileSpreadsheet {...iconProps} />;
}

// Helper to get category tag
function getCategoryTag(slug: string) {
  if (slug.includes("accounting") || slug.includes("bookkeeping")) return "Accounting";
  if (slug.includes("audit")) return "Audit";
  if (slug.includes("vat-registration") || slug.includes("corporate-tax-registration")) return "Compliance";
  if (slug.includes("vat-filing") || slug.includes("corporate-tax-filing")) return "Tax";
  return "Compliance";
}

// Helper to map slug to local image path
function getServiceImagePath(slug: string, serviceImage?: string) {
  if (serviceImage) return serviceImage;
  if (slug.includes("accounting")) return "/images/services/uae/accounting-bookkeeping-uae.jpg";
  if (slug.includes("audit")) return "/images/services/uae/audit-support.jpg";
  if (slug.includes("vat-registration")) return "/images/services/uae/vat-registration-deregistration.jpg";
  if (slug.includes("vat-filing")) return "/images/services/uae/vat-filing.jpg";
  if (slug.includes("corporate-tax-registration")) return "/images/services/uae/corporate-tax-registration.jpg";
  if (slug.includes("corporate-tax-filing")) return "/images/services/uae/corporate-tax-filing.jpg";
  return "/images/services/uae-tax-documents.webp"; // fallback
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
      className={`bg-[#F8FAFC] border border-[#CBD5E1] rounded-[32px] overflow-hidden shadow-soft hover:shadow-glass hover:border-brand-primary/20 transition-all duration-500 flex flex-col justify-between p-0 cursor-pointer h-full min-h-[380px] select-none ${
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
            <div className="p-2.5 bg-white rounded-[14px] border border-brand-border">
              {icon}
            </div>
            <h3 className="font-display text-[26px] md:text-[28px] font-normal leading-tight text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
              {service.title.replace(" (UAE)", "")}
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
                href={`/services/uae/${service.slug}`}
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

export default function UAEServicesPageClient() {
  const services = getUAEServices();
  const industries = getIndustries();
  const allFaqs = getFAQs();
  const company = getCompanyInfo();

  // Filter top 3 FAQs matching UAE tax compliance context
  const contextualFaqs = allFaqs
    .filter(faq => 
      faq.question.toLowerCase().includes("vat") || 
      faq.question.toLowerCase().includes("corporate tax") ||
      faq.question.toLowerCase().includes("uae")
    )
    .slice(0, 3);

  // UAE-specific professional process
  const processSteps = [
    {
      title: "Tax Registration",
      description: "Extracting entity details to register for Corporate Tax or VAT with the FTA."
    },
    {
      title: "Transaction Recording",
      description: "Maintaining compliant books under International Financial Reporting Standards (IFRS)."
    },
    {
      title: "Return Preparation",
      description: "Compiling taxable income adjustments and preparing periodic VAT201 returns."
    },
    {
      title: "Filing & Declaration",
      description: "Electronic submission of tax declarations via the FTA EmaraTax portal."
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
              "UAE Corporate Tax & VAT Compliance Services",
              "Outsourced bookkeeping, VAT registrations, corporate tax filing, and FTA compliance auditing for UAE Mainland and Free Zone companies.",
              "/services/uae"
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
              { name: "UAE Services", path: "/services/uae" },
            ])
          ),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            International Practice
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-[1.1] text-brand-primary tracking-tight">
            UAE Services
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Professional accounting, tax registration, VAT compliance and corporate tax services for companies operating in the UAE.
          </p>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-brand-divider mb-20">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-normal mb-6">
              UAE Corporate Tax & VAT Compliance
            </h2>
            <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-6">
              With the introduction of Federal Decree-Law No. 47 of 2022 on Corporate Tax and the established VAT laws, UAE companies operate in a modern regulatory landscape. Ensuring timely tax registrations and filings is critical to avoid substantial administrative penalties.
            </p>
            <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed">
              We assist Mainland and Free Zone companies with VAT registrations, corporate tax filings, outsourced accounting, audit support, and guide qualification under 0% qualifying Free Zone income rules.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-center">
            <GlassCard className="p-8 bg-white w-full" hoverLift={false}>
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-4">
                UAE Regulatory Links
              </h3>
              <ul className="space-y-4 font-sans text-sm text-brand-secondary">
                <li className="flex items-center justify-between py-2 border-b border-brand-divider">
                  <span>FTA EmaraTax Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </li>
                <li className="flex items-center justify-between py-2 border-b border-brand-divider">
                  <span>Ministry of Finance UAE</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </li>
                <li className="flex items-center justify-between py-2">
                  <span>UAE Cabinet Decisions</span>
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
              Our Professional Services in the UAE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <InteractiveServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>

        {/* SECTION 3: SECTORS SERVED */}
        <div className="mb-24 md:mb-36">
          <div className="text-center mb-16">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-2 block">
              Global Compliance
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-brand-primary">
              Sectors We Serve in the UAE
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
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/20" />
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
              Engagement Lifecycle
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-white">
              How We Work in the UAE
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
                UAE Compliance Q&A
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
            Request UAE Tax Consultation
          </h2>
          <p className="font-sans text-brand-secondary text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Discuss your Mainland or Free Zone trade structure to register correctly under the corporate tax regime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20have%20an%20enquiry%20regarding%20UAE%20tax%20compliance%20services.`}
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
