import HomePageClient from "./HomePageClient";
import { getDbCompanyInfo, getDbPageSettings, getDbInsights } from "@/lib/db";
import { getCapabilities, getFAQs } from "@/lib/cms";

export const revalidate = 300; // 5-minute Incremental Static Regeneration (sub-50ms TTFB)

export default async function HomePage() {
  const company = await getDbCompanyInfo();
  const homeSettings = await getDbPageSettings("home_settings");
  const aboutSettings = await getDbPageSettings("about_settings");
  const insights = await getDbInsights();
  const capabilities = getCapabilities();
  const faqs = getFAQs();

  return (
    <HomePageClient
      company={company}
      homeSettings={homeSettings}
      aboutSettings={aboutSettings}
      insights={insights}
      capabilities={capabilities}
      faqs={faqs}
    />
  );
}
