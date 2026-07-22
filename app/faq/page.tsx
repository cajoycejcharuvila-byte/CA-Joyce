import FAQPageClient from "./FAQPageClient";
import { getFAQs } from "@/lib/cms";
import { getDbCompanyInfo } from "@/lib/db";

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
