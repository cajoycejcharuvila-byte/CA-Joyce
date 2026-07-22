import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import GlassCard from "@/components/cards/GlassCard";
import { getDbInsights } from "@/lib/db";
import InsightsFilter from "@/components/insights/InsightsFilter";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const cat = params.category || "All";
  
  return {
    title: `Updates & Insights ${cat !== "All" ? `- ${cat}` : ""} | JOYCE J CHARUVILA & ASSOCIATES`,
    description: `Read technical tax updates, GST guides, UAE Corporate Tax news, and compliance checklists. Written by practicing Chartered Accountants.`,
    alternates: {
      canonical: "/insights",
    },
  };
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "All";
  const currentPage = parseInt(params.page || "1", 10);
  
  const allInsights = await getDbInsights();
  
  // Get all unique categories for filter tabs
  const categories = ["All", "GST", "Income Tax", "Corporate Tax", "VAT", "Accounting", "Audit", "Business Advisory", "Compliance Updates"];

  // Filter based on search and category
  const filteredInsights = allInsights.filter((item) => {
    const matchesSearch =
      q === "" ||
      item.title.toLowerCase().includes(q.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(q.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  // Pagination details
  const pageSize = 4;
  const totalItems = filteredInsights.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const displayedPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedInsights = filteredInsights.slice((displayedPage - 1) * pageSize, displayedPage * pageSize);

  // Identify featured article (first matching article on page 1)
  const featuredArticle = displayedPage === 1 && paginatedInsights.length > 0 ? paginatedInsights[0] : null;
  const regularArticles = featuredArticle ? paginatedInsights.slice(1) : paginatedInsights;

  // Build Pagination URLs helper
  const getPageUrl = (pageNumber: number) => {
    const queryParams = new URLSearchParams();
    if (q) queryParams.set("q", q);
    if (category !== "All") queryParams.set("category", category);
    queryParams.set("page", pageNumber.toString());
    return `/insights?${queryParams.toString()}`;
  };

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24 text-left">
      
      {/* JSON-LD Breadcrumb & Blog Catalog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://joyceca.in"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Updates & Insights",
                    "item": "https://joyceca.in/insights"
                  }
                ]
              },
              {
                "@type": "Blog",
                "name": "Updates & Insights - JOYCE J CHARUVILA & ASSOCIATES",
                "description": "Regulatory tax and compliance insights for India and the UAE.",
                "publisher": {
                  "@type": "ProfessionalService",
                  "name": "JOYCE J CHARUVILA & ASSOCIATES",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://joyceca.in/logo.png"
                  }
                },
                "blogPost": paginatedInsights.map((post) => ({
                  "@type": "BlogPosting",
                  "headline": post.title,
                  "alternativeHeadline": post.excerpt,
                  "genre": post.category,
                  "wordCount": "1200",
                  "url": `https://joyceca.in/insights/${post.slug}`,
                  "datePublished": new Date(post.date).toISOString().split('T')[0],
                  "author": {
                    "@type": "Person",
                    "name": post.author
                  }
                }))
              }
            ]
          }),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            Regulatory Bulletin
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-normal leading-tight text-brand-primary tracking-tight">
            Updates & Insights
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            Direct, technical commentary on corporate tax mandates, GST laws, audit rules, and compliance deadlines across India and the UAE.
          </p>
        </div>

        {/* Client filter controls */}
        <InsightsFilter categories={categories} activeCategory={category} />

        {/* Zero Results State */}
        {paginatedInsights.length === 0 && (
          <div className="bg-white border border-brand-border rounded-[32px] p-16 text-center shadow-soft mb-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-sans text-base font-semibold text-brand-primary">No articles match your search</h3>
            <p className="font-sans text-sm text-brand-secondary mt-1">
              Try adjusting your filters or checking your spelling.
            </p>
          </div>
        )}

        {/* Featured Article Layout */}
        {featuredArticle && (
          <div className="mb-12">
            <Link href={`/insights/${featuredArticle.slug}`} className="block group">
              <div className="bg-white border border-brand-border rounded-[32px] overflow-hidden shadow-soft transition-all duration-500 hover:shadow-glass hover:border-brand-primary/20 grid grid-cols-1 lg:grid-cols-12">
                
                {/* Text Section */}
                <div className="p-8 md:p-12 lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <span className="font-sans text-3xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full uppercase tracking-wider">
                        Featured - {featuredArticle.category}
                      </span>
                      <span className="font-mono text-3xs text-slate-400">
                        {featuredArticle.date}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-brand-primary leading-tight group-hover:text-brand-accent transition-colors duration-300 mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="font-sans text-sm md:text-base text-brand-secondary leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-brand-divider pt-6 mt-6">
                    <div className="flex items-center space-x-2.5 font-sans text-xs">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">{featuredArticle.readTime}</span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-300 flex items-center space-x-1">
                      <span>Read Full Analysis</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

                {/* Right Image Block */}
                <div className="hidden lg:block lg:col-span-5 relative bg-slate-100 min-h-[360px]">
                  <Image
                    src={`/images/services/${featuredArticle.slug.includes("uae") ? "uae-tax-documents.webp" : "audit-documents.webp"}`}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-w-1024px) 100vw, 400px"
                    className="object-cover grayscale-[30%] group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                </div>

              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {regularArticles.map((insight) => (
              <Link key={insight.slug} href={`/insights/${insight.slug}`} className="block group">
                <GlassCard className="flex flex-col justify-between p-8 md:p-10 bg-white min-h-[340px]" hoverLift={true}>
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-brand-divider">
                      <span className="font-sans text-3xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full uppercase tracking-wider">
                        {insight.category}
                      </span>
                      <span className="font-mono text-3xs text-slate-400">
                        {insight.date}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-normal text-brand-primary leading-tight group-hover:text-brand-accent transition-colors duration-300 mb-4">
                      {insight.title}
                    </h3>
                    <p className="font-sans text-sm text-brand-secondary leading-relaxed mb-6 line-clamp-3">
                      {insight.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-brand-divider">
                    <div className="flex items-center space-x-2 font-sans text-2xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{insight.readTime}</span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-300 flex items-center space-x-1">
                      <span>Read Article</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-6 border-t border-brand-divider pt-12">
            <Link
              href={getPageUrl(displayedPage - 1)}
              className={`inline-flex items-center space-x-2 font-sans text-sm font-medium transition-colors ${
                displayedPage <= 1 
                  ? "text-slate-300 pointer-events-none" 
                  : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Link>

            <span className="font-mono text-xs text-brand-secondary">
              Page {displayedPage} of {totalPages}
            </span>

            <Link
              href={getPageUrl(displayedPage + 1)}
              className={`inline-flex items-center space-x-2 font-sans text-sm font-medium transition-colors ${
                displayedPage >= totalPages 
                  ? "text-slate-300 pointer-events-none" 
                  : "text-brand-secondary hover:text-brand-primary"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
