import { MetadataRoute } from "next";
import { getIndiaServices, getUAEServices, getInsights } from "@/lib/cms";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ca-joyce-lu8v.vercel.app";

  // Static routes
  const staticRoutes = ["", "/about", "/founder", "/services", "/insights", "/contact"].map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })
  );

  // Dynamic services
  const uaeServices = getUAEServices().map((service) => ({
    url: `${siteUrl}/services/uae/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const indiaServices = getIndiaServices().map((service) => ({
    url: `${siteUrl}/services/india/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic insights
  const insights = getInsights().map((insight) => ({
    url: `${siteUrl}/insights/${insight.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...uaeServices, ...indiaServices, ...insights];
}
