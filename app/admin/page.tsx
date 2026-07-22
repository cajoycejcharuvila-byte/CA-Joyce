import { cookies } from "next/headers";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getDbSession, updateDbSessionExpiry, getDbEnquiries, getDbCompanyInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

async function verifySession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    if (!sessionId) return false;

    const session = await getDbSession(sessionId);
    if (!session) return false;

    // Check expiration
    if (Date.now() > session.expiresAt.getTime()) {
      return false;
    }

    // Dynamic Session Refresh: If less than 30 minutes remain, extend by 1 hour
    const minRemaining = (session.expiresAt.getTime() - Date.now()) / (60 * 1000);
    if (minRemaining < 30) {
      const newExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await updateDbSessionExpiry(sessionId, newExpiry);
    }

    return true;
  } catch (error) {
    console.error("Session verification error:", error);
    return false;
  }
}

export default async function AdminPage() {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-brand-bg flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  // Load enquiries and company settings from database layer
  const submissions = await getDbEnquiries();
  const company = await getDbCompanyInfo();

  return (
    <AdminDashboard 
      initialSubmissions={submissions} 
      company={company} 
    />
  );
}
