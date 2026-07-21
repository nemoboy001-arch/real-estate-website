"use client";

import { motion } from "framer-motion";
import { Building2, Compass, Award, ShieldCheck, HeartHandshake } from "lucide-react";

const values = [
  {
    name: "Uncompromising Integrity",
    description: "Honest representation, transparency in fees, and absolute compliance lead every contract we draft.",
    icon: ShieldCheck,
  },
  {
    name: "Architectural Excellence",
    description: "We focus on premium structures, reviewing building codes, layouts, and materials for every listing.",
    icon: Award,
  },
  {
    name: "Client Concierge Partnership",
    description: "We function as active advisors, providing constant consultation through inspection, financing, and key handover.",
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Building2 className="h-3.5 w-3.5" />
            Our Heritage
          </span>
          <h1 className="mt-6 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Redefining Properties, Elevating Standards
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Founded in 2012, Vertex Realty was built on a simple premise: real estate requires specialized local expertise, not generic representation.
          </p>
        </div>

        {/* Story Section */}
        <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-xl bg-white border border-slate-100 grid grid-cols-1 md:grid-cols-2 items-stretch mb-20">
          <div className="relative h-64 md:h-auto min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
              alt="Vertex Office Headquarters"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold font-serif text-slate-900">Our Story</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We recognized that buyers searching for luxury estates had entirely different goals than corporations seeking warehouse logistics hubs. By restructuring our agency into dedicated, specialized divisions (Residential, Luxury, Rentals, and Commercial), we created a system that delivers expert guidance for every transaction type.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Today, Vertex has grown from a boutique firm in Los Angeles to a premier agency overseeing more than $500M in annual transactions. Our commitment to deep analytics, off-market databases, and white-glove client service remains unchanged.
            </p>
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="mx-auto max-w-5xl pt-12 border-t border-slate-200">
          <h3 className="text-center text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-12">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={val.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5 text-blue-600">
                  <val.icon className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{val.name}</h4>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mx-auto max-w-3xl text-center mt-24 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="relative z-10">
            <Compass className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-serif uppercase tracking-widest text-amber-400">Our Mission</h3>
            <p className="mt-4 text-sm sm:text-md leading-relaxed text-slate-200 max-w-xl mx-auto font-serif italic">
              &ldquo;To deliver unparalleled real estate advisory services by aligning clients with domain-specific specialists, leveraging advanced predictive market data, and safeguarding our partners&apos; strategic and financial goals.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
