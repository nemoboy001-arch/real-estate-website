"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Award, EyeOff, ShieldCheck } from "lucide-react";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/property/PropertyCard";

export default function LuxuryPage() {
  const luxuryProperties = properties.filter((p) => p.category === "luxury");

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* Niche Hero */}
      <div className="relative h-[65vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Mansion Estate"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-2xs font-extrabold tracking-widest uppercase text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Elite Portfolios
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white font-serif">
              Curated Luxury. <br />
              Architectural Masterpieces.
            </h1>
            <p className="mt-4 max-w-lg mx-auto text-sm text-slate-300">
              Experience the pinnacle of fine living. Our luxury division represents the most exclusive estates, private waterfronts, and architectural landmarks.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid Showcase */}
      <section className="py-16 sm:py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xs font-extrabold tracking-widest uppercase text-amber-400 font-sans">The Showcase</h2>
              <p className="mt-2 text-3xl font-extrabold font-serif text-white">Active Luxury Estates</p>
            </div>
            <Link
              href="/listings?category=luxury"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              Browse All Luxury &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {luxuryProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Credentials */}
      <section className="bg-slate-950 py-20 border-t border-slate-900 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xs font-extrabold tracking-widest uppercase text-amber-400">Exclusive Agency Services</h3>
            <p className="mt-4 text-2xl font-extrabold font-serif text-white sm:text-3xl">
              Discretion & Elite Advisory
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400">
                <EyeOff className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pocket Listings</h4>
              <p className="mt-3 text-2xs text-slate-400 leading-relaxed max-w-xs">
                Over 30% of our luxury deals occur off-market. Gain access to private inventories and exclusive listings.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Complete Discretion</h4>
              <p className="mt-3 text-2xs text-slate-400 leading-relaxed max-w-xs">
                We safeguard buyer identities and financial disclosures through secure double-blind NDA configurations.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bespoke Concierge</h4>
              <p className="mt-3 text-2xs text-slate-400 leading-relaxed max-w-xs">
                From private jet pick-ups to custom yacht viewings, we arrange complete architectural tours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
