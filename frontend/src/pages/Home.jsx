import React, { useEffect } from "react";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import use_product_store from "../stores/use_product_store";
import categories from "../stores/categories";
const Home = () => {
  const { products, fetchFeaturedProducts } = use_product_store();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-teal-50 overflow-hidden">
      <div className="relative z-10 max-w-7xl mask-auto px-4 sm:px-6 lg:p-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          explore our categories
        </h1>
        <p className="text-center text-xl text-gray-400 md-12">
          discover the latest fashion trend{" "}
        </p>

        <div className=" grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((product) => {
            return <Categories category={product} key={product.imageUrl} />;
          })}
        </div>
        <div>{<FeaturedProducts featuredProducts={products} />}</div>
      </div>
    </div>
  );
};

export default Home;
