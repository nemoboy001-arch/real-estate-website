"use client";

import { useState } from "react";
import { MapPin, ZoomIn, ZoomOut, Compass, Navigation } from "lucide-react";

interface MapMockupProps {
  address: string;
  city: string;
}

export default function MapMockup({ address, city }: MapMockupProps) {
  const [zoom, setZoom] = useState(14);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="h-4 w-4 text-blue-600" />
            Property Location
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{address}, {city}</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setZoom((prev) => Math.min(18, prev + 1))}
            className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(10, prev - 1))}
            className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Styled Mock Map Container */}
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 select-none">
        {/* SVG Grid lines representing roads/city blocks */}
        <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            </pattern>
            <pattern id="minor-grid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#minor-grid)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Highway */}
          <path d="M -50 150 Q 200 120 500 220" fill="none" stroke="#fed7aa" strokeWidth="16" strokeLinecap="round" />
          <path d="M -50 150 Q 200 120 500 220" fill="none" stroke="#ffedd5" strokeWidth="12" strokeLinecap="round" />
          
          {/* River */}
          <path d="M -50 40 C 150 90 280 -20 500 80" fill="none" stroke="#bae6fd" strokeWidth="24" strokeLinecap="round" opacity="0.6" />
          <path d="M -50 40 C 150 90 280 -20 500 80" fill="none" stroke="#e0f2fe" strokeWidth="18" strokeLinecap="round" opacity="0.6" />

          {/* Park area */}
          <rect x="250" y="30" width="110" height="90" rx="12" fill="#dcfce7" opacity="0.8" />
          <text x="305" y="80" fill="#166534" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.8">Park Zone</text>
        </svg>

        {/* Outer Pulsing Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute animate-ping h-14 w-14 rounded-full bg-blue-500/20 opacity-75"></span>
            <span className="absolute animate-pulse h-8 w-8 rounded-full bg-blue-500/35"></span>
            
            {/* Real Estate Pin */}
            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-2 border-white">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Address Overlay Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-lg border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
              <Navigation className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Map Location</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{address}</p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address + ", " + city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white rounded-md px-2.5 py-1.5 font-bold uppercase transition-colors"
          >
            Open Maps
          </a>
        </div>
      </div>
    </div>
  );
}
