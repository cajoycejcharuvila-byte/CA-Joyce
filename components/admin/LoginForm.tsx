"use client";

import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reload to let the Server Component recheck the session cookie and render the dashboard
        window.location.reload();
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full space-y-8 bg-white border border-brand-border rounded-[32px] p-8 md:p-12 shadow-soft"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-50 border border-brand-border rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-brand-accent" />
          </div>
          <h2 className="font-display text-3xl font-normal text-brand-primary tracking-tight">
            Consultant Portal
          </h2>
          <p className="mt-2 font-sans text-xs text-brand-secondary">
            Authorized access only. Sign in to manage client enquiries and firm settings.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Address */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="font-sans text-xs font-semibold text-brand-primary">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 h-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border border-brand-border outline-none py-3 pl-11 pr-4 rounded-[18px] w-full font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="password" className="font-sans text-xs font-semibold text-brand-primary">
                Secret Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border border-brand-border outline-none py-3 pl-11 pr-10 rounded-[18px] w-full font-sans text-sm text-brand-primary focus:border-brand-primary transition-all duration-300"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-primary"
                >
                  {showPassword ? <EyeOff className="h-4 h-4" /> : <Eye className="h-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[18px] font-sans text-xs flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-accent text-white py-3.5 rounded-[20px] font-sans font-medium transition-all duration-300 shadow-soft disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying Access...</span>
              ) : (
                <span>Authenticate</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
