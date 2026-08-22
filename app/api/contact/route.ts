import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { Submission } from "@/types";
import { insertDbEnquiry, getDbCompanyInfo } from "@/lib/db";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Required env var: RESEND_API_KEY (get a free key from resend.com)
const getResendInstance = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const LIMIT = 5; // Max 5 submissions
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return false;
  }

  const timestamps = rateLimitMap.get(ip)!;
  const activeTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);
  
  if (activeTimestamps.length >= LIMIT) {
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  emailAddress: z.string().email("Invalid email address").max(255),
  phoneNumber: z.string().min(7, "Invalid phone number").max(30),
  companyName: z.string().max(255).optional(),
  serviceRequired: z.string().min(1, "Service selection is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  botField: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. IP-Based Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 15 minutes before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Server-side Validation with Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map(err => err.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { fullName, emailAddress, phoneNumber, companyName, serviceRequired, message, botField } = parsed.data;

    // 3. Honeypot Check: Reject spam if hidden 'botField' is filled
    if (botField) {
      // Silently return success to make the spam bot believe it succeeded
      return NextResponse.json({ success: true });
    }

    // 4. Input Sanitization (protects against XSS)
    const sanitize = (text: string) => {
      if (!text) return "";
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .trim();
    };

    const sanitizedData = {
      fullName: sanitize(fullName),
      emailAddress: sanitize(emailAddress),
      phoneNumber: sanitize(phoneNumber),
      companyName: companyName ? sanitize(companyName) : "",
      serviceRequired: sanitize(serviceRequired),
      message: sanitize(message),
    };

    // 5. Persist submission to database (with dynamic memory fallback)
    const newSubmission: Submission = {
      id: crypto.randomBytes(16).toString("hex"),
      ...sanitizedData,
      submittedAt: new Date().toISOString(),
    };
    
    try {
      await insertDbEnquiry(newSubmission);
      console.log("Successfully persisted enquiry to database.");
    } catch (dbErr) {
      console.warn("Database insertion failed (possibly missing DATABASE_URL). Skipping DB persistence. Error:", dbErr);
    }

    // Send email notifications (non-blocking — failures do not affect form success)
    try {
      const resend = getResendInstance();
      const company = await getDbCompanyInfo();
      if (resend) {
        const submittedAt = new Date(newSubmission.submittedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        });

        // 1. Admin notification email
        await resend.emails.send({
        from: "Joyce CA Website <no-reply@cajoyce.com>",
        to: [company.contact.email],
        subject: `New Enquiry — ${sanitizedData.serviceRequired} from ${sanitizedData.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
            <div style="background: #0B1F3A; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0;">New Client Enquiry</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0;">Joyce J Charuvila &amp; Associates — Website Contact Form</p>
            </div>
            <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b; width: 38%;">Full Name</td>
                  <td style="padding: 12px 0; font-weight: 600; color: #0f172a;">${sanitizedData.fullName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Email</td>
                  <td style="padding: 12px 0; color: #0f172a;"><a href="mailto:${sanitizedData.emailAddress}" style="color: #1B5283;">${sanitizedData.emailAddress}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Phone</td>
                  <td style="padding: 12px 0; color: #0f172a;">${sanitizedData.phoneNumber}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Company</td>
                  <td style="padding: 12px 0; color: #0f172a;">${sanitizedData.companyName || "—"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Service Required</td>
                  <td style="padding: 12px 0; font-weight: 600; color: #1B5283;">${sanitizedData.serviceRequired}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Submitted At</td>
                  <td style="padding: 12px 0; color: #0f172a;">${submittedAt} IST</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #64748b; vertical-align: top;">Message</td>
                  <td style="padding: 12px 0; color: #0f172a; line-height: 1.6;">${sanitizedData.message.replace(/\n/g, "<br/>")}</td>
                </tr>
              </table>
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <a href="mailto:${sanitizedData.emailAddress}" style="display: inline-block; background: #0B1F3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to ${sanitizedData.fullName}</a>
              </div>
            </div>
          </div>
        `,
      });

      // 2. Client auto-reply email
      await resend.emails.send({
        from: "Joyce J Charuvila & Associates <no-reply@cajoyce.com>",
        to: [sanitizedData.emailAddress],
        subject: "We received your enquiry — Joyce J Charuvila & Associates",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
            <div style="background: #0B1F3A; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Thank you for reaching out</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0;">Joyce J Charuvila &amp; Associates — Chartered Accountants</p>
            </div>
            <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 15px; color: #0f172a; margin: 0 0 16px;">Dear ${sanitizedData.fullName},</p>
              <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 16px;">
                We have received your enquiry regarding <strong>${sanitizedData.serviceRequired}</strong> and it has been logged with our practice. A Chartered Accountant will review your message and respond within <strong>1 business day</strong>.
              </p>
              <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 28px;">
                If you require an immediate response, you are welcome to contact us directly through any of the channels below.
              </p>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
                <p style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 14px;">Direct Contact</p>
                <p style="font-size: 14px; color: #0f172a; margin: 0 0 8px;">📱 WhatsApp: <a href="${buildWhatsAppUrl(company.contact.whatsapp, "Hi, I recently submitted a contact form on your website and wanted to follow up.")}" style="color: #1B5283; text-decoration: none; font-weight: 600;">${company.contact.phoneDisplay}</a></p>
                <p style="font-size: 14px; color: #0f172a; margin: 0;">✉️ Email: <a href="mailto:${company.contact.email}" style="color: #1B5283; text-decoration: none; font-weight: 600;">${company.contact.email}</a></p>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 24px;">
                We look forward to assisting you with your compliance and accounting requirements.
              </p>
              <p style="font-size: 14px; color: #0f172a; margin: 0;">Warm regards,<br/><strong>CA Joyce J Charuvila & Associates</strong><br/><span style="color: #64748b; font-size: 13px;">Pathanamthitta, Kerala</span></p>
            </div>
          </div>
        `,
      });

        console.log("Email notifications sent for:", sanitizedData.emailAddress);
      } else {
        console.warn("Resend API key is missing. Skipping email notifications.");
      }
    } catch (emailErr) {
      // Email failures are non-fatal — log and continue
      console.error("Resend email error (non-fatal):", emailErr);
    }

    console.log("Secure contact submission validated:", sanitizedData.emailAddress);

    return NextResponse.json({ success: true, data: sanitizedData });
  } catch (error) {
    console.error("API error during contact submission:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
