export interface UrgencyOutput {
  urgencyMessage: string;
  ctaStrength: "high" | "medium" | "low";
  triggerExplanation: string;
}

export function getUrgencyContext(
  serviceType: "tax" | "audit" | "accounting" | "advisory",
  jurisdiction: "India" | "UAE",
  businessStage: "startup" | "SME" | "enterprise"
): UrgencyOutput {
  if (jurisdiction === "India") {
    switch (serviceType) {
      case "tax":
        if (businessStage === "startup") {
          return {
            triggerExplanation: "GST registration becomes mandatory if annual turnover crosses INR 40 Lakhs (goods) or INR 20 Lakhs (services). Voluntary registration is recommended to pass on tax credits.",
            urgencyMessage: "Statutory threshold registration check is critical to avoid penalty notices.",
            ctaStrength: "high"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "GST monthly/quarterly returns (GSTR-1, GSTR-3B) and income tax returns (ITR-4/5) require timely submission.",
            urgencyMessage: "Delayed return filings attract direct late fees plus compounding interest.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "Corporate ITR-6 filing, transfer pricing audits, and extensive GST reconciliations.",
            urgencyMessage: "Strict compliance controls are necessary to avoid automated scrutiny notices.",
            ctaStrength: "high"
          };
        }
      case "audit":
        if (businessStage === "startup") {
          return {
            triggerExplanation: "Statutory audit is legally mandatory under Companies Act 2013 for all registered Private Limited companies from day one.",
            urgencyMessage: "Must complete audits annually to maintain active registrar status.",
            ctaStrength: "medium"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "Section 139 statutory audits and Section 138 internal control audits depending on bank borrowings or turnover.",
            urgencyMessage: "Audits are required to secure bank limits and prevent operational leakages.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "Mandatory statutory, internal, and concurrent audits for banks and government departments.",
            urgencyMessage: "Ensures absolute regulatory conformity and mitigates risk profile.",
            ctaStrength: "high"
          };
        }
      default:
        if (businessStage === "startup") {
          return {
            triggerExplanation: "Filing accounts systematically (Section 44AA) is necessary for tax filing and seed funding preparations.",
            urgencyMessage: "Maintains a clean diligence record for early-stage investor audit checks.",
            ctaStrength: "medium"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "Statutory ledgers must be retained for 8 years; essential for GST and Income Tax reconciliations.",
            urgencyMessage: "Clean, reconciled accounts are necessary for annual filings and bank credit rating appraisals.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "IFRS-compliant corporate general ledgers and monthly corporate MIS reporting.",
            urgencyMessage: "Ensures robust financial control and supports corporate tax filings.",
            ctaStrength: "high"
          };
        }
    }
  } else {
    // UAE Jurisdiction
    switch (serviceType) {
      case "tax":
        if (businessStage === "startup") {
          return {
            triggerExplanation: "Corporate Tax registration is mandatory for all active UAE mainland and free zone corporations. Delayed registration attracts a penalty of AED 10,000.",
            urgencyMessage: "Obtain Corporate Tax Registration Number (CTRN) immediately to avoid administrative fines.",
            ctaStrength: "high"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "VAT registration is mandatory when taxable turnover exceeds AED 375,000. Corporate Tax return filing is required within 9 months of tax year close.",
            urgencyMessage: "Filing delays attract strict FTA administrative fines of AED 1,000+.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "Qualifying Free Zone 0% tax compliance, Transfer Pricing (TP) local file documentation, and Corporate Tax filings.",
            urgencyMessage: "Detailed compliance review required to protect qualifying tax exemption status.",
            ctaStrength: "high"
          };
        }
      case "audit":
        if (businessStage === "startup") {
          return {
            triggerExplanation: "Audit preparation is required for initial licensing reviews and company structure validations.",
            urgencyMessage: "Maintain structured books to ensure seamless audit readiness.",
            ctaStrength: "medium"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "Statutory audits mandated by UAE Free Zone authorities and commercial banks.",
            urgencyMessage: "Audited financial statements must be submitted on time to renew trade licenses.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "Statutory audit reports, consolidated group accounts, and transfer pricing audits.",
            urgencyMessage: "Ensures absolute regulatory compliance and supports stakeholder reviews.",
            ctaStrength: "high"
          };
        }
      default:
        if (businessStage === "startup") {
          return {
            triggerExplanation: "UAE Commercial Companies Law mandates record maintenance; failure to keep books incurs major administrative fines.",
            urgencyMessage: "Sets the essential compliance foundation for subsequent tax filings.",
            ctaStrength: "medium"
          };
        } else if (businessStage === "SME") {
          return {
            triggerExplanation: "Accounting records must be kept in Arabic or English for a minimum of 5 years.",
            urgencyMessage: "Reconciled records are mandatory to file accurate VAT and Corporate Tax returns.",
            ctaStrength: "high"
          };
        } else {
          return {
            triggerExplanation: "IFRS-compliant corporate financial accounts and monthly management summaries.",
            urgencyMessage: "Mandatory reports required for tax audits and shareholder audits.",
            ctaStrength: "high"
          };
        }
    }
  }
}
