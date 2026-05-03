// src/components/layout/drawer/CategorySection.tsx

"use client";

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";

type Category = {
  id: string | number;
  name: string;
};

const CategorySection: React.FC = () => {
  const business = getBusinessData();

  const categories: Category[] =
    (business as any)?.categories ?? [];

  return (
    <div>
      <h3 className="text-xs font-black mb-2">
        Shop by Category
      </h3>

      {categories.map((cat: Category) => (
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