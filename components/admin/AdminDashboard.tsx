"use client";

import { useState, useEffect } from "react";
import { 
  LogOut, Trash2, Save, 
  Settings, Inbox, ShieldCheck, RefreshCw, X,
  FileEdit, Image as ImageIcon, Briefcase, BookOpen, Trash
} from "lucide-react";
import { CompanyInfo } from "@/types";

interface AdminDashboardProps {
  initialSubmissions: any[];
  company: CompanyInfo;
}

export default function AdminDashboard({ initialSubmissions, company }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "services" | "insights" | "recycle">("home");
  const [pageSettings, setPageSettings] = useState<any>({
    home: { heroTitle: "", heroSubtitle: "", heroImage: "", objectiveText: "" },
    about: { heading: "", bioParagraphs: [], portraitImage: "" },
    founder: { credentials: "", biography: [], timeline: [], philosophyText: "", portraitImage: "" }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) window.location.reload();
    } catch (err) {}
  };

  const loadPageSettings = async (page: "home" | "about" | "founder") => {
    try {
      const res = await fetch(`/api/admin/page-settings?pageKey=${page}_settings`);
      if (res.ok) {
        const result = await res.json();
        setPageSettings((prev: any) => ({ ...prev, [page]: result.settings }));
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadPageSettings("home");
    loadPageSettings("about");
    loadPageSettings("founder");
  }, []);

  const handleSavePageSettings = async (page: "home" | "about" | "founder") => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: `${page}_settings`, value: pageSettings[page] })
      });
      alert("Saved successfully!");
    } catch {
      alert("Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, page: string, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setPageSettings((prev: any) => ({
          ...prev,
          [page]: { ...prev[page], [field]: data.url }
        }));
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Upload error.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-slate-50/50 py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-divider pb-6 mb-10 gap-4 text-left">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-brand-accent uppercase tracking-widest mb-1.5 animate-none">
              <ShieldCheck className="w-4 h-4" />
              <span>Auditor Control Center</span>
            </div>
            <h1 className="font-display text-4xl font-normal text-brand-primary tracking-tight">
              Website Manager
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
          <div className="lg:col-span-3 flex flex-col gap-2 p-1.5 bg-white dark:bg-[#121826] border border-brand-border rounded-[24px] shadow-sm">
            {[
              { id: "home", label: "Home Page", icon: FileEdit },
              { id: "about", label: "About Page", icon: BookOpen },
              { id: "services", label: "Services", icon: Briefcase },
              { id: "insights", label: "Insights", icon: FileEdit },
              { id: "recycle", label: "Recycle Bin", icon: Trash },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-start space-x-3 px-4 py-3.5 rounded-[18px] font-sans text-sm font-medium transition-all duration-300 cursor-pointer outline-none ${
                  activeTab === tab.id 
                    ? "bg-brand-primary text-white shadow-soft" 
                    : "text-brand-secondary hover:bg-slate-50 dark:hover:bg-brand-bg"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9">
            {activeTab === "home" && (
              <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm text-left">
                <h2 className="text-2xl font-display text-brand-primary mb-6">Edit Home Page</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Main Headline (Hero Title)</label>
                    <input 
                      type="text" 
                      value={pageSettings.home.heroTitle || ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, home: {...prev.home, heroTitle: e.target.value}}))}
                      className="w-full border rounded-xl p-3" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Subheadline</label>
                    <textarea 
                      value={pageSettings.home.heroSubtitle || ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, home: {...prev.home, heroSubtitle: e.target.value}}))}
                      className="w-full border rounded-xl p-3 h-24" 
                    />
                  </div>

                  <div className="border border-brand-border p-6 rounded-xl bg-slate-50">
                    <label className="block text-sm font-semibold mb-4">Background Image</label>
                    {pageSettings.home.heroImage && (
                      <img src={pageSettings.home.heroImage} alt="Hero" className="w-48 h-32 object-cover rounded-xl mb-4 border" />
                    )}
                    <label className="bg-brand-primary text-white px-4 py-2 rounded-lg cursor-pointer">
                      Upload New Image
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageUpload(e, "home", "heroImage")} 
                      />
                    </label>
                    {uploadingImage && <span className="text-brand-accent ml-4 font-semibold">Uploading...</span>}
                  </div>
                  
                  <button onClick={() => handleSavePageSettings("home")} className="bg-brand-accent hover:bg-emerald-600 transition-colors text-white px-6 py-3 rounded-xl font-bold mt-4">
                    {isSaving ? "Saving..." : "Save Home Page"}
                  </button>
                </div>
              </div>
            )}

            {activeTab !== "home" && (
              <div className="bg-white dark:bg-[#121826] border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm text-center">
                 <h2 className="text-xl font-semibold mb-2 text-brand-primary">Module Updating...</h2>
                 <p className="text-brand-secondary">I am finishing the programming for the {activeTab} editor right now. It will appear here shortly.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
