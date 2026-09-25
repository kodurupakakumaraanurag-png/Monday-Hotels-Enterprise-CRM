"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  DollarSign,
  ShieldCheck,
  Webhook,
  Save,
  CheckCircle2,
  Globe,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "rates" | "security" | "webhooks">("portfolio");
  const [isSaved, setIsSaved] = useState(false);

  // Settings State
  const [currency, setCurrency] = useState("USD ($)");
  const [taxRate, setTaxRate] = useState("18%");
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [webhookUrl, setWebhookUrl] = useState("https://api.mondayhotels.com/v1/webhooks/pms-sync");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              System Settings & Enterprise Configuration
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Property Portfolio Controls, Revenue Rules, SSO Enforcements & Webhook Integrations
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {isSaved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Enterprise system configuration updated successfully across all cluster nodes.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "portfolio"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotel Portfolio</span>
        </button>

        <button
          onClick={() => setActiveTab("rates")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "rates"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Rate & Currency Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "security"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & SSO</span>
        </button>

        <button
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "webhooks"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Webhook className="w-4 h-4" />
          <span>API & Webhooks</span>
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "portfolio" && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400">Monday Hotels Enterprise Portfolio</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-100">Monday Hotels Grand Royale Mumbai</h4>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-stone-400">240 Luxury Suites • Marine Drive, Mumbai</p>
                <p className="text-xs text-stone-500">General Manager: Priya Sharma</p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-100">Monday Hotels Resort & Spa Goa</h4>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-stone-400">180 Beachfront Villas • Calangute Beach, Goa</p>
                <p className="text-xs text-stone-500">General Manager: Rajesh Nair</p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-100">Monday Hotels Palace Udaipur</h4>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-stone-400">110 Heritage Suites • Lake Pichola, Udaipur</p>
                <p className="text-xs text-stone-500">General Manager: Devendra Singh</p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-100">Monday Hotels Tech Hub Bengaluru</h4>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-stone-400">320 Business Suites • Indiranagar, Bengaluru</p>
                <p className="text-xs text-stone-500">General Manager: Sunita Rao</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rates" && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-amber-400">Revenue & Currency Engine</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Primary Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="USD ($)">USD ($) - US Dollars</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Default Luxury GST/Tax Rate</label>
                <input
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-amber-400">Enterprise Security & Identity Rules</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-stone-950 rounded-xl border border-stone-800">
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">Enforce SAML 2.0 / Okta Single Sign-On (SSO)</h4>
                  <p className="text-xs text-stone-400">Require all staff logins to authenticate via Monday Hotels SSO portal.</p>
                </div>
                <input
                  type="checkbox"
                  checked={ssoEnforced}
                  onChange={(e) => setSsoEnforced(e.target.checked)}
                  className="w-5 h-5 accent-amber-500"
                />
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <label className="block text-xs font-semibold text-stone-200">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full max-w-xs bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "webhooks" && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400">PMS & External API Webhooks</h3>

            <div>
              <label className="block text-xs text-stone-400 mb-1">PMS Integration Webhook Endpoint</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 font-mono"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
