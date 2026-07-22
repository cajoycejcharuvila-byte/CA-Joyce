export interface RouteSEOData {
  canonical: string;
  cluster: "India Compliance" | "UAE Compliance" | "Global Overview";
  primary: { name: string; path: string };
  secondary: { name: string; path: string }[];
  contextual: { name: string; path: string }[];
  definition: string;
  targetUser: string;
  whenNeeded: string;
  urgencyTrigger: string;
}

export const SEO_GRAPH: Record<string, RouteSEOData> = {
  // ==========================================
  // INDIA SERVICES
  // ==========================================
  "accounting-bookkeeping-india": {
    canonical: "/services/india/accounting-bookkeeping-india",
    cluster: "India Compliance",
    primary: { name: "Book Consultation", path: "/contact" },
    secondary: [
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" },
      { name: "Common Income Tax Mistakes", path: "/insights/income-tax-filing-mistakes-india" }
    ],
    contextual: [
      { name: "Statutory Audit", path: "/services/india/statutory-audit" },
      { name: "TDS Filing", path: "/services/india/tds-filing" }
    ],
    definition: "Systematic maintenance of books of accounts in compliance with Section 44AA of the Income Tax Act.",
    targetUser: "SMEs, LLPs, and corporations registered under Indian statutes.",
    whenNeeded: "Required continuously for operational tracking and mandatory annual filings.",
    urgencyTrigger: "Failure to maintain proper accounts attracts strict penalties under Section 271A."
  },
  "statutory-audit": {
    canonical: "/services/india/statutory-audit",
    cluster: "India Compliance",
    primary: { name: "Request Audit Checklist", path: "/contact" },
    secondary: [
      { name: "When Do You Need Internal Audit", path: "/insights/when-do-you-need-internal-audit" },
      { name: "Common Income Tax Mistakes", path: "/insights/income-tax-filing-mistakes-india" }
    ],
    contextual: [
      { name: "Accounting & Bookkeeping", path: "/services/india/accounting-bookkeeping-india" },
      { name: "Internal Audit", path: "/services/india/internal-audit-business-advisory" }
    ],
    definition: "Mandatory examination of financial statements under Companies Act 2013 guidelines.",
    targetUser: "All incorporated Indian Private and Public Limited companies.",
    whenNeeded: "Annually within 6 months of financial year close (by September 30th).",
    urgencyTrigger: "Delay in filing audited financial statements (AOC-4) incurs daily late fees of INR 100."
  },
  "bank-concurrent-audit": {
    canonical: "/services/india/bank-concurrent-audit",
    cluster: "India Compliance",
    primary: { name: "Consult Auditor", path: "/contact" },
    secondary: [
      { name: "Project Finance Guide", path: "/insights/project-finance-loan-checklist" },
      { name: "TDS Filing Guide", path: "/insights/understanding-tds-filing-requirements" }
    ],
    contextual: [
      { name: "Statutory Audit", path: "/services/india/statutory-audit" },
      { name: "Certification Services", path: "/services/india/certification-services" }
    ],
    definition: "Real-time, continuous transaction audit to verify bank division compliance.",
    targetUser: "Commercial banks, public sector branches, and financial institutions.",
    whenNeeded: "Required by RBI directives for branches exceeding designated thresholds.",
    urgencyTrigger: "RBI mandates strict quarterly review intervals for financial risk prevention."
  },
  "gst-registration-filing": {
    canonical: "/services/india/gst-registration-filing",
    cluster: "India Compliance",
    primary: { name: "Apply for GSTIN", path: "/contact" },
    secondary: [
      { name: "GST Registration Guide", path: "/insights/understanding-gst-registration-india" },
      { name: "GST Documents Checklist", path: "/insights/documents-required-gst-registration" }
    ],
    contextual: [
      { name: "TDS Filing", path: "/services/india/tds-filing" },
      { name: "Income Tax Audit & Return Filing", path: "/services/india/income-tax-audit-return-filing" }
    ],
    definition: "Indirect tax registration and monthly/quarterly return filings under CGST/SGST Acts.",
    targetUser: "Suppliers of goods and services with turnover exceeding statutory thresholds.",
    whenNeeded: "Mandatory within 30 days of crossing the turnover threshold.",
    urgencyTrigger: "Turnover exceeding INR 40 Lakhs (goods) or INR 20 Lakhs (services) mandates registration."
  },
  "income-tax-audit-return-filing": {
    canonical: "/services/india/income-tax-audit-return-filing",
    cluster: "India Compliance",
    primary: { name: "Schedule Tax Planning", path: "/contact" },
    secondary: [
      { name: "Common Income Tax Mistakes", path: "/insights/income-tax-filing-mistakes-india" },
      { name: "TDS Filing Requirements", path: "/insights/understanding-tds-filing-requirements" }
    ],
    contextual: [
      { name: "GST Registration & Filing", path: "/services/india/gst-registration-filing" },
      { name: "TDS Filing", path: "/services/india/tds-filing" }
    ],
    definition: "Direct tax return compliance including computation, assessment, and filing.",
    targetUser: "Individuals, professionals, partnerships, LLPs, and corporate entities.",
    whenNeeded: "Annually by July 31st (non-audit cases) or October 31st (audit cases).",
    urgencyTrigger: "Late filings attract fees up to INR 5,000 under Section 234F plus interest."
  },
  "tds-filing": {
    canonical: "/services/india/tds-filing",
    cluster: "India Compliance",
    primary: { name: "Outsource TDS Compliance", path: "/contact" },
    secondary: [
      { name: "TDS Filing Requirements", path: "/insights/understanding-tds-filing-requirements" },
      { name: "Common Income Tax Mistakes", path: "/insights/income-tax-filing-mistakes-india" }
    ],
    contextual: [
      { name: "Income Tax Audit & Return Filing", path: "/services/india/income-tax-audit-return-filing" },
      { name: "GST Registration & Filing", path: "/services/india/gst-registration-filing" }
    ],
    definition: "Quarterly deduction, deposit, and reconciliation of Tax Deducted at Source.",
    targetUser: "Deductors making specified payments (salaries, contractors, rent, professional fees).",
    whenNeeded: "Quarterly return filings within 31 days from the end of each quarter.",
    urgencyTrigger: "Section 234E imposes a strict daily fine of INR 200 for late TDS returns."
  },
  "project-finance-loan-assistance": {
    canonical: "/services/india/project-finance-loan-assistance",
    cluster: "India Compliance",
    primary: { name: "Get Credit Assessment", path: "/contact" },
    secondary: [
      { name: "Project Finance Guide", path: "/insights/project-finance-loan-checklist" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "Valuation Services", path: "/services/india/valuation-services" },
      { name: "Certification Services", path: "/services/india/certification-services" }
    ],
    definition: "Structuring CMA data and detailed project reports for bank facility appraisals.",
    targetUser: "Startups, SMEs, and corporate entities seeking expansion funds.",
    whenNeeded: "Prior to making project funding or working capital credit applications.",
    urgencyTrigger: "Credit monitoring audits mandate periodic CMA data submission for active limits."
  },
  "internal-audit-business-advisory": {
    canonical: "/services/india/internal-audit-business-advisory",
    cluster: "India Compliance",
    primary: { name: "Outsource Internal Audit", path: "/contact" },
    secondary: [
      { name: "When Do You Need Internal Audit", path: "/insights/when-do-you-need-internal-audit" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "Statutory Audit", path: "/services/india/statutory-audit" },
      { name: "Valuation Services", path: "/services/india/valuation-services" }
    ],
    definition: "Evaluating internal control systems, operational flows, and regulatory compliance.",
    targetUser: "Medium-to-large corporate companies and expanding SMEs.",
    whenNeeded: "Periodically to identify operational leakage or prevent process discrepancies.",
    urgencyTrigger: "Mandated under Section 138 of Companies Act for companies exceeding size limits."
  },
  "certification-services": {
    canonical: "/services/india/certification-services",
    cluster: "India Compliance",
    primary: { name: "Request CA Certificate", path: "/contact" },
    secondary: [
      { name: "GST Documents Checklist", path: "/insights/documents-required-gst-registration" },
      { name: "TDS Filing Guide", path: "/insights/understanding-tds-filing-requirements" }
    ],
    contextual: [
      { name: "Bank Concurrent Audit", path: "/services/india/bank-concurrent-audit" },
      { name: "Valuation Services", path: "/services/india/valuation-services" }
    ],
    definition: "Issuing statutory certificates required under FEMA, RBI, DGFT, and Direct Tax codes.",
    targetUser: "Exporters, importers, Corporates, and NRI individuals.",
    whenNeeded: "When requested by banks, customs departments, or regulatory authorities.",
    urgencyTrigger: "Strict statutory timelines govern certificates submitted for central scheme claims."
  },
  "valuation-services": {
    canonical: "/services/india/valuation-services",
    cluster: "India Compliance",
    primary: { name: "Request Valuation Report", path: "/contact" },
    secondary: [
      { name: "Project Finance Guide", path: "/insights/project-finance-loan-checklist" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "Certification Services", path: "/services/india/certification-services" },
      { name: "Internal Audit", path: "/services/india/internal-audit-business-advisory" }
    ],
    definition: "Business and equity valuations for regulatory, transaction, and tax filings.",
    targetUser: "LLPs, joint ventures, startups seeking funding, and corporate mergers.",
    whenNeeded: "During corporate restructurings, M&A transactions, or equity transfers.",
    urgencyTrigger: "Income Tax rules require registered valuer certificates for fair value validation."
  },

  // ==========================================
  // UAE SERVICES
  // ==========================================
  "accounting-bookkeeping-uae": {
    canonical: "/services/uae/accounting-bookkeeping-uae",
    cluster: "UAE Compliance",
    primary: { name: "Request Bookkeeping Quote", path: "/contact" },
    secondary: [
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" },
      { name: "VAT Filing Guide", path: "/insights/vat-filing-deadlines-uae" }
    ],
    contextual: [
      { name: "VAT Registration", path: "/services/uae/vat-registration-deregistration" },
      { name: "Corporate Tax Registration", path: "/services/uae/corporate-tax-registration" }
    ],
    definition: "IFRS-compliant maintenance of ledger accounts and financial summaries in the UAE.",
    targetUser: "All mainland and free zone businesses registered in the UAE.",
    whenNeeded: "Continuously to comply with Commercial Companies Law requirements.",
    urgencyTrigger: "Cabinet Decision mandates record maintenance; failure incurs major FTA administrative fines."
  },
  "audit-support": {
    canonical: "/services/uae/audit-support",
    cluster: "UAE Compliance",
    primary: { name: "Consult Audit Advisor", path: "/contact" },
    secondary: [
      { name: "When Do You Need Internal Audit", path: "/insights/when-do-you-need-internal-audit" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "Accounting & Bookkeeping", path: "/services/uae/accounting-bookkeeping-uae" },
      { name: "Corporate Tax Filing", path: "/services/uae/corporate-tax-filing" }
    ],
    definition: "Structuring schedules and matching balance sheets for statutory reviews.",
    targetUser: "Businesses required to submit audited accounts to free zones or banks.",
    whenNeeded: "Annually within designated regulatory deadlines after fiscal year close.",
    urgencyTrigger: "Filing audited financials is a mandatory requirement for free zone license renewals."
  },
  "vat-registration-deregistration": {
    canonical: "/services/uae/vat-registration-deregistration",
    cluster: "UAE Compliance",
    primary: { name: "Apply for VAT Registration", path: "/contact" },
    secondary: [
      { name: "VAT Filing Guide", path: "/insights/vat-filing-deadlines-uae" },
      { name: "Corporate Tax Requirements", path: "/insights/corporate-tax-registration-uae" }
    ],
    contextual: [
      { name: "VAT Filing", path: "/services/uae/vat-filing" },
      { name: "Corporate Tax Registration", path: "/services/uae/corporate-tax-registration" }
    ],
    definition: "Managing tax registration numbers and deregistration requests with the FTA.",
    targetUser: "Businesses importing or supplying goods/services exceeding registration limits.",
    whenNeeded: "Mandatory within 30 days of supplies exceeding the mandatory threshold.",
    urgencyTrigger: "Registration is mandatory when taxable turnover exceeds AED 375,000 in the last 12 months."
  },
  "vat-filing": {
    canonical: "/services/uae/vat-filing",
    cluster: "UAE Compliance",
    primary: { name: "Outsource VAT Filing", path: "/contact" },
    secondary: [
      { name: "VAT Filing Guide", path: "/insights/vat-filing-deadlines-uae" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "VAT Registration", path: "/services/uae/vat-registration-deregistration" },
      { name: "Corporate Tax Filing", path: "/services/uae/corporate-tax-filing" }
    ],
    definition: "Preparing, reconciling, and submitting quarterly or monthly VAT returns.",
    targetUser: "VAT-registered taxable entities with active Tax Registration Numbers.",
    whenNeeded: "Regularly by the 28th day of the month following the end of each tax period.",
    urgencyTrigger: "Late VAT filing incurs an immediate FTA fine of AED 1,000 (AED 2,000 for repetitions)."
  },
  "corporate-tax-registration": {
    canonical: "/services/uae/corporate-tax-registration",
    cluster: "UAE Compliance",
    primary: { name: "Register for Corporate Tax", path: "/contact" },
    secondary: [
      { name: "Corporate Tax Requirements", path: "/insights/corporate-tax-registration-uae" },
      { name: "VAT Filing Guide", path: "/insights/vat-filing-deadlines-uae" }
    ],
    contextual: [
      { name: "Corporate Tax Filing", path: "/services/uae/corporate-tax-filing" },
      { name: "VAT Registration", path: "/services/uae/vat-registration-deregistration" }
    ],
    definition: "Applying for Corporate Tax Registration Number with the Federal Tax Authority.",
    targetUser: "All incorporated companies, sole establishments, and qualifying free zone entities.",
    whenNeeded: "Prior to the designated deadlines set by the FTA based on license issue months.",
    urgencyTrigger: "Late corporate tax registration is subject to an administrative fine of AED 10,000."
  },
  "corporate-tax-filing": {
    canonical: "/services/uae/corporate-tax-filing",
    cluster: "UAE Compliance",
    primary: { name: "Outsource Corporate Tax", path: "/contact" },
    secondary: [
      { name: "Corporate Tax Requirements", path: "/insights/corporate-tax-registration-uae" },
      { name: "Importance of Bookkeeping", path: "/insights/importance-of-bookkeeping" }
    ],
    contextual: [
      { name: "Corporate Tax Registration", path: "/services/uae/corporate-tax-registration" },
      { name: "VAT Filing", path: "/services/uae/vat-filing" }
    ],
    definition: "Compiling taxable income adjustments and filing the Corporate Tax Return.",
    targetUser: "Corporate entities and active businesses subject to UAE Corporate Tax.",
    whenNeeded: "Annually within 9 months from the end of the relevant tax period.",
    urgencyTrigger: "Cabinet regulations prescribe severe financial penalties for delayed return filings."
  }
};
