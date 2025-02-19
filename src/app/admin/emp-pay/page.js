"use client";
import { useEffect, useState } from "react";
import {
  getAllPendingEmployeesPaymentRequest,
  getClientById,
  processPayments,
} from "@/lib/adminServices";

const EmployeePayments = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingPayments, setProcessingPayments] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientNameFilter, setClientNameFilter] = useState(""); // New state for client name filter

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAllPendingEmployeesPaymentRequest();
      if (response && response.data) {
        const clientsMap = new Map();

        // Group pending requests by clientId
        response.data.forEach((request) => {
          if (!clientsMap.has(request.clientId)) {
            clientsMap.set(request.clientId, []);
          }
          clientsMap.get(request.clientId).push(request);
        });

        const clientsList = [];
        for (const [clientId, requests] of clientsMap.entries()) {
          const clientDetails = await getClientById(clientId);
          if (clientDetails && clientDetails.data) {
            clientsList.push({
              client: clientDetails.data,
              requests,
            });
          }
        }

        setClients(clientsList);
        setFilteredClients(clientsList); // Initially, set filteredClients to all clients
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter clients based on the client name filter
  useEffect(() => {
    if (clientNameFilter) {
      const filtered = clients.filter((client) =>
        client.client.clientName
          .toLowerCase()
          .includes(clientNameFilter.toLowerCase()),
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients); // If no filter, show all clients
    }
  }, [clientNameFilter, clients]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  const closeClientDetails = () => {
    setSelectedClient(null);
  };

  const handlePayClick = async () => {
    if (!selectedClient) return;

    setProcessingPayments(true);
    const totalAmount = selectedClient.requests.reduce(
      (sum, request) => sum + parseFloat(request.amount),
      0,
    );
    const clientAccountId = selectedClient.client.accountId;
    try {
      // Validate the paymentsToProcess data structure
      const paymentsToProcess = selectedClient.requests.map((request) => ({
        recipientId: request.recipientId,
        recipientType: request.recipientType,
        amount: request.amount,
        paymentMonth: request.paymentMonth,
      }));

      if (!Array.isArray(paymentsToProcess) || paymentsToProcess.length === 0) {
        setErrorMessage("No payments to process.");
        setShowErrorModal(true);
        return;
      }

      console.log("Payments data to be processed: ", paymentsToProcess);

      // Proceed with payment processing
      const paymentResponse = await processPayments(
        selectedClient.client.id,
        paymentsToProcess,
      );

      console.log("Payment Response: ", paymentResponse);

      // Show success modal if payments were processed successfully
      setShowSuccessModal(true);

      // Remove the client from the clients list after successful payment processing
      setClients((prevClients) =>
        prevClients.filter(
          (client) => client.client.id !== selectedClient.client.id,
        ),
      );
    } catch (error) {
      console.error("Error during payment processing:", error);
      setErrorMessage("An error occurred while processing the payments.");
      setShowErrorModal(true);
    } finally {
      setProcessingPayments(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    closeClientDetails();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">PayFlow Admin</h2>
        <ul className="space-y-4">
          <li>
            <button className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-800">
              Employee Payments
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Pending Employee Payments
        </h1>

        {/* Client Name Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={clientNameFilter}
            onChange={(e) => setClientNameFilter(e.target.value)}
            placeholder="Filter by Client Name"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Table showing clients with pending employee payments */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Clients with Pending Employees
          </h2>
          {/* Check if there are no clients */}
          {filteredClients.length === 0 ? (
            <p className="text-center py-4 text-lg text-gray-600">
              No pending requests found
            </p>
          ) : (
            <table className="w-full table-auto table-fixed">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Client Name</th>
                  <th className="py-3 px-4 text-center">Pending Employees</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {filteredClients.map((client) => (
                  <tr key={client.client.id}>
                    <td className="py-3 px-4">{client.client.clientName}</td>
                    <td className="py-3 px-4 text-center">
                      {client.requests.length}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleClientClick(client)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        View Employees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2 max-w-3xl flex justify-center items-center">
              <div
                className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-indigo-600 rounded-full"
                role="status"
              ></div>
            </div>
          </div>
        )}

        {/* Client Details Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-3/4 max-w-4xl">
              <h2 className="text-2xl font-semibold mb-6">
                Employees Pending for {selectedClient.client.clientName}
              </h2>
              <table className="w-full table-auto table-fixed">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Employee ID</th>
                    <th className="py-3 px-4 text-center">Payment Month</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClient.requests.map((request) => (
                    <tr key={request.id}>
                      <td className="py-3 px-4">{request.recipientId}</td>
                      <td className="py-3 px-4 text-center">
                        {request.paymentMonth}
                      </td>
                      <td className="py-3 px-4 text-right">{request.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePayClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Pay
                </button>
                <button
                  onClick={closeClientDetails}
                  className="bg-red-600 ml-10 text-white px-4 py-2 ml-4 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2">
              <h2 className="text-xl font-semibold text-red-600">
                {errorMessage}
              </h2>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2">
              <h2 className="text-xl font-semibold text-green-600">
                Transactions Completed Successfully!
              </h2>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeSuccessModal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner for Payment Processing */}
        {processingPayments && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2 max-w-3xl flex justify-center items-center">
              <div
                className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-indigo-600 rounded-full"
                role="status"
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayments;
