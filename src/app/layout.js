"use client";

import ClientNavbar from "@/components/navbars/clientNavbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/navbars/adminNavbar";
import Navbar from "@/components/navbars/navbar";

export default function Layout({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  const isClientPage = pathname.startsWith("/client");
  const isHomePage = pathname === "/" || pathname.startsWith("/login");

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PayFlow - Manage Your Finances</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900">
        {/* Conditionally render the navbars */}
        {isHomePage && <Navbar />}
        {isAdminPage && <AdminNavbar />}
        {isClientPage && <ClientNavbar />}

        <main className="min-h-screen flex flex-col justify-between">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-indigo-600 text-white text-center py-4">
          <p>&copy; 2024 PayFlow. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
