"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Menu, X } from "lucide-react";

const AdminNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          PayFlow
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="text-gray-700 hover:text-indigo-600"
          >
            Settings
          </Link>
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200"
            >
              Profile
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="text-gray-700 hover:text-indigo-600"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
