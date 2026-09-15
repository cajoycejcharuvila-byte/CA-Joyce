import FAQPageClient from "./FAQPageClient";
import { getFAQs } from "@/lib/cms";
import { getDbCompanyInfo } from "@/lib/db";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Joyce J Charuvila & Associates",
  description: "Frequently asked questions regarding Indian statutory audits, GST, Income Tax filing, and UAE Corporate Tax and VAT compliance.",
};

export const revalidate = 300; // 5-minute Incremental Static Regeneration

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
