"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { getIndiaServices, getUAEServices } from "@/lib/cms";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const indiaServices = getIndiaServices().map(s => ({ ...s, country: "India" as const, href: `/services/india/${s.slug}` }));
  const uaeServices = getUAEServices().map(s => ({ ...s, country: "UAE" as const, href: `/services/uae/${s.slug}` }));
  const allServices = [...indiaServices, ...uaeServices];

  const results = query
    ? allServices.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.overview.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setQuery(""), 300); // Reset after animation
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 z-[101] overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services (e.g. Audit, Tax, VAT)..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-slate-700 text-lg placeholder:text-slate-400"
              />
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {query === "" ? (
                <div className="px-6 py-12 text-center text-slate-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                  <p className="text-sm">Type to search across our India and UAE practices.</p>
                </div>
              ) : results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((service, idx) => (
                    <li key={idx}>
                      <Link 
                        href={service.href}
                        onClick={() => onClose()}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl group transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                            {service.title}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
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
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-12 text-center text-slate-500">
                  <p className="text-sm">No services found for &quot;{query}&quot;.</p>
                  <p className="text-xs mt-2 text-slate-400">Try searching for keywords like &quot;Audit&quot;, &quot;Tax&quot;, or &quot;Accounting&quot;.</p>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                Search powered by <span className="text-slate-500">Local CMS</span>
              </span>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-sans shadow-sm">esc</kbd>
                  <span>to close</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-sans shadow-sm">↵</kbd>
                  <span>to select</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
