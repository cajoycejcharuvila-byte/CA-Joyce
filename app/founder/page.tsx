/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import { Award, GraduationCap, Mail, MessageSquare } from "lucide-react";
import { getDbCompanyInfo, getDbPageSettings } from "@/lib/db";
import { getPersonSchema, getBreadcrumbSchema } from "@/lib/seo";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Founder | CA Joyce J Charuvila",
  description: "Meet CA Joyce J Charuvila, the founder of Joyce J Charuvila & Associates, leading a team of experts in India and the UAE.",
};

export const revalidate = 0; // Dynamic server rendering

export default async function FounderPage() {
  const company = await getDbCompanyInfo();
  const founder = await getDbPageSettings("founder_settings");

  const portraitSrc = founder.portraitImage || "/images/founder/portrait.webp";
  const bioParagraphs = founder.biography || [];
  const timelineItems = founder.timeline || [];

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24">
      {/* Dynamic SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPersonSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Founder Profile", path: "/founder" },
            ])
          ),
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          {/* Portrait and Contact Quick Card */}
          <div className="lg:col-span-4 max-w-[360px] lg:max-w-none mx-auto w-full">
            <div className="relative aspect-[4/5] w-full rounded-[32px] overflow-hidden shadow-soft mb-8 bg-slate-100 dark:bg-[#121826]">
              <img
                src={portraitSrc}
                alt="CA Joyce J Charuvila"
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
            
            {/* Quick Contact Card */}
            <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[28px] p-6 shadow-soft space-y-4 text-left">
              <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-4">
                Professional Contact
              </h3>
              <div className="flex items-center space-x-3 text-sm text-brand-primary">
                <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                <span>{company.contact.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-brand-primary">
                <MessageSquare className="w-4 h-4 text-brand-accent shrink-0" />
                <span>WhatsApp: {company.contact.phoneDisplay}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white py-3 rounded-[16px] font-sans text-sm font-medium transition-colors duration-300"
                >
                  <span>Connect Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Details & Biography */}
          <div className="lg:col-span-8 flex flex-col justify-center text-left">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
              Founder & Principal
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-normal text-brand-primary leading-tight tracking-tight mb-2">
              CA Joyce J Charuvila
            </h1>
            <p className="font-sans text-sm uppercase tracking-widest text-slate-500 font-semibold mb-8">
              {founder.credentials || "MCom, ACA, CMA Final // Chartered Accountant"}
            </p>

            <div className="space-y-6 font-sans text-brand-secondary text-sm md:text-base leading-relaxed">
              {bioParagraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-brand-divider">
              <div className="flex items-start space-x-3">
                <GraduationCap className="w-5 h-5 text-brand-accent mt-1" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-primary">MCom Degree</h4>
                  <p className="font-sans text-xs text-slate-500">Master of Commerce in Financial Accounting.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-brand-accent mt-1" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-primary">ICAI Membership</h4>
                  <p className="font-sans text-xs text-slate-500">Associate Chartered Accountant (ACA).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-brand-accent mt-1" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-primary">CMA Final</h4>
                  <p className="font-sans text-xs text-slate-500">From Institute of Cost Accountants of India.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="py-16 border-t border-brand-divider mb-16 text-left">
          <div className="max-w-3xl mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-2 block">
              Professional Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-brand-primary">
              Timeline of Experience
            </h2>
          </div>

          <div className="relative border-l border-brand-border ml-4 md:ml-6 space-y-12">
            {timelineItems.map((item: any, idx: number) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 -translate-x-[9px] w-[18px] h-[18px] rounded-full border-4 border-brand-bg bg-brand-accent" />
                
                <span className="font-mono text-sm text-brand-accent font-bold block mb-1">
                  {item.year}
                </span>
                <h3 className="font-display text-2xl text-brand-primary font-normal mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-brand-secondary max-w-2xl leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Philosophy Card */}
        <div className="bg-brand-dark text-white rounded-[32px] p-8 md:p-12 shadow-glass grain-bg text-center max-w-4xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            PROFESSIONAL PHILOSOPHY
          </span>
          <p className="font-display text-2xl md:text-3xl font-normal text-slate-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            &ldquo;{founder.philosophyText || founder.philosophText || "Providing businesses and individuals with clear professional guidance..."}&rdquo;
          </p>
          <div className="w-12 h-[1px] bg-brand-accent mx-auto mb-6" />
          <p className="font-sans text-xs uppercase tracking-wider text-slate-400 font-bold">
            CA Joyce J Charuvila, MCom, ACA, CMA Final
          </p>
        </div>

      </div>
    </div>
  );
}
