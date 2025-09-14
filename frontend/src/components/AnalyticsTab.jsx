import { useEffect, useState } from "react";
import axios from "../lib/axios";
import AnalyticsCard from "./AnalyticsCard";
//..............................................................................
const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData([
          { value: response.data.analytics_data.users, title: "Total Users" },
          { value: response.data.analytics_data.sales, title: "Total Sales" },
          {
            value: response.data.analytics_data.products,
            title: "Total Products",
          },
          {
            value: response.data.analytics_data.revenue,
            title: "Total Revenue",
          },
        ]);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {analyticsData &&
        analyticsData.map((data, count) => {
          return (
            <AnalyticsCard title={data.title} value={data.value} key={count} />
          );
        })}
    </div>
  );
};

export default AnalyticsTab;
