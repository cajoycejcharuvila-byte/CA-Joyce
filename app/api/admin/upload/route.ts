import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSession } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client for Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // We enabled anon insert policy
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // 1. Verify Admin Session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await getDbSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Convert to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 4. Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // 5. Upload to Supabase Storage ('public-images' bucket)
    const { data, error } = await supabase.storage
      .from("public-images")
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // 6. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("public-images")
      .getPublicUrl(uniqueFilename);

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl 
    });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
