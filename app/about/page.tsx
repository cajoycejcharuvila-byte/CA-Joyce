import AboutPageClient from "./AboutPageClient";
import { getDbPageSettings } from "@/lib/db";
import { getFounderInfo } from "@/lib/cms";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Joyce J Charuvila & Associates",
  description: "About Joyce J Charuvila & Associates, Chartered Accountants based in Omalloor, Pathanamthitta. Independent practice handling statutory audits, taxation, and financial compliance in India and the UAE.",
};

export const revalidate = 300; // 5-minute Incremental Static Regeneration

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
