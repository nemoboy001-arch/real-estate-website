"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Building, Sparkles } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("residential");
  const [listingType, setListingType] = useState("sale");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (category) params.set("category", category);
    if (listingType) params.set("listingType", listingType);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Real Estate Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white flex flex-col items-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-2xs font-extrabold tracking-widest uppercase text-amber-400 border border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            Elite Properties & Investment Portfolios
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight font-serif sm:text-5xl lg:text-6xl text-white">
            Find Your Next <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-slate-300 leading-relaxed font-sans">
            Delivering bespoke real estate solutions across residential sales, luxury estates, urban rentals, and premium commercial ventures.
          </p>
        </motion.div>

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 w-full max-w-4xl"
        >
          {/* Quick tab switcher */}
          <div className="flex gap-1.5 justify-center sm:justify-start mb-3">
            <button
              onClick={() => setListingType("sale")}
              className={`rounded-t-xl px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                listingType === "sale"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              Buy Property
            </button>
            <button
              onClick={() => setListingType("lease")}
              className={`rounded-t-xl px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                listingType === "lease"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              Rent Property
            </button>
          </div>

          {/* Quick Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 bg-white/95 backdrop-blur-xs p-5 rounded-2xl md:rounded-full shadow-2xl border border-slate-100 items-center"
          >
            {/* Input query */}
            <div className="flex w-full items-center gap-2.5 px-3 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search location, neighborhood, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 outline-hidden bg-transparent"
              />
            </div>

            {/* Select category */}
            <div className="flex w-full md:w-80 items-center gap-2.5 px-3 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0">
              <Building className="h-5 w-5 text-slate-400 shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm font-semibold text-slate-900 outline-hidden appearance-none bg-transparent"
              >
                <option value="residential">Residential Homes</option>
                <option value="luxury">Luxury Estates</option>
                <option value="rental">Apartment Rentals</option>
                <option value="commercial">Commercial Sites</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 text-xs uppercase tracking-wider transition-all duration-200 shrink-0 hover:scale-105 active:scale-95"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
