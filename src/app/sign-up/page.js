"use client";
import { useState } from "react";
import Link from "next/link";
import { handleSignUp } from "@/lib/loginServices";
import { photoUrlService } from "@/utils/photoUrlServices";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

const SignUp = () => {
  // Step Tracking
  const [step, setStep] = useState(1);

  // Form Data States
  const [basicInfo, setBasicInfo] = useState({
    clientName: "",
    founder: "",
    username: "",
    password: "",
    email: "",
  });

  const [addressInfo, setAddressInfo] = useState({
    city: "",
    state: "", // Initialize the state as an empty string
  });

  const [bankDetails, setBankDetails] = useState({
    accountId: "",
    businessLicense: null,
    gstCertificate: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle Next and Previous
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle Form Inputs
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo({ ...basicInfo, [name]: value });
  };

  const handleAddressInfoChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo({ ...addressInfo, [name]: value });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      try {
        // Upload the file and get the URL
        const fileUrl = await photoUrlService(file);
        // Update the bankDetails state with the uploaded file URL
        setBankDetails({
          ...bankDetails,
          [name]: fileUrl, // Assign the file URL to the appropriate field
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("There was an error uploading the document. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start loading spinner
    setLoading(true);

    try {
      // Attempt to submit the form
      await handleSignUp(e, basicInfo, addressInfo, bankDetails);

      // If the sign-up is successful, hide the loading spinner and show the success modal
      setLoading(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error during sign up:", error);

      // Stop the loading spinner
      setLoading(false);

      // Show an alert message (or handle the error as needed)
      alert(
        "There was an error submitting your registration. Please try again."
      );
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
      {/* Back to Login link */}
      <Link
        href="/login" // Adjust the route as needed
        className="absolute top-4 left-4 z-20 text-white text-sm font-medium hover:underline"
      >
        Back to Login
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">PayFlow</h1>
          <p className="text-lg text-gray-600 mt-2">Sign Up for Your Account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={basicInfo.clientName}
                  onChange={handleBasicInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="founder"
                  className="block text-sm font-medium text-gray-700"
                >
                  Founder Name
                </label>
                <input
                  type="text"
                  id="founder"
                  name="founder"
                  value={basicInfo.founder}
                  onChange={handleBasicInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={basicInfo.username}
                  onChange={handleBasicInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={basicInfo.password}
                    onChange={handleBasicInfoChange}
                    className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressInfo.city}
                  onChange={handleAddressInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={addressInfo.state}
                  onChange={handleAddressInfoChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                >
                  <option value="">Select a State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Bank Details and Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="accountId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account ID
                </label>
                <input
                  type="text"
                  id="accountId"
                  name="accountId"
                  value={bankDetails.accountId}
                  onChange={handleBankDetailsChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="businessLicense"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business License (Upload)
                </label>
                <input
                  type="file"
                  id="businessLicense"
                  name="businessLicense"
                  onChange={handleFileUpload}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gstCertificate"
                  className="block text-sm font-medium text-gray-700"
                >
                  GST Certificate (Upload)
                </label>
                <input
                  type="file"
                  id="gstCertificate"
                  name="gstCertificate"
                  onChange={handleFileUpload}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin border-t-4 border-indigo-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-700">
              Hi {basicInfo.clientName}!
            </h2>
            <p className="mt-4 text-gray-600">
              Your registration form has been submitted. Admin will check the
              information and documents and approve the registration soon.
              Please login after some time.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
