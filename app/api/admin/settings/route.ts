import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession, getDbCompanyInfo, saveDbCompanyInfo } from "@/lib/db";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return false;

  const session = await getDbSession(sessionId);
  if (!session) return false;

  return Date.now() <= session.expiresAt.getTime();
}

export async function PUT(request: Request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const companyData = await getDbCompanyInfo();
    
    // Merge updates
    if (body.contact) {
      companyData.contact = {
        ...companyData.contact,
        ...body.contact,
        social: {
          ...companyData.contact.social,
          ...(body.contact.social || {})
        }
      };
      
      // Auto-update whatsappDirect link if whatsapp is modified
      if (body.contact.whatsapp) {
        const cleaned = body.contact.whatsapp.replace(/[^0-9]/g, "");
        companyData.contact.social.whatsappDirect = `https://wa.me/${cleaned}`;
      }
    }
    
    if (body.businessHours) {
      companyData.businessHours = {
        ...companyData.businessHours,
        ...body.businessHours
      };
    }
    
    if (body.registrations) {
      companyData.registrations = {
        ...companyData.registrations,
        ...body.registrations
      };
    }
    
    const success = await saveDbCompanyInfo(companyData);
    if (!success) {
      return NextResponse.json({ error: "Failed to write settings to database" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: companyData });
  } catch (error) {
    console.error("API error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
