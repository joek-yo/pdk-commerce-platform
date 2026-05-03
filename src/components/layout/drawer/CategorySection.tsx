// src/components/layout/drawer/CategorySection.tsx

"use client";

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";

// ---------------- TYPES ----------------
type Category = {
  id: string | number;
  name: string;
};

type BusinessData = {
  categories?: Category[];
};

const CategorySection = () => {
  const business = getBusinessData() as BusinessData;

  // SAFE fallback (no any, no unsafe casting)
  const categories: Category[] = business?.categories ?? [];

  return (
    <div>
      <h3 className="text-xs font-black mb-2">
        Shop by Category
      </h3>

      {categories.map((cat) => (
        <div
          key={cat.id}
          className="flex justify-between py-2 text-sm"
        >
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;