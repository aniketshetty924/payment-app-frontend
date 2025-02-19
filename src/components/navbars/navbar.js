"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-wide">
          PayFlow
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/about" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
          <Link
            href="/login"
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-600 shadow-md p-4 flex flex-col space-y-4">
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
          <Link
            href="/login"
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
