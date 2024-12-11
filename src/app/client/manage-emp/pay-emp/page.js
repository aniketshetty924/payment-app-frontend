"use client";

import PageSize from "@/components/pagesize/pagesize";
import Pagination from "@/components/pagination/pagination";
import Table from "@/components/table/table";
import {
  getAllEmployees,
  getAllEmployeesPaymentRequestsPerMonth,
  saveEmployeePaymentsForAdminReview,
} from "@/lib/clientServices";
import { useEffect, useState } from "react";

const PayEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // New state for filtered employees
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [processedEmployees, setProcessedEmployees] = useState([]);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const paymentRequests = await getAllEmployeesPaymentRequestsPerMonth(
        `${selectedMonth}-${selectedYear}`
      );
      const response = await getAllEmployees();

      if (response && paymentRequests) {
        const { data: allEmployees } = response;
        const { data: processed } = paymentRequests;

        const processedEmployeeIds = processed.map((emp) => emp.recipientId);
        setProcessedEmployees(processedEmployeeIds);

        const remainingEmployees = allEmployees.filter(
          (emp) => !processedEmployeeIds.includes(emp.accountId)
        );

        setEmployees(remainingEmployees); // Set all employees
        setFilteredEmployees(remainingEmployees); // Initially, filtered employees are the same as all employees
        setTotalEmployees(remainingEmployees.length);
      }
    };

    fetchEmployees();
  }, [selectedMonth, selectedYear, showSuccessModal]);

  // Filter employees based on filter criteria
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesName =
        employee.fullName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        nameFilter === "";
      const matchesSalary =
        !salaryFilter || employee.salary.toString().includes(salaryFilter);
      const matchesRole =
        !roleFilter ||
        employee.role.toLowerCase().includes(roleFilter.toLowerCase());

      return matchesName && matchesSalary && matchesRole;
    });

    setFilteredEmployees(filtered); // Update filtered employees
    setTotalEmployees(filtered.length); // Update total count for pagination
    setCurrentPage(1); // Reset to first page when filters change
  }, [nameFilter, salaryFilter, roleFilter, employees]); // Only depend on filter states, not on filteredEmployees

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const paymentDetails = selectedEmployees.map((employeeId) => {
      const employee = filteredEmployees.find((emp) => emp.id === employeeId);
      return {
        recipientId: employee.accountId,
        recipientName: employee.fullName,
        paymentType: "employee",
        amount: employee.salary,
        paymentDate: new Date().toISOString(),
        paymentMonth: `${selectedMonth}-${selectedYear}`,
      };
    });

    try {
      // Send the payment details for processing
      await saveEmployeePaymentsForAdminReview(paymentDetails);

      // After successful payment, show success modal
      setShowSuccessModal(true);

      // Reset the selected employees after payment
      setSelectedEmployees([]);

      // Add processed employees to the list
      const processedEmployeeIds = paymentDetails.map(
        (payment) => payment.recipientId
      );
      setProcessedEmployees((prev) => [...prev, ...processedEmployeeIds]);
    } catch (error) {
      console.error("Error saving payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headers = ["Sr. No.", "fullName", "role", "salary", "select"];

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isAllSelected = selectedEmployees.length === filteredEmployees.length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Pay Employees</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Pay Employees
        </h1>

        {/* Filter Section */}
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Search by Salary"
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Search by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handlePayment}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            disabled={selectedEmployees.length === 0}
          >
            Pay Selected Employees
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
          <span className="ml-2">Select All Employees</span>
        </div>

        <Table
          headers={headers}
          tableData={paginatedData.map((employee, index) => ({
            srNo: (currentPage - 1) * pageSize + index + 1,
            fullName: employee.fullName,
            role: employee.role,
            salary: employee.salary,
            select: (
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => handleEmployeeSelection(employee.id)}
                disabled={processedEmployees.includes(employee.accountId)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            ),
          }))}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalEmployees / pageSize)}
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
              The payment process for selected employees has been started. Admin
              will verify and complete the transactions accordingly.
            </p>
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

export default PayEmployees;
