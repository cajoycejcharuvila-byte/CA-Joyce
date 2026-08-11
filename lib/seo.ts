import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://joyce-ca.vercel.app";

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
    "name": "JOYCE J CHARUVILA & ASSOCIATES",
    "alternateName": "Joyce J Charuvila & Associates, Chartered Accountants",
    "image": `${SITE_URL}/images/hero/hero-office.webp`,
    "logo": `${SITE_URL}/logo.png`,
    "url": SITE_URL,
    "telephone": "+919061680043",
    "email": "cajoycejcharuvilauae@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Joyce J Charuvila & Associates, Omalloor, Pathanamthitta",
      "addressLocality": "Omalloor, Pathanamthitta",
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
      {
        "@type": "AdministrativeArea",
        "name": "India"
      },
      {
        "@type": "AdministrativeArea",
        "name": "United Arab Emirates"
      }
    ],
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
      "addressLocality": "Omalloor, Pathanamthitta",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "serviceType": serviceTitle,
    "description": serviceDescription,
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "India"
      },
      {
        "@type": "AdministrativeArea",
        "name": "United Arab Emirates"
      }
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
