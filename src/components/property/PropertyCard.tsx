"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart ,MapPin, Bed, Bath, Square, Sparkles, Award } from "lucide-react";
import { Property } from "@/data/mockData";
import { useCompare } from "@/context/comparecontext";
import { useFavorites } from "@/context/favoritecontext";
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

const favorite = isFavorite(property.id);
  const {
  addToCompare,
  removeFromCompare,
  isComparing,
} = useCompare();

const compared = isComparing(property.id);
  const { id, title, category, listingType, price, beds, baths, sqft, location, images } = property;
  
  const formatPrice = (val: number, cat: string, type: string) => {
    if (cat === "rental" || type === "lease") {
      return `$${val.toLocaleString()}/mo`;
    }
    return `$${val.toLocaleString()}`;
  };

  const isLuxury = category === "luxury";
  const isCommercial = category === "commercial";
  const mainImage = images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm border transition-all duration-300 hover:shadow-xl ${
        isLuxury
          ? "border-amber-200/50 hover:border-amber-300 gold-gradient-border"
          : "border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* Property Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
  src={mainImage}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
  priority={false}
/>

{/* Favorite Button */}
<button
  onClick={() => toggleFavorite(property)}
  className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-all duration-300 hover:scale-110"
>
  <Heart
   className={`h-5 w-5 ${
      favorite
        ? "fill-red-500 text-red-500"
        : "text-slate-700 hover:text-red-500"
    }`}
  />
</button>


        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <span className={`rounded-full px-3 py-1 text-2xs font-extrabold tracking-wider uppercase shadow-sm ${
            isLuxury
              ? "bg-amber-500 text-slate-950"
              : isCommercial
              ? "bg-emerald-600 text-white"
              : listingType === "lease"
              ? "bg-purple-600 text-white"
              : "bg-blue-600 text-white"
          }`}>
            {listingType === "lease" ? "For Lease" : "For Sale"}
          </span>

          <span className={`rounded-full px-3 py-1 text-2xs font-bold tracking-wider uppercase shadow-sm bg-slate-950/80 text-white backdrop-blur-xs flex items-center gap-1`}>
            {isLuxury && <Sparkles className="h-3 w-3 text-amber-400" />}
            {category.toUpperCase()}
          </span>

          {(property as any).is_inspected && (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-400 px-3 py-1 text-2xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-white" />
              Inspected
            </span>
          )}
        </div>
      </div>

      {/* Property details */}
      <div className="p-6">
        <p className={`text-xl font-bold tracking-tight ${isLuxury ? "text-amber-600 font-serif" : "text-slate-900"}`}>
          {formatPrice(price, category, listingType)}
        </p>
        
        <h3 className="mt-2 text-md font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-amber-500 transition-colors">
          <Link href={`/listings/${id}`}>
            {title}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{location.address}, {location.city}</span>
        </div>

        {/* Specs summary (Beds/Baths/Sqft) */}
        {!isCommercial ? (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-slate-400" />
              <span><strong className="text-slate-900 font-bold">{beds}</strong> Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-slate-400" />
              <span><strong className="text-slate-900 font-bold">{baths}</strong> Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-slate-400" />
              <span><strong className="text-slate-900 font-bold">{sqft.toLocaleString()}</strong> Sq Ft</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-start gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-slate-400" />
              <span><strong className="text-slate-900 font-bold">{sqft.toLocaleString()}</strong> Sq Ft Area</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400">Commercial Space</span>
          </div>
        )}

        {/* View Details Link */}
      <div className="mt-4 space-y-3">
    <Link
        href={`/listings/${id}`}
        className={`flex w-full items-center justify-center rounded-xl border py-3 font-semibold transition-all duration-300 ${
  isLuxury
    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
}`}
    >
        Explore Property
    </Link>

    <button
        onClick={() =>
            compared
                ? removeFromCompare(property.id)
                : addToCompare(property)
        }
        className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
            compared
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
    >
        {compared ? "Remove from Compare" : "Compare Property"}
    </button>
</div>
      </div>
    </motion.div>
  );
}
