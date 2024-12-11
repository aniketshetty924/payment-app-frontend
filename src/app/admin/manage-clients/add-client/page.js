"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  createClient,
  getAllSubmittedClientForms,
  updateClientFormStatus,
} from "@/lib/adminServices";

const AddClient = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllSubmittedClientForms();
      if (response && response.data) {
        setUsers(response.data);
      }
    };
    fetchData();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleReject = (user) => {
    setSelectedUser(user);
    setRejectionModalOpen(true);
  };

  const closeRejectionModal = () => {
    setRejectionModalOpen(false);
    setSelectedUser(null);
    setAdminNote("");
  };

  const handleRejectSubmit = async () => {
    if (!adminNote) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      setLoading(true);
      await updateClientFormStatus(
        selectedUser.username,
        "rejected",
        adminNote
      );
      setLoading(false);
      closeRejectionModal();
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setSuccessModalOpen(true);
    } catch (error) {
      setLoading(false);
      console.error("Error in rejection process:", error);
    }
  };

  const handleApprove = async (user) => {
    try {
      setLoading(true);
      const clientData = {
        clientName: user.clientName,
        founder: user.founder,
        username: user.username,
        password: user.password,
        email: user.email,
        city: user.city,
        state: user.state,
        accountId: user.accountId,
        businessLicense: user.businessLicense,
        gstCertificate: user.gstCertificate,
      };

      const createResponse = await createClient(clientData);
      if (createResponse) {
        await updateClientFormStatus(user.username, "approved", "");
        setUsers(users.filter((u) => u.id !== user.id));
        setSuccessModalOpen(true);
      } else {
        alert("Client creation failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in approval process:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">PayFlow Admin</h2>
        <ul className="space-y-4">
          <li>
            <button className="w-full py-2 px-4 rounded-lg text-lg bg-indigo-800">
              Client Registration
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Client Registration Forms
        </h1>

        {/* Conditional Rendering */}
        {users.length === 0 ? (
          <div className="text-center text-gray-600 py-6">
            <p>No registration forms available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 pl-0 px-4">#</th>
                  <th className="py-3 pl-0 px-4">Name</th>
                  <th className="py-3 pl-0 px-4">Email</th>
                  <th className="py-3 pl-0 px-4">View Form</th>
                  <th className="py-3 pl-0 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{user.clientName}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleApprove(user)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

        {successModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6">
                Operation Successful
              </h2>
              <p>Updated Response is sent to the user via email</p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSuccessModalOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && selectedUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6">
                Registration Form Details
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Client Name:</strong> {selectedUser.clientName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Founder:</strong> {selectedUser.founder}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>City:</strong> {selectedUser.city}
                </p>
                <p>
                  <strong>State:</strong> {selectedUser.state}
                </p>
                <p>
                  <strong>Account ID:</strong> {selectedUser.accountId}
                </p>
                <p>
                  <strong>Business License:</strong>{" "}
                  <a
                    href={selectedUser.businessLicense}
                    target="_blank"
                    className="text-blue-600"
                  >
                    View License
                  </a>
                </p>
                {selectedUser.gstCertificate && (
                  <p>
                    <strong>GST Certificate:</strong>{" "}
                    <a
                      href={selectedUser.gstCertificate}
                      target="_blank"
                      className="text-blue-600"
                    >
                      View GST Certificate
                    </a>
                  </p>
                )}
                <p>
                  <strong>Status:</strong> {selectedUser.status}
                </p>
                {selectedUser.adminNote && (
                  <p>
                    <strong>Admin Note:</strong> {selectedUser.adminNote}
                  </p>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {rejectionModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-8 rounded-lg w-1/2 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6">
                Reject Reason for {selectedUser.clientName}
              </h2>
              <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-lg"
                placeholder="Write the reason for rejection..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              ></textarea>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeRejectionModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClient;
