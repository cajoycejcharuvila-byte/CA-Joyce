# Content and Placeholder Checklist

This checklist tracks placeholder content, assets, and credentials that need to be replaced with official information before deploying the site to production.

---

## 1. Professional Registrations & Identifiers
* [ ] **ICAI Firm Registration Number (FRN)**
  - *Location*: `data/company.json` -> `registrations.frn`
  - *Current Status*: Empty string `""`
  - *Action*: Replace with the firm's official ICAI FRN number.
* [ ] **ICAI Member ID**
  - *Location*: `data/company.json` -> `registrations.icaiMembership`
  - *Current Status*: Empty string `""` (Note: The credential badges on the **About Page**, **Contact Page**, and **Footer** are hidden automatically when this is blank. They will display when populated.)
  - *Action*: Replace with CA Joyce J Charuvila's ICAI Membership ID.

---

## 2. Location & Social Map Links
* [ ] **Google Maps Link**
  - *Location*: `data/company.json` -> `contact.googleMapsLink`
  - *Current Status*: Empty string `""`
  - *Action*: Embed mapping link or direct address search coordinates for the Pathanamthitta office.
* [ ] **Twitter Profile**
  - *Location*: `data/company.json` -> `contact.social.twitter`
  - *Current Status*: Empty string `""`
  - *Action*: Add the firm's official Twitter link if available.

---

## 3. Dynamic Images & Visual Assets
* [ ] **Founder portrait photo**
  - *Location*: `public/images/about/founder-placeholder.webp`
  - *Action*: Replace with the final headshot of CA Joyce J Charuvila. Keep the exact file name so all dynamic pages update automatically.
* [ ] **Hero Section Background**
  - *Location*: `public/images/hero/hero-office.webp`
  - *Action*: Replace with the final high-resolution firm/office interior or architecture banner image. Keep the filename the same.
