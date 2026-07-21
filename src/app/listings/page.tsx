"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal, Info } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import SearchFilterBar, { FilterState } from "@/components/property/SearchFilterBar";
import { properties, Property } from "@/data/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Initial filter settings
const initialFilters: FilterState = {
  search: "",
  category: "",
  listingType: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
  minSqft: "",
  agentId: "",
};

function ListingsContent() {
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [supabaseListings, setSupabaseListings] = useState<Property[]>([]);

  // Fetch approved listings from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "approved");

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Property[] = data.map((item: Record<string, unknown>) => ({
            id: String(item.id),
            title: String(item.title),
            category: item.category as Property["category"],
            listingType: item.listing_type as Property["listingType"],
            price: Number(item.price),
            beds: item.beds ? Number(item.beds) : undefined,
            baths: item.baths ? Number(item.baths) : undefined,
            sqft: Number(item.sqft),
            location: {
              address: String(item.address),
              city: String(item.city),
              zip: String(item.zip),
            },
            images: (item.images as string[]) && (item.images as string[]).length > 0 ? (item.images as string[]) : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            amenities: ["Approved Asset", "Verified Listing"],
            agentId: String(item.posted_by),
            description: String(item.description),
            featured: true,
          }));
          setSupabaseListings(mapped);
        }
      } catch (err) {
        console.error("Error querying Supabase approved listings:", err);
      }
    };

    fetchListings();
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Initialize filters from URL search params
  useEffect(() => {
    const updatedFilters = { ...initialFilters };
    let hasParams = false;

    searchParams.forEach((value, key) => {
      if (key in updatedFilters) {
        updatedFilters[key as keyof FilterState] = value;
        hasParams = true;
      }
    });

    if (hasParams) {
      setTimeout(() => {
        setFilters(updatedFilters);
      }, 0);
    }
  }, [searchParams]);

  // Handle individual filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset page to 1 on filter action
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // Perform filtration logic calculated on each render
  const filteredListings = (() => {
    const combined = supabaseListings.length > 0 ? [...supabaseListings, ...properties] : properties;
    let result = [...combined];

    // Search query check
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.location.zip.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Agent ID filter
    if (filters.agentId) {
      result = result.filter((p) => p.agentId === filters.agentId);
    }

    // Listing Type (Sale / Lease)
    if (filters.listingType) {
      result = result.filter((p) => p.listingType === filters.listingType);
    }

    // Price Bounds
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Beds
    if (filters.beds) {
      result = result.filter((p) => p.beds !== undefined && p.beds >= Number(filters.beds));
    }

    // Baths
    if (filters.baths) {
      result = result.filter((p) => p.baths !== undefined && p.baths >= Number(filters.baths));
    }

    // Area
    if (filters.minSqft) {
      result = result.filter((p) => p.sqft >= Number(filters.minSqft));
    }

    return result;
  })();

  // Paginated slices
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Browse Our Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredListings.length} matching properties
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            Filters
          </button>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-900"
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-900"
              }`}
              aria-label="List View"
            >
              <List className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <SearchFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              showExtendedFilters={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Display */}
      {paginatedListings.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-6"
          }
        >
          {paginatedListings.map((property) => {
            // For list view mode, let's render a custom inline style, or reuse property card
            if (viewMode === "list") {
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                    property.category === "luxury" ? "gold-gradient-border border-amber-200/50" : ""
                  }`}
                >
                  {/* Left: Image */}
                  <div className="relative aspect-video md:aspect-auto md:w-80 h-48 md:h-auto shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Right: Info */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider ${
                          property.category === "luxury" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {property.listingType === "lease" ? "For Lease" : "For Sale"}
                        </span>
                        <span className="text-3xs text-slate-400 font-bold uppercase tracking-widest">{property.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2 hover:text-blue-600 transition-colors">
                        <a href={`/listings/${property.id}`}>{property.title}</a>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{property.location.address}, {property.location.city}</p>
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2">{property.description}</p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50/50">
                      <div className="flex gap-4 text-xs text-slate-500">
                        {property.beds && <span><strong>{property.beds}</strong> Beds</span>}
                        {property.baths && <span><strong>{property.baths}</strong> Baths</span>}
                        <span><strong>{property.sqft.toLocaleString()}</strong> Sq Ft</span>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <span className="text-lg font-bold text-slate-900">
                          {property.category === "rental" || property.listingType === "lease"
                            ? `$${property.price.toLocaleString()}/mo`
                            : `$${property.price.toLocaleString()}`}
                        </span>
                        <a
                          href={`/listings/${property.id}`}
                          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 text-2xs uppercase tracking-wider transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return <PropertyCard key={property.id} property={property} />;
          })}
        </div>
      ) : (
        <div className="py-24 text-center rounded-3xl border-2 border-dashed border-slate-200 max-w-xl mx-auto flex flex-col items-center p-6">
          <Info className="h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Listings Match Your Criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Try adjusting your location keyword, lowering your minimum square footage, or clearing active filters to browse the full catalog.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Clear Active Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2 border-t border-slate-100 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 transition-colors"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
