/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { MessageSquare, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ContactPageClientProps {
  company: any;
  services: any[];
}

export default function ContactPageClient({ company, services }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    companyName: "",
    serviceRequired: "",
    message: "",
    clientCountry: "India",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [botField, setBotField] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    if (!formData.serviceRequired) newErrors.serviceRequired = "Please select a service.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    const prefix = formData.clientCountry === "United Arab Emirates" ? "+971" : "+91";
    const suffix = formData.clientCountry === "United Arab Emirates" ? " (UAE)" : " (India)";
    const formattedPhoneNumber = `${prefix} ${formData.phoneNumber.trim()}${suffix}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          emailAddress: formData.emailAddress,
          phoneNumber: formattedPhoneNumber,
          companyName: formData.companyName,
          serviceRequired: formData.serviceRequired,
          message: formData.message,
          botField,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setApiError(result.error || "Form submission failed. Please check inputs.");
      }
    } catch {
      setApiError("A network error occurred. Please verify your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp Redirect Link with form details
  const getWhatsAppLink = () => {
    const prefix = formData.clientCountry === "United Arab Emirates" ? "+971" : "+91";
    const formattedPhone = `${prefix} ${formData.phoneNumber.trim()}`;
    const text = `Hi, my name is ${formData.fullName}.${
      formData.companyName ? ` I represent ${formData.companyName}.` : ""
    } I require assistance with "${formData.serviceRequired}".\n\nEnquiry Details:\n${formData.message}\n\nEmail: ${formData.emailAddress}\nPhone: ${formattedPhone}`;
    
    return buildWhatsAppUrl(company.contact.whatsapp, text);
  };

  return (
    <div className="w-full bg-brand-bg py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Contact Information */}
          <div className="lg:col-span-5 flex flex-col justify-between lg:h-full lg:sticky lg:top-[130px] text-left">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-accent font-bold mb-4 block">
                Office Information
              </span>
              <h1 className="font-display text-5xl md:text-6xl font-normal text-brand-primary tracking-tight leading-tight mb-8">
                JOYCE J CHARUVILA & ASSOCIATES
              </h1>
              
              <div className="space-y-6 font-sans text-sm md:text-base text-brand-secondary mb-12">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-primary mb-1">Office Location</h3>
                    <p>{company.location.city}, {company.location.state}, {company.location.country}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <MessageSquare className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-primary mb-1">Direct Contact Channels</h3>
                    <div className="space-y-1">
                      <p>
                        <span className="text-slate-400 text-xs mr-2">Call:</span>
                        <a
                          href={`tel:${company.contact.whatsapp.replace(/\s/g, "")}`}
                          className="hover:text-brand-accent transition-colors duration-200 font-semibold text-brand-primary"
                        >
                          {company.contact.phoneDisplay}
                        </a>
                      </p>
                      <p>
                        <span className="text-slate-400 text-xs mr-2">WhatsApp:</span>
                        <a
                          href={buildWhatsAppUrl(company.contact.whatsapp, "Hi, I would like to schedule a consultation with Joyce J Charuvila & Associates.")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-accent transition-colors duration-200 font-semibold text-brand-primary"
                        >
                          {company.contact.phoneDisplay}
                        </a>
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Direct replies during normal business hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-primary mb-1">Direct Correspondence</h3>
                    <a
                      href={`mailto:${company.contact.email}`}
                      className="hover:text-brand-accent transition-colors duration-200 font-semibold text-brand-primary"
                    >
                      {company.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CA Badge — only rendered when ICAI membership number is on file */}
            {/* CA Badge Placement */}
            {company.registrations?.icaiMembership && (
              <div className="border-t border-brand-divider pt-8 mt-12 bg-white/40 rounded-[24px] p-6 border border-brand-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 border border-brand-accent/20 rounded-full flex items-center justify-center shrink-0 bg-emerald-50">
                    <span className="font-display text-sm font-semibold text-brand-accent">CA</span>
                  </div>
                  <div className="font-sans text-xs text-brand-primary leading-tight">
                    <p className="font-semibold">Practicing Chartered Accountant</p>
                    <p className="text-slate-400">Member ID: {company.registrations.icaiMembership}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-brand-border rounded-[32px] p-8 md:p-10 shadow-soft">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    {/* Honeypot hidden input */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="botField">Leave this field blank</label>
                      <input
                        type="text"
                        name="botField"
                        id="botField"
                        value={botField}
                        onChange={(e) => setBotField(e.target.value)}
                        autoComplete="off"
                        tabIndex={-1}
                      />
                    </div>
                    <h2 className="font-display text-3xl text-brand-primary font-normal mb-6">
                      Request Consultation
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="fullName" className="font-sans text-xs font-semibold text-brand-primary">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`bg-slate-50 border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary transition-all duration-300 ${
                            errors.fullName ? "border-red-500 focus:border-red-500" : "border-brand-border focus:border-brand-primary"
                          }`}
                          placeholder="John Doe"
                          aria-invalid={!!errors.fullName}
                          aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        />
                        {errors.fullName && <p id="fullName-error" className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.fullName}</p>}
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="emailAddress" className="font-sans text-xs font-semibold text-brand-primary">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="emailAddress"
                          id="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange}
                          className={`bg-slate-50 border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary transition-all duration-300 ${
                            errors.emailAddress ? "border-red-500 focus:border-red-500" : "border-brand-border focus:border-brand-primary"
                          }`}
                          placeholder="john@company.com"
                          aria-invalid={!!errors.emailAddress}
                          aria-describedby={errors.emailAddress ? "emailAddress-error" : undefined}
                        />
                        {errors.emailAddress && <p id="emailAddress-error" className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.emailAddress}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Country Selector */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="clientCountry" className="font-sans text-xs font-semibold text-brand-primary">
                          Where are you from? *
                        </label>
                        <div className="relative">
                          <select
                            name="clientCountry"
                            id="clientCountry"
                            value={formData.clientCountry}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-brand-border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300 appearance-none"
                          >
                            <option value="India">India</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-primary">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Phone Number with Dynamic Badge */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="phoneNumber" className="font-sans text-xs font-semibold text-brand-primary">
                          Phone Number *
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 rounded-l-[18px] border border-r-0 border-brand-border bg-slate-100 text-brand-secondary text-sm font-sans font-semibold">
                            {formData.clientCountry === "United Arab Emirates" ? "+971" : "+91"}
                          </span>
                          <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`flex-1 min-w-0 bg-slate-50 border outline-none py-3.5 px-4 rounded-r-[18px] font-sans text-sm text-brand-primary transition-all duration-300 ${
                              errors.phoneNumber ? "border-red-500 focus:border-red-500" : "border-brand-border focus:border-brand-primary"
                            }`}
                            placeholder="9876543210"
                            aria-invalid={!!errors.phoneNumber}
                            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                          />
                        </div>
                        {errors.phoneNumber && <p id="phoneNumber-error" className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.phoneNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="companyName" className="font-sans text-xs font-semibold text-brand-primary">
                          Company Name (Optional)
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          id="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="bg-slate-50 border border-brand-border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300"
                          placeholder="Enter Enterprise Name"
                        />
                      </div>

                      {/* Service Required */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="serviceRequired" className="font-sans text-xs font-semibold text-brand-primary">
                          Service Required *
                        </label>
                        <div className="relative">
                          <select
                            name="serviceRequired"
                            id="serviceRequired"
                            value={formData.serviceRequired}
                            onChange={handleChange}
                            className={`w-full bg-slate-50 border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary transition-all duration-300 appearance-none ${
                              errors.serviceRequired ? "border-red-500 focus:border-red-500" : "border-brand-border focus:border-brand-primary"
                            }`}
                            aria-invalid={!!errors.serviceRequired}
                            aria-describedby={errors.serviceRequired ? "serviceRequired-error" : undefined}
                          >
                            <option value="">Select a compliance service...</option>
                            <optgroup label="UAE Compliance">
                              {services
                                .filter((s) => s.slug.endsWith("-uae") || s.title.includes("UAE"))
                                .map((s) => (
                                  <option key={s.slug} value={s.title}>
                                    {s.title}
                                  </option>
                                ))}
                            </optgroup>
                            <optgroup label="India Compliance">
                              {services
                                .filter((s) => !s.slug.endsWith("-uae") && !s.title.includes("UAE"))
                                .map((s) => (
                                  <option key={s.slug} value={s.title}>
                                    {s.title}
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-primary">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                        {errors.serviceRequired && <p id="serviceRequired-error" className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.serviceRequired}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="message" className="font-sans text-xs font-semibold text-brand-primary">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`bg-slate-50 border outline-none py-3.5 px-4 rounded-[18px] font-sans text-sm text-brand-primary transition-all duration-300 resize-none ${
                          errors.message ? "border-red-500 focus:border-red-500" : "border-brand-border focus:border-brand-primary"
                        }`}
                        placeholder="Please outline your entity structure and filing requirement..."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && <p id="message-error" className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.message}</p>}
                    </div>

                    {apiError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-[18px] font-sans text-xs" role="alert" aria-live="assertive">
                        {apiError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-accent hover:bg-brand-primary text-white py-4 px-8 rounded-[18px] font-sans font-medium text-sm transition-all duration-300 shadow-soft hover:shadow-glass flex items-center justify-center space-x-2 disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Engagement Inquiry</span>
                        </>
                      )}
                    </button>
                    <p className="font-sans text-[11px] text-brand-secondary text-center leading-relaxed">
                      By submitting this form, you consent to your data being stored and processed 
                      strictly for the purpose of communicating with you regarding your inquiry, 
                      in compliance with local data protection regulations. We never share your data with third parties.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-12 space-y-6"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-brand-accent rounded-full flex items-center justify-center mx-auto shadow-soft">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <h2 className="font-display text-4xl text-brand-primary font-normal">
                    Enquiry Received Successfully
                  </h2>
                  
                  <p className="font-sans text-brand-secondary text-sm leading-relaxed max-w-md mx-auto">
                    Thank you, {formData.fullName}. Your request has been recorded. To expedite your consultation, you can instantly forward these details directly to our CA team on WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-teal-700 text-white px-8 py-4 rounded-[18px] font-sans font-medium transition-all duration-300 shadow-glass w-full"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Send via WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                          fullName: "",
                          emailAddress: "",
                          phoneNumber: "",
                          companyName: "",
                          serviceRequired: "",
                          message: "",
                          clientCountry: "India"
                        });
                      }}
                      className="inline-flex items-center justify-center space-x-2 border border-brand-border hover:border-brand-primary bg-white text-brand-primary px-8 py-4 rounded-[18px] font-sans font-medium transition-all duration-300 w-full"
                    >
                      <span>New Enquiry</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
