/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { 
  LogOut, Building2, Trash2, Save, 
  Search, CheckCircle, MessageSquare, 
  Settings, Inbox, ExternalLink, ShieldCheck, RefreshCw, X,
  FileEdit, Plus, Sparkles, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyInfo } from "@/types";

interface Submission {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName?: string;
  serviceRequired: string;
  message: string;
  submittedAt: string;
}

interface InsightItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

interface AdminDashboardProps {
  initialSubmissions: Submission[];
  company: CompanyInfo;
}

export default function AdminDashboard({ initialSubmissions, company }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"submissions" | "cms" | "page_editor" | "insights">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<"all" | "india" | "uae">("all");
  const [companyForm, setCompanyForm] = useState(company);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [companySaveStatus, setCompanySaveStatus] = useState<{ success?: boolean; error?: string }>({});
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ==========================================
  // PAGE EDITOR STATE (Wordpress Elementor Style)
  // ==========================================
  const [selectedPage, setSelectedPage] = useState<"home" | "about" | "founder">("home");
  const [pageSettings, setPageSettings] = useState<any>({
    home: {
      heroTitle: "",
      heroSubtitle: "",
      heroImage: "",
      objectiveText: ""
    },
    about: {
      heading: "",
      bioParagraphs: [] as string[],
      portraitImage: ""
    },
    founder: {
      credentials: "",
      biography: [] as string[],
      timeline: [] as any[],
      philosophyText: "",
      portraitImage: ""
    }
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveStatus, setSettingsSaveStatus] = useState<{ success?: boolean; error?: string }>({});

  // Textarea input states (for handling paragraph editing easily as newline-separated strings)
  const [aboutBioText, setAboutBioText] = useState("");
  const [founderBioText, setFounderBioText] = useState("");

  // ==========================================
  // INSIGHTS CRUD STATE
  // ==========================================
  const [insightsList, setInsightsList] = useState<InsightItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isSavingInsight, setIsSavingInsight] = useState(false);
  const [isFetchingDevTo, setIsFetchingDevTo] = useState(false);
  const [insightForm, setInsightForm] = useState<InsightItem>({
    slug: "",
    title: "",
    category: "GST",
    readTime: "5 min read",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    author: "CA Joyce J Charuvila",
    excerpt: "",
    content: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [isEditingInsight, setIsEditingInsight] = useState(false);
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [insightStatus, setInsightStatus] = useState<{ success?: boolean; error?: string }>({});


  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Refresh submissions list manually
  const handleRefreshSubmissions = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Error refreshing submissions:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      } else {
        alert("Failed to delete enquiry.");
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
    }
  };

  // Save Company settings
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCompany(true);
    setCompanySaveStatus({});

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setCompanySaveStatus({ success: true });
        setTimeout(() => setCompanySaveStatus({}), 4000);
      } else {
        setCompanySaveStatus({ error: result.error || "Failed to update profile." });
      }
    } catch {
      setCompanySaveStatus({ error: "Network error. Please try again." });
    } finally {
      setIsSavingCompany(false);
    }
  };

  // ==========================================
  // PAGE EDITOR LOGIC
  // ==========================================
  const loadPageSettings = async (page: "home" | "about" | "founder") => {
    setIsLoadingSettings(true);
    try {
      const pageKey = `${page}_settings`;
      const res = await fetch(`/api/admin/page-settings?pageKey=${pageKey}`);
      if (res.ok) {
        const result = await res.json();
        const settings = result.settings;
        setPageSettings((prev: any) => ({ ...prev, [page]: settings }));
        
        if (page === "about") {
          setAboutBioText(settings.bioParagraphs ? settings.bioParagraphs.join("\n\n") : "");
        } else if (page === "founder") {
          setFounderBioText(settings.biography ? settings.biography.join("\n\n") : "");
        }
      }
    } catch (err) {
      console.error(`Error loading settings for ${page}:`, err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSaveStatus({});

    try {
      const pageKey = `${selectedPage}_settings`;
      const value = { ...pageSettings[selectedPage] };

      // Process newline paragraphs
      if (selectedPage === "about") {
        value.bioParagraphs = aboutBioText.split("\n\n").filter(p => p.trim() !== "");
      } else if (selectedPage === "founder") {
        value.biography = founderBioText.split("\n\n").filter(p => p.trim() !== "");
      }

      const res = await fetch("/api/admin/page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, value })
      });

      const result = await res.json();

      if (res.ok) {
        setSettingsSaveStatus({ success: true });
        // Update local state
        setPageSettings((prev: any) => ({ ...prev, [selectedPage]: value }));
        setTimeout(() => setSettingsSaveStatus({}), 4000);
      } else {
        setSettingsSaveStatus({ error: result.error || "Failed to save settings." });
      }
    } catch {
      setSettingsSaveStatus({ error: "Network error saving settings." });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Timeline helpers
  const handleTimelineChange = (index: number, field: string, val: string) => {
    const updatedTimeline = [...pageSettings.founder.timeline];
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: val };
    setPageSettings((prev: any) => ({
      ...prev,
      founder: { ...prev.founder, timeline: updatedTimeline }
    }));
  };

  const handleAddTimelineEvent = () => {
    const updatedTimeline = [...(pageSettings.founder.timeline || []), { year: "", title: "", description: "" }];
    setPageSettings((prev: any) => ({
      ...prev,
      founder: { ...prev.founder, timeline: updatedTimeline }
    }));
  };

  const handleRemoveTimelineEvent = (index: number) => {
    const updatedTimeline = pageSettings.founder.timeline.filter((_: any, idx: number) => idx !== index);
    setPageSettings((prev: any) => ({
      ...prev,
      founder: { ...prev.founder, timeline: updatedTimeline }
    }));
  };

  // ==========================================
  // INSIGHTS BLOG LOGIC
  // ==========================================
  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch("/api/admin/insights");
      if (res.ok) {
        const result = await res.json();
        setInsightsList(result.insights || []);
      }
    } catch (err) {
      console.error("Error loading insights:", err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // ==========================================
  // INITIAL DATA LIFECYCLE
  // ==========================================
  useEffect(() => {
    // Load page settings on mount
    loadPageSettings("home");
    loadPageSettings("about");
    loadPageSettings("founder");
    loadInsights();
  }, []);

  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInsight(true);
    setInsightStatus({});

    // Parse tag input
    const tags = tagInput.split(",").map(t => t.trim()).filter(t => t !== "");
    const payload = {
      ...insightForm,
      tags,
      // Parse content string into paragraph structure in database if needed, or store content as a raw JSON string
      content: typeof insightForm.content === "string" ? [insightForm.content] : insightForm.content
    };

    try {
      const method = isEditingInsight ? "PUT" : "POST";
      const res = await fetch("/api/admin/insights", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        setInsightStatus({ success: true });
        setShowInsightForm(false);
        setIsEditingInsight(false);
        // Reset form
        setInsightForm({
          slug: "",
          title: "",
          category: "GST",
          readTime: "5 min read",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          author: "CA Joyce J Charuvila",
          excerpt: "",
          content: "",
          tags: []
        });
        setTagInput("");
        loadInsights();
        setTimeout(() => setInsightStatus({}), 4000);
      } else {
        setInsightStatus({ error: result.error || "Failed to save blog article." });
      }
    } catch {
      setInsightStatus({ error: "Network error saving blog article." });
    } finally {
      setIsSavingInsight(false);
    }
  };

  const handleEditInsight = (insight: InsightItem) => {
    const rawContent = Array.isArray(insight.content) ? (insight.content as string[]).join("\n\n") : insight.content;
    setInsightForm({
      ...insight,
      content: rawContent
    });
    setTagInput(insight.tags ? insight.tags.join(", ") : "");
    setIsEditingInsight(true);
    setShowInsightForm(true);
  };

  const handleDeleteInsight = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/insights?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setInsightsList(prev => prev.filter(item => item.slug !== slug));
      } else {
        alert("Failed to delete article.");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const handleFetchDevTo = async () => {
    setIsFetchingDevTo(true);
    setInsightStatus({});
    try {
      const res = await fetch("/api/admin/insights/fetch", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        setInsightStatus({ success: true });
        loadInsights();
        alert(`Successfully fetched and recorded ${result.count || 0} financial articles from Dev.to!`);
        setTimeout(() => setInsightStatus({}), 4000);
      } else {
        setInsightStatus({ error: result.error || "Failed to fetch articles from Dev.to API." });
      }
    } catch {
      setInsightStatus({ error: "Network error fetching articles." });
    } finally {
      setIsFetchingDevTo(false);
    }
  };

  // Deep helper to filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.companyName && sub.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.serviceRequired.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterRegion === "all") return matchesSearch;
    
    const isUAE = sub.serviceRequired.toLowerCase().includes("uae") || 
                  sub.message.toLowerCase().includes("dubai") ||
                  sub.message.toLowerCase().includes("uae");
                  
    const matchesRegion = filterRegion === "uae" ? isUAE : !isUAE;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="w-full min-h-[85vh] bg-slate-50/50 py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-divider pb-6 mb-10 gap-4 text-left">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-brand-accent uppercase tracking-widest mb-1.5 animate-none">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Session Active</span>
            </div>
            <h1 className="font-display text-4xl font-normal text-brand-primary tracking-tight">
              Administrative Control Center
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center space-x-2 border border-brand-border bg-white hover:bg-slate-100 text-brand-primary px-5 py-2.5 rounded-[16px] font-sans text-sm font-medium transition-all duration-300 shadow-sm cursor-pointer outline-none"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-3 flex flex-col gap-2 p-1.5 bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] shadow-sm">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center justify-start space-x-3 px-4 py-3.5 rounded-[18px] font-sans text-sm font-medium transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "submissions" 
                  ? "bg-brand-primary text-white shadow-soft" 
                  : "text-brand-secondary hover:bg-slate-50 dark:hover:bg-brand-bg"
              }`}
            >
              <Inbox className="w-4 h-4 shrink-0" />
              <span>Client Enquiries</span>
              {submissions.length > 0 && (
                <span className={`ml-auto text-2xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === "submissions" ? "bg-white/25 text-white" : "bg-slate-100 dark:bg-brand-bg text-slate-600"
                }`}>
                  {submissions.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("page_editor")}
              className={`flex items-center justify-start space-x-3 px-4 py-3.5 rounded-[18px] font-sans text-sm font-medium transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "page_editor" 
                  ? "bg-brand-primary text-white shadow-soft" 
                  : "text-brand-secondary hover:bg-slate-50 dark:hover:bg-brand-bg"
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0" />
              <span>Page Editor (CMS)</span>
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex items-center justify-start space-x-3 px-4 py-3.5 rounded-[18px] font-sans text-sm font-medium transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "insights" 
                  ? "bg-brand-primary text-white shadow-soft" 
                  : "text-brand-secondary hover:bg-slate-50 dark:hover:bg-brand-bg"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Insights & Blogs</span>
              {insightsList.length > 0 && (
                <span className={`ml-auto text-2xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === "insights" ? "bg-white/25 text-white" : "bg-slate-100 dark:bg-brand-bg text-slate-600"
                }`}>
                  {insightsList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`flex items-center justify-start space-x-3 px-4 py-3.5 rounded-[18px] font-sans text-sm font-medium transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "cms" 
                  ? "bg-brand-primary text-white shadow-soft" 
                  : "text-brand-secondary hover:bg-slate-50 dark:hover:bg-brand-bg"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Firm Details</span>
            </button>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: CLIENT SUBMISSIONS */}
              {activeTab === "submissions" && (
                <motion.div
                  key="submissions-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* FILTERS PANEL */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] p-4 shadow-sm">
                    {/* Search */}
                    <div className="relative w-full sm:flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by client, email, service description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50/50 dark:bg-brand-bg border border-brand-border outline-none pl-10 pr-4 py-2.5 rounded-[16px] w-full font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300"
                      />
                    </div>
                    
                    {/* Region Selector */}
                    <div className="flex gap-1 bg-slate-100 dark:bg-brand-bg p-1 rounded-[14px] w-full sm:w-auto shrink-0">
                      {(["all", "india", "uae"] as const).map((region) => (
                        <button
                          key={region}
                          onClick={() => setFilterRegion(region)}
                          className={`flex-1 sm:flex-initial text-center px-4 py-1.5 rounded-[10px] font-sans text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${
                            filterRegion === region
                              ? "bg-white dark:bg-[#121826] text-brand-primary shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>

                    {/* Refresh Button */}
                    <button
                      onClick={handleRefreshSubmissions}
                      disabled={isRefreshing}
                      className="p-2.5 border border-brand-border hover:bg-slate-50 dark:hover:bg-brand-bg text-slate-600 rounded-[14px] bg-white dark:bg-[#121826] transition-all cursor-pointer disabled:opacity-50 shrink-0"
                      title="Refresh List"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* SUBMISSIONS LIST & DETAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Submissions List */}
                    <div className={`${selectedSubmission ? "md:col-span-5" : "md:col-span-12"} space-y-4`}>
                      {filteredSubmissions.length === 0 ? (
                        <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] p-12 text-center shadow-sm">
                          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <h3 className="font-sans text-sm font-semibold text-brand-primary">No submissions found</h3>
                          <p className="font-sans text-xs text-brand-secondary mt-1">
                            {submissions.length === 0 
                              ? "No client enquiries have been received yet." 
                              : "No enquiries match your search criteria."}
                          </p>
                        </div>
                      ) : (
                        filteredSubmissions.map((sub) => {
                          const isUAE = sub.serviceRequired.toLowerCase().includes("uae") || 
                                        sub.message.toLowerCase().includes("dubai") ||
                                        sub.message.toLowerCase().includes("uae");
                          const submissionDate = new Date(sub.submittedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          });

                          return (
                            <div
                              key={sub.id}
                              onClick={() => setSelectedSubmission(sub)}
                              className={`bg-white dark:bg-[#121826] border p-5 rounded-[24px] transition-all duration-300 cursor-pointer text-left relative group shadow-sm flex flex-col justify-between min-h-[140px] hover:border-brand-primary/40 ${
                                selectedSubmission?.id === sub.id 
                                  ? "border-brand-primary ring-1 ring-brand-primary" 
                                  : "border-brand-border"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-3xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    isUAE 
                                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900" 
                                      : "bg-emerald-50 dark:bg-emerald-950/20 text-brand-accent border border-emerald-100 dark:border-emerald-900"
                                  }`}>
                                    {isUAE ? "UAE Track" : "India Track"}
                                  </span>
                                  <span className="font-mono text-3xs text-slate-400">
                                    {submissionDate}
                                  </span>
                                </div>
                                <h3 className="font-sans text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                                  {sub.fullName}
                                </h3>
                                {sub.companyName && (
                                  <p className="font-sans text-2xs text-slate-400 mt-0.5 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {sub.companyName}
                                  </p>
                                )}
                                <p className="font-sans text-xs text-brand-secondary mt-2 line-clamp-1">
                                  {sub.serviceRequired}
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-brand-divider pt-3 mt-3">
                                <span className="font-sans text-3xs text-slate-400 truncate max-w-[70%]">
                                  {sub.emailAddress}
                                </span>
                                
                                <button
                                  onClick={(e) => handleDeleteSubmission(sub.id, e)}
                                  className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Detailed View Panel */}
                    <AnimatePresence>
                      {selectedSubmission && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="md:col-span-7 bg-white dark:bg-[#121826] border border-brand-border rounded-[28px] p-6 md:p-8 shadow-md sticky top-[130px] text-left"
                        >
                          <div className="flex items-center justify-between border-b border-brand-divider pb-4 mb-5">
                            <h2 className="font-display text-2xl text-brand-primary font-normal">
                              Client Consultation Detail
                            </h2>
                            <button
                              onClick={() => setSelectedSubmission(null)}
                              className="text-slate-400 hover:text-brand-primary p-1 bg-slate-50 dark:bg-brand-bg rounded-full transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-5">
                            <div>
                              <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                Client Representative
                              </span>
                              <p className="font-sans text-base font-semibold text-brand-primary">
                                {selectedSubmission.fullName}
                              </p>
                              {selectedSubmission.companyName && (
                                <p className="font-sans text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{selectedSubmission.companyName}</span>
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-y border-brand-divider py-4">
                              <div>
                                <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                  Email Address
                                </span>
                                <a 
                                  href={`mailto:${selectedSubmission.emailAddress}`}
                                  className="font-sans text-xs text-brand-accent hover:underline break-all flex items-center gap-1"
                                >
                                  {selectedSubmission.emailAddress}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <div>
                                <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                  Phone Number
                                </span>
                                <a 
                                  href={`tel:${selectedSubmission.phoneNumber}`}
                                  className="font-sans text-xs text-brand-accent hover:underline flex items-center gap-1"
                                >
                                  {selectedSubmission.phoneNumber}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            <div>
                              <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                Service Selected
                              </span>
                              <div className="inline-block bg-slate-50 dark:bg-brand-bg border border-brand-border rounded-[12px] px-3.5 py-1.5 font-sans text-xs text-brand-primary">
                                {selectedSubmission.serviceRequired}
                              </div>
                            </div>

                            <div>
                              <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                Brief Inquiry
                              </span>
                              <div className="bg-slate-50/50 dark:bg-brand-bg border border-brand-border rounded-[18px] p-4 font-sans text-xs text-brand-primary leading-relaxed whitespace-pre-wrap">
                                {selectedSubmission.message}
                              </div>
                            </div>

                            <div>
                              <span className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                                Record Meta
                              </span>
                              <p className="font-mono text-3xs text-slate-400">
                                Submitted ID: {selectedSubmission.id} <br />
                                Submitted On: {new Date(selectedSubmission.submittedAt).toLocaleString("en-IN")}
                              </p>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-brand-divider">
                              <a
                                href={`https://wa.me/${selectedSubmission.phoneNumber.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center space-x-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-brand-accent py-2.5 rounded-[14px] font-sans text-xs font-semibold transition-all duration-200"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp Contact</span>
                              </a>
                              
                              <button
                                onClick={(e) => handleDeleteSubmission(selectedSubmission.id, e)}
                                className="inline-flex items-center justify-center space-x-2 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-600 px-4 py-2.5 rounded-[14px] font-sans text-xs font-semibold transition-all duration-200 cursor-pointer outline-none"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Record</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: WP-ELEMENTOR PAGE EDITOR */}
              {activeTab === "page_editor" && (
                <motion.div
                  key="page-editor-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-[#121826] border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-divider pb-4 mb-6">
                    <div>
                      <h2 className="font-display text-2xl text-brand-primary font-normal">
                        Page Content Manager
                      </h2>
                      <p className="font-sans text-xs text-brand-secondary mt-1">
                        Select a page to modify its sections and visual components.
                      </p>
                    </div>

                    {/* Page selector pills */}
                    <div className="flex gap-1 bg-slate-100 dark:bg-brand-bg p-1 rounded-[14px] mt-4 sm:mt-0">
                      {(["home", "about", "founder"] as const).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setSelectedPage(page)}
                          className={`px-4 py-2 rounded-[10px] font-sans text-xs font-semibold capitalize transition-all cursor-pointer ${
                            selectedPage === page
                              ? "bg-white dark:bg-[#121826] text-brand-primary shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {page} Page
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLoadingSettings ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <RefreshCw className="w-8 h-8 text-brand-accent animate-spin" />
                      <p className="font-sans text-xs text-brand-secondary">Loading page configurations...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSavePageSettings} className="space-y-6">
                    {/* HOME PAGE FIELDS */}
                    {selectedPage === "home" && (
                      <div className="space-y-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Hero Title</label>
                          <input
                            type="text"
                            value={pageSettings.home.heroTitle}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              home: { ...pageSettings.home, heroTitle: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="JOYCE J CHARUVILA & ASSOCIATES"
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Hero Subtitle</label>
                          <textarea
                            rows={3}
                            value={pageSettings.home.heroSubtitle}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              home: { ...pageSettings.home, heroSubtitle: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all resize-none"
                            placeholder="Describe firm operations briefly..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Hero Image (Public URL Path)</label>
                          <input
                            type="text"
                            value={pageSettings.home.heroImage}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              home: { ...pageSettings.home, heroImage: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="/images/hero/hero-office.webp"
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Firm Objective Statement</label>
                          <textarea
                            rows={4}
                            value={pageSettings.home.objectiveText}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              home: { ...pageSettings.home, objectiveText: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all resize-none"
                            placeholder="Write main firm objective quote..."
                          />
                        </div>
                      </div>
                    )}

                    {/* ABOUT PAGE FIELDS */}
                    {selectedPage === "about" && (
                      <div className="space-y-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Founder Title Header</label>
                          <input
                            type="text"
                            value={pageSettings.about.heading}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              about: { ...pageSettings.about, heading: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="CA Joyce J Charuvila, MCom, ACA, CMA Final"
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Biography Paragraphs (Separate paragraph blocks by double-newlines)
                          </label>
                          <textarea
                            rows={8}
                            value={aboutBioText}
                            onChange={(e) => setAboutBioText(e.target.value)}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="Write paragraphs here. Use two new lines to separate blocks..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Founder Portrait Image Path</label>
                          <input
                            type="text"
                            value={pageSettings.about.portraitImage}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              about: { ...pageSettings.about, portraitImage: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="/images/founder/portrait.webp"
                          />
                        </div>
                      </div>
                    )}

                    {/* FOUNDER PAGE FIELDS */}
                    {selectedPage === "founder" && (
                      <div className="space-y-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Founder Credentials Suffix</label>
                          <input
                            type="text"
                            value={pageSettings.founder.credentials}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              founder: { ...pageSettings.founder, credentials: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="MCom, ACA, CMA Final // Chartered Accountant"
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Biography Text (Separate paragraphs by double-newlines)
                          </label>
                          <textarea
                            rows={8}
                            value={founderBioText}
                            onChange={(e) => setFounderBioText(e.target.value)}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="Write principal biography..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Philosophy Quote</label>
                          <textarea
                            rows={3}
                            value={pageSettings.founder.philosophyText}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              founder: { ...pageSettings.founder, philosophyText: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all resize-none"
                            placeholder="Providing businesses with clear guidance..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">Portrait Image Path</label>
                          <input
                            type="text"
                            value={pageSettings.founder.portraitImage}
                            onChange={(e) => setPageSettings({
                              ...pageSettings,
                              founder: { ...pageSettings.founder, portraitImage: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                            placeholder="/images/founder/portrait.webp"
                          />
                        </div>

                        {/* TIMELINE MANAGER */}
                        <div className="space-y-4 pt-4 border-t border-brand-divider">
                          <div className="flex items-center justify-between">
                            <h3 className="font-sans text-sm font-bold text-brand-primary uppercase tracking-wider">
                              Timeline of Experience
                            </h3>
                            <button
                              type="button"
                              onClick={handleAddTimelineEvent}
                              className="inline-flex items-center space-x-1.5 border border-brand-border hover:bg-slate-50 dark:hover:bg-brand-bg px-3 py-1.5 rounded-[12px] font-sans text-xs font-semibold transition-all cursor-pointer outline-none text-brand-accent"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Year Event</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {pageSettings.founder.timeline && pageSettings.founder.timeline.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4 p-4 border border-brand-border rounded-[18px] bg-slate-50/50 dark:bg-brand-bg items-start">
                                <div className="w-[100px] flex flex-col space-y-1.5 shrink-0">
                                  <label className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold">Year</label>
                                  <input
                                    type="text"
                                    value={item.year}
                                    onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                                    className="bg-white dark:bg-[#121826] border border-brand-border outline-none py-1.5 px-2.5 rounded-[10px] font-sans text-xs text-brand-primary"
                                    placeholder="2026"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col space-y-3">
                                  <div className="flex flex-col space-y-1">
                                    <label className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold">Event Title</label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                                      className="bg-white dark:bg-[#121826] border border-brand-border outline-none py-1.5 px-2.5 rounded-[10px] font-sans text-xs text-brand-primary w-full"
                                      placeholder="Senior Controller Roles"
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    <label className="font-sans text-4xs uppercase tracking-widest text-slate-400 font-bold">Details</label>
                                    <textarea
                                      rows={2}
                                      value={item.description}
                                      onChange={(e) => handleTimelineChange(idx, "description", e.target.value)}
                                      className="bg-white dark:bg-[#121826] border border-brand-border outline-none py-1.5 px-2.5 rounded-[10px] font-sans text-xs text-brand-primary w-full resize-none"
                                      placeholder="Explain responsibilities..."
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTimelineEvent(idx)}
                                  className="text-slate-400 hover:text-red-600 transition-colors p-2 mt-4 outline-none cursor-pointer"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* STATUS ALERTS */}
                    {settingsSaveStatus.success && (
                      <div className="bg-emerald-50 border border-emerald-200 text-brand-accent px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Page settings saved and caches cleared successfully.</span>
                      </div>
                    )}
                    {settingsSaveStatus.error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{settingsSaveStatus.error}</span>
                      </div>
                    )}

                    {/* SAVE BUTTON */}
                    <div className="pt-4 border-t border-brand-divider flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white px-8 py-3.5 rounded-[18px] font-sans font-medium transition-all duration-300 shadow-soft disabled:opacity-70 cursor-pointer outline-none"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingSettings ? "Saving Settings..." : "Save Page Contents"}</span>
                      </button>
                    </div>

                  </form>
                  )}
                </motion.div>
              )}

              {/* TAB 3: INSIGHTS & BLOGS */}
              {activeTab === "insights" && (
                <motion.div
                  key="insights-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  
                  {/* INSIGHTS SUB-HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] p-6 shadow-sm gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-brand-primary font-normal">
                        Bulletin & Insights Library
                      </h2>
                      <p className="font-sans text-xs text-brand-secondary mt-1">
                        Write local regulatory guides or trigger the automated Dev.to API fetcher to aggregate financial articles.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleFetchDevTo}
                        disabled={isFetchingDevTo}
                        className="inline-flex items-center space-x-1.5 border border-[#E2E8F0] dark:border-brand-border bg-white dark:bg-brand-bg hover:bg-slate-50 px-4 py-2.5 rounded-[16px] font-sans text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <Sparkles className="w-4 h-4 text-brand-accent" />
                        <span>{isFetchingDevTo ? "Fetching Articles..." : "Fetch Automatically"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingInsight(false);
                          setInsightForm({
                            slug: "",
                            title: "",
                            category: "GST",
                            readTime: "5 min read",
                            date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                            author: "CA Joyce J Charuvila",
                            excerpt: "",
                            content: "",
                            tags: []
                          });
                          setTagInput("");
                          setShowInsightForm(!showInsightForm);
                        }}
                        className="inline-flex items-center space-x-1.5 bg-brand-primary hover:bg-brand-accent text-white px-4 py-2.5 rounded-[16px] font-sans text-xs font-semibold transition-all cursor-pointer outline-none"
                      >
                        {showInsightForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{showInsightForm ? "Close Form" : "Create Article"}</span>
                      </button>
                    </div>
                  </div>

                  {/* FORM BLOCK OR ARTICLE LISTING */}
                  <AnimatePresence mode="wait">
                    {showInsightForm ? (
                      <motion.div
                        key="insight-form-block"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-[#121826] border border-brand-border rounded-[32px] p-8 shadow-md"
                      >
                        <h3 className="font-display text-xl text-brand-primary font-normal mb-6">
                          {isEditingInsight ? "Edit Regulatory Article" : "Write Regulatory Article"}
                        </h3>

                        <form onSubmit={handleSaveInsight} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-sans text-xs font-semibold text-brand-primary">Article Title *</label>
                              <input
                                type="text"
                                required
                                value={insightForm.title}
                                onChange={(e) => {
                                  const title = e.target.value;
                                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                                  setInsightForm({
                                    ...insightForm,
                                    title,
                                    slug: isEditingInsight ? insightForm.slug : slug
                                  });
                                }}
                                className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                                placeholder="GST Return Filing Deadline Extended"
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-sans text-xs font-semibold text-brand-primary">Article URL Slug *</label>
                              <input
                                type="text"
                                required
                                disabled={isEditingInsight}
                                value={insightForm.slug}
                                onChange={(e) => setInsightForm({ ...insightForm, slug: e.target.value })}
                                className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all disabled:opacity-50"
                                placeholder="gst-return-filing-deadline"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-sans text-xs font-semibold text-brand-primary">Category *</label>
                              <select
                                value={insightForm.category}
                                onChange={(e) => setInsightForm({ ...insightForm, category: e.target.value })}
                                className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                              >
                                <option value="GST">GST</option>
                                <option value="Income Tax">Income Tax</option>
                                <option value="Corporate Tax">Corporate Tax</option>
                                <option value="VAT">VAT</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Audit">Audit</option>
                                <option value="Business Advisory">Business Advisory</option>
                                <option value="Compliance Updates">Compliance Updates</option>
                              </select>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                              <label className="font-sans text-xs font-semibold text-brand-primary">Reading Duration</label>
                              <input
                                type="text"
                                value={insightForm.readTime}
                                onChange={(e) => setInsightForm({ ...insightForm, readTime: e.target.value })}
                                className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                                placeholder="5 min read"
                              />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                              <label className="font-sans text-xs font-semibold text-brand-primary">Author Name</label>
                              <input
                                type="text"
                                value={insightForm.author}
                                onChange={(e) => setInsightForm({ ...insightForm, author: e.target.value })}
                                className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                                placeholder="CA Joyce J Charuvila"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-sans text-xs font-semibold text-brand-primary">Short Excerpt *</label>
                            <input
                              type="text"
                              required
                              value={insightForm.excerpt}
                              onChange={(e) => setInsightForm({ ...insightForm, excerpt: e.target.value })}
                              className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                              placeholder="Brief summary of the article contents for sitemaps and grid displays..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-sans text-xs font-semibold text-brand-primary">Article Body Content *</label>
                            <textarea
                              rows={10}
                              required
                              value={insightForm.content}
                              onChange={(e) => setInsightForm({ ...insightForm, content: e.target.value })}
                              className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                              placeholder="Write detailed regulatory guidance and notes here..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-sans text-xs font-semibold text-brand-primary">Tags (Comma-separated)</label>
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                              placeholder="taxation, gst, uae, updates"
                            />
                          </div>

                          {/* STATUS ALERTS */}
                          {insightStatus.success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-brand-accent px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2 mb-4">
                              <CheckCircle className="w-4 h-4 shrink-0" />
                              <span>Article successfully saved.</span>
                            </div>
                          )}
                          {insightStatus.error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2 mb-4">
                              <X className="w-4 h-4 shrink-0" />
                              <span>{insightStatus.error}</span>
                            </div>
                          )}

                          {/* SAVE BUTTON */}
                          <div className="pt-4 border-t border-brand-divider flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowInsightForm(false);
                                setIsEditingInsight(false);
                              }}
                              className="inline-flex items-center justify-center border border-brand-border bg-white dark:bg-brand-bg hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-[16px] font-sans text-xs font-semibold transition-all cursor-pointer outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingInsight}
                              className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-accent text-white px-6 py-2.5 rounded-[16px] font-sans text-xs font-semibold transition-all cursor-pointer disabled:opacity-70 outline-none"
                            >
                              <Save className="w-4 h-4 mr-1.5" />
                              <span>{isSavingInsight ? "Saving..." : "Publish Article"}</span>
                            </button>
                          </div>

                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="insight-list-block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {isLoadingInsights ? (
                          <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] p-12 text-center shadow-sm">
                            <RefreshCw className="w-8 h-8 text-brand-accent mx-auto animate-spin mb-3" />
                            <p className="font-sans text-xs text-brand-secondary">Querying blog database...</p>
                          </div>
                        ) : insightsList.length === 0 ? (
                          <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] p-12 text-center shadow-sm">
                            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-sans text-sm font-semibold text-brand-primary">No articles published</h3>
                            <p className="font-sans text-xs text-brand-secondary mt-1">
                              Publish a manual article or click &quot;Fetch Automatically&quot; to aggregate Dev.to insights.
                            </p>
                          </div>
                        ) : (
                          insightsList.map((item) => (
                            <div
                              key={item.slug}
                              className="bg-white dark:bg-[#121826] border border-brand-border p-6 rounded-[24px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-primary/45"
                            >
                              <div className="space-y-1.5 text-left flex-1 min-w-0">
                                <div className="flex items-center space-x-2 text-3xs font-semibold text-brand-accent uppercase tracking-wider">
                                  <span>{item.category}</span>
                                  <span>•</span>
                                  <span className="text-slate-400 font-mono font-normal">{item.date}</span>
                                </div>
                                <h3 className="font-sans text-sm font-bold text-brand-primary truncate">
                                  {item.title}
                                </h3>
                                <p className="font-sans text-xs text-brand-secondary line-clamp-1">
                                  {item.excerpt}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => handleEditInsight(item)}
                                  className="p-2 border border-brand-border hover:bg-slate-50 dark:hover:bg-brand-bg rounded-[12px] text-slate-600 transition-all cursor-pointer outline-none"
                                  title="Edit article"
                                >
                                  <FileEdit className="w-3.5 h-3.5 text-brand-accent" />
                                </button>
                                <button
                                  onClick={() => handleDeleteInsight(item.slug)}
                                  className="p-2 border border-red-100 hover:bg-red-50 text-red-600 rounded-[12px] transition-all cursor-pointer outline-none"
                                  title="Delete article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}

              {/* TAB 4: FIRM DETAILS (ORIGINAL CMS) */}
              {activeTab === "cms" && (
                <motion.div
                  key="cms-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-[#121826] border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm text-left"
                >
                  <form onSubmit={handleSaveCompany} className="space-y-8">
                    
                    {/* General Settings */}
                    <div>
                      <h2 className="font-display text-2xl text-brand-primary font-normal mb-1">
                        General Registration Details
                      </h2>
                      <p className="font-sans text-xs text-brand-secondary mb-6 border-b border-brand-divider pb-3">
                        Update official numbers displayed across footers and about details.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Firm Registration Number (FRN)
                          </label>
                          <input
                            type="text"
                            placeholder="FRN No. (optional)"
                            value={companyForm.registrations?.frn || ""}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              registrations: { ...companyForm.registrations, frn: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            ICAI Membership Number
                          </label>
                          <input
                            type="text"
                            placeholder="Membership No. (optional)"
                            value={companyForm.registrations?.icaiMembership || ""}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              registrations: { ...companyForm.registrations, icaiMembership: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Configuration */}
                    <div>
                      <h2 className="font-display text-2xl text-brand-primary font-normal mb-1">
                        Contact Information
                      </h2>
                      <p className="font-sans text-xs text-brand-secondary mb-6 border-b border-brand-divider pb-3">
                        These channels route phone calls, emails, and direct WhatsApp queries.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            WhatsApp Number (With country code, no space)
                          </label>
                          <input
                            type="text"
                            placeholder="+919061680043"
                            value={companyForm.contact.whatsapp}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              contact: { ...companyForm.contact, whatsapp: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Display Phone Number
                          </label>
                          <input
                            type="text"
                            placeholder="+91 90616 80043"
                            value={companyForm.contact.phoneDisplay}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              contact: { ...companyForm.contact, phoneDisplay: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Primary Correspondence Email
                          </label>
                          <input
                            type="email"
                            value={companyForm.contact.email}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              contact: { ...companyForm.contact, email: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Google Maps Link (Share link from Maps)
                          </label>
                          <input
                            type="text"
                            placeholder="https://maps.google.com/..."
                            value={companyForm.contact.googleMapsLink || ""}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              contact: { ...companyForm.contact, googleMapsLink: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1.5 mt-6">
                        <label className="font-sans text-xs font-semibold text-brand-primary">
                          Office Physical Address
                        </label>
                        <input
                          type="text"
                          value={companyForm.contact.address}
                          onChange={(e) => setCompanyForm({
                            ...companyForm,
                            contact: { ...companyForm.contact, address: e.target.value }
                          })}
                          className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                      <h2 className="font-display text-2xl text-brand-primary font-normal mb-1">
                        Business Operation Hours
                      </h2>
                      <p className="font-sans text-xs text-brand-secondary mb-6 border-b border-brand-divider pb-3">
                        Configure hours displayed to prospective clients.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Weekdays (Mon - Fri)
                          </label>
                          <input
                            type="text"
                            value={companyForm.businessHours.weekdays}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              businessHours: { ...companyForm.businessHours, weekdays: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Saturdays
                          </label>
                          <input
                            type="text"
                            value={companyForm.businessHours.saturday}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              businessHours: { ...companyForm.businessHours, saturday: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-sans text-xs font-semibold text-brand-primary">
                            Sundays
                          </label>
                          <input
                            type="text"
                            value={companyForm.businessHours.sunday}
                            onChange={(e) => setCompanyForm({
                              ...companyForm,
                              businessHours: { ...companyForm.businessHours, sunday: e.target.value }
                            })}
                            className="bg-slate-50 dark:bg-brand-bg border border-brand-border outline-none py-2.5 px-4 rounded-[16px] font-sans text-sm text-brand-primary focus:border-brand-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Feedback */}
                    {companySaveStatus.success && (
                      <div className="bg-emerald-50 border border-emerald-200 text-brand-accent px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Firm settings successfully updated and saved.</span>
                      </div>
                    )}
                    
                    {companySaveStatus.error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[18px] font-sans text-xs flex items-center space-x-2">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{companySaveStatus.error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-brand-divider flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingCompany}
                        className="inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white px-8 py-3.5 rounded-[18px] font-sans font-medium transition-all duration-300 shadow-soft disabled:opacity-70 cursor-pointer outline-none"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingCompany ? "Saving Changes..." : "Save Settings"}</span>
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
