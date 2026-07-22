/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, saveDbInsight } from "@/lib/db";
import { InsightItem } from "@/lib/cms";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return false;

  const session = await getDbSession(sessionId);
  if (!session) return false;

  return Date.now() <= session.expiresAt.getTime();
}

export async function POST() {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = [
      { tag: "finance", label: "Finance" },
      { tag: "accounting", label: "Accounting" },
      { tag: "business", label: "Business" },
    ];

    let fetchedCount = 0;
    const errors: string[] = [];

    for (const cat of categories) {
      try {
        const response = await fetch(
          `https://dev.to/api/articles?tag=${cat.tag}&per_page=3`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            signal: AbortSignal.timeout(6000), // 6-second timeout per category
          }
        );

        if (!response.ok) {
          errors.push(`Failed to fetch tag ${cat.tag}: ${response.statusText}`);
          continue;
        }

        const articles = await response.json();
        if (Array.isArray(articles)) {
          for (const art of articles) {
            const dateStr = new Date(art.published_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const insight: InsightItem = {
              slug: `${art.slug}-${art.id}`,
              title: art.title,
              category: cat.label,
              readTime: `${art.reading_time_minutes || 5} min read`,
              date: dateStr,
              author: art.user?.name || "Dev.to Contributor",
              excerpt: art.description || "Latest industry updates and analysis.",
              content: [
                art.description || "",
                "This insight was automatically curated from the professional community. Keeping up-to-date with dynamic regulatory and global changes requires following industry-wide insights and active discussions.",
                `Link to original publication: ${art.url}`,
              ],
              toc: [],
              faqs: [],
              related: [],
              tags: art.tag_list || [],
            };

            await saveDbInsight(insight);
            fetchedCount++;
          }
        }
      } catch (catErr: any) {
        console.warn(`Error fetching dev.to category ${cat.tag}:`, catErr);
        errors.push(`Error for ${cat.tag}: ${catErr.message || catErr}`);
      }
    }

    return NextResponse.json({
      success: true,
      fetched: fetchedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("API error fetching insights from dev.to:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
