"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Property } from "@/data/mockData";

interface FavoriteContextType {
  favorites: Property[];
  toggleFavorite: (property: Property) => void;
  isFavorite: (id: string) => boolean;
}

const FavoriteContext = createContext<
  FavoriteContextType | undefined
>(undefined);

export function FavoriteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<Property[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function toggleFavorite(property: Property) {
    if (favorites.some((p) => p.id === property.id)) {
      setFavorites(favorites.filter((p) => p.id !== property.id));
    } else {
      setFavorites([...favorites, property]);
    }
  }

  function isFavorite(id: string) {
    return favorites.some((p) => p.id === id);
  }

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoriteProvider"
    );
  }

  return context;
}