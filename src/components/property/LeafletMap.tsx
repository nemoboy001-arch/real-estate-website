"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Navigation, Layers, RotateCcw, MapPin } from "lucide-react";

export interface LeafletMapProps {
  lat: number;
  lng: number;
  address: string;
  city: string;
  title?: string;
  price?: number;
  image?: string;
  category?: string;
  height?: string;
}

export default function LeafletMap({
  lat,
  lng,
  address,
  city,
  title,
  price,
  image,
  category,
  height = "h-80",
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet CSS if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        if (!mapContainerRef.current || !isMounted) return;

        // Clean up previous instance if exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const validLat = typeof lat === "number" && !isNaN(lat) ? lat : 34.0522;
        const validLng = typeof lng === "number" && !isNaN(lng) ? lng : -118.2437;

        // Create Map
        const map = L.map(mapContainerRef.current, {
          center: [validLat, validLng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
        });

        // Add Tile Layer (CartoDB Positron for clean luxury look or ESRI Satellite)
        const tileUrl =
          mapType === "satellite"
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

        L.tileLayer(tileUrl, {
          maxZoom: 19,
          subdomains: "abcd",
        }).addTo(map);

        // Custom pulsing marker icon
        const isLuxury = category === "luxury";
        const formattedPrice = price ? `$${price.toLocaleString()}` : "";

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
              <div style="
                background: ${isLuxury ? "#f59e0b" : "#2563eb"};
                color: ${isLuxury ? "#0f172a" : "#ffffff"};
                padding: 6px 12px;
                border-radius: 9999px;
                font-weight: 800;
                font-size: 11px;
                letter-spacing: 0.05em;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 5px;
                border: 2px solid white;
                white-space: nowrap;
                cursor: pointer;
              ">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${formattedPrice || "Vertex Realty"}
              </div>
              <div style="
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid ${isLuxury ? "#f59e0b" : "#2563eb"};
              "></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([validLat, validLng], { icon: customIcon }).addTo(map);

        // Custom Popup
        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            ${
              image
                ? `<img src="${image}" alt="${title || address}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
                : ""
            }
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${title || address}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${address}, ${city}</div>
            ${
              price
                ? `<div style="font-size: 14px; font-weight: 800; color: ${isLuxury ? "#d97706" : "#2563eb"}; margin-bottom: 8px;">$${price.toLocaleString()}</div>`
                : ""
            }
            <a href="https://maps.google.com/?q=${encodeURIComponent(address + ", " + city)}" target="_blank" rel="noopener noreferrer" style="
              display: inline-block;
              width: 100%;
              text-align: center;
              background: #0f172a;
              color: #ffffff;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              text-decoration: none;
            ">Open Google Maps &rarr;</a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -35],
          className: "custom-leaflet-popup",
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setIsLoaded(true);
      } catch (err) {
        console.error("Leaflet initialization error:", err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address, city, title, price, image, category, mapType]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      const validLat = typeof lat === "number" && !isNaN(lat) ? lat : 34.0522;
      const validLng = typeof lng === "number" && !isNaN(lng) ? lng : -118.2437;
      mapInstanceRef.current.setView([validLat, validLng], 15);
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="h-4 w-4 text-blue-600 animate-spin-slow" />
            Interactive Live Location
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {address}, {city}
          </p>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMapType(mapType === "standard" ? "satellite" : "standard")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider transition-colors border ${
              mapType === "satellite"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle Map Style"
          >
            <Layers className="h-3 w-3" />
            {mapType === "satellite" ? "Satellite" : "Street"}
          </button>

          <button
            onClick={handleResetCenter}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Recenter"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className={`relative ${height} w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80`}>
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
            <MapPin className="h-5 w-5 animate-bounce mr-2 text-blue-600" />
            Loading live map tiles...
          </div>
        )}

        {/* Floating Bottom Card */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Navigation className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exact Coordinates</p>
              <p className="text-xs font-semibold text-slate-800 truncate">{address}, {city}</p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address + ", " + city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[10px] bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5 font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-xs"
          >
            Get Directions &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

