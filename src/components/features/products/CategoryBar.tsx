"use client";

import { motion } from "framer-motion";

interface CategoryBarProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="flex justify-center overflow-x-auto no-scrollbar py-4">
      <div className="flex bg-gray-200 rounded-full shadow-sm divide-x divide-gray-300
                      w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
        {categories.map((category, index) => {
          const isActive = activeCategory === category;
          const isFirst = index === 0;
          const isLast = index === categories.length - 1;

          return (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category)}
              className={`flex-1 text-center px-4 py-2 text-sm font-medium transition-colors
                         ${isFirst ? "rounded-l-full" : ""}
                         ${isLast ? "rounded-r-full" : ""}
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         ${isActive ? "bg-green-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;