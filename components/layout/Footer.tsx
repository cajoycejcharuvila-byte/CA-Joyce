"use client";

import Link from "next/link";

import { MessageSquare, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { getCompanyInfo } from "@/lib/cms";
import { CompanyInfo } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface FooterProps {
  companyInfo?: CompanyInfo;
}

export default function Footer({ companyInfo }: FooterProps) {
  const company = companyInfo || getCompanyInfo();

  return (
    <footer className="relative bg-brand-dark text-white rounded-t-[48px] overflow-hidden grain-bg pt-20 pb-12 mt-auto">
      {/* Premium Closing CTA */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-normal leading-tight tracking-tight text-white mb-6">
              Let&apos;s Discuss Your <br />
              Requirements
            </h2>
            <p className="font-sans text-lg text-slate-400 max-w-md">
              Speak directly with a Chartered Accountant to address your auditing, accounting, and tax compliance needs in India or the UAE.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:justify-end">
            <a
              href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I would like to schedule a consultation with Joyce J Charuvila & Associates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white hover:bg-slate-200 text-brand-dark px-8 py-4 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft focus-visible:ring-2 focus-visible:ring-brand-accent focus:outline-none"
            >
              <MessageSquare className="w-5 h-5 text-brand-accent" />
              <span>WhatsApp Consultation</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-brand-accent hover:bg-teal-700 text-white px-8 py-4 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16">
          {/* Company Details */}
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-white block mb-1">
              JOYCE J CHARUVILA & ASSOCIATES
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-slate-400 font-medium block mb-6">
              Chartered Accountants
            </span>
            <div className="space-y-3 font-sans text-sm text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-accent mt-1 shrink-0" />
                <span>
                  {company.location.city}, {company.location.state}, {company.location.country}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-brand-accent shrink-0" />
                <span>WhatsApp: {company.contact.phoneDisplay}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                <span>{company.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4 font-sans text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-300">
                  About the Firm
                </Link>
              </li>
              <li>
                <Link href="/founder" className="hover:text-white transition-colors duration-300">
                  Meet the Founder
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-white transition-colors duration-300">
                  Regulatory Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-300">
                  Schedule Call
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">
              Services
            </h4>
            <ul className="space-y-4 font-sans text-sm text-slate-400">
              <li>
                <Link href="/services#uae-services" className="hover:text-white transition-colors duration-300">
                  UAE VAT & Corporate Tax
                </Link>
              </li>
              <li>
                <Link href="/services#india-services" className="hover:text-white transition-colors duration-300">
                  Indian GST & Income Tax
                </Link>
              </li>
              <li>
                <Link href="/services#india-services" className="hover:text-white transition-colors duration-300">
                  Statutory & Internal Audit
                </Link>
              </li>
              <li>
                <Link href="/services#uae-services" className="hover:text-white transition-colors duration-300">
                  Accounting & Bookkeeping
                </Link>
              </li>
            </ul>
          </div>

          {/* CA Branding & UDIN Verification Link */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">
                Verification & ICAI Compliance
              </h4>
              <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                Audit reports and statutory certificates issued by our firm carry a Unique Document Identification Number (UDIN) as mandated by the ICAI.
              </p>
              <a
                href="https://udin.icai.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-brand-accent hover:underline font-sans font-medium"
              >
                <span>Verify Audit Reports on ICAI UDIN Portal</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
            
            <p className="font-sans text-xs text-slate-500 pt-8 mt-auto">
              &copy; {new Date().getFullYear()} JOYCE J CHARUVILA & ASSOCIATES. All rights reserved. Est. {company.established || 2026}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
