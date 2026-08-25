"use client";

import { useState, useEffect } from "react";
import { 
  LogOut, Trash2, Save, 
  Settings, Inbox, ShieldCheck, RefreshCw, X,
  FileEdit, Image as ImageIcon, Briefcase, BookOpen, Trash, Plus, RotateCcw
} from "lucide-react";
import { CompanyInfo } from "@/types";

interface AdminDashboardProps {
  initialSubmissions: any[];
  company: CompanyInfo;
}

export default function AdminDashboard({ initialSubmissions, company }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"inbox" | "home" | "about" | "services" | "insights" | "recycle">("inbox");
  const [pageSettings, setPageSettings] = useState<any>({
    home: { heroTitle: "", heroSubtitle: "", heroImage: "", objectiveText: "" },
    about: { heading: "", bioParagraphs: [], portraitImage: "" }
  });
  
  const [enquiries, setEnquiries] = useState<any[]>(initialSubmissions);
  const [services, setServices] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [recycleItems, setRecycleItems] = useState<any[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Forms state
  const [serviceForm, setServiceForm] = useState<any>(null);
  const [insightForm, setInsightForm] = useState<any>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) window.location.reload();
    } catch (err) {}
  };

  const loadData = async () => {
    try {
      const [pgHome, pgAbout, srvRes, insRes, recRes, enqRes] = await Promise.all([
        fetch("/api/admin/page-settings?pageKey=home_settings").then(r => r.json()),
        fetch("/api/admin/page-settings?pageKey=about_settings").then(r => r.json()),
        fetch("/api/admin/services").then(r => r.json()),
        fetch("/api/admin/insights").then(r => r.json()),
        fetch("/api/admin/recycle").then(r => r.json()),
        fetch("/api/admin/enquiries").then(r => r.json())
      ]);
      setPageSettings({ home: pgHome.settings, about: pgAbout.settings });
      setServices(srvRes.services || []);
      setInsights(insRes.insights || []);
      setRecycleItems(recRes.recycle || []);
      if (enqRes.submissions) setEnquiries(enqRes.submissions);
    } catch (err) {}
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const handleSavePageSettings = async (page: "home" | "about") => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: `${page}_settings`, value: pageSettings[page] })
      });
      alert("Saved successfully!");
    } catch { alert("Error saving."); } finally { setIsSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) callback(data.url);
      else alert("Upload failed.");
    } catch (err) { alert("Upload error."); } finally { setUploadingImage(false); }
  };

  const handleSaveService = async () => {
    try {
      const method = serviceForm.id ? "PUT" : "POST";
      await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm)
      });
      setServiceForm(null);
      loadData();
    } catch {}
  };

  const handleDeleteService = async (id: string) => {
    if(!confirm("Move to Recycle Bin?")) return;
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    loadData();
  };

  const handleSaveInsight = async () => {
    try {
      const method = insightForm.isEdit ? "PUT" : "POST";
      const payload = {
        ...insightForm,
        tags: (insightForm.tags || "").toString().split(","),
        content: typeof insightForm.content === "string" ? insightForm.content.split("\n\n") : insightForm.content
      };
      await fetch("/api/admin/insights", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setInsightForm(null);
      loadData();
    } catch {}
  };

  const handleDeleteInsight = async (slug: string) => {
    if(!confirm("Move to Recycle Bin?")) return;
    await fetch(`/api/admin/insights?slug=${slug}`, { method: "DELETE" });
    loadData();
  };

  const handleDeleteEnquiry = async (id: string) => {
    if(!confirm("Move to Recycle Bin?")) return;
    await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
    loadData();
  };

  const handleRecycleAction = async (item: any, action: 'restore' | 'delete') => {
    await fetch("/api/admin/recycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, type: item.type, action })
    });
    loadData();
  };

  return (
    <div className="w-full min-h-[85vh] bg-slate-50/50 py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-divider pb-6 mb-10 gap-4 text-left">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-brand-accent uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Auditor Control Center</span>
            </div>
            <h1 className="font-display text-4xl font-normal text-brand-primary tracking-tight">
              Website Manager
            </h1>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center space-x-2 border bg-white px-5 py-2.5 rounded-[16px] font-sans text-sm font-medium shadow-sm hover:bg-slate-100">
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-2 p-1.5 bg-white border border-brand-border rounded-[24px] shadow-sm">
            {[
              { id: "inbox", label: "Client Inbox", icon: Inbox },
              { id: "home", label: "Home Page", icon: FileEdit },
              { id: "about", label: "About Page", icon: BookOpen },
              { id: "services", label: "Services", icon: Briefcase },
              { id: "insights", label: "Insights", icon: FileEdit },
              { id: "recycle", label: "Recycle Bin", icon: Trash },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-[18px] text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-brand-primary text-white shadow-soft" : "text-brand-secondary hover:bg-slate-50"
                }`}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 text-left">
            
            {/* INBOX */}
            {activeTab === "inbox" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <h2 className="text-2xl font-display text-brand-primary mb-6">Client Inbox</h2>
                <div className="space-y-4">
                  {enquiries.length === 0 ? <p className="text-slate-500">No new messages.</p> : enquiries.map(eq => (
                    <div key={eq.id} className="border p-4 rounded-xl flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{eq.fullName} ({eq.emailAddress}) - {eq.phoneNumber}</h4>
                        <p className="text-sm font-semibold text-brand-accent">{eq.serviceRequired}</p>
                        <p className="text-sm mt-2">{eq.message}</p>
                      </div>
                      <button onClick={() => handleDeleteEnquiry(eq.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOME */}
            {activeTab === "home" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <h2 className="text-2xl font-display text-brand-primary mb-6">Edit Home Page</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Main Headline</label>
                    <input type="text" value={pageSettings.home?.heroTitle || ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, home: {...prev.home, heroTitle: e.target.value}}))}
                      className="w-full border rounded-xl p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subheadline</label>
                    <textarea value={pageSettings.home?.heroSubtitle || ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, home: {...prev.home, heroSubtitle: e.target.value}}))}
                      className="w-full border rounded-xl p-3 h-24" />
                  </div>
                  <div className="border p-6 rounded-xl bg-slate-50">
                    <label className="block text-sm font-semibold mb-4">Background Image</label>
                    {pageSettings.home?.heroImage && <img src={pageSettings.home.heroImage} alt="Hero" className="w-48 h-32 object-cover rounded-xl mb-4 border" />}
                    <label className="bg-brand-primary text-white px-4 py-2 rounded-lg cursor-pointer">
                      Upload New Image
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, url => setPageSettings((prev: any) => ({...prev, home: {...prev.home, heroImage: url}})))} />
                    </label>
                    {uploadingImage && <span className="ml-4 font-semibold text-brand-accent">Uploading...</span>}
                  </div>
                  <button onClick={() => handleSavePageSettings("home")} className="bg-brand-accent hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
                    {isSaving ? "Saving..." : "Save Home Page"}
                  </button>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {activeTab === "about" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <h2 className="text-2xl font-display text-brand-primary mb-6">Edit About Page</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Heading</label>
                    <input type="text" value={pageSettings.about?.heading || ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, about: {...prev.about, heading: e.target.value}}))}
                      className="w-full border rounded-xl p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Biography (Paragraphs)</label>
                    <textarea value={pageSettings.about?.bioParagraphs ? pageSettings.about.bioParagraphs.join("\n\n") : ""} 
                      onChange={e => setPageSettings((prev: any) => ({...prev, about: {...prev.about, bioParagraphs: e.target.value.split("\n\n")}}))}
                      className="w-full border rounded-xl p-3 h-48" placeholder="Double line break to separate paragraphs" />
                  </div>
                  <div className="border p-6 rounded-xl bg-slate-50">
                    <label className="block text-sm font-semibold mb-4">Portrait Image</label>
                    {pageSettings.about?.portraitImage && <img src={pageSettings.about.portraitImage} alt="Portrait" className="w-32 h-32 object-cover rounded-xl mb-4 border" />}
                    <label className="bg-brand-primary text-white px-4 py-2 rounded-lg cursor-pointer">
                      Upload New Image
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, url => setPageSettings((prev: any) => ({...prev, about: {...prev.about, portraitImage: url}})))} />
                    </label>
                  </div>
                  <button onClick={() => handleSavePageSettings("about")} className="bg-brand-accent hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
                    {isSaving ? "Saving..." : "Save About Page"}
                  </button>
                </div>
              </div>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display text-brand-primary">Services Editor</h2>
                  <button onClick={() => setServiceForm({ region: "uae", title: "", description: "", price: "", features: [] })} className="bg-brand-accent text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Service
                  </button>
                </div>
                
                {serviceForm ? (
                  <div className="space-y-4 border p-6 rounded-xl">
                    <h3 className="font-bold text-lg">{serviceForm.id ? "Edit Service" : "New Service"}</h3>
                    <select value={serviceForm.region} onChange={e => setServiceForm({...serviceForm, region: e.target.value})} className="w-full border p-2 rounded-lg">
                      <option value="uae">UAE</option>
                      <option value="india">India</option>
                    </select>
                    <input type="text" placeholder="Title" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full border p-2 rounded-lg" />
                    <textarea placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full border p-2 rounded-lg" />
                    <input type="text" placeholder="Price (e.g. AED 1000)" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full border p-2 rounded-lg" />
                    <div className="border p-4 rounded-lg bg-slate-50">
                      <label className="block text-sm mb-2 font-semibold">Service Image/Icon</label>
                      {serviceForm.image_url && <img src={serviceForm.image_url} className="h-16 mb-2"/>}
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setServiceForm({...serviceForm, image_url: url}))} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleSaveService} className="bg-brand-primary text-white px-4 py-2 rounded-lg">Save Service</button>
                      <button onClick={() => setServiceForm(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-brand-primary">UAE Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.filter(s => s.region === 'uae').map(srv => (
                          <div key={srv.id} className="border p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold mt-2">{srv.title}</h4>
                              <p className="text-sm line-clamp-2 mt-1 text-slate-500">{srv.description}</p>
                            </div>
                            <div className="flex justify-between mt-4 border-t pt-3">
                              <button onClick={() => setServiceForm(srv)} className="text-brand-primary text-sm font-semibold">Edit</button>
                              <button onClick={() => handleDeleteService(srv.id)} className="text-red-500 text-sm font-semibold">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-brand-primary">India Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.filter(s => s.region === 'india').map(srv => (
                          <div key={srv.id} className="border p-4 rounded-xl flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold mt-2">{srv.title}</h4>
                              <p className="text-sm line-clamp-2 mt-1 text-slate-500">{srv.description}</p>
                            </div>
                            <div className="flex justify-between mt-4 border-t pt-3">
                              <button onClick={() => setServiceForm(srv)} className="text-brand-primary text-sm font-semibold">Edit</button>
                              <button onClick={() => handleDeleteService(srv.id)} className="text-red-500 text-sm font-semibold">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INSIGHTS */}
            {activeTab === "insights" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display text-brand-primary">Insights & Blogs</h2>
                  <button onClick={() => setInsightForm({ title: "", slug: "", category: "", content: "", isEdit: false })} className="bg-brand-accent text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Article
                  </button>
                </div>
                
                {insightForm ? (
                  <div className="space-y-4 border p-6 rounded-xl">
                    <h3 className="font-bold text-lg">{insightForm.isEdit ? "Edit Article" : "New Article"}</h3>
                    <input type="text" placeholder="URL Slug (e.g. tax-update-2026)" disabled={insightForm.isEdit} value={insightForm.slug} onChange={e => setInsightForm({...insightForm, slug: e.target.value})} className="w-full border p-2 rounded-lg disabled:bg-slate-100" />
                    <input type="text" placeholder="Title" value={insightForm.title} onChange={e => setInsightForm({...insightForm, title: e.target.value})} className="w-full border p-2 rounded-lg" />
                    <input type="text" placeholder="Category" value={insightForm.category} onChange={e => setInsightForm({...insightForm, category: e.target.value})} className="w-full border p-2 rounded-lg" />
                    <textarea placeholder="Article Content (paragraphs separated by blank lines)" value={typeof insightForm.content === 'string' ? insightForm.content : (insightForm.content || []).join('\n\n')} onChange={e => setInsightForm({...insightForm, content: e.target.value})} className="w-full border p-2 rounded-lg h-48" />
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleSaveInsight} className="bg-brand-primary text-white px-4 py-2 rounded-lg">Save Article</button>
                      <button onClick={() => setInsightForm(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insights.map(ins => (
                      <div key={ins.slug} className="border p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{ins.title}</h4>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{ins.category}</span>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setInsightForm({ ...ins, isEdit: true })} className="text-brand-primary text-sm font-semibold">Edit</button>
                          <button onClick={() => handleDeleteInsight(ins.slug)} className="text-red-500 text-sm font-semibold">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RECYCLE BIN */}
            {activeTab === "recycle" && (
              <div className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
                <h2 className="text-2xl font-display text-brand-primary mb-6">Recycle Bin</h2>
                <div className="space-y-3">
                  {recycleItems.length === 0 ? <p className="text-slate-500">Recycle bin is empty.</p> : recycleItems.map(item => (
                    <div key={item.id} className="border p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs uppercase bg-slate-100 px-2 py-1 rounded font-bold mr-2 text-slate-500">{item.type}</span>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleRecycleAction(item, 'restore')} className="text-emerald-600 flex items-center gap-1 text-sm font-bold">
                          <RotateCcw className="w-4 h-4"/> Restore
                        </button>
                        <button onClick={() => handleRecycleAction(item, 'delete')} className="text-red-500 flex items-center gap-1 text-sm font-bold">
                          <Trash className="w-4 h-4"/> Delete Forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
