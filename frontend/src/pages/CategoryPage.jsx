import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import use_product_store from "../stores/use_product_store";
import { useParams } from "react-router-dom";
const CategoryPage = () => {
  const { fetchProductsByCategory, products } = use_product_store();
  const { category } = useParams();
  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
