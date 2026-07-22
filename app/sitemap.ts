import { MetadataRoute } from "next";
import { getAllServices, getInsights } from "@/lib/cms";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joyce-ca.vercel.app";

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
  const services = getAllServices().map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
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

  return [...staticRoutes, ...services, ...insights];
}
