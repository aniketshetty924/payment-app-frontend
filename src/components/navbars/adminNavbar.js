"use client";
import Link from "next/link";
import Cookies from "js-cookie";

const AdminNavbar = () => {
  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  const handleForward = () => {
    window.history.forward(); // Go forward to the next page
  };
  const handleLogout = () => {
    // Remove token from localStorage (or clear other user-related data)
    localStorage.removeItem("token");
    Cookies.remove("token");

    // Redirect to the home page
    router.push("/");
  };

  return (
    <nav className="bg-indigo-600 text-white py-4 px-6 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Back and Forward Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={handleForward}
            className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg"
          >
            Forward
          </button>
        </div>

        {/* PayFlow Logo centered */}
        <div className="flex-1 text-center">
          <Link href="/" className="text-2xl font-bold">
            PayFlow
          </Link>
        </div>

        {/* Navigation Links (Logout) */}
        <div className="space-x-6">
          <Link
            onClick={handleLogout}
            href="/login"
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
