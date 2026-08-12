"use client";

import React, { useState } from "react";
import { School, Utensils, Bus, ShoppingBag, MapPin, Compass, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NeighborhoodInsightsProps {
  city: string;
}

interface PlaceItem {
  name: string;
  distance: string;
  rating?: number;
}

interface NeighborhoodData {
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  categories: {
    schools: PlaceItem[];
    food: PlaceItem[];
    transit: PlaceItem[];
    lifestyle: PlaceItem[];
  };
}

const cityData: Record<string, NeighborhoodData> = {
  "Beverly Hills": {
    walkScore: 88,
    transitScore: 62,
    bikeScore: 74,
    categories: {
      schools: [
        { name: "Beverly Hills High School", distance: "0.5 mi", rating: 4.8 },
        { name: "El Rodeo Elementary School", distance: "1.2 mi", rating: 4.6 },
        { name: "Hawthorne School", distance: "0.9 mi", rating: 4.5 },
      ],
      food: [
        { name: "Spago Beverly Hills", distance: "0.8 mi", rating: 4.9 },
        { name: "Il Pastaio", distance: "0.9 mi", rating: 4.7 },
        { name: "Blue Bottle Coffee", distance: "0.4 mi", rating: 4.4 },
        { name: "The Cheesecake Factory", distance: "0.7 mi", rating: 4.2 },
      ],
      transit: [
        { name: "Santa Monica / Wilshire Bus Stop", distance: "0.3 mi" },
        { name: "Wilshire / Rodeo Metro D Line (Under Construction)", distance: "0.6 mi" },
        { name: "LAX Airport Shuttle Stop", distance: "1.5 mi" },
      ],
      lifestyle: [
        { name: "Rodeo Drive Shopping District", distance: "0.6 mi" },
        { name: "Beverly Gardens Park", distance: "0.3 mi" },
        { name: "Equinox Beverly Hills Gym", distance: "0.7 mi" },
      ],
    },
  },
  "Venice": {
    walkScore: 92,
    transitScore: 58,
    bikeScore: 95,
    categories: {
      schools: [
        { name: "Venice High School", distance: "1.1 mi", rating: 4.2 },
        { name: "Coeur d'Alene Avenue Elementary", distance: "0.8 mi", rating: 4.7 },
        { name: "Westside Leadership Magnet", distance: "1.5 mi", rating: 4.4 },
      ],
      food: [
        { name: "Gjusta Bakery & Cafe", distance: "0.5 mi", rating: 4.8 },
        { name: "Felix Trattoria", distance: "0.4 mi", rating: 4.9 },
        { name: "Blue Star Donuts", distance: "0.2 mi", rating: 4.5 },
        { name: "The Butcher's Daughter", distance: "0.3 mi", rating: 4.3 },
      ],
      transit: [
        { name: "Abbot Kinney / Venice Blvd Bus Stop", distance: "0.1 mi" },
        { name: "Metro E Line Station (Santa Monica)", distance: "2.5 mi" },
        { name: "Pacific Ave / Windward Bus Stop", distance: "0.6 mi" },
      ],
      lifestyle: [
        { name: "Venice Canals Historical Walk", distance: "0.4 mi" },
        { name: "Venice Beach Boardwalk & Skatepark", distance: "0.6 mi" },
        { name: "Abbot Kinney Boutique Shops", distance: "0.1 mi" },
      ],
    },
  },
  "Malibu": {
    walkScore: 42,
    transitScore: 28,
    bikeScore: 35,
    categories: {
      schools: [
        { name: "Malibu High School", distance: "2.3 mi", rating: 4.5 },
        { name: "Webster Elementary School", distance: "1.5 mi", rating: 4.6 },
        { name: "Our Lady of Malibu School", distance: "1.8 mi", rating: 4.3 },
      ],
      food: [
        { name: "Nobu Malibu", distance: "2.4 mi", rating: 4.9 },
        { name: "Malibu Farm Pier Restaurant", distance: "1.8 mi", rating: 4.6 },
        { name: "Broad Street Oyster Co.", distance: "1.2 mi", rating: 4.8 },
        { name: "Taverna Tony", distance: "1.3 mi", rating: 4.7 },
      ],
      transit: [
        { name: "PCH / Malibu Canyon Bus Terminal", distance: "0.5 mi" },
        { name: "PCH / Webb Way Bus Stop", distance: "1.2 mi" },
      ],
      lifestyle: [
        { name: "Malibu Lagoon State Beach", distance: "1.1 mi" },
        { name: "Solstice Canyon Hiking Trail", distance: "2.8 mi" },
        { name: "Malibu Country Mart Shopping", distance: "1.2 mi" },
      ],
    },
  },
  "Downtown LA": {
    walkScore: 96,
    transitScore: 94,
    bikeScore: 82,
    categories: {
      schools: [
        { name: "Ramon C. Cortines High School", distance: "1.3 mi", rating: 4.4 },
        { name: "Downtown Magnets High School", distance: "0.8 mi", rating: 4.3 },
        { name: "USC (University of Southern California)", distance: "2.9 mi", rating: 4.8 },
      ],
      food: [
        { name: "Grand Central Market", distance: "0.6 mi", rating: 4.7 },
        { name: "Bestia", distance: "1.8 mi", rating: 4.9 },
        { name: "Blue Bottle Coffee DTLA", distance: "0.2 mi", rating: 4.4 },
        { name: "Otium Restaurant", distance: "0.5 mi", rating: 4.6 },
      ],
      transit: [
        { name: "7th Street / Metro Center Station", distance: "0.2 mi" },
        { name: "Union Station Transportation Hub", distance: "1.5 mi" },
        { name: "Pershing Square Transit Stop", distance: "0.5 mi" },
      ],
      lifestyle: [
        { name: "The Broad Contemporary Art Museum", distance: "0.5 mi" },
        { name: "Walt Disney Concert Hall", distance: "0.6 mi" },
        { name: "Crypto.com Arena", distance: "0.8 mi" },
      ],
    },
  },
};

const defaultData: NeighborhoodData = {
  walkScore: 78,
  transitScore: 60,
  bikeScore: 68,
  categories: {
    schools: [
      { name: "Central High School", distance: "0.8 mi", rating: 4.4 },
      { name: "Oakwood Prep School", distance: "1.2 mi", rating: 4.5 },
      { name: "Sunnydale Elementary", distance: "0.6 mi", rating: 4.2 },
    ],
    food: [
      { name: "The Corner Bistro", distance: "0.4 mi", rating: 4.5 },
      { name: "Central Coffee Roasters", distance: "0.2 mi", rating: 4.3 },
      { name: "Green Garden Salads", distance: "0.6 mi", rating: 4.1 },
      { name: "Artisan Pizza Co.", distance: "0.5 mi", rating: 4.4 },
    ],
    transit: [
      { name: "Central Transit Bus Hub", distance: "0.3 mi" },
      { name: "Metro Commuter Rail Station", distance: "1.1 mi" },
    ],
    lifestyle: [
      { name: "Civic Center Public Park", distance: "0.4 mi" },
      { name: "Town Plaza Shopping Promenade", distance: "0.8 mi" },
      { name: "Gold's Gym Health Club", distance: "0.5 mi" },
    ],
  },
};

export default function NeighborhoodInsights({ city }: NeighborhoodInsightsProps) {
  const [activeTab, setActiveTab] = useState<"schools" | "food" | "transit" | "lifestyle">("schools");

  // Load data based on city matches, otherwise use defaults
  const data = cityData[city] || defaultData;

  const tabMeta = {
    schools: { label: "Schools", icon: School, color: "text-blue-600" },
    food: { label: "Food & Drink", icon: Utensils, color: "text-amber-500" },
    transit: { label: "Transit", icon: Bus, color: "text-purple-600" },
    lifestyle: { label: "Lifestyle", icon: ShoppingBag, color: "text-emerald-600" },
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200/50";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200/50";
    return "text-red-500 bg-red-50 border-red-200/50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return "Very Walkable / Transit Friendly";
    if (score >= 50) return "Somewhat Walkable / Transitable";
    return "Car Dependent";
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Compass className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-900">Neighborhood Analytics</h3>
          <p className="text-xs text-slate-500">Walkability, scores, and nearby amenities</p>
        </div>
      </div>

      {/* Scores Summary Strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`rounded-xl border p-3 text-center ${getScoreColorClass(data.walkScore)}`}>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-85">Walk Score</p>
          <p className="text-xl font-black mt-1">{data.walkScore}</p>
          <p className="text-[8px] font-medium leading-tight mt-1 opacity-75">{getScoreLabel(data.walkScore)}</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${getScoreColorClass(data.transitScore)}`}>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-85">Transit Score</p>
          <p className="text-xl font-black mt-1">{data.transitScore}</p>
          <p className="text-[8px] font-medium leading-tight mt-1 opacity-75">Commuter friendly</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${getScoreColorClass(data.bikeScore)}`}>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-85">Bike Score</p>
          <p className="text-xl font-black mt-1">{data.bikeScore}</p>
          <p className="text-[8px] font-medium leading-tight mt-1 opacity-75">Biker's paradise</p>
        </div>
      </div>

      {/* Categories Tabs Selector */}
      <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 mb-4">
        {(Object.keys(tabMeta) as Array<keyof typeof tabMeta>).map((key) => {
          const tab = tabMeta[key];
          const Icon = tab.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-grow flex items-center justify-center gap-1.5 rounded-lg py-2 text-2xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-white text-slate-900 shadow-3xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? tab.color : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Places Display List */}
      <div className="min-h-[140px] bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {data.categories[activeTab].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-slate-100/60 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center border border-slate-100 text-slate-400 mt-0.5 shrink-0">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                    {item.rating && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-[10px]">
                              {i < Math.floor(item.rating!) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold">{item.rating} Rating</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white border px-2 py-1 rounded-md shrink-0">
                  {item.distance}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
