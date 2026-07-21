"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Property } from "@/data/mockData";

interface CompareContextType {
  compareList: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [compareList, setCompareList] = useState<Property[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("compare-properties");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "compare-properties",
      JSON.stringify(compareList)
    );
  }, [compareList]);

  const addToCompare = (property: Property) => {
    if (compareList.some((p) => p.id === property.id)) return;

    if (compareList.length >= 4) return;

    setCompareList([...compareList, property]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isComparing = (id: string) => {
    return compareList.some((p) => p.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context)
    throw new Error("useCompare must be used inside CompareProvider");

  return context;
}