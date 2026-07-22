import AboutPageClient from "./AboutPageClient";
import { getDbPageSettings } from "@/lib/db";
import { getFounderInfo } from "@/lib/cms";

export const revalidate = 0; // Dynamic server rendering

export default async function AboutPage() {
  const aboutSettings = await getDbPageSettings("about_settings");
  const founderInfo = getFounderInfo();

  return (
    <AboutPageClient
      aboutSettings={aboutSettings}
      founderInfo={founderInfo}
    />
  );
}
