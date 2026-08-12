"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ScrollCapabilitiesProps {
  capabilities: any[];
}

export default function ScrollCapabilities({ capabilities }: ScrollCapabilitiesProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Moves the inner flex container left by its width minus the viewport width
  // so the last card aligns nicely.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(-100% + 100vw)"]);

  const images = [
    "/images/capabilities/audit-assurance.jpg",
    "/images/capabilities/tax-compliance.jpg",
    "/images/capabilities/financial-reporting.jpg",
    "/images/capabilities/business-advisory.jpg",
    "/images/capabilities/crossborder-tax.jpg",
    "/images/capabilities/internal-controls.jpg"
  ];

  const practiceLinks = [
    "/services/india/statutory-audit",
    "/services/india/gst-registration-filing",
    "/services/india/accounting-bookkeeping-india",
    "/services/uae/audit-support",
    "/services/uae/corporate-tax-filing",
    "/services/india/statutory-audit"
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-brand-bg">
      <div className="sticky top-[80px] h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
        
        {/* Intro Text */}
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 mb-8 md:mb-12 shrink-0">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-normal text-brand-primary tracking-tight">
            Areas of Practice
          </h2>
          <p className="font-sans text-brand-secondary max-w-lg mt-4 text-sm md:text-base">
            Providing technical precision across audit, assurance, tax compliance, and business advisory assignments in India and the UAE.
          </p>
        </div>

        {/* Scrollable Track */}
        <motion.div style={{ x }} className="flex pl-6 md:pl-12 gap-6 md:gap-10 w-max items-center">
          {capabilities.map((cap, idx) => {
            const num = (idx + 1).toString().padStart(2, "0");
            return (
              <div 
                key={idx} 
                className="relative w-[300px] md:w-[420px] lg:w-[480px] h-[400px] md:h-[500px] rounded-[32px] overflow-hidden group shrink-0 flex flex-col justify-end shadow-glass"
              >
                {/* Background Image */}
                <Image
                  src={images[idx % images.length]}
                  alt={cap.title}
                  fill
                  sizes="(max-width: 768px) 300px, 500px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay to make text readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 border border-white/20 rounded-[32px] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-10 flex flex-col h-full justify-end">
                  <div className="mt-auto">
                    <span className="font-mono text-xs md:text-sm text-brand-accent font-bold uppercase tracking-widest mb-4 block">
                      {num}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-white mb-4 font-normal">
                      {cap.title}
                    </h3>
                    <p className="font-sans text-sm text-slate-300 leading-relaxed mb-8 line-clamp-3 md:line-clamp-none">
                      {cap.description}
                    </p>
                    
                    <Link
                      href={practiceLinks[idx % practiceLinks.length]}
                      className="inline-flex items-center space-x-2 bg-white/10 hover:bg-brand-accent backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full transition-all duration-300 group/btn"
                    >
                      <span className="font-sans text-xs uppercase tracking-widest font-semibold text-white">
                        Learn More
                      </span>
                      <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Spacer so the last card doesn't perfectly touch the right edge of the screen */}
          <div className="w-[12px] md:w-[24px] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
