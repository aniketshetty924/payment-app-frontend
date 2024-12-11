const About = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen flex-col text-center">
        {/* App Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About PayFlow</h1>

        {/* App Description */}
        <p className="text-lg text-gray-600 mb-8">
          PayFlow is an all-in-one platform designed to streamline financial
          operations for businesses, from managing employee salaries and dealer
          transactions to generating detailed financial reports. With our
          secure, transparent, and efficient solution, businesses can focus on
          growth while we take care of the financial management.
        </p>

        {/* Mission Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h3>
          <p className="text-gray-600">
            Our mission is to empower businesses by simplifying financial
            processes. We strive to provide a platform that enhances
            transparency, improves efficiency, and ensures secure transactions
            for all users.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Vision
          </h3>
          <p className="text-gray-600">
            At PayFlow, we envision a world where financial operations are
            seamless and businesses of all sizes can easily manage their
            employees, transactions, and financial reports with confidence and
            ease.
          </p>
        </div>

        {/* Values Section */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Core Values
          </h3>
          <ul className="text-gray-600 space-y-4">
            <li className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                Integrity:
              </span>
              We believe in maintaining transparency, honesty, and ethical
              practices in all our operations.
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                Innovation:
              </span>
              We continuously innovate to provide cutting-edge solutions to meet
              the evolving needs of businesses.
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                Security:
              </span>
              We prioritize the security and privacy of your data, ensuring that
              all transactions are safe and secure.
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                Customer-Centric:
              </span>
              We put our customers first, constantly working to improve their
              experience and satisfaction with our platform.
            </li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Team
          </h3>
          <p className="text-gray-600 mb-4">
            PayFlow is driven by a passionate and dedicated team of
            professionals committed to delivering the best financial solutions.
            Our team consists of experts in finance, technology, and business
            development, all working together to build a platform that empowers
            businesses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-xl text-gray-800">
                Swapnil Shah
              </h4>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-xl text-gray-800">
                Aniket Shetty
              </h4>
              <p className="text-gray-600">Co-Founder & CTO</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-xl text-gray-800">John Doe</h4>
              <p className="text-gray-600">Lead Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
