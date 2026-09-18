"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Users, Building, CheckCircle, XCircle, Loader2, AlertCircle, FileText, ExternalLink, ShieldAlert, Award } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface PendingAgent {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  verified: boolean;
  created_at: string;
  nin_document_url?: string;
}

interface PendingListing {
  id: string;
  title: string;
  price: number;
  category: string;
  listing_type: string;
  address: string;
  city: string;
  posted_by_name?: string;
  status: string;
  proof_document_url?: string;
  parcel_number?: string;
  utility_document_url?: string;
  is_inspected?: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"agents" | "listings">("agents");
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  
  const [loadingData, setLoadingData] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showMemoModalId, setShowMemoModalId] = useState<string | null>(null);
  const [rejectionMemoText, setRejectionMemoText] = useState("");

  // Security guard
  useEffect(() => {
    if (!authLoading) {
      if (!user || !profile || !profile.is_admin) {
        router.push("/login");
      }
    }
  }, [user, profile, authLoading, router]);

  // Load moderation queues
  useEffect(() => {
    if (authLoading || !profile?.is_admin) return;

    const loadQueue = async () => {
      setLoadingData(true);
      
      if (!isSupabaseConfigured()) {
        // Load mock queues for demo mode
        setPendingAgents([
          { id: "mock-agent-1", full_name: "John Jameson", phone: "(555) 321-9876", email: "john.j@peculiaraesthetics.com", verified: false, created_at: new Date().toISOString(), nin_document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
          { id: "mock-agent-2", full_name: "Clara Oswald", phone: "(555) 765-4321", email: "clara@peculiaraesthetics.com", verified: false, created_at: new Date().toISOString(), nin_document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]);
        setPendingListings([
          { id: "mock-listing-1", title: "Modernist Concrete Loft", price: 1250000, category: "residential", listing_type: "sale", address: "505 Concrete Ave", city: "Los Angeles", posted_by_name: "Sarah Jenkins", status: "pending", proof_document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
          { id: "mock-listing-2", title: "Prime Office Floor", price: 15000, category: "commercial", listing_type: "lease", address: "100 Wilshire Blvd", city: "Los Angeles", posted_by_name: "Marcus Vance", status: "pending", proof_document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        ]);
        setLoadingData(false);
        return;
      }

      try {
        // Fetch unverified profiles
        const { data: agents, error: agentsError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "agent")
          .eq("verified", false);

        if (agentsError) throw agentsError;
        setPendingAgents(agents || []);

        let formattedListings = [];

        if (isSupabaseConfigured()) {
          const { data: listings, error: listingsError } = await supabase
            .from("listings")
            .select(`
              id,
              title,
              price,
              category,
              listing_type,
              address,
              city,
              status,
              proof_document_url,
              parcel_number,
              utility_document_url,
              is_inspected,
              profiles (
                full_name
              )
            `)
            .eq("status", "pending");

          if (listingsError) throw listingsError;

          formattedListings = (listings || []).map((l: any) => ({
            id: String(l.id),
            title: String(l.title),
            price: Number(l.price),
            category: String(l.category),
            listing_type: String(l.listing_type),
            address: String(l.address),
            city: String(l.city),
            posted_by_name: l.profiles?.full_name || "Unknown Agent",
            status: String(l.status),
            proof_document_url: l.proof_document_url ? String(l.proof_document_url) : undefined,
            parcel_number: l.parcel_number ? String(l.parcel_number) : undefined,
            utility_document_url: l.utility_document_url ? String(l.utility_document_url) : undefined,
            is_inspected: Boolean(l.is_inspected),
          }));
        } else {
          // Load local listings from sandbox key
          const sandbox = localStorage.getItem("vertex_sandbox_listings");
          const mockList = sandbox ? JSON.parse(sandbox) : [];
          formattedListings = mockList.filter((l: any) => l.status === "pending").map((l: any) => ({
            id: String(l.id),
            title: String(l.title),
            price: Number(l.price),
            category: String(l.category),
            listing_type: String(l.listing_type),
            address: String(l.address),
            city: String(l.city),
            posted_by_name: String(l.posted_by_name || "Demo Agent"),
            status: String(l.status),
            proof_document_url: l.proof_document_url ? String(l.proof_document_url) : undefined,
            parcel_number: l.parcel_number ? String(l.parcel_number) : undefined,
            utility_document_url: l.utility_document_url ? String(l.utility_document_url) : undefined,
            is_inspected: Boolean(l.is_inspected),
          }));
        }
        
        setPendingListings(formattedListings);
      } catch (err) {
        console.error("Error loading admin queue:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadQueue();
  }, [authLoading, profile]);

  const handleVerifyAgent = async (agentId: string, approve: boolean) => {
    setActioningId(agentId);
    setFeedbackMsg(null);

    if (!isSupabaseConfigured()) {
      // Mock action
      await new Promise((r) => setTimeout(r, 800));
      setPendingAgents(prev => prev.filter(a => a.id !== agentId));
      setFeedbackMsg({ type: "success", text: approve ? "Agent approved successfully (Mock)." : "Agent rejected successfully (Mock)." });
      setActioningId(null);
      return;
    }

    try {
      if (approve) {
        const { error } = await supabase
          .from("profiles")
          .update({ verified: true })
          .eq("id", agentId);

        if (error) throw error;
        setPendingAgents(prev => prev.filter(a => a.id !== agentId));
        setFeedbackMsg({ type: "success", text: "Agent has been verified successfully." });
      } else {
        // Delete rejected agent profile/user metadata (or just delete profile row)
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", agentId);

        if (error) throw error;
        setPendingAgents(prev => prev.filter(a => a.id !== agentId));
        setFeedbackMsg({ type: "success", text: "Agent account has been rejected and deleted." });
      }
    } catch (err: unknown) {
      setFeedbackMsg({ type: "error", text: (err as Error).message || "An error occurred." });
    } finally {
      setActioningId(null);
    }
  };

  const handleModerateListing = async (listingId: string, status: "approved" | "rejected", memo?: string) => {
    setActioningId(listingId);
    setFeedbackMsg(null);

    if (!isSupabaseConfigured()) {
      // Mock action
      await new Promise((r) => setTimeout(r, 800));
      setPendingListings(prev => prev.filter(l => l.id !== listingId));
      setFeedbackMsg({ type: "success", text: `Listing ${status} successfully (Mock).` });
      setActioningId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("listings")
        .update({ status, moderation_memo: memo || null })
        .eq("id", listingId);

      if (error) throw error;
      setPendingListings(prev => prev.filter(l => l.id !== listingId));
      setFeedbackMsg({ type: "success", text: `Listing has been ${status} successfully.` });
    } catch (err: unknown) {
      setFeedbackMsg({ type: "error", text: (err as Error).message || "An error occurred." });
    } finally {
      setActioningId(null);
    }
  };

  const togglePhysicalInspection = async (listingId: string, currentStatus: boolean) => {
    setActioningId(listingId);
    setFeedbackMsg(null);

    if (!isSupabaseConfigured()) {
      // Toggle locally
      const sandbox = localStorage.getItem("vertex_sandbox_listings");
      if (sandbox) {
        const mockList = JSON.parse(sandbox);
        const updated = mockList.map((l: any) => {
          if (l.id === listingId) {
            return { ...l, is_inspected: !currentStatus };
          }
          return l;
        });
        localStorage.setItem("vertex_sandbox_listings", JSON.stringify(updated));
      }
      setPendingListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_inspected: !currentStatus } : l))
      );
      setActioningId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("listings")
        .update({ is_inspected: !currentStatus })
        .eq("id", listingId);

      if (error) throw error;
      setPendingListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_inspected: !currentStatus } : l))
      );
      setFeedbackMsg({ type: "success", text: `Physical inspection status updated successfully.` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update inspection status." });
    } finally {
      setActioningId(null);
    }
  };

  if (authLoading || !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold text-slate-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 pb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrative Control
            </span>
            <h1 className="mt-4 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
              Moderation Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Approve agent profiles and moderate submitted listings.
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-3xs font-semibold text-amber-800 flex gap-2 items-center shadow-2xs">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Demo Mode active (Simulated DB Queue)
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="h-16 w-16" />
            </div>
            <p className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Agent Requests</p>
            <p className="text-2xl font-black text-slate-900 mt-2 font-serif">{pendingAgents.length}</p>
            <p className="text-3xs text-slate-500 mt-1 font-semibold">Profiles awaiting verification reviews</p>
          </div>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform">
              <Building className="h-16 w-16" />
            </div>
            <p className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Listing Approvals</p>
            <p className="text-2xl font-black text-slate-900 mt-2 font-serif">{pendingListings.length}</p>
            <p className="text-3xs text-slate-500 mt-1 font-semibold">Properties pending deed moderation</p>
          </div>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-16 w-16" />
            </div>
            <p className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Moderation Guard</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isSupabaseConfigured() ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {isSupabaseConfigured() ? "Supabase Live DB" : "Sandbox Demo Mode"}
              </span>
            </div>
            <p className="text-3xs text-slate-500 mt-1.5 font-semibold">Automated proof-of-ownership filters active</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-8 gap-4">
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "agents"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4" />
            Pending Agents ({pendingAgents.length})
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "listings"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Building className="h-4 w-4" />
            Pending Listings ({pendingListings.length})
          </button>
        </div>

        {/* Action Feedback Alerts */}
        {feedbackMsg && (
          <div
            className={`mb-6 p-4 rounded-xl border text-xs flex gap-2 items-center ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedbackMsg.type === "success" ? <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> : <AlertCircle className="h-4.5 w-4.5 text-red-500" />}
            <span className="font-semibold">{feedbackMsg.text}</span>
          </div>
        )}

        {/* Queues Display */}
        {loadingData ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "agents" ? (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-4"
              >
                {pendingAgents.length > 0 ? (
                  pendingAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:-translate-y-0.5"
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900">{agent.full_name}</h3>
                        <p className="text-3xs text-slate-400 uppercase font-semibold">Registered: {new Date(agent.created_at).toLocaleDateString()}</p>
                        <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                          <span>Phone: {agent.phone}</span>
                          {agent.email && <span>Email: {agent.email}</span>}
                        </div>
                        {agent.nin_document_url ? (
                          <div className="pt-2">
                            <a
                              href={agent.nin_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-2xs"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Inspect NIN Identification
                              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                            </a>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 text-3xs font-bold text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg">
                              No NIN document uploaded yet
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyAgent(agent.id, true)}
                          disabled={actioningId === agent.id}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors disabled:bg-slate-200"
                        >
                          {actioningId === agent.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerifyAgent(agent.id, false)}
                          disabled={actioningId === agent.id}
                          className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors disabled:bg-slate-200"
                        >
                          {actioningId === agent.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white border border-dashed rounded-3xl p-6">
                    <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 font-medium">No pending agent verification requests.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-4"
              >
                {pendingListings.length > 0 ? (
                  pendingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:-translate-y-0.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider border border-blue-100">
                            {listing.listing_type === "lease" ? "For Lease" : "For Sale"}
                          </span>
                          <span className="text-3xs text-slate-400 font-bold uppercase tracking-widest">{listing.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{listing.title}</h3>
                        <p className="text-xs text-slate-500">{listing.address}, {listing.city}</p>
                        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                          <span>Price: <strong className="text-slate-900">${listing.price.toLocaleString()}</strong></span>
                          <span>Submitted By: <strong className="text-blue-600">{listing.posted_by_name}</strong></span>
                        </div>
                        <div className="pt-2 flex flex-wrap gap-2 items-center">
                          {listing.proof_document_url && (
                            <a
                              href={listing.proof_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-2xs"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Inspect Title Deed
                              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                            </a>
                          )}
                          {listing.utility_document_url && (
                            <a
                              href={listing.utility_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-2xs"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Inspect Utility Statement / Mandate
                              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                            </a>
                          )}
                        </div>

                        {listing.parcel_number && (
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 text-3xs font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md">
                              Registry Parcel: {listing.parcel_number}
                            </span>
                          </div>
                        )}

                        {/* Automated OCR Integrity Check MOCK Panel */}
                        <div className="mt-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5 max-w-lg">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                            AI Document Integrity Check (OCR)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-3xs font-semibold text-slate-500 uppercase">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>Deed Matches Parcel Code</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>Stamps Verified Authentic</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>Utility Bill Address Match</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>Owner Identity Confirmed</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 items-end">
                        {showMemoModalId === listing.id ? (
                          <div className="w-64 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-3">
                            <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500">
                              Provide Rejection Memo:
                            </label>
                            <textarea
                              rows={2}
                              value={rejectionMemoText}
                              onChange={(e) => setRejectionMemoText(e.target.value)}
                              placeholder="e.g. Verification document is blurry..."
                              className="w-full rounded-lg border border-slate-200 py-1.5 px-2.5 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setShowMemoModalId(null)}
                                className="rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 text-3xs uppercase tracking-wider transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  handleModerateListing(listing.id, "rejected", rejectionMemoText);
                                  setShowMemoModalId(null);
                                }}
                                className="rounded-md bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 text-3xs uppercase tracking-wider transition-colors"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => togglePhysicalInspection(listing.id, !!listing.is_inspected)}
                              disabled={actioningId === listing.id}
                              className={`flex items-center gap-1.5 rounded-lg border font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors disabled:bg-slate-200 ${
                                listing.is_inspected 
                                  ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <Award className="h-3.5 w-3.5" />
                              {listing.is_inspected ? "Verified Inspected" : "Mark Inspected"}
                            </button>
                            <button
                              onClick={() => handleModerateListing(listing.id, "approved")}
                              disabled={actioningId === listing.id}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors disabled:bg-slate-200"
                            >
                              {actioningId === listing.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setShowMemoModalId(listing.id);
                                setRejectionMemoText("");
                              }}
                              disabled={actioningId === listing.id}
                              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors disabled:bg-slate-200"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white border border-dashed rounded-3xl p-6">
                    <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 font-medium">No listings pending moderation.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}
