// src/components/layout/drawer/CategorySection.tsx

import React from "react";
import Link from "next/link";
import { getCategories } from "@/lib/getBusinessData";

type Category = {
  id: string | number;
  name: string;
  hot?: boolean;
};

const CategorySection = () => {
  const categories: Category[] = getCategories();

  return (
    <div>
      <h3 className="text-xs font-black mb-2">Shop by Category</h3>

      {categories.map((cat: Category) => (
        <Link
          key={cat.id}
          href={`/menu?category=${cat.id}`}
          className="flex justify-between py-2 text-sm hover:text-[#FDB813] transition-colors"
        >
          <span>{cat.name}</span>

          {cat.hot && (
            <span className="text-[9px] bg-red-500 text-white px-1 rounded">
              HOT
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default CategorySection;