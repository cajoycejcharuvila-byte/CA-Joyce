import ContactPageClient from "./ContactPageClient";
import { getDbCompanyInfo } from "@/lib/db";
import { getAllServices } from "@/lib/cms";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Joyce J Charuvila & Associates",
  description: "Get in touch with Joyce J Charuvila & Associates for your audit, tax, and advisory needs in India and the UAE.",
};

export const revalidate = 0; // Dynamic server rendering

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
