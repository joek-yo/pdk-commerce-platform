// src/components/layout/drawer/NavigationSection.tsx

"use client";

import React from "react";
import Link from "next/link";
import { getNavigation } from "@/lib/getBusinessData";

// ---------------- TYPES ----------------
type NavItem = {
  id: string | number;
  label: string;
  path: string;
};

const NavigationSection = () => {
  // SAFE TYPE CAST (because lib is not strictly typed yet)
  const nav: NavItem[] = (getNavigation() as NavItem[]) ?? [];

  return (
    <div>
      {nav.map((item) => (
        <Link key={item.id} href={item.path}>
          <div className="py-3 border-b text-sm font-bold">
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NavigationSection;