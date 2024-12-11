"use client";
import { useEffect, useState } from "react";
import { getClientById } from "@/lib/clientServices"; // Adjust the import path based on your project structure

const Profile = () => {
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch client data using the getClientById function
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getClientById();
        if (response && response.data) {
          setClientData(response.data);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center text-red-500">
        Failed to load client data.
      </div>
    );
  }

  // Destructure client data to exclude unwanted fields
  const {
    clientName,
    founder,
    username,
    email,
    city,
    state,
    accountId,
    businessLicense,
    gstCertificate,
  } = clientData;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Client Profile
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          {clientName}
        </h2>

        <div className="mb-4">
          <strong>Founder:</strong> {founder}
        </div>
        <div className="mb-4">
          <strong>Username:</strong> {username}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-4">
          <strong>Location:</strong> {city}, {state}
        </div>
        <div className="mb-4">
          <strong>Account ID:</strong> {accountId}
        </div>
        <div className="mb-4">
          <strong>Business License:</strong>{" "}
          <a
            href={businessLicense}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600"
          >
            View License
          </a>
        </div>
        <div className="mb-4">
          <strong>GST Certificate:</strong>{" "}
          <a
            href={gstCertificate}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600"
          >
            View Certificate
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
