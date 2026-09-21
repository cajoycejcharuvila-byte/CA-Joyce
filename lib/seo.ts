import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cajoyce.com";

interface MetadataInput {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  type?: "website" | "article";
}

// 1. Dynamic Metadata Generator
export function generateMetadata({
  title,
  description,
  keywords = [],
  path,
  ogImage = "/logo.png",
  type = "website",
}: MetadataInput): Metadata {
  const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  
  return {
    title: `${title} | JOYCE J CHARUVILA & ASSOCIATES`,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      title: `${title} | JOYCE J CHARUVILA & ASSOCIATES`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      siteName: "JOYCE J CHARUVILA & ASSOCIATES",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | JOYCE J CHARUVILA & ASSOCIATES`,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

// 2. LocalBusiness Schema
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#firm`,
    "name": "CA JOYCE J CHARUVILA & ASSOCIATES",
    "alternateName": [
      "CA Joyce",
      "CA Joyce J Charuvila",
      "Joyce CA",
      "CA Joyce Charuvila & Associates",
      "Joyce J Charuvila & Associates, Chartered Accountants"
    ],
    "founder": {
      "@type": "Person",
      "name": "CA Joyce J Charuvila",
      "jobTitle": "Chartered Accountant & Founder",
      "url": `${SITE_URL}/founder`
    },
    "image": `${SITE_URL}/images/hero/hero-office.webp`,
    "logo": `${SITE_URL}/logo.png`,
    "url": SITE_URL,
    "telephone": "+919061680043",
    "email": "cajoycejcharuvilauae@gmail.com",
    "description": "Chartered Accountant in Pathanamthitta & Omalloor, Kerala. Providing statutory audit, tax audit, GST filing, Income Tax filing, accounting, and UAE Corporate Tax compliance.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Joyce J Charuvila & Associates, Omalloor, Pathanamthitta",
      "addressLocality": "Omalloor",
      "addressRegion": "Kerala",
      "postalCode": "689645",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.2648",
      "longitude": "76.7870"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:30"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Pathanamthitta" },
      { "@type": "City", "name": "Omalloor" },
      { "@type": "City", "name": "Adoor" },
      { "@type": "City", "name": "Thiruvalla" },
      { "@type": "City", "name": "Kozhencherry" },
      { "@type": "AdministrativeArea", "name": "Kerala" },
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United Arab Emirates" }
    ],
    "knowsAbout": [
      "Chartered Accountant in Pathanamthitta",
      "Chartered Accountant in Omalloor",
      "GST Filing in Pathanamthitta",
      "Income Tax Filing in Pathanamthitta",
      "Auditor in Pathanamthitta",
      "CA Firm in Omalloor",
      "Statutory Audit",
      "Tax Audit under Section 44AB",
      "Internal Audit & Risk Advisory",
      "UAE Corporate Tax & VAT Compliance",
      "NRI Taxation & Cross-Border Advisory",
      "Company Registration & Financial Reporting"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Audit & Financial Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Statutory & Tax Audit in Pathanamthitta",
            "description": "Comprehensive audit services ensuring statutory compliance and financial accuracy for businesses in Pathanamthitta and Kerala."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "GST Registration & Return Filing",
            "description": "Timely GST registration, monthly GSTR-1, GSTR-3B filings, and annual returns for enterprises."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Income Tax Return (ITR) Filing & Advisory",
            "description": "Strategic tax planning, ITR filing for individuals, firms, companies, and NRI clients."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "UAE Corporate Tax & VAT Advisory",
            "description": "FTA registration, UAE corporate tax return filing, and VAT compliance for UAE businesses and NRIs."
          }
        }
      ]
    },
    "priceRange": "$$"
  };
}

// 3. ProfessionalService Schema (Contextual for services pages)
export function getProfessionalServiceSchema(serviceTitle: string, serviceDescription: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}${path}#service`,
    "name": "JOYCE J CHARUVILA & ASSOCIATES",
    "image": `${SITE_URL}/images/services/audit-documents.webp`,
    "url": SITE_URL,
    "telephone": "+919061680043",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Joyce J Charuvila & Associates, Omalloor, Pathanamthitta",
      "addressLocality": "Omalloor",
      "addressRegion": "Kerala",
      "postalCode": "689645",
      "addressCountry": "IN"
    },
    "serviceType": serviceTitle,
    "description": serviceDescription,
    "areaServed": [
      { "@type": "City", "name": "Pathanamthitta" },
      { "@type": "City", "name": "Omalloor" },
      { "@type": "City", "name": "Adoor" },
      { "@type": "City", "name": "Thiruvalla" },
      { "@type": "City", "name": "Kozhencherry" },
      { "@type": "AdministrativeArea", "name": "Kerala" },
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United Arab Emirates" }
    ]
  };
}

// 4. Person Schema (Founder Biography)
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/founder#person`,
    "name": "CA Joyce J Charuvila",
    "jobTitle": "Chartered Accountant & Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "JOYCE J CHARUVILA & ASSOCIATES"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Mahatma Gandhi University"
    },
    "nationality": "Indian",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pathanamthitta",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "description": "Chartered Accountant with over nine years of professional experience in auditing, accounting, financial reporting, and taxation across India and the United Arab Emirates."
  };
}

// 5. FAQPage Schema
export function getFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };
}

// 6. Article Schema
export function getArticleSchema(article: {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/insights/${article.slug}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": new Date(article.date).toISOString().split("T")[0],
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "JOYCE J CHARUVILA & ASSOCIATES",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    }
  };
}

// 7. Breadcrumb Schema
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`
    }))
  };
}
