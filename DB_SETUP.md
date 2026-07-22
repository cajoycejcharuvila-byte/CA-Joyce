# Production Database Setup Guide (Supabase PostgreSQL)

This application uses PostgreSQL for persisting contact form enquiries, dynamic website configurations, sessions, and editorial updates. Follow these steps to provision a database.

---

## 1. Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and log in or sign up.
2. Click **New Project** and select your organization.
3. Fill in the project details:
   - **Name**: `Joyis Financial Audit Website` or similar.
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Choose a data center close to your core users (e.g., *South Asia (Mumbai)* or *Middle East (Bahrain)*).
   - **Pricing Plan**: Select **Free**.
4. Click **Create new project** and wait for the database instances to provision (takes around 1–2 minutes).

---

## 2. Retrieve Connection Strings
1. Once your project is ready, navigate to the **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click on the **Database** tab under settings.
3. Scroll down to the **Connection string** section.
4. Under the **URI** tab:
   - Select **Transaction Connection** (recommended for serverless next.js deployments) or **Session Connection**.
   - Copy the connection string string (it looks like: `postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`).
   - Replace `[YOUR-PASSWORD]` with the actual database password you chose in Step 1.

---

## 3. Run the Database Schema
1. In the Supabase left sidebar, click on the **SQL Editor** icon (the query terminal icon).
2. Click **New Query** to create a blank SQL window.
3. Copy the entire contents of the `schema.sql` file located at the project root.
4. Paste the queries into the Supabase SQL editor window.
5. Click the **Run** button at the bottom-right of the page to execute the queries.
6. The terminal will display `Success. No rows returned.` and verify the tables (`enquiries`, `services`, `insights`, `faq`, `company_settings`, and `admin_sessions`) have been created.

---

## 4. Add Environment Variables
Add the following keys to your local `.env.local` file for development and to your production deployment configurations:

```env
# Postgres connection URL
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Supabase API Settings (Available on Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
```

---

## 5. Add Environment Variables to Vercel (Production)
1. Go to your project dashboard on Vercel.
2. Navigate to **Settings** → **Environment Variables**.
3. Create a new environment variable key-value pair for each:
   - Key: `DATABASE_URL` | Value: *[Your Supabase Database Connection URI]*
   - Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: *[Your Supabase URL]*
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: *[Your Supabase Anon Key]*
4. Click **Save** to apply the keys to the next build trigger.
