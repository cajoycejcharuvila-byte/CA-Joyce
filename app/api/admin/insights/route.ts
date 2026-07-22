import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, getDbInsights, saveDbInsight, deleteDbInsight } from "@/lib/db";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return false;

  const session = await getDbSession(sessionId);
  if (!session) return false;

  return Date.now() <= session.expiresAt.getTime();
}

export async function GET() {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const insights = await getDbInsights();
    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error("API error fetching insights:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const insight = await request.json();
    if (!insight.slug || !insight.title || !insight.category || !insight.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const success = await saveDbInsight(insight);
    if (!success) {
      return NextResponse.json({ error: "Failed to create insight in database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insight });
  } catch (error) {
    console.error("API error creating insight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const insight = await request.json();
    if (!insight.slug || !insight.title || !insight.category || !insight.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const success = await saveDbInsight(insight);
    if (!success) {
      return NextResponse.json({ error: "Failed to update insight in database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insight });
  } catch (error) {
    console.error("API error updating insight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Insight slug required" }, { status: 400 });
    }

    const success = await deleteDbInsight(slug);
    if (!success) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Insight deleted successfully" });
  } catch (error) {
    console.error("API error deleting insight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
