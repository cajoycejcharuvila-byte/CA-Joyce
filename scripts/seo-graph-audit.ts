import fs from "fs";
import path from "path";
import { SEO_GRAPH } from "../lib/seoGraph";

console.log("Starting SEO Graph Soft Audit...");

const indiaServices = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "services-india.json"), "utf8")
) as { slug: string }[];
const uaeServices = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "services-uae.json"), "utf8")
) as { slug: string }[];

const allSlugs = [
  ...indiaServices.map((s) => s.slug),
  ...uaeServices.map((s) => s.slug),
];

let warnings = 0;

for (const slug of allSlugs) {
  const node = SEO_GRAPH[slug];
  if (!node) {
    console.warn(`[WARNING] Service "${slug}" is missing from SEO_GRAPH.`);
    warnings++;
    continue;
  }

  if (!node.cluster) {
    console.warn(`[WARNING] Route "${slug}" is missing a cluster assignment.`);
    warnings++;
  }

  if (!node.primary || !node.primary.name || !node.primary.path) {
    console.warn(`[WARNING] Route "${slug}" is missing a PRIMARY link.`);
    warnings++;
  }

  if (!node.secondary || node.secondary.length < 2) {
    console.warn(`[WARNING] Route "${slug}" has fewer than 2 SECONDARY links (${node.secondary?.length || 0} found).`);
    warnings++;
  }

  if (!node.contextual || node.contextual.length < 2) {
    console.warn(`[WARNING] Route "${slug}" has fewer than 2 CONTEXTUAL links (${node.contextual?.length || 0} found).`);
    warnings++;
  }

  if (!node.canonical) {
    console.warn(`[WARNING] Route "${slug}" is missing a canonical URL.`);
    warnings++;
  }
}

if (warnings > 0) {
  console.warn(`\n[SEO AUDIT] Completed with ${warnings} warnings. Build will proceed.\n`);
} else {
  console.log("\n[SEO AUDIT] Completed successfully with zero warnings!\n");
}

process.exit(0);
