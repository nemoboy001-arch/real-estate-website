"use client";

import { motion } from "framer-motion";
import { Users, ShieldAlert, Award } from "lucide-react";
import { agents } from "@/data/mockData";
import AgentCard from "@/components/agent/AgentCard";

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Users className="h-3.5 w-3.5" />
            Our Professionals
          </span>
          <h1 className="mt-6 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Meet Our Niche Experts
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Our certified agents possess specialized credentials across residential, luxury, rental, and commercial domains, ensuring elite guidance.
          </p>
        </div>

        {/* Agents Grid list */}
        <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
