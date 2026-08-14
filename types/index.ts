export interface CompanyInfo {
  name: string;
  businessName: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  established: number;
  contact: {
    whatsapp: string;
    phoneDisplay: string;
    email: string;
    address: string;
    googleMapsLink: string;
    social: {
      linkedin: string;
      twitter: string;
      whatsappDirect: string;
    };
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  registrations: {
    frn: string;
    icaiMembership: string;
  };
}

export interface FounderInfo {
  name: string;
  credentials: string;
  title: string;
  summary: string;
  biography: string[];
  philosophy: {
    title: string;
    text: string;
  };
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
  expertise: string[];
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  overview: string;
  who_needs_this: string;
  scope_of_work: string[];
  process: string[];
  deliverables: string[];
  faq: ServiceFAQ[];
  meta_title: string;
  meta_description: string;
  image?: string;
  whatsapp_context?: string;
}

export interface IndustryItem {
  name: string;
  description: string;
  image?: string;
}

export interface CapabilityItem {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOPageData {
  title: string;
  description: string;
  keywords: string[];
}

export interface SEOMetadata {
  [page: string]: SEOPageData;
}

export interface Submission {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName?: string;
  serviceRequired: string;
  message: string;
  submittedAt: string;
}
