# Environment Setup Guide (`.env.local`)

This document outlines the required environment variables to run this application in local development and production environments. Copy these keys to your local `.env.local` file.

---

## 1. Email (Resend)
* **`RESEND_API_KEY`**: 
  - *Purpose*: Used to send client auto-replies and admin submission notifications.
  - *Setup*: Visit [resend.com](https://resend.com), register a free account, and generate a new API key.
  - *Local format*: `RESEND_API_KEY=re_yourApiKeyHere`

---

## 2. Relational Database (Supabase PostgreSQL)
* **`DATABASE_URL`**:
  - *Purpose*: Postgres connection string used by the server to read/write site settings, dynamic blogs/insights, and submissions.
  - *Setup*: Setup a database on [supabase.com](https://supabase.com). Copy the PostgreSQL URI connection string (choose **Transaction Connection** or **Session Connection**).
  - *Local format*: `DATABASE_URL=postgresql://postgres.xxxx:password@xxxx.supabase.co:5432/postgres`

* **`NEXT_PUBLIC_SUPABASE_URL`**:
  - *Purpose*: Supabase project endpoint.
  - *Local format*: `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co`

* **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**:
  - *Purpose*: Anonymous client-side key for Supabase calls.
  - *Local format*: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`

---

## 3. SEO & Domain Config
* **`NEXT_PUBLIC_SITE_URL`**:
  - *Purpose*: Base URL used to build absolute canonical meta links and sitemaps.
  - *Production Value*: `NEXT_PUBLIC_SITE_URL=https://joyceca.in`
  - *Local Value*: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

---

## 4. Google Analytics 4 (GA4)
* **`NEXT_PUBLIC_GA_ID`**:
  - *Purpose*: Google Analytics 4 property Measurement ID.
  - *Setup*: Admin → Data Streams → Web Stream → Measurement ID (looks like `G-XXXXXXXXXX`).
  - *Local format*: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

---

## 5. Google Search Console
* **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`**:
  - *Purpose*: Verification token rendered in the `<head>` meta tag.
  - *Setup*: Search Console → Add Property → HTML Tag Verification → copy the `content` attribute value.
  - *Local format*: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=yourVerificationTokenString`
