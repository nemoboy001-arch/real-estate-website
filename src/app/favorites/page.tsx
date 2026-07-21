"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/favoritecontext";
import PropertyCard from "@/components/property/PropertyCard";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-red-600 border border-red-500/20">
            <Heart className="h-3.5 w-3.5 fill-red-500" />
            Your Collection
          </span>
          <h1 className="mt-6 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Saved Properties
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Keep track of the premier homes, luxury estates, and commercial spaces you are interested in.
          </p>
        </div>

        {/* Favorites Grid / Placeholder */}
        <AnimatePresence mode="wait">
          {favorites.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mx-auto max-w-md text-center py-20 px-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-400">
                <Home className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Saved Properties</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                You haven&apos;t favorited any listings yet. Explore our curated portfolio and click the heart icon on any property.
              </p>
              <Link
                href="/listings"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
