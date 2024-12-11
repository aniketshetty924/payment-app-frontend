"use client";

import { useEffect, useState } from "react";
import {
  getAllClients,
  updateClientById,
  deleteClientById,
} from "@/lib/adminServices";
import Pagination from "@/components/pagination/pagination";
import PageSize from "@/components/pagesize/pagesize";

const ViewClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState({
    clientName: "",
    username: "",
    email: "",
    city: "",
    founder: "",
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [clientToDelete, setClientToDelete] = useState(null);

  const [filters, setFilters] = useState({
    clientName: "",
    username: "",
    city: "",
    founder: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await getAllClients();
        if (response) {
          setClients(response.data.clients);
          setFilteredClients(response.data.clients);
          setTotalClients(response.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching clients: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filteredData = clients.filter((client) => {
      return (
        (filters.clientName
          ? client.clientName
              .toLowerCase()
              .includes(filters.clientName.toLowerCase())
          : true) &&
        (filters.username
          ? client.username
              .toLowerCase()
              .includes(filters.username.toLowerCase())
          : true) &&
        (filters.city
          ? client.city.toLowerCase().includes(filters.city.toLowerCase())
          : true) &&
        (filters.founder
          ? client.founder.toLowerCase().includes(filters.founder.toLowerCase())
          : true)
      );
    });
    setFilteredClients(filteredData);
    setTotalClients(filteredData.length);
  }, [filters, clients]);

  const handleOpenEditModal = (client) => {
    setSelectedClient(client);
    setClientData({
      clientName: client.clientName,
      username: client.username,
      email: client.email,
      city: client.city,
      founder: client.founder,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setClientData({
      clientName: "",
      username: "",
      email: "",
      city: "",
      founder: "",
    });
  };

  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  const handleUpdateClient = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    const updatedFields = [];

    Object.keys(clientData).forEach((key) => {
      if (clientData[key] !== selectedClient[key]) {
        updatedFields.push({ parameter: key, value: clientData[key] });
      }
    });

    if (updatedFields.length === 0) {
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      for (const { parameter, value } of updatedFields) {
        await updateClientById(selectedClient.id, parameter, value);
      }

      const updatedClients = filteredClients.map((client) =>
        client.id === selectedClient.id ? { ...client, ...clientData } : client
      );

      setFilteredClients(updatedClients);
      setIsConfirmModalOpen(false);
      setIsEditModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating client: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteClientById(clientToDelete.id);
      const remainingClients = filteredClients.filter(
        (client) => client.id !== clientToDelete.id
      );
      setFilteredClients(remainingClients);
      setTotalClients(remainingClients.length);
      setIsConfirmModalOpen(false);
      setClientToDelete(null);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error deleting client: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setClientToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const paginatedData = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">View Clients</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Clients List
        </h1>

        <div className="mb-6">
          <input
            type="text"
            name="clientName"
            placeholder="Filter by Client Name"
            value={filters.clientName}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
          />
          <input
            type="text"
            name="username"
            placeholder="Filter by Username"
            value={filters.username}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
          />
          <input
            type="text"
            name="city"
            placeholder="Filter by City"
            value={filters.city}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
          />
          <input
            type="text"
            name="founder"
            placeholder="Filter by Founder"
            value={filters.founder}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Sr. No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Founder
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  City
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Update
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((client, index) => (
                <tr key={client.id} className="border-t">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.founder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => handleOpenEditModal(client)}
                    >
                      Update
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleDeleteClient(client)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalClients / pageSize)}
          onPageChange={setCurrentPage}
        />

        <PageSize pageSize={pageSize} onPageSizeChange={setPageSize} />
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl mb-4">
              Are you sure you want to delete "{clientToDelete?.clientName}"?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl mb-4 text-green-600">
              Client successfully deleted
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default ViewClients;
