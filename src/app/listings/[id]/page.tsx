"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Square,
  Sparkles,
  MapPin,
  Calendar,
  ArrowLeft,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { properties, agents, Property } from "@/data/mockData";
import MortgageCalculator from "@/components/property/MortgageCalculator";
import ContactAgentForm from "@/components/property/ContactAgentForm";
import MapMockup from "@/components/property/MapMockup";
import PropertyCard from "@/components/property/PropertyCard";
import { useFavorites } from "@/context/favoritecontext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import TourScheduler from "@/components/property/TourScheduler";
import AgentChat from "@/components/property/AgentChat";
import NeighborhoodInsights from "@/components/property/NeighborhoodInsights";
import VirtualTour from "@/components/property/VirtualTour";

interface PropertyDetailProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailProps) {
  const { id } = React.use(params);
  const [dbProperty, setDbProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Look for sandbox listing locally
      const sandbox = localStorage.getItem("vertex_sandbox_listings");
      if (sandbox) {
        const mockList = JSON.parse(sandbox);
        const found = mockList.find((l: any) => String(l.id) === String(id));
        if (found) {
          setDbProperty({
            id: String(found.id),
            title: found.title,
            category: found.category,
            listingType: found.listing_type || found.listingType,
            price: Number(found.price),
            beds: found.beds ? Number(found.beds) : undefined,
            baths: found.baths ? Number(found.baths) : undefined,
            sqft: Number(found.sqft),
            location: found.location || {
              address: found.address,
              city: found.city,
              zip: found.zip,
            },
            images: found.images && found.images.length > 0 ? found.images : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            amenities: ["Approved Asset", "Verified Listing"],
            agentId: found.posted_by || "demo-agent",
            description: found.description,
            featured: true,
            is_inspected: Boolean(found.is_inspected),
          } as any);
        }
      }
      return;
    }

    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) return;

        setDbProperty({
          id: data.id,
          title: data.title,
          category: data.category,
          listingType: data.listing_type,
          price: Number(data.price),
          beds: data.beds ? Number(data.beds) : undefined,
          baths: data.baths ? Number(data.baths) : undefined,
          sqft: Number(data.sqft),
          location: {
            address: data.address,
            city: data.city,
            zip: data.zip,
          },
          images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
          amenities: ["Approved Asset", "Verified Listing"],
          agentId: data.posted_by,
          description: data.description,
          featured: true,
          is_inspected: Boolean(data.is_inspected),
        } as any);
      } catch (err) {
        console.error("Error fetching single listing from Supabase:", err);
      }
    };

    fetchProperty();
  }, [id]);

  const property = dbProperty || properties.find((p) => p.id === id);

  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = property ? isFavorite(property.id) : false;

  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!property) {
    return notFound();
  }

  const agent = agents.find((a) => a.id === property.agentId) || agents[0];
  const similarProperties = properties
    .filter((p) => p.category === property.category && p.id !== property.id)
    .slice(0, 3);

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const isLuxury = property.category === "luxury";
  const isRental = property.category === "rental" || property.listingType === "lease";

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link & Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(property)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-xs"
              aria-label="Add to favorites"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors shadow-xs"
              aria-label="Share listing"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title, Badges & Price Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className={`rounded-full px-3 py-1 text-2xs font-extrabold tracking-wider uppercase ${
                isLuxury
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : property.category === "commercial"
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 text-white"
              }`}>
                {property.listingType === "lease" ? "For Lease" : "For Sale"}
              </span>
              <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-2xs font-bold uppercase tracking-wider">
                {property.category}
              </span>
              {(property as any).is_inspected && (
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-400 px-3 py-1 text-2xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Inspected & Verified by Vertex
                </span>
              )}
            </div>
            
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 ${isLuxury ? "font-serif text-slate-950" : ""}`}>
              {property.title}
            </h1>
            
            <p className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{property.location.address}, {property.location.city}, {property.location.zip}</span>
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <p className={`text-2xl sm:text-3xl font-black text-slate-900 ${isLuxury ? "text-amber-600 font-serif" : ""}`}>
              {isRental ? `$${property.price.toLocaleString()}/mo` : `$${property.price.toLocaleString()}`}
            </p>
            {property.hoa && property.hoa > 0 ? (
              <p className="text-3xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                + ${property.hoa.toLocaleString()}/mo HOA dues
              </p>
            ) : null}
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gallery, Specs, Description, Amenities, Maps, Mortgage */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Image slider */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-100 overflow-hidden shadow-sm group">
              <img
                src={property.images[activeImageIdx]}
                alt={`${property.title} - View ${activeImageIdx + 1}`}
                className="h-full w-full object-cover transition-all duration-300"
              />
              
              {/* Slideshow triggers */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:text-slate-900 shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:text-slate-900 shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dots tracker */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      activeImageIdx === idx ? "bg-white w-4" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.beds !== undefined && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs flex flex-col items-center text-center">
                  <Bed className="h-5 w-5 text-blue-600 mb-2" />
                  <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Bedrooms</span>
                  <span className="text-md font-bold text-slate-800 mt-1">{property.beds}</span>
                </div>
              )}
              {property.baths !== undefined && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs flex flex-col items-center text-center">
                  <Bath className="h-5 w-5 text-blue-600 mb-2" />
                  <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Bathrooms</span>
                  <span className="text-md font-bold text-slate-800 mt-1">{property.baths}</span>
                </div>
              )}
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs flex flex-col items-center text-center">
                <Square className="h-5 w-5 text-blue-600 mb-2" />
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Square Footage</span>
                <span className="text-md font-bold text-slate-800 mt-1">{property.sqft.toLocaleString()}</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs flex flex-col items-center text-center">
                <Calendar className="h-5 w-5 text-blue-600 mb-2" />
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Year Built</span>
                <span className="text-md font-bold text-slate-800 mt-1">{property.yearBuilt || "N/A"}</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                About This Property
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Amenities & Features
              </h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 360 Virtual Tour */}
            <VirtualTour propertyTitle={property.title} />

            {/* Map Mockup */}
            <MapMockup address={property.location.address} city={property.location.city} />

            {/* Neighborhood Guide & Insights */}
            <NeighborhoodInsights city={property.location.city} />

            {/* Tour Booking Scheduler */}
            <TourScheduler propertyId={property.id} propertyTitle={property.title} agentName={agent.name} />

            {/* Mortgage Calculator for sales, or Lease Information for leases */}
            {!isRental ? (
              <MortgageCalculator propertyPrice={property.price} hoa={property.hoa} />
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                  Lease Terms & Conditions
                </h3>
                <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-medium">Minimum Term</span>
                    <span className="font-bold text-slate-800">{property.leaseTerm || "12 Months"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-medium">Security Deposit</span>
                    <span className="font-bold text-slate-800">Equivalent to 1.5x monthly rent</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-medium">Available Date</span>
                    <span className="font-bold text-slate-800">Immediate Move-in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Utilities & Maintenance</span>
                    <span className="font-bold text-slate-800 text-right">Tenant responsible for electric, water & trash</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Contact Form */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <ContactAgentForm agent={agent} propertyName={property.title} />
              <AgentChat agent={agent} property={property} />
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-8">
              Similar Properties You Might Interest
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
