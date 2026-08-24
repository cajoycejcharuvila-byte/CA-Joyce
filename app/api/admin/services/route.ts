import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, runQuery } from "@/lib/db";

async function checkAuth() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return false;
  const session = await getDbSession(sessionId);
  return session && session.expiresAt > new Date();
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await runQuery("SELECT * FROM services WHERE is_deleted = false ORDER BY id DESC");
    return NextResponse.json({ services: rows });
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    await runQuery(
      "INSERT INTO services (region, title, description, price, features, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
      [data.region, data.title, data.description, data.price, JSON.stringify(data.features || []), data.image_url]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    await runQuery(
      "UPDATE services SET region=$1, title=$2, description=$3, price=$4, features=$5, image_url=$6 WHERE id=$7",
      [data.region, data.title, data.description, data.price, JSON.stringify(data.features || []), data.image_url, data.id]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    // Soft delete
    await runQuery("UPDATE services SET is_deleted = true WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
