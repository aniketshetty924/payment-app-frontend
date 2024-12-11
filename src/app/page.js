const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen flex-col text-center">
        {/* App Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to PayFlow
        </h1>

        {/* App Description */}
        <p className="text-lg text-gray-600 mb-8">
          PayFlow helps businesses manage employee salaries, dealer
          transactions, and generate detailed reports for financial tracking.
          The admin can handle all financial processes, ensuring smooth
          operations and complete transparency.
        </p>

        {/* App Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Employees
            </h3>
            <p className="text-gray-600">
              Add and manage employees, set their salaries, and track their
              performance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Dealers
            </h3>
            <p className="text-gray-600">
              Add and manage dealers, set transaction amounts, and oversee their
              business dealings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generate Reports
            </h3>
            <p className="text-gray-600">
              Get detailed reports on employee salaries, dealer transactions,
              and overall financial health.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Secure Transactions
            </h3>
            <p className="text-gray-600">
              Complete all transactions securely and efficiently, ensuring a
              smooth financial operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
