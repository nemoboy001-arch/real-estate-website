"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps } from "@/components/property/LeafletMap";

const LeafletMap = dynamic<LeafletMapProps>(
  () => import("@/components/property/LeafletMap"),
  { ssr: false }
);

interface MapMockupProps {
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  title?: string;
  price?: number;
  image?: string;
  category?: string;
}

// Fallback coordinate mapping for demo cities if not provided
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Beverly Hills": { lat: 34.0736, lng: -118.4004 },
  "Bel Air": { lat: 34.0984, lng: -118.4489 },
  "Lake Tahoe": { lat: 39.0968, lng: -120.0324 },
  "Pasadena": { lat: 34.1478, lng: -118.1445 },
  "Sherman Oaks": { lat: 34.1481, lng: -118.4514 },
  "Glendora": { lat: 34.1361, lng: -117.8653 },
  "Downtown LA": { lat: 34.0407, lng: -118.2468 },
  "Venice": { lat: 33.985, lng: -118.4695 },
  "Santa Monica": { lat: 34.0195, lng: -118.4912 },
  "Malibu": { lat: 34.0259, lng: -118.7798 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
};

export default function MapMockup({
  address,
  city,
  lat,
  lng,
  title,
  price,
  image,
  category,
}: MapMockupProps) {
  const fallbackCoords = cityCoordinates[city] || { lat: 34.0522, lng: -118.2437 };
  const finalLat = lat || fallbackCoords.lat;
  const finalLng = lng || fallbackCoords.lng;

  return (
    <LeafletMap
      lat={finalLat}
      lng={finalLng}
      address={address}
      city={city}
      title={title}
      price={price}
      image={image}
      category={category}
    />
  );
}
