"use client";
import PageSize from "@/components/pagesize/pagesize";
import Pagination from "@/components/pagination/pagination";
import Table from "@/components/table/table";
import { createDealer, getAllBanks, getAllDealers } from "@/lib/clientServices";
import { useEffect, useState } from "react";

const AddDealer = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]); // New state for filtered dealers
  const [banks, setBanks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalDealers, setTotalDealers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDealerModal, setShowAddDealerModal] = useState(false);
  const [step, setStep] = useState(1);
  const [dealerData, setDealerData] = useState({
    dealerName: "",
    dealerEmail: "",
    dealerUsername: "",
    accountId: "",
    bankName: "",
    ifscCode: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter states
  const [dealerNameFilter, setDealerNameFilter] = useState("");
  const [dealerUsernameFilter, setDealerUsernameFilter] = useState("");

  useEffect(() => {
    const fetchDealers = async () => {
      const response = await getAllDealers();
      if (response) {
        setDealers(response.data);
        setFilteredDealers(response.data); // Initially, filtered dealers are the same as all dealers
        setTotalDealers(response.data.length);
      }
    };
    const fetchBanks = async () => {
      const response = await getAllBanks();
      if (response) {
        setBanks(response.data);
      }
    };
    fetchDealers();
    fetchBanks();
  }, []);

  useEffect(() => {
    const filtered = dealers.filter((dealer) => {
      const matchesName =
        dealer.dealerName
          .toLowerCase()
          .includes(dealerNameFilter.toLowerCase()) || dealerNameFilter === "";
      const matchesUsername =
        dealer.dealerUsername
          .toLowerCase()
          .includes(dealerUsernameFilter.toLowerCase()) ||
        dealerUsernameFilter === "";

      return matchesName && matchesUsername;
    });

    setFilteredDealers(filtered); // Update filtered dealers
    setTotalDealers(filtered.length); // Update total count for pagination
    setCurrentPage(1); // Reset to first page when filters change
  }, [dealerNameFilter, dealerUsernameFilter, dealers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDealerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateDealer = async () => {
    setIsLoading(true);
    try {
      const response = await createDealer(dealerData);

      if (response.status === 201) {
        setShowSuccessModal(true);
        setDealerData({
          dealerName: "",
          dealerEmail: "",
          dealerUsername: "",
          accountId: "",
          bankName: "",
          ifscCode: "",
        });
        setStep(1);
        setShowAddDealerModal(false);
      } else {
        console.error("Dealer creation failed:", response);
      }
    } catch (error) {
      console.error("Error creating dealer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headers = [
    "Sr. No.",
    "dealerName",
    "dealerEmail",
    "dealerUsername",
    "accountId",
    "bankName",
  ];

  const paginatedData = filteredDealers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Add Dealer</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dealers</h1>

        {/* Filter Section */}
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by Dealer Name"
            value={dealerNameFilter}
            onChange={(e) => setDealerNameFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Search by Dealer Username"
            value={dealerUsernameFilter}
            onChange={(e) => setDealerUsernameFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowAddDealerModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add New Dealer
          </button>
        </div>

        <Table
          headers={headers}
          tableData={paginatedData.map((dealer, index) => ({
            srNo: (currentPage - 1) * pageSize + index + 1,
            dealerName: dealer.dealerName,
            dealerEmail: dealer.dealerEmail,
            dealerUsername: dealer.dealerUsername,
            accountId: dealer.accountId,
            bankName: dealer.bankName,
          }))}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalDealers / pageSize)}
          onPageChange={setCurrentPage}
        />

        <PageSize pageSize={pageSize} onPageSizeChange={setPageSize} />
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
        </div>
      )}

      {showAddDealerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
              {step === 1
                ? "Dealer Personal Information"
                : "Dealer Bank Details"}
            </h3>

            {step === 1 && (
              <div>
                <input
                  type="text"
                  name="dealerName"
                  value={dealerData.dealerName}
                  onChange={handleInputChange}
                  placeholder="Dealer Name"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="email"
                  name="dealerEmail"
                  value={dealerData.dealerEmail}
                  onChange={handleInputChange}
                  placeholder="Dealer Email"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="text"
                  name="dealerUsername"
                  value={dealerData.dealerUsername}
                  onChange={handleInputChange}
                  placeholder="Dealer Username"
                  className="w-full p-2 border mb-4"
                />
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  type="text"
                  name="accountId"
                  value={dealerData.accountId}
                  onChange={handleInputChange}
                  placeholder="Account ID"
                  className="w-full p-2 border mb-4"
                />
                <select
                  name="bankName"
                  value={dealerData.bankName}
                  onChange={handleInputChange}
                  className="w-full p-2 border mb-4"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.bankName}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="ifscCode"
                  value={dealerData.ifscCode}
                  onChange={handleInputChange}
                  placeholder="IFSC Code"
                  className="w-full p-2 border mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mr-2"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateDealer}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Create Dealer
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAddDealerModal(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Dealer Created Successfully
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDealer;
