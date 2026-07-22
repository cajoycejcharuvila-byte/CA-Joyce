/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, ShieldCheck, Award } from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getBreadcrumbSchema } from "@/lib/seo";

interface AboutPageClientProps {
  aboutSettings: {
    heading: string;
    bioParagraphs: string[];
    portraitImage: string;
  };
  founderInfo: {
    expertise: string[];
  };
  company?: {
    registrations?: {
      icaiMembership?: string;
    };
  };
}

export default function AboutPageClient({ aboutSettings, founderInfo, company }: AboutPageClientProps) {
  const headingVal = aboutSettings.heading || "CA Joyce J Charuvila, MCom, ACA, CMA Final";
  const bioParagraphs = aboutSettings.bioParagraphs || [];
  const portraitSrc = `${aboutSettings.portraitImage || "/images/founder/portrait.webp"}?v=1.1`;
  const hasIcaiMembership = !!(company?.registrations?.icaiMembership);

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24">
      {/* Dynamic SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About Firm", path: "/about" },
            ])
          ),
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            About the Firm
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-[1.1] text-brand-primary tracking-tight">
            Independent Advisory Built on Technical Competence.
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Joyce J Charuvila & Associates was established with a focus on cross-border financial operations. We deliver reliable auditing, accounting, and tax compliance services for companies operating in India and the United Arab Emirates.
          </p>
        </div>

        {/* SECTION 1: ABOUT THE FIRM & PHILOSOPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pb-20 border-b border-brand-divider">
          <div className="lg:col-span-7 space-y-6 text-brand-secondary text-sm md:text-base leading-relaxed text-left">
            <h2 className="font-display text-3xl md:text-4xl font-normal text-brand-primary mb-4">
              Our Professional Approach
            </h2>
            <p>
              We operate under a simple objective — to provide businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters, with equal familiarity in both Indian and UAE compliance requirements.
            </p>
            <p>
              Rather than traditional, high-volume accounting templates, we focus on thorough reviews. We believe that professional financial management requires a clear understanding of the client&apos;s trade, regular communication, and detailed recordkeeping.
            </p>
            <p>
              Our operations in Pathanamthitta, Kerala support local growing enterprises while providing a gateway for business owners expanding into the Middle East. Through digital accounting systems, we maintain clean records that satisfy both Indian tax departments and the UAE Federal Tax Authority.
            </p>
          </div>

          <div className="lg:col-span-5">
            <GlassCard className="p-8 md:p-10 hover:shadow-glass bg-white text-left" hoverLift={false}>
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold mb-6">
                Our Values
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-brand-primary">Technical Precision</h4>
                    <p className="font-sans text-xs text-brand-secondary mt-1">Maintaining strict adherence to IFRS, Indian Accounting Standards, and tax laws.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-brand-primary">Clear Communication</h4>
                    <p className="font-sans text-xs text-brand-secondary mt-1">Explaining regulatory requirements in straightforward, business-focused terms.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-brand-primary">Diligence & Ethics</h4>
                    <p className="font-sans text-xs text-brand-secondary mt-1">Upholding standard code of ethics as mandated by the ICAI.</p>
                  </div>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* SECTION 2: MEET THE FOUNDER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pt-16 md:pt-20">
          <div className="lg:col-span-4 max-w-[360px] lg:max-w-none mx-auto w-full">
            <div className="relative aspect-[4/5] w-full rounded-[32px] overflow-hidden shadow-soft mb-8 bg-slate-100">
              <img
                src={portraitSrc}
                alt="CA Joyce J Charuvila"
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
            
            {/* CA Identity Badges — only shown when ICAI membership number is registered */}
            {hasIcaiMembership && (
            <div className="bg-white border border-brand-border rounded-[24px] p-6 shadow-soft space-y-4 text-left">
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 border border-brand-accent/20 rounded-full flex items-center justify-center shrink-0 bg-slate-50">
                  <Image
                    src="/logo.png"
                    alt="CA Logo"
                    fill
                    sizes="40px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="font-sans text-xs text-brand-primary leading-tight">
                  <p className="font-semibold">Institute of Chartered Accountants of India</p>
                  <p className="text-slate-500">Official ICAI Credentials Registered</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 border border-brand-border rounded-full flex items-center justify-center shrink-0 bg-slate-50">
                  <Image
                    src="/logo.png"
                    alt="CA India"
                    fill
                    sizes="40px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="font-sans text-xs text-brand-primary leading-tight">
                  <p className="font-semibold">Chartered Accountant India</p>
                  <p className="text-slate-500">Official Member Identity Emblem</p>
                </div>
              </div>
            </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center text-left">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Founder Profile
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-normal text-brand-primary mb-6">
              {headingVal}
            </h2>
            
            <div className="space-y-4 font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-8">
              {bioParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-brand-primary font-bold mb-4">
              Areas of Professional Expertise:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-sans text-sm text-brand-secondary mb-10">
              {founderInfo.expertise.map((exp, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                  <span>{exp}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/founder"
                className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3.5 rounded-[20px] font-sans text-sm font-medium transition-all duration-300"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 text-brand-primary hover:text-brand-accent font-sans text-sm font-medium transition-all duration-300"
              >
                <span>Schedule Consultation</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
