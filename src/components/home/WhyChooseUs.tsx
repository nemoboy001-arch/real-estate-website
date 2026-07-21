"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, HeartHandshake, EyeOff } from "lucide-react";

const features = [
  {
    name: "Elite Specialized Brokers",
    description: "Our dedicated agents operate as specialists in their niches, ensuring deep insights and top-tier local expertise.",
    icon: Award,
    bgColor: "bg-blue-50 text-blue-600",
  },
  {
    name: "Off-Market Properties",
    description: "Gain access to an exclusive database of pocket listings and off-market estates not listed on standard MLS systems.",
    icon: EyeOff,
    bgColor: "bg-amber-50 text-amber-600",
  },
  {
    name: "Client-Centric Philosophy",
    description: "Every negotiation is guided by our clients' strategic goals. We stand by you from initial tour to key delivery.",
    icon: HeartHandshake,
    bgColor: "bg-purple-50 text-purple-600",
  },
  {
    name: "Transaction Security",
    description: "Leverage premium broker compliance, secure legal advisory partners, and stress-free contract structures.",
    icon: ShieldCheck,
    bgColor: "bg-emerald-50 text-emerald-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xs font-extrabold tracking-widest uppercase text-blue-600">The Vertex Difference</h2>
          <p className="mt-4 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Why Discerning Clients Trust Vertex
          </p>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Combining state-of-the-art market data with an editorial approach to client services, we simplify real estate acquisitions.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:max-w-none md:grid-cols-2 lg:gap-y-16">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-sm font-bold text-slate-900">
                  <div className={`absolute top-0 left-0 flex h-11 w-11 items-center justify-center rounded-xl ${feature.bgColor} shadow-sm border border-black/5`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-xs text-slate-500 leading-relaxed">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
