"use client";
import { useRouter, useSearchParams } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleRoute("/admin/manage-clients")}
              className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-800"
            >
              Manage Clients
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRoute("/admin/emp-pay")}
              className="w-full py-2 px-4 rounded-lg text-lg hover:bg-indigo-700"
            >
              Employee Payments
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRoute("/admin/dealer-pay")}
              className="w-full py-2 px-4 rounded-lg text-lg hover:bg-indigo-700"
            >
              Dealer Payments
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome {username} !
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <div
            onClick={() => handleRoute("/admin/manage-clients")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Manage Clients
            </h3>
            <p className="text-gray-600">
              Add, view, and manage the clients associated with your platform.
            </p>
          </div>

          <div
            onClick={() => handleRoute("/admin/emp-pay")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Employee Payments
            </h3>
            <p className="text-gray-600">
              View and manage employee payment processing requests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-6">
          <div
            onClick={() => handleRoute("/admin/dealer-pay")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Dealer Payments
            </h3>
            <p className="text-gray-600">
              View and manage dealer payment processing requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
