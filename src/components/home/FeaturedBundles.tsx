"use client";

import ProductCard from "@/components/home/ProductCard";

interface FeaturedBundlesProps {
  bundles: any[];
}

const FeaturedBundles: React.FC<FeaturedBundlesProps> = ({ bundles }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        🎁 Special Bundles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
        {bundles.map((bundle) => (
          <ProductCard
            key={bundle.id}
            id={bundle.id}
            name={bundle.name}
            price={bundle.price}
            image={bundle.image || "/images/placeholder.jpg"}
            description={bundle.description}
            available={bundle.available}
            jabysFavorite={bundle.jabysFavorite || false}
            bestSelling={bundle.bestSelling || false}
            isBundle
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBundles;