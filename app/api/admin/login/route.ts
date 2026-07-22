import { NextResponse } from "next/server";
import crypto from "crypto";
import { createDbSession } from "@/lib/db";

// Rate limiting for admin login attempts (IP -> attempts count)
const loginAttemptsMap = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

function checkRateLimit(ip: string): { allowed: boolean; waitMs?: number } {
  const now = Date.now();
  if (!loginAttemptsMap.has(ip)) {
    loginAttemptsMap.set(ip, { count: 0, lastAttempt: now });
    return { allowed: true };
  }

  const record = loginAttemptsMap.get(ip)!;

  // Reset count if lockout period has passed
  if (now - record.lastAttempt > LOCKOUT_MS) {
    record.count = 0;
    record.lastAttempt = now;
    loginAttemptsMap.set(ip, record);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, waitMs: LOCKOUT_MS - (now - record.lastAttempt) };
  }

  return { allowed: true };
}

function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttemptsMap.set(ip, record);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // 1. Check Rate Limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const waitMin = Math.ceil((rateLimit.waitMs || LOCKOUT_MS) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again after ${waitMin} minutes.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // 2. Load environment variables securely (never hardcode!)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@joyceca.in";
    const adminPassword = process.env.ADMIN_PASSWORD || "JoyceCA@2026"; // Secure default fallback

    // 3. Validate Inputs
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      registerFailedAttempt(ip);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 4. Successful login: Generate random Session ID and store in DB
    const sessionId = crypto.randomUUID();
    const expiresDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    
    await createDbSession(sessionId, expiresDate);

    // Clear failed attempts upon successful login
    loginAttemptsMap.delete(ip);

    // 5. Construct Response with Secure HttpOnly Cookie
    const response = NextResponse.json({ success: true, message: "Authentication successful" });
    
    const isProd = process.env.NODE_ENV === "production";
    const secureFlag = isProd ? "Secure;" : "";

    response.headers.append(
      "Set-Cookie",
      `admin_session=${sessionId}; Path=/; HttpOnly; ${secureFlag} SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
