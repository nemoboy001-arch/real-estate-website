"use client";

import { Search } from "lucide-react";

export interface FilterState {
  search: string;
  category: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  minSqft: string;
  agentId?: string;
}

interface SearchFilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters?: () => void;
  showExtendedFilters?: boolean;
}

export default function SearchFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  showExtendedFilters = true,
}: SearchFilterBarProps) {
  return (
    <div className="w-full rounded-3xl bg-white p-6 shadow-xl border border-slate-100">
      {/* Primary Row: Search Keyword, Category, Listing Type, Price */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Keyword Search */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location / Keyword</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Beverly Hills, Loft..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-10 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Niche Category</label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            >
              <option value="">All Categories</option>
              <option value="residential">Residential</option>
              <option value="luxury">Luxury Estates</option>
              <option value="rental">Rentals</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land Sites</option>
            </select>
          </div>
        </div>

        {/* Listing Type Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Type</label>
          <div className="relative">
            <select
              value={filters.listingType}
              onChange={(e) => onFilterChange("listingType", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            >
              <option value="">Buy & Rent (All)</option>
              <option value="sale">For Sale (Buy)</option>
              <option value="lease">For Lease (Rent)</option>
            </select>
          </div>
        </div>

        {/* Max Price Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Max Budget</label>
          <div className="relative">
            <select
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            >
              <option value="">No Max Limit</option>
              <option value="3000">Under $3,000/mo</option>
              <option value="6000">Under $6,000/mo</option>
              <option value="500000">Under $500,000</option>
              <option value="1000000">Under $1,000,000</option>
              <option value="2500000">Under $2,500,000</option>
              <option value="10000000">Under $10,000,000</option>
              <option value="20000000">Under $20,000,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Row: Extended Filters (Bedrooms, Bathrooms, Sqft, Clear) */}
      {showExtendedFilters && (
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-3 lg:grid-cols-4 items-end">
          {/* Min Price Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Min Price</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>

          {/* Bedrooms Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bedrooms</label>
            <select
              value={filters.beds}
              onChange={(e) => onFilterChange("beds", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
              <option value="6">6+ Beds</option>
            </select>
          </div>

          {/* Bathrooms Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bathrooms</label>
            <select
              value={filters.baths}
              onChange={(e) => onFilterChange("baths", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            >
              <option value="">Any Baths</option>
              <option value="1">1+ Bath</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
              <option value="4">4+ Baths</option>
              <option value="5">5+ Baths</option>
              <option value="6">6+ Baths</option>
            </select>
          </div>

          {/* Min Sqft / Area Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Min Sq Ft</label>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={filters.minSqft}
              onChange={(e) => onFilterChange("minSqft", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>

          {/* Clear Filters CTA */}
          {onClearFilters && (
            <div className="lg:col-start-4 flex justify-end">
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl px-5 py-3 transition-colors duration-200 w-full lg:w-auto text-center"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
