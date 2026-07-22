import {
  CompanyInfo,
  FounderInfo,
  ServiceItem,
  FAQItem,
  IndustryItem,
  CapabilityItem,
  SEOMetadata
} from "../types";

import companyJson from "../data/company.json";
import founderJson from "../data/founder.json";
import uaeServicesJson from "../data/services-uae.json";
import indiaServicesJson from "../data/services-india.json";
import faqJson from "../data/faq.json";
import seoJson from "../data/seo.json";
import industriesJson from "../data/industries.json";
import testimonialsJson from "../data/testimonials.json";
import insightsJson from "../data/insights.json";

export interface InsightItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  toc?: string[];
  faqs?: { question: string; answer: string; }[];
  related?: string[];
  tags?: string[];
}

export function getCompanyInfo(): CompanyInfo {
  return companyJson as CompanyInfo;
}

export function getFounderInfo(): FounderInfo {
  return founderJson as FounderInfo;
}

export function getUAEServices(): ServiceItem[] {
  return uaeServicesJson as ServiceItem[];
}

export function getIndiaServices(): ServiceItem[] {
  return indiaServicesJson as ServiceItem[];
}

export function getAllServices(): ServiceItem[] {
  return [...getUAEServices(), ...getIndiaServices()];
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return getAllServices().find((s) => s.slug === slug);
}

export function getFAQs(): FAQItem[] {
  return faqJson as FAQItem[];
}

export function getIndustries(): IndustryItem[] {
  return industriesJson as IndustryItem[];
}

export function getCapabilities(): CapabilityItem[] {
  return testimonialsJson as CapabilityItem[];
}

export function getInsights(): InsightItem[] {
  return insightsJson as InsightItem[];
}

export function getInsightBySlug(slug: string): InsightItem | undefined {
  return getInsights().find((i) => i.slug === slug);
}

export function getSEOMetadata(): SEOMetadata {
  return seoJson as SEOMetadata;
}

export function getPageMetadata(page: string) {
  const meta = getSEOMetadata();
  return meta[page] || meta.home;
}
