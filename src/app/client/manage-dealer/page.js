"use client";
import { useRouter } from "next/navigation";

const ManageDealers = () => {
  const router = useRouter();

  const handleRoute = (route) => {
    console.log("here", route);
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Manage Dealers</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Manage Dealers
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Add Dealer Section */}
          <div
            onClick={() => handleRoute("/client/manage-dealer/add-dealer")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Dealer
            </h3>
            <p className="text-gray-600">
              Add new dealers to your organization.
            </p>
          </div>

          {/* Pay Dealer Section */}
          <div
            onClick={() => handleRoute("/client/manage-dealer/pay-dealer")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Pay Dealer
            </h3>
            <p className="text-gray-600">
              Pay the dealers their respective commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDealers;
