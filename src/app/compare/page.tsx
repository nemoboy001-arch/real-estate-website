"use client";

import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import CompareTable from "@/components/compare/comparetable";
import { useCompare } from "@/context/comparecontext";

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto max-w-md py-16 px-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600">
              <Scale className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold font-serif text-slate-900">
              No Properties Selected
            </h1>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-xs">
              Add up to 3 properties to your comparison matrix to evaluate specs, square footage, and pricing side by side.
            </p>
            <Link
              href="/listings"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Explore Listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Scale className="h-3.5 w-3.5" />
            Feature Analysis
          </span>
          <h1 className="mt-4 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Compare Properties
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            Side-by-side breakdown of features, layouts, and financials.
          </p>
        </div>

        <CompareTable
          properties={compareList}
          removeFromCompare={removeFromCompare}
        />
      </div>
    </div>
  );
}