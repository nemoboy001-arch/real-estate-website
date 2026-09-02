"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/mockData";

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xs font-extrabold tracking-widest uppercase text-amber-500">Client Reviews</h2>
          <p className="mt-4 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            What Our Partners Say
          </p>
        </div>

        <div className="relative mt-16 sm:mt-20 flex flex-col items-center">
          {/* Quote Mark Icon background */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-5 text-slate-900 pointer-events-none select-none">
            <Quote className="h-44 w-44" />
          </div>

          <div className="w-full max-w-3xl min-h-[220px] flex items-center justify-center text-center px-4 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Rating stars */}
                <div className="flex gap-1.5 justify-center mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Feedback */}
                <blockquote className="text-lg sm:text-xl font-medium font-serif text-slate-800 leading-relaxed italic max-w-2xl">
                  &ldquo;{current.feedback}&rdquo;
                </blockquote>

                {/* Profile */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{current.name}</p>
                    <p className="text-2xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prevTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all hover:scale-105 active:scale-95 shadow-xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all hover:scale-105 active:scale-95 shadow-xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
