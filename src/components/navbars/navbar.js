import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white py-4 px-6 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <Link href="/" className="text-2xl font-bold">
          PayFlow
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link
            href="/login"
            className="bg-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-800"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
