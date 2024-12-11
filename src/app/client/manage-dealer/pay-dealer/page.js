"use client";

import PageSize from "@/components/pagesize/pagesize";
import Pagination from "@/components/pagination/pagination";
import Table from "@/components/table/table";
import {
  getAllDealers,
  getAllDealersPaymentRequestByMonth,
  saveDealerPaymentsForAdminReview,
} from "@/lib/clientServices";

import { useEffect, useState } from "react";

const PayDealers = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]); // New state for filtered dealers
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalDealers, setTotalDealers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [processedDealers, setProcessedDealers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [showAmountErrorModal, setShowAmountErrorModal] = useState(false); // New state for error modal

  // Filter states
  const [dealerNameFilter, setDealerNameFilter] = useState("");
  const [dealerEmailFilter, setDealerEmailFilter] = useState("");

  useEffect(() => {
    const fetchDealers = async () => {
      const paymentRequests = await getAllDealersPaymentRequestByMonth(
        `${selectedMonth}-${selectedYear}`
      );
      const response = await getAllDealers();

      if (response && paymentRequests) {
        const { data: allDealers } = response;
        const { data: processed } = paymentRequests;

        const processedDealerIds = processed.map(
          (dealer) => dealer.recipientId
        );
        setProcessedDealers(processedDealerIds);

        const remainingDealers = allDealers.filter(
          (dealer) => !processedDealerIds.includes(dealer.accountId)
        );

        setDealers(remainingDealers);
        setFilteredDealers(remainingDealers); // Initially, filtered dealers are the same as all dealers
        setTotalDealers(remainingDealers.length);
      }
    };

    fetchDealers();
  }, [selectedMonth, selectedYear, showSuccessModal]);

  useEffect(() => {
    const filtered = dealers.filter((dealer) => {
      const matchesName =
        dealer.dealerName
          .toLowerCase()
          .includes(dealerNameFilter.toLowerCase()) || dealerNameFilter === "";
      const matchesEmail =
        dealer.dealerEmail
          .toLowerCase()
          .includes(dealerEmailFilter.toLowerCase()) ||
        dealerEmailFilter === "";

      return matchesName && matchesEmail;
    });

    setFilteredDealers(filtered); // Update filtered dealers
    setTotalDealers(filtered.length); // Update total count for pagination
    setCurrentPage(1); // Reset to first page when filters change
  }, [dealerNameFilter, dealerEmailFilter, dealers]);

  const handleDealerSelection = (dealerId) => {
    setSelectedDealers((prevSelected) =>
      prevSelected.includes(dealerId)
        ? prevSelected.filter((id) => id !== dealerId)
        : [...prevSelected, dealerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDealers.length === filteredDealers.length) {
      setSelectedDealers([]);
    } else {
      setSelectedDealers(filteredDealers.map((dealer) => dealer.id));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAmountChange = (dealerId, value) => {
    const numericValue =
      value && /^[0-9]*$/.test(value) ? parseInt(value, 10) : 0;

    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [dealerId]: numericValue,
    }));
  };

  const handlePayment = async () => {
    const invalidPayment = selectedDealers.some((dealerId) => {
      const dealer = filteredDealers.find((deal) => deal.id === dealerId);
      const amount = amounts[dealerId];
      return !amount || amount <= 0; // If amount is missing or invalid
    });

    if (invalidPayment) {
      setShowAmountErrorModal(true); // Show error modal if any dealer has missing amount
      return;
    }

    setIsLoading(true);
    const paymentDetails = selectedDealers
      .map((dealerId) => {
        const dealer = filteredDealers.find((deal) => deal.id === dealerId);

        if (!dealer) return null;

        const customAmount =
          amounts[dealerId] !== undefined ? amounts[dealerId] : dealer.amount;

        return {
          recipientId: dealer.accountId,
          recipientName: dealer.dealerName,
          paymentType: "dealer",
          amount: customAmount,
          paymentDate: new Date().toISOString(),
          paymentMonth: `${selectedMonth}-${selectedYear}`,
        };
      })
      .filter((payment) => payment !== null);

    if (paymentDetails.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      await saveDealerPaymentsForAdminReview(paymentDetails);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setAmounts({});
    setShowSuccessModal(false);
  };

  const handleAmountErrorModalClose = () => {
    setShowAmountErrorModal(false);
  };

  const headers = ["Sr. No.", "Dealer Name", "Email", "Amount", "Select"];

  const paginatedData = filteredDealers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isAllSelected = selectedDealers.length === filteredDealers.length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Pay Dealers</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Pay Dealers
        </h1>

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
            placeholder="Search by Dealer Email"
            value={dealerEmailFilter}
            onChange={(e) => setDealerEmailFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handlePayment}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            disabled={selectedDealers.length === 0}
          >
            Pay Selected Dealers
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-select h-10 w-36 px-4 py-2 border border-gray-300 rounded-md"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <span className="mx-4 text-xl font-semibold">{selectedYear}</span>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2">Select All Dealers</span>
        </div>

        <Table
          headers={headers}
          tableData={paginatedData.map((dealer, index) => ({
            srNo: (currentPage - 1) * pageSize + index + 1,
            dealerName: dealer.dealerName,
            dealerEmail: dealer.dealerEmail,
            amount: (
              <input
                type="text"
                value={
                  amounts[dealer.id] !== undefined ? amounts[dealer.id] : ""
                }
                onChange={(e) => handleAmountChange(dealer.id, e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-md"
                disabled={processedDealers.includes(dealer.accountId)}
              />
            ),
            select: (
              <input
                type="checkbox"
                checked={selectedDealers.includes(dealer.id)}
                onChange={() => handleDealerSelection(dealer.id)}
                disabled={processedDealers.includes(dealer.accountId)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            ),
          }))}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalDealers / pageSize)}
          onPageChange={setCurrentPage}
        />

        <PageSize pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Payment Process Started
            </h3>
            <p className="text-lg mb-4">
              The payment process for selected dealers has been started. Admin
              will verify and complete the transactions accordingly.
            </p>
            <button
              onClick={handleModalClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAmountErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">
              Enter Amount to Proceed
            </h3>
            <p className="text-lg mb-4">
              Please enter a valid amount for all selected dealers before
              proceeding with the payment.
            </p>
            <button
              onClick={handleAmountErrorModalClose}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayDealers;
