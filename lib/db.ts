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

// Query helper with aggressive timeout to prevent SSR stalling
export async function runQuery<T>(text: string, params: any[] = []): Promise<T[]> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Database query timed out (800ms limit)")), 800)
  );

  const queryPromise = (async () => {
    const client = await getDbClient().connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  })();

  return Promise.race([queryPromise, timeoutPromise]);
}

// ==========================================
// IN-MEMORY FAST CACHE (Sub-millisecond reads)
// ==========================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}
const memoryCache = new Map<string, CacheEntry<any>>();

export function getMemoryCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value as T;
  }
  return null;
}

export function setMemoryCache<T>(key: string, value: T, ttlSeconds: number = 300): void {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function delMemoryCache(key: string): void {
  memoryCache.delete(key);
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
      signal: AbortSignal.timeout(1000), // 1-second timeout
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.result;
  } catch {
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
  
  const memoryCached = getMemoryCache<CompanyInfo>(cacheKey);
  if (memoryCached) {
    return memoryCached;
  }

  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      setMemoryCache(cacheKey, cached, 300);
      return cached as CompanyInfo;
    }
  } catch {
    // KV read fallback
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>("SELECT value FROM company_settings WHERE key = 'main_settings'");
      if (rows.length === 0) {
        setMemoryCache(cacheKey, companyJson as CompanyInfo, 300);
        return companyJson as CompanyInfo;
      }
      const val = rows[0].value as CompanyInfo;
      setMemoryCache(cacheKey, val, 300);
      return val;
    });
    return data;
  } catch {
    setMemoryCache(cacheKey, companyJson as CompanyInfo, 300);
    return companyJson as CompanyInfo;
  }
}

export async function saveDbCompanyInfo(data: CompanyInfo): Promise<boolean> {
  setMemoryCache("cache:company_settings", data, 300);
  try {
    await runQuery(
      "INSERT INTO company_settings (key, value) VALUES ('main_settings', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [JSON.stringify(data)]
    );
  } catch (err) {
    console.warn("Database write skipped/failed for company settings:", err);
  }
  await kvDel("cache:company_settings");
  return true;
}

// ==========================================
// 3. INSIGHTS / BLOGS DATABASE INTERFACE (RESILIENT READ / STRICT WRITE)
// ==========================================

export async function getDbInsights(): Promise<InsightItem[]> {
  const cacheKey = "cache:insights";

  const memoryCached = getMemoryCache<InsightItem[]>(cacheKey);
  if (memoryCached) {
    return memoryCached;
  }

  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      setMemoryCache(cacheKey, cached, 300);
      return cached as InsightItem[];
    }
  } catch {
    // KV read fallback
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>(
        "SELECT slug, title, category, read_time as \"readTime\", date_published as \"date\", author, excerpt, toc, content, faqs, related, tags FROM insights"
      );
      if (rows.length === 0) {
        setMemoryCache(cacheKey, insightsJson as InsightItem[], 300);
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
      setMemoryCache(cacheKey, parsedRows, 300);
      await kvSet(cacheKey, parsedRows, 3600); // 1 hour TTL
      return parsedRows;
    });
    return data;
  } catch {
    setMemoryCache(cacheKey, insightsJson as InsightItem[], 300);
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

  const memoryCached = getMemoryCache<any>(cacheKey);
  if (memoryCached) {
    return memoryCached;
  }

  const getFallback = () => {
    if (pageKey === "home_settings") {
      return {
        heroTitle: "CA JOYCE J CHARUVILA & ASSOCIATES",
        heroSubtitle: "Chartered Accountants handling audits, tax filings, and bookkeeping for businesses and individuals in India and the United Arab Emirates.",
        heroImage: "/images/hero/hero-office.webp",
        objectiveText: "Independent Chartered Accountant practice based in Omalloor, Pathanamthitta. We provide hands-on statutory audit, Indian income tax and GST compliance, alongside UAE Corporate Tax and VAT advisory."
      };
    } else if (pageKey === "about_settings") {
      return {
        heading: "CA Joyce J Charuvila, MCom, ACA, CMA Final",
        bioParagraphs: [
          "CA Joyce J Charuvila is an associate Chartered Accountant with over nine years of practical experience in statutory audit, taxation, and financial management across India and the UAE.",
          "His professional background covers statutory audits under the Indian Companies Act, tax audits under Section 44AB, GST compliance, and UAE Corporate Tax and VAT return filings across trading, construction, and service sectors."
        ],
        portraitImage: "/images/founder/portrait.webp"
      };
    } else if (pageKey === "founder_settings") {
      return {
        credentials: "MCom, ACA, CMA Final",
        biography: [
          "CA Joyce J Charuvila, MCom, ACA, CMA Final, is an associate Chartered Accountant with over nine years of professional experience across Indian statutory audit, corporate taxation, and UAE tax systems.",
          "Before establishing the independent practice, Joyce worked across Indian and Middle Eastern markets, serving in audit management and Financial Controller capacities across manufacturing, trading, and contracting businesses.",
          "The practice was founded to provide direct, partner-led accounting and tax compliance. Clients communicate directly with CA Joyce J Charuvila rather than through layers of account managers."
        ],
        timeline: [
          {
            year: "2017",
            title: "Commenced Professional Practice",
            description: "Conducted statutory audits, tax audits, and corporate tax compliance assignments for companies in India."
          },
          {
            year: "2022",
            title: "UAE Tax & VAT Practice",
            description: "Managed corporate bookkeeping, VAT returns, and FTA compliance for businesses in Dubai and Abu Dhabi."
          },
          {
            year: "2024",
            title: "Financial Controller Engagements",
            description: "Supervised financial reporting, internal controls, and management accounts across commercial trading and contracting companies."
          },
          {
            year: "2026",
            title: "Independent Practice Founded",
            description: "Established Joyce J Charuvila & Associates in Omalloor, Pathanamthitta, Kerala, focusing on Indian compliance and cross-border UAE tax advisory."
          }
        ],
        portraitImage: "/images/founder/portrait.webp",
        philosophyText: "Direct, accessible CA guidance. Every filing, audit schedule, and tax return is personally reviewed to ensure accurate statutory compliance."
      };
    }
    return {};
  };

  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      setMemoryCache(cacheKey, cached, 300);
      return cached;
    }
  } catch {
    // KV fallback
  }

  try {
    const data = await runDeduplicatedQuery(cacheKey, async () => {
      const rows = await runQuery<any>("SELECT value FROM company_settings WHERE key = $1", [pageKey]);
      if (rows.length === 0) {
        const defaultVal = getFallback();
        setMemoryCache(cacheKey, defaultVal, 300);
        return defaultVal;
      }
      const val = rows[0].value;
      setMemoryCache(cacheKey, val, 300);
      return val;
    });
    return data;
  } catch {
    const defaultVal = getFallback();
    setMemoryCache(cacheKey, defaultVal, 300);
    return defaultVal;
  }
}

export async function saveDbPageSettings(pageKey: string, value: any): Promise<boolean> {
  setMemoryCache(`cache:page_settings:${pageKey}`, value, 300);
  try {
    await runQuery(
      "INSERT INTO company_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [pageKey, JSON.stringify(value)]
    );
  } catch (err) {
    console.warn(`Database write skipped/failed for page settings ${pageKey}:`, err);
  }
  await kvDel(`cache:page_settings:${pageKey}`);
  return true;
}
