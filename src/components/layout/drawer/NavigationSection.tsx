// src components/layout/drawer/NavigationSection.tsx

import React from "react";
import Link from "next/link";
import { getNavigation } from "@/lib/getBusinessData";

const NavigationSection = () => {
  const nav = getNavigation();

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