"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Briefcase, CheckCircle, FileText, Upload, AlertCircle, Loader2, Key } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  moderation_memo?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("Niche Specialist");
  const [bio, setBio] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [ninFile, setNinFile] = useState<File | null>(null);
  const [ninError, setNinError] = useState<string | null>(null);
  const [ninUrl, setNinUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const specialtiesOptions = [
    "Luxury Homes",
    "Residential Sales",
    "Commercial Leases",
    "Land Development",
    "Urban Rentals",
    "Investment Brokerage",
    "First-Time Buyers",
  ];

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load profile meta and listings
  useEffect(() => {
    if (!user) return;

    // Load standard info from profile hook
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setNinUrl(profile.nin_document_url || "");
    }

    // Load local meta
    const localMeta = JSON.parse(localStorage.getItem(`vertex_agent_meta_${user.id}`) || "{}");
    setTitle(localMeta.title || "Real Estate Advisor");
    setBio(localMeta.bio || "");
    setAvatarUrl(localMeta.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80");
    setSelectedSpecialties(localMeta.specialties || ["Residential Sales"]);

    // Fetch listings
    const fetchListings = async () => {
      setListingsLoading(true);
      if (!isSupabaseConfigured()) {
        // Load mock listings
        setMyListings([
          { id: "mock-1", title: "Modernist Concrete Loft", price: 1250000, category: "residential", status: "approved" },
          { id: "mock-2", title: "Sunset Strip Penthouse", price: 6500, category: "rental", status: "pending" },
          { id: "mock-3", title: "Downtown Office Plaza", price: 18500, category: "commercial", status: "rejected", moderation_memo: "Proof of ownership document is illegible. Please re-upload a clear copy." }
        ]);
        setListingsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("listings")
          .select("id, title, price, category, status, moderation_memo")
          .eq("posted_by", user.id);

        if (error) throw error;
        setMyListings(data || []);
      } catch (err) {
        console.error("Error fetching agent listings:", err);
      } finally {
        setListingsLoading(false);
      }
    };

    fetchListings();
  }, [user, profile]);

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setNinError("File size exceeds 10MB limit.");
        setNinFile(null);
        return;
      }
      setNinError(null);
      setNinFile(file);
    }
  };

  const handleUploadNIN = async () => {
    if (!ninFile || !user) return null;
    
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 1200));
      return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }

    const fileExt = ninFile.name.split(".").pop();
    const fileName = `nin_${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `identity/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("identity-documents")
      .upload(filePath, ninFile);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("identity-documents")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      let finalNinUrl = ninUrl;
      if (ninFile) {
        const uploadedUrl = await handleUploadNIN();
        if (uploadedUrl) {
          finalNinUrl = uploadedUrl;
          setNinUrl(uploadedUrl);
          setNinFile(null);
        }
      }

      // 1. Update Database (Profile)
      if (isSupabaseConfigured()) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            phone: phone,
            nin_document_url: finalNinUrl || null
          })
          .eq("id", user.id);

        if (updateError) throw updateError;
        await refreshProfile();
      }

      // 2. Update Local Storage for extended meta
      const meta = {
        title,
        bio,
        avatar_url: avatarUrl,
        specialties: selectedSpecialties
      };
      localStorage.setItem(`vertex_agent_meta_${user.id}`, JSON.stringify(meta));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError((err as Error).message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">Agent Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Manage profile bio, specialties, active listings and credentials.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {profile?.verified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-2xs font-extrabold tracking-widest uppercase text-amber-500 border border-amber-500/20 shadow-xs">
                <ShieldCheck className="h-4 w-4" />
                Verified Niche Specialist
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-2xs font-extrabold tracking-widest uppercase text-red-500 border border-red-500/20 shadow-xs">
                <AlertCircle className="h-4 w-4" />
                Verification Pending / Unverified
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar Card & NIN Verification */}
          <div className="space-y-8">
            {/* Profile Glance Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4 h-28 w-28 shrink-0">
                <Image
                  src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80"}
                  alt={fullName || "User Avatar"}
                  fill
                  sizes="112px"
                  className="rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                {profile?.verified && (
                  <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-md border-2 border-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                )}
              </div>
              
              <h2 className="text-md font-bold text-slate-800">{fullName || "Unnamed Agent"}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{title}</p>
              <p className="text-3xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{user.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-1 justify-center">
                {selectedSpecialties.slice(0, 3).map((spec) => (
                  <span key={spec} className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* NIN Verification Panel */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Key className="h-4.5 w-4.5 text-blue-600" />
                Account Verification
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Upload your National Identification Card or NIN certificate. Verified specialists get a golden shield on listings and are listed in the expert directory.
              </p>

              {ninUrl ? (
                <div className="rounded-xl bg-slate-50 border border-slate-200/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Submitted Document</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${profile?.verified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      {profile?.verified ? "Approved" : "Under Review"}
                    </span>
                  </div>
                  <a
                    href={ninUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    <FileText className="h-4 w-4" />
                    View Uploaded Identity.pdf
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50/50 transition-colors">
                    <label className="cursor-pointer block">
                      <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-700 block">Select Document File</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">PDF, PNG, JPG up to 10MB</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                      />
                    </label>
                  </div>

                  {ninFile && (
                    <div className="flex items-center justify-between bg-blue-50/40 border border-blue-100 rounded-xl px-3 py-2 text-xs">
                      <span className="font-semibold text-blue-800 truncate max-w-[70%]">{ninFile.name}</span>
                      <span className="text-3xs text-blue-500 shrink-0">{(ninFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  )}

                  {ninError && (
                    <p className="text-[10px] text-red-500 font-semibold">{ninError}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Edit Profile & Listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit details form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-6">
                <Briefcase className="h-4.5 w-4.5 text-blue-600" />
                Customize Professional Profile
              </h3>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Sarah Jenkins"
                      className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs font-medium placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="(555) 124-5678"
                      className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs font-medium placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Luxury Estate Specialist"
                      className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs font-medium placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                      Profile Avatar URL
                    </label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs font-medium placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                    Professional Biography
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your expertise, sales background, and local market knowledge..."
                    className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs font-medium placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white bg-slate-50/50 resize-none"
                  />
                </div>

                {/* Specialties Checklist */}
                <div>
                  <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
                    Areas of Specialty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {specialtiesOptions.map((specialty) => {
                      const isSelected = selectedSpecialties.includes(specialty);
                      return (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white shadow-3xs"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {specialty}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status messages */}
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200/50 rounded-xl px-4 py-3 text-xs font-semibold">
                    <CheckCircle className="h-4.5 w-4.5" />
                    Profile customizations saved successfully.
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200/50 rounded-xl px-4 py-3 text-xs font-semibold">
                    <AlertCircle className="h-4.5 w-4.5" />
                    {saveError}
                  </div>
                )}

                {/* Submit actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-55"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* My Listings queue */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-6">
                <FileText className="h-4.5 w-4.5 text-blue-600" />
                My Listings Queue
              </h3>

              {listingsLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              ) : myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800">{listing.title}</h4>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            listing.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : listing.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Category: <span className="capitalize font-semibold text-slate-600">{listing.category}</span> • Price: <span className="font-bold text-slate-700">${listing.price.toLocaleString()}</span>
                        </p>
                        
                        {/* Rejected memo indicator */}
                        {listing.status === "rejected" && listing.moderation_memo && (
                          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700 space-y-1">
                            <p className="font-bold flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Moderation Memo:
                            </p>
                            <p className="font-medium text-red-600/90 italic">"{listing.moderation_memo}"</p>
                          </div>
                        )}
                      </div>
                      
                      {listing.status === "approved" && (
                        <Link
                          href={`/listings/${listing.id}`}
                          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 text-3xs uppercase tracking-wider transition-colors shadow-2xs text-center shrink-0"
                        >
                          View Listing
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-xl py-12 text-center">
                  <p className="text-xs text-slate-400 font-medium">You haven&apos;t submitted any listings yet.</p>
                  <Link
                    href="/listings/new"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Submit a Listing &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
