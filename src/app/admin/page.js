"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar Placeholder */}
      <header className="w-full bg-white shadow-md p-4 fixed top-0 left-0 z-10 flex items-center justify-between px-6 md:px-10">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Sidebar & Main Content Wrapper */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 fixed h-full shadow-lg top-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Admin Dashboard
          </h2>
          <ul className="space-y-6">
            <li>
              <button
                onClick={() => handleRoute("/admin/manage-clients")}
                className="w-full py-3 px-5 rounded-lg text-lg bg-white text-indigo-600 font-semibold hover:bg-gray-200"
              >
                Manage Clients
              </button>
            </li>
            <li>
              <button
                onClick={() => handleRoute("/admin/emp-pay")}
                className="w-full py-3 px-5 rounded-lg text-lg hover:bg-indigo-700"
              >
                Employee Payments
              </button>
            </li>
            <li>
              <button
                onClick={() => handleRoute("/admin/dealer-pay")}
                className="w-full py-3 px-5 rounded-lg text-lg hover:bg-indigo-700"
              >
                Dealer Payments
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 ml-72 pt-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Welcome, Admin!</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card Component */}
            <div
              onClick={() => handleRoute("/admin/manage-clients")}
              className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                Manage Clients
              </h3>
              <p className="text-gray-600">
                Add, view, and manage clients with ease.
              </p>
            </div>

            <div
              onClick={() => handleRoute("/admin/emp-pay")}
              className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                Employee Payments
              </h3>
              <p className="text-gray-600">
                Manage payroll and employee payment processing.
              </p>
            </div>

            <div
              onClick={() => handleRoute("/admin/dealer-pay")}
              className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                Dealer Payments
              </h3>
              <p className="text-gray-600">
                Manage dealer transactions and payments seamlessly.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
