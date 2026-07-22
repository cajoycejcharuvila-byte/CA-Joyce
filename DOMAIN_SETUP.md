# Custom Domain Setup Guide (`joyceca.in`)

This document outlines the step-by-step configuration needed to map the custom domain `joyceca.in` to your Vercel deployment.

---

## 1. Configure the Domain on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com) and select the project.
2. Navigate to **Settings** → **Domains** in the top navigation bar.
3. In the input box, type `joyceca.in` and click the **Add** button.
4. Vercel will ask if you also want to add `www.joyceca.in` and redirect traffic from it. Select **"Add joyceca.in and redirect www.joyceca.in to it"** (recommended for SEO stability).

---

## 2. Add DNS Records at Your Registrar
Log in to the DNS provider/registrar where you purchased `joyceca.in` (e.g., GoDaddy, Namecheap, Google Domains/Squarespace, Hostinger) and create the following records:

### Record 1: Apex Domain (`joyceca.in`)
- **Type**: `A`
- **Name/Host**: `@` (or leave empty depending on the registrar)
- **Value/IP Address**: `76.76.21.21` (Vercel's global IP address)
- **TTL**: `Default` or `3600` (1 hour)

### Record 2: Subdomain (`www.joyceca.in`)
- **Type**: `CNAME`
- **Name/Host**: `www`
- **Value/Target**: `cname.vercel-dns.com`
- **TTL**: `Default` or `3600`

*Note: Remove any other conflicting A or CNAME records mapped to `@` or `www`.*

---

## 3. Update the Website Site URL Variable
Once the domain is verified and DNS propagation is complete (takes from 5 minutes up to 24 hours):
1. Navigate back to **Vercel Settings** → **Environment Variables**.
2. Add or update the variable `NEXT_PUBLIC_SITE_URL`:
   - Value: `https://joyceca.in`
3. Update this value in your local `.env.local` file as well for consistent testing:
   ```env
   NEXT_PUBLIC_SITE_URL=https://joyceca.in
   ```

---

## 4. Verify SSL Certificate Issuance
1. Vercel automatically generates and provisions Let's Encrypt SSL certificates for your domain names as soon as your DNS configurations are propagated.
2. To check status, go to **Settings** → **Domains** on Vercel.
3. Look for a green **"Valid Configuration"** checkmark and a lock icon next to your domains.
4. Try loading `https://joyceca.in` in your browser. A security lock icon should appear in the browser address bar, indicating a secure SSL/TLS connection.
