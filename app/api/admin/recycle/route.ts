import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, runQuery } from "@/lib/db";

async function checkAuth() {
  const sessionId = cookies().get("admin_session")?.value;
  if (!sessionId) return false;
  const session = await getDbSession(sessionId);
  return session && session.expiresAt > new Date();
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const services = await runQuery("SELECT id, title, 'Service' as type FROM services WHERE is_deleted = true");
    const insights = await runQuery("SELECT slug as id, title, 'Insight' as type FROM insights WHERE is_deleted = true");
    const enquiries = await runQuery("SELECT id, full_name as title, 'Enquiry' as type FROM enquiries WHERE is_deleted = true");
    return NextResponse.json({ recycle: [...services, ...insights, ...enquiries] });
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, type, action } = await req.json(); // action: 'restore' | 'delete'
    let table = type === 'Service' ? 'services' : type === 'Insight' ? 'insights' : 'enquiries';
    let idCol = type === 'Insight' ? 'slug' : 'id';
    
    if (action === 'restore') {
      await runQuery(`UPDATE ${table} SET is_deleted = false WHERE ${idCol} = $1`, [id]);
    } else {
      await runQuery(`DELETE FROM ${table} WHERE ${idCol} = $1`, [id]);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
