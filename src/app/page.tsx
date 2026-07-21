"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Building, Key, HomeIcon, ArrowRight, ShieldCheck } from "lucide-react";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialSection from "@/components/home/TestimonialSection";
import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data/mockData";

const categoryTabs = [
  { id: "residential", name: "Residential", icon: HomeIcon },
  { id: "luxury", name: "Luxury Estates", icon: Sparkles },
  { id: "rental", name: "Rentals", icon: Key },
  { id: "commercial", name: "Commercial", icon: Building },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("residential");

  const filteredProperties = properties
    .filter((p) => p.category === activeTab && p.featured)
    .slice(0, 3); // Get up to 3 featured properties per category

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <Hero />

      {/* FEATURED PROPERTIES SHOWCASE */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xs font-extrabold tracking-widest uppercase text-blue-600">Premium Selections</h2>
              <p className="mt-4 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
                Featured Properties
              </p>
            </div>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-400">No featured properties available in this category.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* View Niche Button */}
          <div className="mt-12 text-center">
            <Link
              href={`/${activeTab}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-6 py-3.5 text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Explore All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* TESTIMONIALS */}
      <TestimonialSection />

      {/* CALL TO ACTION */}
      <section className="bg-slate-50 pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 py-16 px-8 text-center shadow-2xl sm:px-16">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-slate-900 to-slate-900" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-3xs font-extrabold tracking-widest uppercase text-amber-400 border border-amber-500/20">
                <ShieldCheck className="h-3 w-3" />
                Trusted Real Estate Solutions
              </span>
              <h2 className="mt-6 text-3xl font-extrabold font-serif tracking-tight text-white sm:text-4xl">
                Ready to Find Your Dream Property?
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with our expert niche specialists today to discuss buying, leasing, or commercial investments. We formulate tailor-made strategies for every client.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
                >
                  Contact An Agent
                </Link>
                <Link
                  href="/listings"
                  className="rounded-full border border-slate-700 hover:border-slate-500 text-white font-bold px-8 py-3.5 text-xs uppercase tracking-wider transition-all hover:bg-white/5"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
