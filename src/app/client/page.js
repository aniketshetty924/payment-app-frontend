//

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/utils/verifyToken";

const ClientDashboard = () => {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations

  // Fetch the client data (token validation) in useEffect
  // useEffect(() => {
  //   const fetchClientData = async () => {
  //     try {
  //       const clientData = await verifyToken();
  //       setClient(clientData); // Set client data after fetching
  //     } catch (error) {
  //       console.error("Error verifying token", error);
  //       // Handle error, maybe redirect to login if token is invalid
  //       router.push("/login");
  //     } finally {
  //       setLoading(false); // Set loading to false once the async call is complete
  //     }
  //   };

  //   fetchClientData(); // Call the function to fetch the client data
  // }, [router]); // Only run once after component mounts

  // if (loading) {
  //   return <div>Loading...</div>; // Optionally show a loading spinner or message
  // }

  // if (!client) {
  //   // Redirect to login or show an error message if no client data is found
  //   return <div>Error: Client data not found. Please log in again.</div>;
  // }

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Client Dashboard
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleRoute("/client/manage-emp")}
              className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-800"
            >
              Manage Employees
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRoute("/client/manage-dealer")}
              className="w-full py-2 px-4 rounded-lg text-lg hover:bg-indigo-700"
            >
              Manage Dealers
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRoute("/client/reports")}
              className="w-full py-2 px-4 rounded-lg text-lg hover:bg-indigo-700"
            >
              Reports
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <div
            onClick={() => handleRoute("/client/manage-emp")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Manage Employees
            </h3>
            <p className="text-gray-600">
              Add, view, and manage employees in your organization.
            </p>
          </div>

          <div
            onClick={() => handleRoute("/client/manage-dealer")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Manage Dealers
            </h3>
            <p className="text-gray-600">
              Add, view, and manage dealers associated with your company.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <div
            onClick={() => handleRoute("/client/reports")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Reports
            </h3>
            <p className="text-gray-600">
              View and generate reports to analyze your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
