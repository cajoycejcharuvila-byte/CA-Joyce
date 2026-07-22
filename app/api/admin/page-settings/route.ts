import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, getDbPageSettings, saveDbPageSettings } from "@/lib/db";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return false;

  const session = await getDbSession(sessionId);
  if (!session) return false;

  return Date.now() <= session.expiresAt.getTime();
}

export async function GET(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get("pageKey");
    if (!pageKey) {
      return NextResponse.json({ error: "Missing pageKey parameter" }, { status: 400 });
    }

    const settings = await getDbPageSettings(pageKey);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("API error fetching page settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageKey, value } = await request.json();
    if (!pageKey || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await saveDbPageSettings(pageKey, value);
    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("API error saving page settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
