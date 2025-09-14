import React from "react";
import CustomerOrders from "../components/CustomerOrders";
const CustomerDeshboard = ({ user }) => {
  return (
    <div className="max-h-screen-lg bg-gray-550 flex items-center justify-center px-6 py-10">
      {user && (
        <div className="max-w-2xl w-full bg-gray-700 rounded-xl shadow-lg p-8 content-center">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfFsUopJfGt4lVDmVIDti7Ti2ynkw-e0Nj6Q&s"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-emerald-500"
            />
            <div className="mt-4 md:mt-0 text-center md:text-left ">
              <h1 className="text-2xl font-bold text-gray-200">{user.name}</h1>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>

          {user && <CustomerOrders user={user} />}
        </div>
      )}
    </div>
  );
};

export default CustomerDeshboard;
