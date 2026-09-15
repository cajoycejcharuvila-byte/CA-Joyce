import ContactPageClient from "./ContactPageClient";
import { getDbCompanyInfo } from "@/lib/db";
import { getAllServices } from "@/lib/cms";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Joyce J Charuvila & Associates",
  description: "Contact CA Joyce J Charuvila & Associates in Omalloor, Pathanamthitta, Kerala. Discuss statutory audits, Indian tax filings, or UAE Corporate Tax and VAT requirements.",
};

export const revalidate = 300; // 5-minute Incremental Static Regeneration

export default async function ContactPage() {
  const company = await getDbCompanyInfo();
  const services = getAllServices();

  return (
    <ContactPageClient
      company={company}
      services={services}
    />
  );
}
