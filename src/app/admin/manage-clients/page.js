"use client";
import { useRouter } from "next/navigation";

const ManageClients = () => {
  const router = useRouter();

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Manage Clients</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleRoute("/admin/manage-clients/add-client")}
              className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              Add Client
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRoute("/admin/manage-clients/view-client")}
              className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              View All Clients
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Manage Clients
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* Add Client Card */}
          <div
            onClick={() => handleRoute("/admin/manage-clients/add-client")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Client
            </h3>
            <p className="text-gray-600">Add a new client to your system.</p>
          </div>

          {/* View All Clients Card */}
          <div
            onClick={() => handleRoute("/admin/manage-clients/view-client")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              View All Clients
            </h3>
            <p className="text-gray-600">
              View all existing clients in your system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClients;
