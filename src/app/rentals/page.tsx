"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Key, CheckCircle2 } from "lucide-react";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/property/PropertyCard";

export default function RentalsPage() {
  const rentalProperties = properties.filter((p) => p.category === "rental");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Niche Hero */}
      <div className="relative h-[55vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
          alt="Premium Apartment Rentals"
          className="absolute inset-0 h-full w-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-purple-400 border border-purple-500/20">
              <Key className="h-3.5 w-3.5" />
              Rentals Portfolio
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white font-serif">
              Modern Urban Living. Premium Spaces.
            </h1>
            <p className="mt-4 max-w-lg mx-auto text-sm text-slate-300">
              Explore high-end urban lofts, penthouses, and luxury apartments for lease in metropolitan hubs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid Showcase */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xs font-extrabold tracking-widest uppercase text-purple-600 font-sans">For Lease</h2>
              <p className="mt-2 text-2xl font-extrabold font-serif text-slate-900">Featured Premium Rentals</p>
            </div>
            <Link
              href="/listings?category=rental"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors"
            >
              Browse All Rentals &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rentalProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Niche Specific Values */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-purple-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Flexible Lease Options</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Choose from 6 to 18-month lease terms, fully furnished variants, or corporate options.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-purple-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Seamless Approval Cycle</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Utilize our online tenant application portal to receive qualification responses in under 24 hours.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-purple-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Concierge Facilities</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Most rental listings feature roof pools, professional gym access, pet spas, and security.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
