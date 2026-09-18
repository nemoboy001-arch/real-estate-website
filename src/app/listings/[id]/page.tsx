import { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties, Property } from "@/data/mockData";
import PropertyDetailClient from "@/components/property/PropertyDetailClient";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | Peculiar Aesthetics",
      description: "The requested property listing could not be found.",
    };
  }

  const isRental = property.category === "rental" || property.listingType === "lease";
  const formattedPrice = isRental
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  const title = `${property.title} - ${formattedPrice} | Peculiar Aesthetics`;
  const description = property.description.slice(0, 160);
  const primaryImage =
    property.images[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

  return {
    title,
    description,
    keywords: [
      property.title,
      property.category,
      property.location.city,
      property.listingType === "lease" ? "for rent" : "for sale",
      "luxury real estate",
      "Peculiar Aesthetics",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const property = getProperty(id);

  if (!property) {
    return notFound();
  }

  // Schema.org RealEstateListing JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: property.images,
    url: `https://peculiaraesthetics.com/listings/${property.id}`,
    datePosted: property.yearBuilt ? `${property.yearBuilt}-01-01` : "2024-01-01",
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      businessFunction:
        property.listingType === "lease"
          ? "https://schema.org/LeaseOut"
          : "https://schema.org/Sell",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: property.location.city,
      postalCode: property.location.zip,
      addressCountry: "US",
    },
    geo: property.location.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: property.location.coordinates.lat,
          longitude: property.location.coordinates.lng,
        }
      : undefined,
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.sqft,
      unitCode: "FTK",
    },
    amenityFeature: property.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient initialProperty={property} propertyId={id} />
    </>
  );
}
