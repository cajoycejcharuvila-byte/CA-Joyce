import { generateMetadata as seoGenerateMetadata } from "@/lib/seo";
import UAEServicesPageClient from "./UAEServicesPageClient";

export async function generateMetadata() {
  return seoGenerateMetadata({
    title: "UAE Corporate Tax & VAT Compliance Services",
    description: "Outsourced bookkeeping, VAT registrations, corporate tax filing, and FTA compliance auditing for UAE Mainland and Free Zone companies.",
    path: "/services/uae",
    type: "website",
  });
}

export default function UAEServicesPage() {
  return <UAEServicesPageClient />;
}
