import { generateMetadata as seoGenerateMetadata } from "@/lib/seo";
import IndiaServicesPageClient from "./IndiaServicesPageClient";

export async function generateMetadata() {
  return seoGenerateMetadata({
    title: "India Chartered Accountancy & Tax Compliance Services",
    description: "Professional statutory audits, GST filing, income tax consulting, concurrent audits, and business advisory services in India.",
    path: "/services/india",
    type: "website",
  });
}

export default function IndiaServicesPage() {
  return <IndiaServicesPageClient />;
}
