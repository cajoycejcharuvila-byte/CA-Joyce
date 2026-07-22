-- Database schema for JOYCE J CHARUVILA & ASSOCIATES
-- Compatible with PostgreSQL (Neon, Supabase, Vercel Postgres)

-- 1. Enquiries Table (Client queries from contact form)
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email_address VARCHAR(100) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  company_name VARCHAR(100),
  service_required VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services Table (Dual-jurisdiction services catalog)
CREATE TABLE IF NOT EXISTS services (
  slug VARCHAR(100) PRIMARY KEY,
  region VARCHAR(10) NOT NULL, -- 'india' or 'uae'
  title VARCHAR(255) NOT NULL,
  overview TEXT NOT NULL,
  who_needs_this TEXT NOT NULL,
  scope_of_work JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings
  process_steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings/objects
  meta_title VARCHAR(255),
  meta_description TEXT
);

-- 3. Insights Table (Editorial blog posts)
CREATE TABLE IF NOT EXISTS insights (
  slug VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  date_published VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  excerpt TEXT NOT NULL,
  toc JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings
  content JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of paragraphs (strings)
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of FAQ objects {question, answer}
  related JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of related slugs (strings)
  tags JSONB NOT NULL DEFAULT '[]'::jsonb -- Array of tag strings
);

-- 4. FAQs Table (Common Q&A items)
CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general'
);

-- 5. Company Settings Table (Stores firm operational variables as JSON)
CREATE TABLE IF NOT EXISTS company_settings (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL
);

-- 6. Admin Sessions Table (Session-based database authentication)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id VARCHAR(100) PRIMARY KEY,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
