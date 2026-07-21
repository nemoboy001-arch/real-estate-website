"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isLuxuryPage = pathname === "/luxury";

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-smooth ${
        isLuxuryPage
          ? "bg-slate-950 text-white border-amber-920/10"
          : "bg-slate-900 text-white border-slate-800"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-serif tracking-widest font-semibold ${isLuxuryPage ? "text-amber-400" : "text-white"}`}>
                VERTEX
              </span>
              <span className={`text-[10px] tracking-[0.25em] font-sans font-bold px-1.5 py-0.5 rounded ${
                isLuxuryPage ? "bg-amber-400/15 text-amber-400 border border-amber-400/25" : "bg-slate-800 text-slate-200"
              }`}>
                REALTY
              </span>
            </div>
            <p className={`text-sm max-w-xs ${isLuxuryPage ? "text-slate-400" : "text-slate-300"}`}>
              Redefining real estate through unparalleled expertise, luxury aesthetics, and dedicated client service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Instagram">
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Twitter">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="LinkedIn">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            <div>
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLuxuryPage ? "text-amber-400" : "text-white"}`}>
                Property Niches
              </h3>
              <ul role="list" className="mt-4 space-y-2.5">
                <li><Link href="/residential" className="text-sm hover:opacity-85 text-slate-400 hover:text-white transition-colors">Residential Sales</Link></li>
                <li><Link href="/luxury" className="text-sm hover:opacity-85 text-slate-400 hover:text-white transition-colors">Luxury Estates</Link></li>
                <li><Link href="/rentals" className="text-sm hover:opacity-85 text-slate-400 hover:text-white transition-colors">Premium Rentals</Link></li>
                <li><Link href="/commercial" className="text-sm hover:opacity-85 text-slate-400 hover:text-white transition-colors">Commercial Real Estate</Link></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLuxuryPage ? "text-amber-400" : "text-white"}`}>
                Company
              </h3>
              <ul role="list" className="mt-4 space-y-2.5">
                <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About Story</Link></li>
                <li><Link href="/agents" className="text-sm text-slate-400 hover:text-white transition-colors">Our Brokers</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Office Location</Link></li>
                <li><Link href="/listings" className="text-sm text-slate-400 hover:text-white transition-colors">Browse Listings</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLuxuryPage ? "text-amber-400" : "text-white"}`}>
                Contact Office
              </h3>
              <ul role="list" className="mt-4 space-y-3.5 text-slate-400">
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>777 Wilshire Blvd, Suite 100<br />Los Angeles, CA 90017</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:5551245678" className="hover:text-white transition-colors">(+234) 80-3860-3853</a>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href="mailto:info@vertexrealestate.com" className="hover:text-white transition-colors">info@vertexrealestate.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 xl:grid xl:grid-cols-3 xl:gap-8 border-slate-800">
          <p className="text-xs text-slate-400 xl:col-span-2">
            &copy; {currentYear} Vertex Realty. All rights reserved. Equal Housing Opportunity.
          </p>
          <div className="mt-4 flex space-x-6 xl:col-span-1 xl:justify-end xl:mt-0">
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
