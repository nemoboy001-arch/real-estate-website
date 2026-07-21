"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/context/comparecontext";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareBar() {
  const {
    compareList,
    removeFromCompare,
  } = useCompare();

  if (compareList.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        exit={{ y: 120 }}
        transition={{ duration: .3 }}
        className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2 text-white">

              <Scale size={20} />

              <span className="font-semibold">
                Comparing {compareList.length} Properties
              </span>

            </div>

            <div className="mt-2 flex flex-wrap gap-2">

              {compareList.map((property) => (

                <div
                  key={property.id}
                  className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-sm text-white"
                >

                  {property.title}

                  <button
                    onClick={() => removeFromCompare(property.id)}
                  >
                    <X size={14}/>
                  </button>

                </div>

              ))}

            </div>

          </div>

          <Link
            href="/compare"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Compare Now →
          </Link>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}