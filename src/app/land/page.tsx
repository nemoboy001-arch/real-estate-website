"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass, CheckCircle2 } from "lucide-react";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/property/PropertyCard";

export default function LandPage() {
  const landProperties = properties.filter((p) => p.category === "land");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Niche Hero */}
      <div className="relative h-[55vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Acreage and Land Lots"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-orange-400 border border-orange-500/20">
              <Compass className="h-3.5 w-3.5" />
              Development Plots & Acreage
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white font-serif">
              Premium Development Land.
            </h1>
            <p className="mt-4 max-w-lg mx-auto text-sm text-slate-300">
              Discover raw acreage, development sites, and custom residential building lots in highly coveted locations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid Showcase */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xs font-extrabold tracking-widest uppercase text-orange-600 font-sans">Available Plots</h2>
              <p className="mt-2 text-2xl font-extrabold font-serif text-slate-900">Featured Land Investments</p>
            </div>
            <Link
              href="/listings?category=land"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors"
            >
              Browse All Land Listings &rarr;
            </Link>
          </div>

          {landProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {landProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed rounded-3xl p-6">
              <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-semibold">No land listings active currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* Niche Specific Values */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-orange-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Feasibility & Surveys</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                We supply fully compiled geological, geotechnical, and boundary surveys to simplify your pre-construction process.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-orange-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Zoning Optimization</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Expert consultation on local zoning regulations, hillside ordinances, easements, and entitlement rights.
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle2 className="h-4.5 w-4.5 text-orange-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Utility Coordination</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Detailed verification of municipal water connectivity, sewer extensions, fire department access, and power line proximity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
