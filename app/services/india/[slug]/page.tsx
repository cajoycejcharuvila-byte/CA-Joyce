import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MessageSquare, PhoneCall, HelpCircle, CheckCircle2 } from "lucide-react";
import { getServiceBySlug, getIndiaServices, getCompanyInfo } from "@/lib/cms";
import { generateMetadata as seoGenerateMetadata, getProfessionalServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import SEOAuthorityLinks from "@/components/layout/SEOAuthorityLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = getIndiaServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return seoGenerateMetadata({
    title: service.meta_title,
    description: service.meta_description,
    path: `/services/india/${slug}`,
    type: "website",
  });
}

export default async function IndiaServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const company = getCompanyInfo();

  if (!service) {
    notFound();
  }

  const serviceSchema = getProfessionalServiceSchema(
    service.title,
    service.overview,
    `/services/india/${slug}`
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "India Services", path: "/services/india" },
    { name: service.title.replace(" (India)", ""), path: `/services/india/${slug}` },
  ]);

  const faqSchema = service.faq && service.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faq.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  const allIndia = getIndiaServices();
  const currentIndex = allIndia.findIndex((s) => s.slug === slug);
  
  const prevService = allIndia[currentIndex === 0 ? allIndia.length - 1 : currentIndex - 1];
  const nextService = allIndia[currentIndex === allIndia.length - 1 ? 0 : currentIndex + 1];

  const relatedServices = allIndia
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <div className="w-full bg-brand-bg py-12 md:py-20 relative">
      {/* Dynamic SEO JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              serviceSchema,
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : [])
            ]
          }),
        }}
      />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/services/india"
            className="inline-flex items-center space-x-2 text-brand-secondary hover:text-brand-primary font-sans text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>India Services</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-12">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
            India Regulatory Compliance
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-normal leading-tight text-brand-primary tracking-tight">
            {service.title.replace(" (India)", "")}
          </h1>
          <p className="font-sans text-brand-secondary text-base md:text-lg mt-6 leading-relaxed">
            {service.overview}
          </p>
        </div>

        {/* Featured Service Image Banner */}
        {service.image && (
          <div className="w-full relative h-[320px] md:h-[450px] rounded-[32px] overflow-hidden mb-16 shadow-soft border border-brand-border">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Main Info Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Overview & Who Requires This */}
            <div className="bg-white border border-brand-border rounded-[32px] p-8 md:p-12 shadow-soft">
              <h2 className="font-display text-3xl text-brand-primary font-normal mb-6">
                Who Requires This Service
              </h2>
              <p className="font-sans text-brand-secondary text-sm md:text-base leading-relaxed mb-8">
                {service.who_needs_this}
              </p>

              <h2 className="font-display text-3xl text-brand-primary font-normal mb-6 pt-4 border-t border-brand-divider">
                Scope of Professional Assistance
              </h2>
              <ul className="space-y-4 font-sans text-sm text-brand-secondary">
                {service.scope_of_work.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Timeline */}
            <div className="bg-brand-dark text-white rounded-[32px] p-8 md:p-12 shadow-glass grain-bg">
              <h2 className="font-display text-3xl text-white font-normal mb-8">
                Process Timeline
              </h2>
              <div className="relative border-l border-slate-800 ml-3 space-y-8">
                {service.process.map((step, idx) => {
                  const [title, desc] = step.split(": ");
                  return (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 -translate-x-[21px] w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs text-brand-accent font-bold">
                        0{idx + 1}
                      </div>
                      <h3 className="font-sans text-sm font-semibold text-white mb-2 pt-1">{title}</h3>
                      <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQs */}
            {service.faq && service.faq.length > 0 && (
              <div>
                <h2 className="font-display text-3xl text-brand-primary font-normal mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faq.map((item, idx) => (
                    <div key={idx} className="bg-white border border-brand-border rounded-[24px] p-6 shadow-soft">
                      <h3 className="font-sans text-sm font-semibold text-brand-primary flex items-start space-x-2.5 mb-3">
                        <HelpCircle className="w-4.5 h-4.5 text-brand-accent mt-0.5 shrink-0" />
                        <span>{item.question}</span>
                      </h3>
                      <p className="font-sans text-sm text-brand-secondary pl-7 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Authority Internal Links */}
            <SEOAuthorityLinks slug={slug} />

          </div>

          {/* Sidebar CTA Cards (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-[130px]">
            {/* Consultation Card */}
            <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-soft">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-2 block">
                Direct Contact
              </span>
              <h3 className="font-display text-2xl text-brand-primary font-normal mb-4">
                Consult CA
              </h3>
              <p className="font-sans text-xs text-brand-secondary leading-relaxed mb-6">
                Connect with our Pathanamthitta office to manage documents, filing deadlines, and registrations under Indian statutes.
              </p>
              
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20would%20like%20to%20consult%20about%20your%20Indian%20service:%20${encodeURIComponent(service.title)}`}
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
                  <PhoneCall className="w-4 h-4 text-brand-accent" />
                  <span>Request Callback</span>
                </Link>
              </div>
            </div>

            {/* Related Services */}
            <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-soft">
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">
                Other India Services
              </h3>
              <div className="space-y-4">
                {relatedServices.map((rs) => (
                  <Link
                    key={rs.slug}
                    href={`/services/india/${rs.slug}`}
                    className="block group"
                  >
                    <p className="font-display text-lg text-brand-primary group-hover:text-brand-accent transition-colors duration-300 font-normal leading-snug">
                      {rs.title.replace(" (India)", "")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>

        {/* Page Sibling Pagination Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-brand-divider mb-12">
          <Link
            href={`/services/india/${prevService.slug}`}
            className="group flex flex-col items-start p-8 bg-white border border-brand-border rounded-[24px] hover:border-brand-primary transition-all duration-300"
          >
            <span className="font-sans text-xs text-slate-400 font-medium flex items-center space-x-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Service</span>
            </span>
            <span className="font-display text-xl text-brand-primary font-normal group-hover:text-brand-accent transition-colors duration-300">
              {prevService.title.replace(" (India)", "")}
            </span>
          </Link>

          <Link
            href={`/services/india/${nextService.slug}`}
            className="group flex flex-col items-end p-8 bg-white border border-brand-border rounded-[24px] hover:border-brand-primary transition-all duration-300 text-right"
          >
            <span className="font-sans text-xs text-slate-400 font-medium flex items-center space-x-1 mb-2">
              <span>Next Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="font-display text-xl text-brand-primary font-normal group-hover:text-brand-accent transition-colors duration-300">
              {nextService.title.replace(" (India)", "")}
            </span>
          </Link>
        </div>

      </div>

      {/* Sticky Mobile Enquiry Button */}
      <div className="fixed bottom-6 left-6 right-6 z-40 lg:hidden">
        <a
          href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20would%20like%20to%20consult%20about%20${encodeURIComponent(service.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-primary text-white py-4 rounded-[18px] font-sans font-medium shadow-glass transition-transform duration-300"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Enquire About {service.title.split(" (")[0]}</span>
        </a>
      </div>

    </div>
  );
}
