"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/data/mockData";

interface CompareTableProps {
  properties: Property[];
  removeFromCompare: (id: string) => void;
}

export default function CompareTable({
  properties,
  removeFromCompare,
}: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-xl">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="p-6 text-left text-xs font-bold uppercase tracking-wider w-44">
              Property Specs
            </th>

            {properties.map((property) => (
              <th key={property.id} className="p-6 text-center min-w-[260px] border-l border-slate-800">
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <Link href={`/listings/${property.id}`} className="block hover:text-blue-400 transition-colors">
                    <h3 className="text-sm font-bold truncate">
                      {property.title}
                    </h3>
                  </Link>

                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/listings/${property.id}`}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-2xs font-extrabold uppercase tracking-wider transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeFromCompare(property.id)}
                      className="rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 text-2xs font-extrabold uppercase tracking-wider transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-xs">
          <FeatureRow
            title="Price"
            values={properties.map((p) =>
              p.category === "rental" || p.listingType === "lease"
                ? `$${p.price.toLocaleString()}/mo`
                : `$${p.price.toLocaleString()}`
            )}
            highlight
          />

          <FeatureRow
            title="Category"
            values={properties.map((p) => p.category.toUpperCase())}
          />

          <FeatureRow
            title="Listing Type"
            values={properties.map((p) => (p.listingType === "lease" ? "For Lease" : "For Sale"))}
          />

          <FeatureRow
            title="Bedrooms"
            values={properties.map((p) => (p.beds !== undefined ? `${p.beds} Beds` : "N/A"))}
          />

          <FeatureRow
            title="Bathrooms"
            values={properties.map((p) => (p.baths !== undefined ? `${p.baths} Baths` : "N/A"))}
          />

          <FeatureRow
            title="Floor Area"
            values={properties.map((p) => `${p.sqft.toLocaleString()} sqft`)}
          />

          <FeatureRow
            title="Price / SqFt"
            values={properties.map((p) =>
              p.sqft > 0 ? `$${Math.round(p.price / p.sqft).toLocaleString()}/sqft` : "N/A"
            )}
          />

          <FeatureRow
            title="Address"
            values={properties.map((p) => p.location.address)}
          />

          <FeatureRow
            title="City / ZIP"
            values={properties.map((p) => `${p.location.city}, ${p.location.zip}`)}
          />

          <FeatureRow
            title="Year Built"
            values={properties.map((p) => (p.yearBuilt ? `${p.yearBuilt}` : "N/A"))}
          />

          <FeatureRow
            title="Monthly HOA"
            values={properties.map((p) => (p.hoa && p.hoa > 0 ? `$${p.hoa}/mo` : "None"))}
          />

          <FeatureRow
            title="Amenities"
            values={properties.map((p) => p.amenities.slice(0, 4).join(", "))}
          />
        </tbody>
      </table>
    </div>
  );
}

function FeatureRow({
  title,
  values,
  highlight = false,
}: {
  title: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="bg-slate-50/80 p-4 font-bold text-slate-700 uppercase tracking-wider text-2xs">
        {title}
      </td>

      {values.map((value, index) => (
        <td
          key={index}
          className={`p-4 text-center border-l border-slate-100 ${
            highlight ? "font-extrabold text-blue-600 text-sm" : "font-medium text-slate-700"
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}