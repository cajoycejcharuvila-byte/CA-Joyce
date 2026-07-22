"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition, useEffect } from "react";

interface InsightsFilterProps {
  categories: string[];
  activeCategory: string;
}

export default function InsightsFilter({ categories, activeCategory }: InsightsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Sync state with URL parameter changes (e.g. back navigation or clear)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const timer = setTimeout(() => {
      setQuery(q);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleUpdate = (newQuery: string, newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQuery.trim()) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }

    if (newCategory !== "All") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    params.set("page", "1"); // Reset to page 1 on new filter
    
    startTransition(() => {
      router.push(`/insights?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdate(query, activeCategory);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center mb-12 pb-8 border-b border-brand-divider">
      
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleUpdate(query, category)}
            className={`px-5 py-2.5 rounded-full font-sans text-xs md:text-sm font-semibold tracking-wide border shrink-0 transition-all duration-300 cursor-pointer ${
              activeCategory === category
                ? "bg-brand-accent border-brand-accent text-white shadow-soft"
                : "bg-white border-brand-border text-brand-secondary hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => handleUpdate(query, activeCategory)}
          className="w-full bg-white border border-brand-border focus:border-brand-primary outline-none py-3 pl-11 pr-10 rounded-[18px] font-sans text-sm text-brand-primary shadow-soft transition-all duration-300"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              handleUpdate("", activeCategory);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

    </div>
  );
}
