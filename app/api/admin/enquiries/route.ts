import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, getDbEnquiries, deleteDbEnquiry } from "@/lib/db";

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

    const enquiries = await getDbEnquiries();
    return NextResponse.json({ success: true, submissions: enquiries });
  } catch (error) {
    console.error("API error fetching enquiries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    }

    const success = await deleteDbEnquiry(id);
    if (!success) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("API error deleting enquiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
