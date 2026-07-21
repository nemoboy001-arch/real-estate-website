"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { PlusCircle, Info, Image as ImageIcon, MapPin, Building, Ruler, HelpCircle, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  category: z.enum(["residential", "luxury", "rental", "commercial"]),
  listingType: z.enum(["sale", "lease"]),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Square footage must be a positive number"),
  address: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  images: z.string().min(1, "Please supply at least one image URL. Separate multiple URLs with commas or line breaks."),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "residential",
      listingType: "sale",
    },
  });

  const selectedCategory = useWatch({ control, name: "category" }) || "residential";

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: ListingFormData) => {
    setError(null);
    setLoading(true);

    // Process images string to array of clean URLs
    const imageList = data.images
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const bedsCount = data.beds ? Number(data.beds) : undefined;
    const bathsCount = data.baths ? Number(data.baths) : undefined;

    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      listing_type: data.listingType,
      beds: data.category !== "commercial" ? bedsCount : null,
      baths: data.category !== "commercial" ? bathsCount : null,
      sqft: Number(data.sqft),
      address: data.address,
      city: data.city,
      zip: data.zip,
      images: imageList.length > 0 ? imageList : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
      posted_by: user?.id,
      status: "pending",
    };

    if (!isSupabaseConfigured()) {
      // Mock submit
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
      setSuccess(true);
      return;
    }

    try {
      const { error: insertError } = await supabase.from("listings").insert(payload);
      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred while creating the listing.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Double check user profile verified flag
  if (user && profile && !profile.verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-32 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">Verification Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Hi <strong>{profile.full_name}</strong>, your account is registered. However, agents are restricted from submitting listings until their credentials are confirmed by our administrator.
          </p>
          <div className="text-3xs font-semibold text-slate-400 bg-slate-100 rounded-xl px-4 py-2 uppercase tracking-wider">
            Current Status: Pending Verification
          </div>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-6 py-2.5 text-xs uppercase tracking-wider transition-colors w-full"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <PlusCircle className="h-3.5 w-3.5" />
            Agent Submissions
          </span>
          <h1 className="mt-4 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Submit A New Listing
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            List premium homes, luxury estates, and commercial spaces on Vertex.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex gap-2.5 items-start">
            <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center py-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 flex flex-col items-center max-w-md mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Submission Successful!</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your property listing has been queued for moderation. It will undergo zoning and metadata verification, and will appear on the public catalog once approved by an administrator.
            </p>
            <button
              onClick={() => router.push("/listings")}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider shadow-md transition-colors w-full"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
            
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
                Property Specifications
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Property Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Modernist Sunset Glass Estate"
                    {...register("title")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.title ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.title && <p className="text-3xs text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                {/* Niche Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Niche Category</label>
                  <select
                    {...register("category")}
                    className="w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                  >
                    <option value="residential">Residential</option>
                    <option value="luxury">Luxury Estates</option>
                    <option value="rental">Rentals</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Listing Type</label>
                  <select
                    {...register("listingType")}
                    className="w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                  >
                    <option value="sale">For Sale (Buy)</option>
                    <option value="lease">For Lease (Rent)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description Details</label>
                  <textarea
                    rows={5}
                    placeholder="Write a compelling overview of details, structural highlights, amenities, and landscaping..."
                    {...register("description")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 resize-none ${
                      errors.description ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.description && <p className="text-3xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>
              </div>
            </div>

            {/* 2. Specs & Location */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <Ruler className="h-4.5 w-4.5 text-blue-600" />
                Dimensions, Pricing & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500000"
                    {...register("price")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.price ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.price && <p className="text-3xs text-red-500 mt-1">{errors.price.message}</p>}
                </div>

                {/* Sqft */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Area (Sq Ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2800"
                    {...register("sqft")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.sqft ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.sqft && <p className="text-3xs text-red-500 mt-1">{errors.sqft.message}</p>}
                </div>

                {/* Beds / Baths (conditional on category !== commercial) */}
                {selectedCategory !== "commercial" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Bedrooms</label>
                      <input
                        type="number"
                        placeholder="3"
                        {...register("beds")}
                        className="w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Bathrooms</label>
                      <input
                        type="number"
                        placeholder="2.5"
                        {...register("baths")}
                        className="w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                      />
                    </div>
                  </>
                ) : null}
              </div>

              {/* Address Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Wilshire Blvd"
                    {...register("address")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.address ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.address && <p className="text-3xs text-red-500 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Los Angeles"
                    {...register("city")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.city ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.city && <p className="text-3xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 90017"
                    {...register("zip")}
                    className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                      errors.zip ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.zip && <p className="text-3xs text-red-500 mt-1">{errors.zip.message}</p>}
                </div>
              </div>
            </div>

            {/* 3. Media Links */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <ImageIcon className="h-4.5 w-4.5 text-blue-600" />
                Image Library Assets
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Image URLs</label>
                <textarea
                  rows={4}
                  placeholder="Paste Unsplash or static image URLs here. Separate multiple links with commas or place them on new lines."
                  {...register("images")}
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 resize-none ${
                    errors.images ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                  }`}
                />
                <p className="text-3xs text-slate-400 mt-1.5">
                  Example: https://images.unsplash.com/photo-1613490493576-7fde63acd811, https://images.unsplash.com/photo-1613977257363-707ba9348227
                </p>
                {errors.images && <p className="text-3xs text-red-500 mt-1">{errors.images.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-center text-xs uppercase tracking-wider shadow-md transition-colors disabled:bg-slate-300 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Details...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Submit Listing
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
