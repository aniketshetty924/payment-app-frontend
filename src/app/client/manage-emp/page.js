"use client";
import { useRouter } from "next/navigation";

const ManageEmployees = () => {
  const router = useRouter();

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Manage Employees
        </h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Manage Employees
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* Add Employee Card */}
          <div
            onClick={() => handleRoute("/client/manage-emp/add-emp")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Employee
            </h3>
            <p className="text-gray-600">
              Add new employees to your organization.
            </p>
          </div>

          {/* Pay Employee Card */}
          <div
            onClick={() => handleRoute("/client/manage-emp/pay-emp")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Pay Employee
            </h3>
            <p className="text-gray-600">
              Pay the employees their respective salaries.
            </p>
          </div>

          {/* Add Employees CSV Card */}
          <div
            onClick={() => handleRoute("/client/manage-emp/add-emp-csv")}
            className="p-8 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Employees CSV
            </h3>
            <p className="text-gray-600">
              Upload a CSV file to add multiple employees at once.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;
