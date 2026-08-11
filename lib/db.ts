/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import { Submission, CompanyInfo } from "../types";
import { InsightItem } from "./cms";
import companyJson from "../data/company.json";
import insightsJson from "../data/insights.json";

// Initialise Database Client
let pool: Pool | null = null;

function getDbClient(): Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not configured.");
    }
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    });
    console.log("Database Driver: PostgreSQL Pool Initialized");
  }
  return pool;
}

// Query helper
export async function runQuery<T>(text: string, params: any[] = []): Promise<T[]> {
  const client = await getDbClient().connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

// ==========================================
// DISTRIBUTED CACHE LAYER (Vercel KV / Upstash Redis HTTP REST)
// ==========================================

async function runKvCommand(command: any[]): Promise<any> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return null; // Not configured
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(2000), // 2-second timeout
    });
    if (!res.ok) {
      console.warn(`KV Command failed: ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    return json.result;
  } catch (err) {
    console.warn("KV Cache error:", err);
    return null;
  }
}

async function kvGet(key: string): Promise<any> {
  const res = await runKvCommand(["get", key]);
  if (res && typeof res === "string") {
    try {
      return JSON.parse(res);
    } catch {
      return res;
    }
  }
  return res;
}

async function kvSet(key: string, value: any, ttlSeconds: number): Promise<void> {
  await runKvCommand(["set", key, JSON.stringify(value), "ex", ttlSeconds]);
}

async function kvDel(key: string): Promise<void> {
  await runKvCommand(["del", key]);
}

// ==========================================
// REQUEST DEDUPLICATION LAYER (Promise Pooling)
// ==========================================

const inFlightQueries = new Map<string, Promise<any>>();

async function runDeduplicatedQuery<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
  const existing = inFlightQueries.get(key);
  if (existing) {
    return existing;
  }

  const promise = queryFn().finally(() => {
    inFlightQueries.delete(key);
  });

  inFlightQueries.set(key, promise);
  return promise;
}

// ==========================================
// 1. ENQUIRIES DATABASE INTERFACE (STRICT WRITE)
// ==========================================

export async function getDbEnquiries(): Promise<Submission[]> {
  try {
    const rows = await runQuery<any>(
      "SELECT id, full_name as \"fullName\", email_address as \"emailAddress\", phone_number as \"phoneNumber\", company_name as \"companyName\", service_required as \"serviceRequired\", message, submitted_at as \"submittedAt\" FROM enquiries ORDER BY submitted_at DESC"
    );
    return rows;
  } catch (err) {
    console.warn("Database query failed for enquiries, returning empty list:", err);
    return [];
  }
}

export async function insertDbEnquiry(enquiry: Submission): Promise<boolean> {
  await runQuery(
    "INSERT INTO enquiries (id, full_name, email_address, phone_number, company_name, service_required, message, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      enquiry.id,
      enquiry.fullName,
      enquiry.emailAddress,
      enquiry.phoneNumber,
      enquiry.companyName || "",
      enquiry.serviceRequired,
      enquiry.message,
      enquiry.submittedAt
    ]
  );
  return true;
}

export async function deleteDbEnquiry(id: string): Promise<boolean> {
  await runQuery("DELETE FROM enquiries WHERE id = $1", [id]);
  return true;
}

// ==========================================
// 2. COMPANY SETTINGS INTERFACE (RESILIENT READ / STRICT WRITE)
// ==========================================

export async function getDbCompanyInfo(): Promise<CompanyInfo> {
  const cacheKey = "cache:company_settings";
  
  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      return cached as CompanyInfo;
    }
  } catch (err) {
    console.warn("KV Cache read error, trying DB:", err);
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>("SELECT value FROM company_settings WHERE key = 'main_settings'");
      if (rows.length === 0) {
        // If not in database, save default and return it
        await saveDbCompanyInfo(companyJson as CompanyInfo);
        return companyJson as CompanyInfo;
      }
      return rows[0].value as CompanyInfo;
    });
    return data;
  } catch (err) {
    console.warn("Database query failed for company settings, returning fallback JSON:", err);
    return companyJson as CompanyInfo;
  }
}

export async function saveDbCompanyInfo(data: CompanyInfo): Promise<boolean> {
  await runQuery(
    "INSERT INTO company_settings (key, value) VALUES ('main_settings', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [JSON.stringify(data)]
  );
  await kvDel("cache:company_settings");
  return true;
}

// ==========================================
// 3. INSIGHTS / BLOGS DATABASE INTERFACE (RESILIENT READ / STRICT WRITE)
// ==========================================

export async function getDbInsights(): Promise<InsightItem[]> {
  const cacheKey = "cache:insights";

  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      return cached as InsightItem[];
    }
  } catch (err) {
    console.warn("KV Cache read error, trying DB:", err);
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>(
        "SELECT slug, title, category, read_time as \"readTime\", date_published as \"date\", author, excerpt, toc, content, faqs, related, tags FROM insights"
      );
      if (rows.length === 0) {
        // Populate static insights if database is empty
        for (const insight of insightsJson) {
          await saveDbInsight(insight as any);
        }
        return insightsJson as InsightItem[];
      }
      const parsedRows = rows.map(r => ({
        ...r,
        toc: typeof r.toc === "string" ? JSON.parse(r.toc) : r.toc,
        content: typeof r.content === "string" ? JSON.parse(r.content) : r.content,
        faqs: typeof r.faqs === "string" ? JSON.parse(r.faqs) : r.faqs,
        related: typeof r.related === "string" ? JSON.parse(r.related) : r.related,
        tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
      }));
      await kvSet(cacheKey, parsedRows, 3600); // 1 hour TTL
      return parsedRows;
    });
    return data;
  } catch (err) {
    console.warn("Database query failed for insights, returning fallback JSON:", err);
    return insightsJson as InsightItem[];
  }
}

export async function saveDbInsight(insight: InsightItem): Promise<boolean> {
  await runQuery(
    `INSERT INTO insights (slug, title, category, read_time, date_published, author, excerpt, toc, content, faqs, related, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (slug) DO UPDATE SET 
       title = EXCLUDED.title,
       category = EXCLUDED.category,
       read_time = EXCLUDED.read_time,
       date_published = EXCLUDED.date_published,
       author = EXCLUDED.author,
       excerpt = EXCLUDED.excerpt,
       toc = EXCLUDED.toc,
       content = EXCLUDED.content,
       faqs = EXCLUDED.faqs,
       related = EXCLUDED.related,
       tags = EXCLUDED.tags`,
    [
      insight.slug,
      insight.title,
      insight.category,
      insight.readTime,
      insight.date,
      insight.author,
      insight.excerpt,
      JSON.stringify(insight.toc || []),
      JSON.stringify(insight.content || []),
      JSON.stringify(insight.faqs || []),
      JSON.stringify(insight.related || []),
      JSON.stringify(insight.tags || []),
    ]
  );
  await kvDel("cache:insights");
  return true;
}

export async function deleteDbInsight(slug: string): Promise<boolean> {
  await runQuery("DELETE FROM insights WHERE slug = $1", [slug]);
  await kvDel("cache:insights");
  return true;
}

export async function getDbInsightBySlug(slug: string): Promise<InsightItem | null> {
  const all = await getDbInsights();
  return all.find(item => item.slug === slug) || null;
}

// ==========================================
// 4. SESSIONS DATABASE INTERFACE (STRICT WRITE)
// ==========================================

const memorySessions = new Map<string, Date>();

export async function createDbSession(id: string, expiresAt: Date): Promise<boolean> {
  try {
    await runQuery(
      "INSERT INTO admin_sessions (id, expires_at) VALUES ($1, $2)",
      [id, expiresAt]
    );
  } catch (err) {
    console.warn("Database failed for createDbSession, falling back to memory session:", err);
    memorySessions.set(id, expiresAt);
  }
  return true;
}

export async function getDbSession(id: string): Promise<{ id: string; expiresAt: Date } | null> {
  try {
    const rows = await runQuery<any>("SELECT id, expires_at as \"expiresAt\" FROM admin_sessions WHERE id = $1", [id]);
    if (rows.length > 0) {
      return {
        id: rows[0].id,
        expiresAt: new Date(rows[0].expiresAt),
      };
    }
  } catch (err) {
    console.warn("Session retrieval failed, trying memory sessions:", err);
    const expiresAt = memorySessions.get(id);
    if (expiresAt) {
      return { id, expiresAt };
    }
  }
  return null;
}

export async function updateDbSessionExpiry(id: string, expiresAt: Date): Promise<boolean> {
  try {
    await runQuery("UPDATE admin_sessions SET expires_at = $1 WHERE id = $2", [expiresAt, id]);
  } catch (err) {
    console.warn("Database updateDbSessionExpiry failed:", err);
  }
  if (memorySessions.has(id)) {
    memorySessions.set(id, expiresAt);
  }
  return true;
}

export async function deleteDbSession(id: string): Promise<boolean> {
  try {
    await runQuery("DELETE FROM admin_sessions WHERE id = $1", [id]);
  } catch (err) {
    console.warn("Database deleteDbSession failed:", err);
  }
  memorySessions.delete(id);
  return true;
}

// ==========================================
// 5. PAGE SETTINGS DATABASE INTERFACE (RESILIENT READ / STRICT WRITE)
// ==========================================

export async function getDbPageSettings(pageKey: string): Promise<any> {
  const cacheKey = `cache:page_settings:${pageKey}`;

  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      return cached;
    }
  } catch (err) {
    console.warn(`KV Cache read error for page settings ${pageKey}:`, err);
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>("SELECT value FROM company_settings WHERE key = $1", [pageKey]);
      if (rows.length === 0) {
        // Return default values based on pageKey
        let defaultVal: any = {};
        if (pageKey === "home_settings") {
          defaultVal = {
            heroTitle: "JOYCE J CHARUVILA & ASSOCIATES",
            heroSubtitle: "Professional accounting, audit, taxation and advisory services for businesses and individuals in India and the United Arab Emirates.",
            heroImage: "/images/hero/hero-office.webp",
            objectiveText: "Providing businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters, with equal familiarity in both Indian and UAE compliance requirements. We prioritize technical precision, responsive service, and straightforward client communication."
          };
        } else if (pageKey === "about_settings") {
          defaultVal = {
            heading: "CA Joyce J Charuvila, MCom, ACA, CMA Final",
            bioParagraphs: [
              "CA Joyce J Charuvila, is an associate Chartered Accountant with over nine years of professional experience in auditing, accounting, taxation, and financial reporting. Experience gained through assignments in India and the UAE has provided extensive exposure across multiple industries and regulatory environments.",
              "His professional background covers responsibilities in statutory audit reviews, internal control audits, tax filings, and management accounting across manufacturing, construction, logistics, and retail business sectors."
            ],
            portraitImage: "/images/founder/portrait.webp"
          };
        } else if (pageKey === "founder_settings") {
          defaultVal = {
            credentials: "MCom, ACA, CMA Final",
            biography: [
              "CA Joyce J Charuvila, MCom, ACA, CMA Final, is an associate Chartered Accountant with over nine years of professional experience in auditing, accounting, taxation, and financial reporting. Experience gained through assignments in India and the UAE has provided extensive exposure across multiple industries and regulatory environments.",
              "Professional expertise was developed through leadership and advisory roles including Auditor and Financial Controller. This includes responsibilities in Audit, Financial Control, Tax Compliance, and Advisory assignments across both Indian and Middle Eastern markets.",
              "Our practice is built on a foundation of precision, technical competence, and clear, practical communication. We assist clients in navigating their statutory compliance obligations while maintaining standard financial reporting systems."
            ],
            timeline: [
              {
                year: "2017",
                title: "Entering The Profession",
                description: "Engaged in statutory auditing and tax compliance assignments for corporate entities in India."
              },
              {
                year: "2022",
                title: "UAE Corporate Tax & VAT Specialization",
                description: "Expanded operations to the UAE, managing corporate accounting, VAT filings, and advisory roles in Dubai and Abu Dhabi."
              },
              {
                year: "2024",
                title: "Senior Financial Controller Roles",
                description: "Led audit reviews, internal controls audit, and financial control operations across trading, construction, and service sectors."
              },
              {
                year: "2026",
                title: "Established Independent Firm",
                description: "Founded Joyce J Charuvila & Associates in Pathanamthitta, Kerala, to provide cross-border tax, audit, and advisory services."
              }
            ],
            portraitImage: "/images/founder/portrait.webp",
            philosophyText: "Providing businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters, with equal familiarity in both Indian and UAE compliance requirements. We prioritize technical precision, responsive service, and straightforward client communication."
          };
        }
        await saveDbPageSettings(pageKey, defaultVal);
        return defaultVal;
      }
      return rows[0].value;
    });
    return data;
  } catch (err) {
    console.warn(`Database query failed for page settings ${pageKey}, returning local defaults:`, err);
    // Return hardcoded defaults as final fallback
    if (pageKey === "home_settings") {
      return {
        heroTitle: "JOYCE J CHARUVILA & ASSOCIATES",
        heroSubtitle: "Professional accounting, audit, taxation and advisory services for businesses and individuals in India and the United Arab Emirates.",
        heroImage: "/images/hero/hero-office.webp",
        objectiveText: "Providing businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters, with equal familiarity in both Indian and UAE compliance requirements. We prioritize technical precision, responsive service, and straightforward client communication."
      };
    } else if (pageKey === "about_settings") {
      return {
        heading: "CA Joyce J Charuvila, MCom, ACA, CMA Final",
        bioParagraphs: [
          "CA Joyce J Charuvila, is an associate Chartered Accountant with over nine years of professional experience in auditing, accounting, taxation, and financial reporting. Experience gained through assignments in India and the UAE has provided extensive exposure across multiple industries and regulatory environments.",
          "His professional background covers responsibilities in statutory audit reviews, internal control audits, tax filings, and management accounting across manufacturing, construction, logistics, and retail business sectors."
        ],
        portraitImage: "/images/founder/portrait.webp"
      };
    } else if (pageKey === "founder_settings") {
      return {
        credentials: "MCom, ACA, CMA Final",
        biography: [
          "CA Joyce J Charuvila, MCom, ACA, CMA Final, is an associate Chartered Accountant with over nine years of professional experience in auditing, accounting, taxation, and financial reporting. Experience gained through assignments in India and the UAE has provided extensive exposure across multiple industries and regulatory environments.",
          "Professional expertise was developed through leadership and advisory roles including Auditor and Financial Controller. This includes responsibilities in Audit, Financial Control, Tax Compliance, and Advisory assignments across both Indian and Middle Eastern markets.",
          "Our practice is built on a foundation of precision, technical competence, and clear, practical communication. We assist clients in navigating their statutory compliance obligations while maintaining standard financial reporting systems."
        ],
        timeline: [
          {
            year: "2017",
            title: "Entering The Profession",
            description: "Engaged in statutory auditing and tax compliance assignments for corporate entities in India."
          },
          {
            year: "2022",
            title: "UAE Corporate Tax & VAT Specialization",
            description: "Expanded operations to the UAE, managing corporate accounting, VAT filings, and advisory roles in Dubai and Abu Dhabi."
          },
          {
            year: "2024",
            title: "Senior Financial Controller Roles",
            description: "Led audit reviews, internal controls audit, and financial control operations across trading, construction, and service sectors."
          },
          {
            year: "2026",
            title: "Established Independent Firm",
            description: "Founded Joyce J Charuvila & Associates in Pathanamthitta, Kerala, to provide cross-border tax, audit, and advisory services."
          }
        ],
        portraitImage: "/images/founder/portrait.webp",
        philosophyText: "Providing businesses and individuals with clear professional guidance in accounting, taxation, and regulatory matters, with equal familiarity in both Indian and UAE compliance requirements. We prioritize technical precision, responsive service, and straightforward client communication."
      };
    }
    return {};
  }
}

export async function saveDbPageSettings(pageKey: string, value: any): Promise<boolean> {
  await runQuery(
    "INSERT INTO company_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [pageKey, JSON.stringify(value)]
  );
  await kvDel(`cache:page_settings:${pageKey}`);
  return true;
}
