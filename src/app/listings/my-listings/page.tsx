"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, FileText, CheckCircle, Clock, XCircle, Trash2, ArrowRight, ShieldAlert, Upload, Loader2, Sparkles, Home } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface UserListing {
  id: string;
  title: string;
  price: number;
  category: string;
  listing_type: string;
  address: string;
  city: string;
  status: "pending" | "approved" | "rejected";
  moderation_memo?: string;
  created_at: string;
  images: string[];
}

export default function MyListingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const [listings, setListings] = useState<UserListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Verification Upload States
  const [ninFile, setNinFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load User's Listings
  useEffect(() => {
    if (!user) return;

    const fetchMyListings = async () => {
      setLoadingListings(true);

      if (!isSupabaseConfigured()) {
        // Load mock listings
        setListings([
          {
            id: "my-mock-1",
            title: "Luxury Beachfront Penthouse",
            price: 4500000,
            category: "luxury",
            listing_type: "sale",
            address: "102 Ocean Drive",
            city: "Miami",
            status: "approved",
            created_at: new Date().toISOString(),
            images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"]
          },
          {
            id: "my-mock-2",
            title: "Cozy Suburb Villa",
            price: 320000,
            category: "residential",
            listing_type: "sale",
            address: "44 Pine Crescent",
            city: "Houston",
            status: "rejected",
            moderation_memo: "Proof of ownership document is blurred and unreadable. Please submit a clearer copy of the Title Deed.",
            created_at: new Date().toISOString(),
            images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]
          }
        ]);
        setLoadingListings(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("posted_by", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        console.error("Error fetching agent listings:", err);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchMyListings();
  }, [user]);

  // Handle NIN Verification Upload
  const handleNinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size exceeds 10MB limit.");
        setNinFile(null);
        return;
      }
      setUploadError(null);
      setNinFile(file);
    }
  };

  const handleUploadNin = async () => {
    if (!ninFile || !user) return;
    setUploading(true);
    setUploadError(null);

    if (!isSupabaseConfigured()) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUploadSuccess(true);
      setUploading(false);
      return;
    }

    try {
      const fileExt = ninFile.name.split(".").pop();
      const fileName = `nin_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `identity/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("identity-documents")
        .upload(filePath, ninFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("identity-documents")
        .getPublicUrl(filePath);

      // Save URL to agent's profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ nin_document_url: publicUrlData.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUploadSuccess(true);
      if (refreshProfile) await refreshProfile();
    } catch (err: unknown) {
      setUploadError(((err as Error).message) || "Failed to upload NIN document.");
    } finally {
      setUploading(false);
    }
  };

  // Delete Listing Handler
  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;

    if (!isSupabaseConfigured()) {
      setListings(listings.filter((l) => l.id !== listingId));
      return;
    }

    try {
      const { error } = await supabase.from("listings").delete().eq("id", listingId);
      if (error) throw error;
      setListings(listings.filter((l) => l.id !== listingId));
    } catch (err) {
      alert("Error deleting listing: " + ((err as Error).message || "Database error"));
    }
  };

  if (authLoading || loadingListings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
              <Sparkles className="h-3 w-3" />
              Agent Console
            </span>
            <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight mt-3">
              My Submissions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your property listings, verify identity, and review administrative feedback.
            </p>
          </div>
          {profile?.verified && (
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Submit New Listing
            </Link>
          )}
        </div>

        {/* Verification Status Banner */}
        {!profile?.verified ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-8 items-start">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-500" />
            <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            
            <div className="space-y-3 flex-1">
              <h3 className="text-base font-bold text-slate-900">Identity Verification Required</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                Before you can post property listings, administrators must verify your identity. 
                Please upload a digital scan or high-resolution photo of your **National Identification Number (NIN)** card or slip.
              </p>

              {/* Upload Interface */}
              {profile?.nin_document_url || uploadSuccess ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2.5 mt-3 text-xs text-emerald-800 font-semibold">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  NIN document successfully uploaded and pending administrative review.
                </div>
              ) : (
                <div className="space-y-4 pt-3 max-w-md">
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${uploadError ? "border-red-400 bg-red-50/50" : ninFile ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 hover:border-blue-400 bg-slate-50/50"}`}>
                    <input
                      type="file"
                      id="nin-upload"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleNinFileChange}
                      className="hidden"
                    />
                    <label htmlFor="nin-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Upload className="h-4 w-4" />
                      </div>
                      {ninFile ? (
                        <div>
                          <p className="text-xs font-bold text-slate-900">{ninFile.name}</p>
                          <p className="text-3xs text-emerald-600 font-semibold mt-0.5">Attached ({(ninFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-slate-800">Attach digital or hardcopy NIN</p>
                          <p className="text-3xs text-slate-400 mt-0.5">Supported: PDF, PNG, JPG (Max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {uploadError && <p className="text-3xs text-red-500 font-semibold">{uploadError}</p>}

                  <button
                    onClick={handleUploadNin}
                    disabled={!ninFile || uploading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 text-xs uppercase tracking-wider shadow-xs transition-colors disabled:bg-slate-200"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        Submit Verification Request
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-3xl p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Your Broker Account is Verified</p>
              <p className="text-3xs text-slate-500 mt-0.5">You have full access to submit and update properties.</p>
            </div>
          </div>
        )}

        {/* Listings Queue Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Submission History</h2>
          
          {listings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Listing Image */}
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Status Badge overlays */}
                      <div className="absolute top-4 right-4">
                        {item.status === "approved" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 text-white px-3 py-1 text-3xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-3 py-1 text-3xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
                            <Clock className="h-3 w-3" />
                            Pending Review
                          </span>
                        )}
                        {item.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 text-white px-3 py-1 text-3xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Listing details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">
                            {item.category}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-3xs font-bold uppercase text-blue-600">
                            {item.listing_type === "lease" ? "For Lease" : "For Sale"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.address}, {item.city}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-50/50">
                        <span className="text-xs text-slate-500">Listed Price</span>
                        <span className="text-base font-extrabold text-slate-900">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Rejection / Moderation Memo banner */}
                      {item.moderation_memo && (
                        <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${item.status === "rejected" ? "bg-red-50/50 border-red-100 text-red-800" : "bg-blue-50/50 border-blue-100 text-blue-800"}`}>
                          <div className="flex items-start gap-2">
                            <FileText className={`h-4 w-4 shrink-0 mt-0.5 ${item.status === "rejected" ? "text-red-500" : "text-blue-500"}`} />
                            <div>
                              <p className="font-bold uppercase tracking-wider text-3xs mb-1">
                                {item.status === "rejected" ? "Reason for Rejection" : "Admin Feedback"}
                              </p>
                              <p className="opacity-90">{item.moderation_memo}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-3xs text-slate-400 font-medium">
                      Submitted: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {item.status === "approved" && (
                        <Link
                          href={`/listings/${item.id}`}
                          className="inline-flex items-center gap-1 text-3xs font-extrabold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                        >
                          View Property
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="inline-flex items-center gap-1 text-3xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-dashed rounded-3xl p-6">
              <Home className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-semibold">You haven&apos;t submitted any listings yet.</p>
              {profile?.verified && (
                <Link
                  href="/listings/new"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  Create your first listing &rarr;
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
