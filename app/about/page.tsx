import AboutPageClient from "./AboutPageClient";
import { getDbPageSettings } from "@/lib/db";
import { getFounderInfo } from "@/lib/cms";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Joyce J Charuvila & Associates",
  description: "Learn about Joyce J Charuvila & Associates, our mission, values, and our commitment to delivering financial excellence across India and the UAE.",
};

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
