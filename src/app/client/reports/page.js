"use client";
import { useState, useEffect } from "react";
import Select from "@/components/select/select";
import {
  getDealerPaymentReportByMonth,
  getEmployeePaymentReportByMonth,
} from "@/lib/clientServices";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("employee");
  const [paymentMonth, setPaymentMonth] = useState("January-2024");
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Search filters
  const [employeeNameFilter, setEmployeeNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dealerNameFilter, setDealerNameFilter] = useState("");

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const formattedMonth = paymentMonth;
      let response;
      if (reportType === "employee") {
        response = await getEmployeePaymentReportByMonth(formattedMonth);
      } else {
        response = await getDealerPaymentReportByMonth(formattedMonth);
      }

      setData(response.data);
      setTotalRecords(response.data.length);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, paymentMonth, currentPage, pageSize]);

  // Function to format payment date
  const formatPaymentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Define table headers based on the report type (without the 'Month' column)
  const headers =
    reportType === "employee"
      ? ["Sr. No.", "Employee Name", "Payment Date", "Salary", "Status"]
      : ["Sr. No.", "Dealer Name", "Payment Date", "Payment Amount", "Status"];

  // Filter data based on search inputs
  const filteredData = (data || []).filter((row) => {
    if (reportType === "employee") {
      return (
        (employeeNameFilter === "" ||
          row.recipientName
            .toLowerCase()
            .includes(employeeNameFilter.toLowerCase())) &&
        (statusFilter === "" ||
          row.status.toLowerCase().includes(statusFilter.toLowerCase()))
      );
    }
    if (reportType === "dealer") {
      return (
        (dealerNameFilter === "" ||
          row.recipientName
            .toLowerCase()
            .includes(dealerNameFilter.toLowerCase())) &&
        (statusFilter === "" ||
          row.status.toLowerCase().includes(statusFilter.toLowerCase()))
      );
    }
    return true;
  });

  // Paginate the data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Reports</h2>
        <div className="space-y-4">
          <button
            className={`w-full p-3 text-white ${
              reportType === "employee" ? "bg-indigo-700" : "bg-indigo-600"
            } rounded-lg`}
            onClick={() => setReportType("employee")}
          >
            Employee Report
          </button>
          <button
            className={`w-full p-3 text-white ${
              reportType === "dealer" ? "bg-indigo-700" : "bg-indigo-600"
            } rounded-lg`}
            onClick={() => setReportType("dealer")}
          >
            Dealer Report
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Payment Reports
        </h1>

        <div className="mb-4">
          <Select
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
            options={[
              { label: "January 2024", value: "January-2024" },
              { label: "February 2024", value: "February-2024" },
              { label: "March 2024", value: "March-2024" },
              { label: "April 2024", value: "April-2024" },
              { label: "May 2024", value: "May-2024" },
              { label: "June 2024", value: "June-2024" },
              { label: "July 2024", value: "July-2024" },
              { label: "August 2024", value: "August-2024" },
              { label: "September 2024", value: "September-2024" },
              { label: "October 2024", value: "October-2024" },
              { label: "November 2024", value: "November-2024" },
              { label: "December 2024", value: "December-2024" },
            ]}
          />
        </div>

        <div className="mb-4">
          {reportType === "employee" && (
            <>
              <input
                type="text"
                placeholder="Search by Employee Name"
                value={employeeNameFilter}
                onChange={(e) => setEmployeeNameFilter(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Search by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              />
            </>
          )}

          {reportType === "dealer" && (
            <>
              <input
                type="text"
                placeholder="Search by Dealer Name"
                value={dealerNameFilter}
                onChange={(e) => setDealerNameFilter(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Search by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              />
            </>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            No Reports Found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300 mt-4">
              <table className="min-w-full bg-white border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider border border-gray-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-blue-100 ${
                        rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                        {(currentPage - 1) * pageSize + rowIndex + 1}
                      </td>

                      {/* Employee Report Columns */}
                      {reportType === "employee" && (
                        <>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {row.recipientName}
                          </td>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {formatPaymentDate(row.paymentDate)}
                          </td>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {row.amount}
                          </td>
                        </>
                      )}

                      {/* Dealer Report Columns */}
                      {reportType === "dealer" && (
                        <>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {row.recipientName}
                          </td>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {formatPaymentDate(row.paymentDate)}
                          </td>
                          <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                            {row.amount}
                          </td>
                        </>
                      )}

                      <td className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handlePageChange(currentPage === 1 ? 1 : currentPage - 1)
                  }
                  className="px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-md hover:bg-gray-200"
                >
                  Previous
                </button>

                {Array.from(
                  { length: Math.ceil(totalRecords / pageSize) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border border-gray-300 rounded-full ${
                      currentPage === page
                        ? "text-white bg-blue-500"
                        : "text-gray-700 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(
                      currentPage === Math.ceil(totalRecords / pageSize)
                        ? 1
                        : currentPage + 1,
                    )
                  }
                  className="px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-md hover:bg-gray-200"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="page-size">Rows per page:</label>
                <select
                  id="page-size"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md"
                >
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
