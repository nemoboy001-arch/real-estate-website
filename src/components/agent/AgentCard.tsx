"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Star, Sparkles } from "lucide-react";
import { Agent } from "@/data/mockData";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const { id, name, title, photo, email, phone, bio, rating, specialties } = agent;
  const isLuxuryAgent = title.toLowerCase().includes("luxury");

  return (
    <div
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isLuxuryAgent ? "border-amber-200/50 gold-gradient-border" : "border-slate-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Agent Profile Picture */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50 shadow-inner">
          <Image
            src={photo}
            alt={name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Agent Information */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className={`text-lg font-bold flex items-center justify-center sm:justify-start gap-1.5 ${isLuxuryAgent ? "text-amber-700 font-serif" : "text-slate-900"}`}>
                {name}
                {isLuxuryAgent && <Sparkles className="h-4 w-4 text-amber-500" />}
              </h3>
              <p className="text-xs font-semibold text-slate-500">{title}</p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 bg-amber-50 rounded-full px-2.5 py-0.5 self-center sm:self-start">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span className="text-xs font-bold">{rating}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {bio}
          </p>

          {/* Specialties Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {specialties.map((spec) => (
              <span
                key={spec}
                className={`rounded-md px-2 py-0.5 text-3xs font-bold uppercase tracking-wider ${
                  isLuxuryAgent
                    ? "bg-amber-50 text-amber-800 border border-amber-100"
                    : "bg-slate-50 text-slate-600 border border-slate-100"
                }`}
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Contact Details */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-4 text-xs">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{email}</span>
            </a>
            <span className="hidden sm:inline text-slate-300">|</span>
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{phone}</span>
            </a>
          </div>

          <div className="mt-4">
            <Link
              href={`/listings?agentId=${id}`}
              className={`inline-block text-xs font-bold uppercase tracking-wider hover:underline ${
                isLuxuryAgent ? "text-amber-600" : "text-blue-600"
              }`}
            >
              View Active Listings &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
