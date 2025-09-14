import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import ProductCard from "./ProductCard";
//..............................................................................

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/reconditions");
        setRecommendations(res.data);
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching recommendations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
