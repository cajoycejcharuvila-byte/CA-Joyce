"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { getIndiaServices, getUAEServices } from "@/lib/cms";

interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarSearch({ isOpen, onClose }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use useMemo to avoid recreating arrays on every render
  const allServices = (() => {
    const indiaServices = getIndiaServices().map(s => ({ ...s, country: "India" as const, href: `/services/india/${s.slug}` }));
    const uaeServices = getUAEServices().map(s => ({ ...s, country: "UAE" as const, href: `/services/uae/${s.slug}` }));
    return [...indiaServices, ...uaeServices];
  })();

  const results = query
    ? allServices.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.overview.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden"; // Prevent scrolling when searching
    } else {
      setTimeout(() => setQuery(""), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, transformOrigin: "right center" }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] md:w-[450px] flex items-center bg-white/95 backdrop-blur-xl rounded-full px-4 md:px-6 z-50 shadow-glass border border-brand-divider"
        >
          <Search className="w-5 h-5 text-brand-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services (e.g. Audit, Tax, VAT)..."
            className="flex-1 bg-transparent border-none outline-none text-brand-dark text-lg md:text-xl placeholder:text-brand-dark/40 font-sans"
          />
          <button 
            onClick={onClose}
            className="p-2 ml-2 text-brand-dark/40 hover:text-brand-accent hover:bg-brand-accent/10 rounded-full transition-colors flex items-center gap-2"
            aria-label="Close search"
          >
            <span className="hidden md:block text-xs font-medium px-1.5 py-0.5 rounded border border-brand-dark/20">ESC</span>
            <X className="w-5 h-5" />
          </button>

          {/* Dropdown Results */}
          <AnimatePresence>
            {query.trim() !== "" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[calc(100%+16px)] left-0 right-0 bg-white border border-brand-divider shadow-2xl rounded-2xl overflow-hidden max-h-[60vh] flex flex-col"
              >
                <div className="overflow-y-auto flex-1 p-2">
                  {results.length > 0 ? (
                    <ul className="space-y-1">
                      {results.map((service, idx) => (
                        <li key={idx}>
                          <Link 
                            href={service.href}
                            onClick={() => onClose()}
                            className="flex items-center justify-between px-4 py-4 hover:bg-brand-bg rounded-xl group transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">
                                {service.title}
                              </span>
                              <span className="text-xs text-brand-dark/60 mt-0.5 line-clamp-1">
                                {service.overview}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 shrink-0 ml-4">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                service.country === 'India' 
                                  ? 'bg-brand-accent/10 text-brand-accent' 
                                  : 'bg-emerald-500/10 text-emerald-600'
                              }`}>
                                {service.country}
                              </span>
                              <ArrowRight className="w-4 h-4 text-brand-dark/30 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-12 text-center text-brand-dark/50">
                      <p className="text-sm font-medium">No services found for &quot;{query}&quot;.</p>
                      <p className="text-xs mt-2 text-brand-dark/40">Try searching for keywords like &quot;Audit&quot;, &quot;Tax&quot;, or &quot;Accounting&quot;.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
