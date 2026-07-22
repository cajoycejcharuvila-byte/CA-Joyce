import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteDbSession } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    if (sessionId) {
      await deleteDbSession(sessionId);
    }
  } catch (err) {
    console.error("Error deleting session on logout:", err);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  const isProd = process.env.NODE_ENV === "production";
  const secureFlag = isProd ? "Secure;" : "";

  // Overwrite the admin_session cookie with Max-Age=0 to immediately expire it
  response.headers.append(
    "Set-Cookie",
    `admin_session=; Path=/; HttpOnly; ${secureFlag} SameSite=Strict; Max-Age=0`
  );

  return response;
}
