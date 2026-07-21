"use client";

import CompareTable from "@/components/compare/comparetable";
import { useCompare } from "@/context/comparecontext";

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-4xl py-24 text-center">
        <h1 className="text-4xl font-bold">
          No Properties Selected
        </h1>

        <p className="mt-4 text-slate-500">
          Add properties before comparing them.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-10 text-center text-5xl font-bold">
        Compare Properties
      </h1>

      <CompareTable
        properties={compareList}
        removeFromCompare={removeFromCompare}
      />

    </section>
  );
}