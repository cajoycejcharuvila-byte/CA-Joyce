import Link from "next/link";
import { SEO_GRAPH } from "@/lib/seoGraph";
import { ArrowRight, HelpCircle, FileText, CheckSquare } from "lucide-react";

export default function SEOAuthorityLinks({ slug }: { slug: string }) {
  const seoNode = SEO_GRAPH[slug];

  if (!seoNode) return null;

  return (
    <div className="w-full bg-slate-50 border border-brand-border rounded-[32px] p-8 md:p-10 shadow-soft mt-12 mb-8 text-left">
      <div className="border-b border-brand-divider pb-4 mb-6">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold mb-1.5 block">
          Compliance Architecture
        </span>
        <h4 className="font-display text-2xl text-brand-primary font-normal">
          {seoNode.cluster} Authority Node
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Primary Link (Conversion) */}
        <div className="space-y-3">
          <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Primary Action
          </span>
          <div className="p-4 bg-white border border-brand-border rounded-[20px]">
            <Link
              href={seoNode.primary.path}
              className="group inline-flex items-center space-x-1.5 font-sans text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-brand-accent shrink-0" />
              <span>{seoNode.primary.name}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Secondary Links (Supporting Authority Articles) */}
        <div className="space-y-3">
          <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Supporting Publications
          </span>
          <div className="space-y-2">
            {seoNode.secondary.map((sec, i) => (
              <div key={i} className="p-3.5 bg-white border border-brand-border rounded-[16px]">
                <Link
                  href={sec.path}
                  className="group inline-flex items-start space-x-1.5 font-sans text-xs font-medium text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-accent mt-0.5 shrink-0" />
                  <span className="leading-snug">{sec.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Contextual Links (Sibling Services) */}
        <div className="space-y-3">
          <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Related Compliance
          </span>
          <div className="space-y-2">
            {seoNode.contextual.map((ctx, i) => (
              <div key={i} className="p-3.5 bg-white border border-brand-border rounded-[16px]">
                <Link
                  href={ctx.path}
                  className="group inline-flex items-start space-x-1.5 font-sans text-xs font-medium text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-brand-accent mt-0.5 shrink-0" />
                  <span className="leading-snug">{ctx.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
