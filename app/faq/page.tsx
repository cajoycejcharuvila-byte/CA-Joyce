import FAQPageClient from "./FAQPageClient";
import { getFAQs } from "@/lib/cms";
import { getDbCompanyInfo } from "@/lib/db";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Joyce J Charuvila & Associates",
  description: "Find answers to frequently asked questions about our audit, tax, and advisory services in India and the UAE.",
};

export const revalidate = 0; // Dynamic server rendering

export default async function FAQPage() {
  const allFaqs = getFAQs();
  const company = await getDbCompanyInfo();

  return (
    <FAQPageClient
      allFaqs={allFaqs}
      company={company}
    />
  );
}
