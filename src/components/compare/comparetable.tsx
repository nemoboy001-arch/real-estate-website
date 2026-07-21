"use client";

import Image from "next/image";
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
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="p-5 text-left">Feature</th>

            {properties.map((property) => (
              <th key={property.id} className="p-5 text-center">
                <div className="space-y-3">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    width={250}
                    height={160}
                    className="mx-auto h-40 rounded-xl object-cover"
                  />

                  <h3 className="text-lg font-semibold">
                    {property.title}
                  </h3>

                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

      <tbody>

  <FeatureRow
    title="Price"
    values={properties.map((p) => `$${p.price.toLocaleString()}`)}
  />

  <FeatureRow
    title="Category"
    values={properties.map((p) => p.category)}
  />

  <FeatureRow
    title="Listing Type"
    values={properties.map((p) => p.listingType)}
  />

  <FeatureRow
    title="Bedrooms"
    values={properties.map((p) => `${p.beds}`)}
  />

  <FeatureRow
    title="Bathrooms"
    values={properties.map((p) => `${p.baths}`)}
  />

  <FeatureRow
    title="Area"
    values={properties.map((p) => `${p.sqft.toLocaleString()} sqft`)}
  />

  <FeatureRow
    title="Address"
    values={properties.map((p) => p.location.address)}
  />

  <FeatureRow
    title="City"
    values={properties.map((p) => p.location.city)}
  />

  <FeatureRow
    title="ZIP Code"
    values={properties.map((p) => p.location.zip)}
  />

  <FeatureRow
    title="Year Built"
    values={properties.map((p) => `${p.yearBuilt}`)}
  />

  <FeatureRow
    title="Featured"
    values={properties.map((p) => (p.featured ? "Yes ⭐" : "No"))}
  />

  <FeatureRow
    title="Amenities"
    values={properties.map((p) => p.amenities.join(", "))}
  />

</tbody>
      </table>
    </div>
  );
}

function FeatureRow({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  return (
    <tr className="border-b">
      <td className="bg-slate-50 p-5 font-semibold">
        {title}
      </td>

      {values.map((value, index) => (
        <td key={index} className="p-5 text-center">
          {value}
        </td>
      ))}
    </tr>
  );
}