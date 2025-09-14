import React from "react";

const AnalyticsCard = ({ title, value }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ">
      <div className="flex justify-between items-center border-white-200">
        <div className="z-10">
          <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
          <h3 className="text-white text-3xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
