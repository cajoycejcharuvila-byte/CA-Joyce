"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUpRight, Calculator, ClipboardCheck, Percent, FileCheck, 
  Building2, FileSpreadsheet, ArrowRight,
  ShoppingCart, Building, Factory, HeartPulse, Utensils, Briefcase, Rocket
} from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getUAEServices, getIndustries, getFAQs, getCompanyInfo } from "@/lib/cms";
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
  if (slug.includes("accounting")) return "/images/services/uae/accounting-new.jpg";
  if (slug.includes("audit")) return "/images/services/uae/audit-new.jpg";
  if (slug.includes("vat-registration")) return "/images/services/uae/vat-reg-new.jpg";
  if (slug.includes("vat-filing")) return "/images/services/uae/vat-filing-new.jpg";
  if (slug.includes("corporate-tax-registration")) return "/images/services/uae/ct-reg-new.jpg";
  if (slug.includes("corporate-tax-filing")) return "/images/services/uae/ct-filing-new.jpg";
  return "/images/services/uae-tax-documents.webp"; // fallback
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

          <div className="flex flex-col">
            {services.slice(0, 3).map((service, index) => (
              <Link 
                href={`/services/uae/${service.slug}`} 
                key={service.slug}
                className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 py-8 border-b border-brand-divider last:border-b-0"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-sm text-brand-accent font-bold uppercase tracking-widest bg-brand-accent/5 px-3 py-1.5 rounded-full border border-brand-accent/10">
                    0{index + 1}
                  </span>
                  <div className="bg-white p-2.5 rounded-xl border border-brand-border text-brand-primary group-hover:text-brand-accent transition-colors shadow-soft">
                    {getServiceIcon(service.slug)}
                  </div>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl text-brand-primary mb-2 font-normal group-hover:text-brand-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-sans text-sm md:text-base text-brand-secondary leading-relaxed max-w-2xl">
                      {service.overview}
                    </p>
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary group-hover:text-white group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-300 self-start sm:self-center mt-2 sm:mt-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {services.length > 3 && (
            <div className="mt-16 pt-16 border-t border-brand-divider">
              <h3 className="font-display text-2xl text-brand-primary mb-8">Other Specialized Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {services.slice(3).map((service) => (
                  <Link 
                    href={`/services/uae/${service.slug}`} 
                    key={service.slug} 
                    className="group flex items-center justify-between py-4 border-b border-brand-divider hover:border-brand-accent transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-brand-primary group-hover:text-brand-accent transition-colors">
                         {getServiceIcon(service.slug)}
                      </div>
                      <h4 className="font-sans font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">{service.title.replace(" (UAE)", "")}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-accent group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: SECTORS SERVED */}
        <div className="mb-24 md:mb-36 border-t border-brand-divider pt-16 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-4 block">
                Industry Experience
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-normal text-brand-primary mb-6">
                Sectors We Serve in the UAE
              </h2>
              <p className="font-sans text-sm md:text-base text-brand-secondary leading-relaxed">
                Applying cross-industry financial knowledge to optimize your regulatory and tax structures within Free Zones and Mainland UAE.
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
              href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I have an enquiry regarding UAE tax compliance services.")}
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
