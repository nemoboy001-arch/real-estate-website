"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles, Building, Key, Home, Heart, Scale, PlusCircle, ShieldCheck, LogOut, LogIn, FileText } from "lucide-react";
import { useFavorites } from "@/context/favoritecontext";
import { useCompare } from "@/context/comparecontext";
import { useAuth } from "@/context/authcontext";

const navigation = [
  { name: "About Us", href: "/about" },
  { name: "Our Team", href: "/agents" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { name: "Residential", href: "/residential", description: "Family homes & townhouses", icon: Home, color: "text-blue-600" },
  { name: "Luxury Estates", href: "/luxury", description: "Elite properties & architectural gems", icon: Sparkles, color: "text-amber-500" },
  { name: "Rentals", href: "/rentals", description: "Premium lofts & high-rise apartments", icon: Key, color: "text-purple-600" },
  { name: "Commercial", href: "/commercial", description: "Offices, retail & industrial spaces", icon: Building, color: "text-emerald-600" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();
  const { user, profile, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset menu states when pathname changes, computed directly during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }

  
  const isLuxuryPage = pathname === "/luxury";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? isLuxuryPage
            ? "bg-slate-950/90 text-white shadow-lg border-b border-amber-920/20 backdrop-blur-md"
            : "bg-white/95 text-slate-900 shadow-md border-b border-slate-200/50 backdrop-blur-md"
          : isLuxuryPage
          ? "bg-transparent text-white border-b border-white/10"
          : "bg-transparent text-slate-900 border-b border-slate-200/20"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`text-2xl font-serif tracking-widest font-semibold transition-colors duration-300 ${
              isLuxuryPage ? "text-amber-400 group-hover:text-white" : scrolled ? "text-slate-900 group-hover:text-slate-700" : "text-slate-900 group-hover:text-slate-700"
            } ${!scrolled && isLuxuryPage ? "text-amber-400 group-hover:text-white" : ""}`}>
              VERTEX
            </span>
            <span className={`text-[10px] tracking-[0.25em] font-sans font-bold px-1.5 py-0.5 rounded ${
              isLuxuryPage ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-slate-900 text-white"
            }`}>
              REALTY
            </span>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          {/* CATEGORIES DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className={`flex items-center gap-1 text-sm font-semibold hover:opacity-85 transition-opacity ${
                dropdownOpen ? (isLuxuryPage ? "text-amber-400" : "text-blue-600") : ""
              }`}
            >
              Properties
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className={`absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-2xl shadow-xl border ${
                    isLuxuryPage
                      ? "bg-slate-900 border-slate-800 text-white"
                      : "bg-white border-slate-100 text-slate-900"
                  }`}
                >
                  <div className="p-4 grid gap-1">
                    {categories.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors duration-200 ${
                            isLuxuryPage ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className={`rounded-lg p-2 ${isLuxuryPage ? "bg-slate-800" : "bg-slate-100"}`}>
                            <IconComponent className={`h-6 w-6 ${item.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className={`text-xs mt-0.5 ${isLuxuryPage ? "text-slate-400" : "text-slate-500"}`}>
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className={`p-4 text-center ${isLuxuryPage ? "bg-slate-950/50 border-t border-slate-800" : "bg-slate-50 border-t border-slate-100"}`}>
                    <Link
                      href="/listings"
                      className={`text-xs font-bold tracking-wider uppercase hover:underline ${
                        isLuxuryPage ? "text-amber-400" : "text-blue-600"
                      }`}
                    >
                      View All Listings &rarr;
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/listings" className="text-sm font-semibold hover:opacity-85 transition-opacity">
            All Listings
          </Link>

          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-semibold hover:opacity-85 transition-opacity">
              {item.name}
            </Link>
          ))}
        </div>

        {/* CALL TO ACTION & SAVED ITEMS */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {/* Favorites Link */}
          <Link
            href="/favorites"
            className={`relative p-2 transition-all hover:scale-110 ${
              isLuxuryPage ? "text-amber-400 hover:text-white" : scrolled ? "text-slate-500 hover:text-red-500" : "text-slate-500 hover:text-red-500"
            }`}
            title="Saved Favorites"
          >
            <Heart className={`h-5 w-5 ${favorites.length > 0 && mounted ? "fill-red-500 text-red-500" : ""}`} />
            {mounted && favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Compare Link */}
          <Link
            href="/compare"
            className={`relative p-2 transition-all hover:scale-110 ${
              isLuxuryPage ? "text-amber-400 hover:text-white" : scrolled ? "text-slate-500 hover:text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Compare Properties"
          >
            <Scale className={`h-5 w-5 ${compareList.length > 0 && mounted ? "text-blue-600" : ""}`} />
            {mounted && compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-xs">
                {compareList.length}
              </span>
            )}
          </Link>

          {/* User Auth controls */}
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.is_admin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white px-3 py-1.5 text-2xs font-extrabold uppercase tracking-wider shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}

              <Link
                href="/listings/my-listings"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-2xs font-extrabold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                My Listings
              </Link>

              <Link
                href="/listings/new"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-2xs font-extrabold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
                Submit Listing
              </Link>

              <button
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase shadow-md transition-smooth hover:scale-105 active:scale-95 ${
                isLuxuryPage
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              Agent Portal
            </Link>
          )}
        </div>
      </nav>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 shadow-2xl ${
                isLuxuryPage
                  ? "bg-slate-950 text-white ring-white/10"
                  : "bg-white text-slate-900 ring-slate-900/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <span className={`text-xl font-serif tracking-widest font-semibold ${isLuxuryPage ? "text-amber-400" : "text-slate-900"}`}>
                    VERTEX
                  </span>
                </Link>
                <button
                  type="button"
                  className="rounded-md p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="divide-y divide-slate-500/10">
                  <div className="space-y-2 py-6">
                    <p className={`text-xs font-bold tracking-widest uppercase ${isLuxuryPage ? "text-amber-400" : "text-slate-400"} mb-3`}>
                      Niches
                    </p>
                    {categories.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-lg py-2 px-3 text-sm font-semibold transition-colors ${
                          isLuxuryPage ? "hover:bg-slate-900" : "hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-500/10 my-4 pt-4">
                      <p className={`text-xs font-bold tracking-widest uppercase ${isLuxuryPage ? "text-amber-400" : "text-slate-400"} mb-3`}>
                        Pages
                      </p>
                      <Link
                        href="/listings"
                        className="block rounded-lg py-2 px-3 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        All Listings
                      </Link>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-lg py-2 px-3 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          {item.name}
                        </Link>
                      ))}
                      
                      {/* Favorites and Compare */}
                      <div className="border-t border-slate-500/10 my-3 pt-3 space-y-1">
                        <Link
                          href="/favorites"
                          className="flex items-center justify-between rounded-lg py-2 px-3 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className={`h-5 w-5 ${favorites.length > 0 && mounted ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                            Saved Favorites
                          </span>
                          {mounted && favorites.length > 0 && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-2xs font-bold text-white">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                        
                        <Link
                          href="/compare"
                          className="flex items-center justify-between rounded-lg py-2 px-3 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <span className="flex items-center gap-2">
                            <Scale className={`h-5 w-5 ${compareList.length > 0 && mounted ? "text-blue-600" : "text-slate-400"}`} />
                            Compare Properties
                          </span>
                          {mounted && compareList.length > 0 && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-2xs font-bold text-white">
                              {compareList.length}
                            </span>
                          )}
                        </Link>
                        {/* Auth / Agent links */}
                        <div className="border-t border-slate-500/10 my-3 pt-3 space-y-1">
                          {user ? (
                            <>
                              <Link
                                href="/listings/my-listings"
                                className="flex items-center gap-2 rounded-lg py-2 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                              >
                                <FileText className="h-5 w-5" />
                                My Listings
                              </Link>
                              <Link
                                href="/listings/new"
                                className="flex items-center gap-2 rounded-lg py-2 px-3 text-base font-semibold text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                              >
                                <PlusCircle className="h-5 w-5" />
                                Submit New Listing
                              </Link>
                              {profile?.is_admin && (
                                <Link
                                  href="/admin"
                                  className="flex items-center gap-2 rounded-lg py-2 px-3 text-base font-semibold text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                                >
                                  <ShieldCheck className="h-5 w-5" />
                                  Admin Control Panel
                                </Link>
                              )}
                              <button
                                onClick={() => signOut()}
                                className="flex w-full items-center gap-2 rounded-lg py-2 px-3 text-base font-semibold text-red-600 hover:bg-slate-50 dark:hover:bg-slate-900 text-left"
                              >
                                <LogOut className="h-5 w-5" />
                                Log Out
                              </button>
                            </>
                          ) : (
                            <Link
                              href="/login"
                              className="flex items-center gap-2 rounded-lg py-2 px-3 text-base font-semibold text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                              <LogIn className="h-5 w-5" />
                              Agent Portal Sign In
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-6">
                    <Link
                      href="/contact"
                      className={`block w-full text-center rounded-xl py-3 text-sm font-bold tracking-wider uppercase shadow-md ${
                        isLuxuryPage ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-white"
                      }`}
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
