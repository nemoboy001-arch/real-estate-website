import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CompareProvider } from "@/context/comparecontext";
import CompareBar from "@/components/compare/comparebar";
import { FavoriteProvider } from "@/context/favoritecontext";
import { AuthProvider } from "@/context/authcontext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vertex Real Estate | Premium Properties & Luxury Estates",
    template: "%s | Vertex Real Estate",
  },
  description: "Discover exceptional residential sales, luxury homes, premium rentals, and commercial real estate with Vertex. Connect with top brokers and find your perfect property today.",
  keywords: ["real estate", "luxury homes", "apartments for rent", "commercial properties", "house for sale", "property search"],
  authors: [{ name: "Vertex Group" }],
  openGraph: {
    title: "Vertex Real Estate",
    description: "Discover exceptional residential sales, luxury homes, premium rentals, and commercial real estate with Vertex.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex Real Estate",
    description: "Discover exceptional residential sales, luxury homes, premium rentals, and commercial real estate with Vertex.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
  <AuthProvider>
    <CompareProvider>
       <FavoriteProvider>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CompareBar />
      </FavoriteProvider>
    </CompareProvider>
  </AuthProvider>
</body>
    </html>
  );
}
