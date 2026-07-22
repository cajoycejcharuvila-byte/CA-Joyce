import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, MessageSquare, Share2 } from "lucide-react";
import { getDbInsightBySlug, getDbInsights, getDbCompanyInfo } from "@/lib/db";
import { generateMetadata as seoGenerateMetadata, getArticleSchema, getBreadcrumbSchema, getFAQPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const insights = await getDbInsights();
  return insights.map((insight) => ({
    slug: insight.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const insight = await getDbInsightBySlug(slug);

  if (!insight) {
    return {
      title: "Insight Not Found",
    };
  }

  const baseMetadata = seoGenerateMetadata({
    title: insight.title,
    description: insight.excerpt,
    path: `/insights/${slug}`,
    type: "article",
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      publishedTime: new Date(insight.date).toISOString(),
      authors: [insight.author],
      tags: [insight.category],
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = await getDbInsightBySlug(slug);
  const company = await getDbCompanyInfo();

  if (!insight) {
    notFound();
  }

  const allInsights = await getDbInsights();
  
  // Resolve related insights from mappings or fallbacks
  const relatedPromises = (insight.related || []).map((rSlug) => getDbInsightBySlug(rSlug));
  const resolvedRelated = await Promise.all(relatedPromises);
  const relatedInsights = resolvedRelated
    .filter((i): i is NonNullable<typeof i> => i !== null)
    .slice(0, 2);

  // If no mapped related articles, take fallbacks
  if (relatedInsights.length === 0) {
    const fallbacks = allInsights.filter((i) => i.slug !== slug).slice(0, 2);
    relatedInsights.push(...fallbacks);
  }

  const articleSchema = getArticleSchema({
    title: insight.title,
    excerpt: insight.excerpt,
    date: insight.date,
    author: insight.author,
    slug: insight.slug,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Updates & Insights", path: "/insights" },
    { name: insight.title, path: `/insights/${slug}` },
  ]);

  const faqSchema = insight.faqs && insight.faqs.length > 0 ? getFAQPageSchema(insight.faqs) : null;

  const articleUrl = `https://joyceca.in/insights/${slug}`;

  return (
    <div className="w-full bg-brand-bg py-12 md:py-20 text-left">
      
      {/* Dynamic SEO JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbSchema,
              articleSchema,
              ...(faqSchema ? [faqSchema] : [])
            ]
          }),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/insights"
            className="inline-flex items-center space-x-2 text-brand-secondary hover:text-brand-primary font-sans text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Insights</span>
          </Link>
        </div>

        {/* Content Layout Grid (8 cols content, 4 cols sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-brand-border rounded-[32px] p-8 md:p-12 shadow-soft">
            
            {/* Category & Date */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="font-sans text-3xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full uppercase tracking-wider">
                {insight.category}
              </span>
              <span className="font-mono text-3xs text-slate-400">
                {insight.date}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-brand-primary tracking-tight mb-8">
              {insight.title}
            </h1>

            {/* Author details */}
            <div className="flex flex-wrap items-center gap-6 font-sans text-xs text-slate-400 border-y border-brand-divider py-4 mb-10">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-brand-accent" />
                <span>{insight.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-brand-accent" />
                <span>{insight.readTime}</span>
              </div>
            </div>

            {/* Table of Contents Box */}
            {insight.toc && insight.toc.length > 0 && (
              <div className="bg-slate-50 border border-brand-border rounded-[20px] p-6 mb-10 text-left">
                <h3 className="font-sans text-xs font-semibold text-brand-primary uppercase tracking-widest mb-3">
                  Table of Contents
                </h3>
                <ul className="space-y-2 font-sans text-xs md:text-sm text-brand-secondary">
                  {insight.toc.map((heading, i) => (
                    <li key={i} className="hover:text-brand-primary transition-colors">
                      <span className="text-brand-accent font-semibold mr-1.5">—</span>
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content */}
            <article className="space-y-6 font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-12">
              {insight.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>

            {/* Contextual FAQs if present */}
            {insight.faqs && insight.faqs.length > 0 && (
              <div className="border-t border-brand-divider pt-10 mt-10">
                <h3 className="font-display text-2xl text-brand-primary font-normal mb-6">
                  Article FAQs
                </h3>
                <div className="space-y-4">
                  {insight.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50/50 border border-brand-border rounded-[18px] p-6">
                      <h4 className="font-sans text-sm font-semibold text-brand-primary mb-2">
                        {faq.question}
                      </h4>
                      <p className="font-sans text-xs md:text-sm text-brand-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share buttons */}
            <div className="flex items-center space-x-3 border-t border-brand-divider pt-8 mt-10">
              <span className="font-sans text-2xs text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </span>
              
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-slate-400 hover:text-[#0077B5] hover:border-[#0077B5] transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(insight.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"
                title="Share on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${insight.title} — ${articleUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                title="Share on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Sidebar CTA & Related (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-[130px]">
            
            {/* Contact CA */}
            <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-soft">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-2 block">
                Direct Inquiry
              </span>
              <h3 className="font-display text-2xl text-brand-primary font-normal mb-4">
                Consult CA
              </h3>
              <p className="font-sans text-xs text-brand-secondary leading-relaxed mb-6">
                Consult on {insight.category} deadlines and statutory compliance under local regulations.
              </p>
              
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20read%20your%20article%20on%20"${encodeURIComponent(insight.title)}"%20and%20require%20assistance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white py-3.5 rounded-[16px] font-sans text-sm font-medium transition-colors duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center space-x-2 border border-brand-border hover:border-brand-primary text-brand-primary py-3.5 rounded-[16px] font-sans text-sm font-medium transition-colors duration-300 bg-slate-50"
                >
                  <span>Request Callback</span>
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-soft">
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">
                Related Reading
              </h3>
              <div className="space-y-6">
                {relatedInsights.map((ri) => (
                  <Link key={ri.slug} href={`/insights/${ri.slug}`} className="block group">
                    <p className="font-mono text-3xs text-brand-accent uppercase tracking-wider mb-1.5">
                      {ri.category}
                    </p>
                    <p className="font-display text-lg text-brand-primary group-hover:text-brand-accent transition-colors duration-300 font-normal leading-snug">
                      {ri.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
