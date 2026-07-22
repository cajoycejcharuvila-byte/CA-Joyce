import ContactPageClient from "./ContactPageClient";
import { getDbCompanyInfo } from "@/lib/db";
import { getAllServices } from "@/lib/cms";

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
