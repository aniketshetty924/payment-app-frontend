"use client";
import { useEffect, useState } from "react";
import PageSize from "@/components/pagesize/pagesize";
import Pagination from "@/components/pagination/pagination";
import Table from "@/components/table/table";
import {
  createEmployee,
  getAllEmployees,
  getAllBanks,
} from "@/lib/clientServices";

const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [banks, setBanks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [step, setStep] = useState(1);
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    username: "",
    accountId: "",
    bankName: "",
    ifscCode: "",
    salary: "",
    role: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter States
  const [nameFilter, setNameFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getAllEmployees();
      if (response) {
        const sortedEmployees = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // Sort by `createdAt` descending
        );
        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees); // Initially set all employees as filtered employees
        setTotalEmployees(sortedEmployees.length);
      }
    };

    const fetchBanks = async () => {
      const response = await getAllBanks();
      if (response) {
        setBanks(response.data);
      }
    };

    fetchEmployees();
    fetchBanks();
  }, []);

  useEffect(() => {
    // Filter employees whenever any filter changes
    const filtered = employees.filter((employee) => {
      const matchesName =
        employee.fullName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        nameFilter === "";
      const matchesUsername =
        employee.username
          .toLowerCase()
          .includes(usernameFilter.toLowerCase()) || usernameFilter === "";
      const matchesSalary = employee.salary >= (salaryFilter || 0);

      return matchesName && matchesUsername && matchesSalary;
    });
    setFilteredEmployees(filtered);
    setTotalEmployees(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [nameFilter, usernameFilter, salaryFilter, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateEmployee = async () => {
    setIsLoading(true);
    try {
      const response = await createEmployee(employeeData);
      if (response.status === 201) {
        setShowSuccessModal(true);
        setEmployeeData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          email: "",
          username: "",
          accountId: "",
          bankName: "",
          ifscCode: "",
          salary: "",
          role: "",
        });
        setStep(1);
        setShowAddEmployeeModal(false);
        const newEmployee = response.data;
        setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
        setTotalEmployees((prevTotal) => prevTotal + 1);
      } else {
        console.error("Employee creation failed:", response);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headers = [
    "Sr. No.",
    "Full Name",
    "Email",
    "Username",
    "Role",
    "Salary",
  ];

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Convert the employees data into CSV format
  const convertToCSV = (data) => {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Username",
      "Role",
      "Salary",
      "Date of Birth",
      "Bank",
      "Account ID",
      "IFSC Code",
    ];

    const rows = data.map((employee) => [
      employee.id,
      employee.fullName,
      employee.email,
      employee.username,
      employee.role,
      employee.salary,
      employee.dateOfBirth,
      employee.bankName,
      employee.accountId,
      employee.ifscCode,
    ]);

    // Convert to CSV format
    const csvRows = [headers.join(","), ...rows.map((row) => row.join(","))];

    return csvRows.join("\n");
  };

  const triggerDownload = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCSV = async () => {
    const pageSize = 1000;
    let currentPage = 1;

    // Calculate total number of employees dynamically from the `employees` array
    const totalEmployees = employees.length;
    const totalPages = Math.ceil(totalEmployees / pageSize);

    for (let page = 1; page <= totalPages; page++) {
      // Fetch the data for this page (assuming the server-side pagination is handled)
      const response = await getAllEmployees({ page, pageSize });
      const employeesPage = response.data;

      // Convert employees data to CSV
      const csvData = convertToCSV(employeesPage);

      // Trigger download for the current page's data
      triggerDownload(csvData, `employees_page_${page}.csv`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Add Employee</h2>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Employees</h1>

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
            type="text"
            placeholder="Search by Username"
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Min Salary"
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add New Employee
          </button>
        </div>

        {/* CSV Download Button */}
        <div className="mb-4">
          <button
            onClick={downloadCSV}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>

        <Table
          headers={headers}
          tableData={paginatedData.map((employee, index) => ({
            srNo: (currentPage - 1) * pageSize + index + 1,
            fullName: employee.fullName,
            email: employee.email,
            username: employee.username,
            role: employee.role,
            salary: employee.salary,
          }))}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalEmployees / pageSize)}
          onPageChange={setCurrentPage}
        />

        <PageSize pageSize={pageSize} onPageSizeChange={setPageSize} />
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-indigo-600"></div>
        </div>
      )}

      {showAddEmployeeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center relative">
            <button
              onClick={() => setShowAddEmployeeModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
              {step === 1
                ? "Employee Basic Information"
                : step === 2
                  ? "Employee Contact Information"
                  : step === 3
                    ? "Employee Bank Account Information"
                    : "Employee Job Information"}
            </h3>

            {/* Employee Information Steps */}
            {step === 1 && (
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={employeeData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="text"
                  name="lastName"
                  value={employeeData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={employeeData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="Date of Birth"
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
                  type="email"
                  name="email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="text"
                  name="username"
                  value={employeeData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full p-2 border mb-4"
                />
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2"
                >
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div>
                <select
                  name="bankName"
                  value={employeeData.bankName}
                  onChange={handleInputChange}
                  className="w-full p-2 border mb-4"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="accountId"
                  value={employeeData.accountId}
                  onChange={handleInputChange}
                  placeholder="Account ID"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="text"
                  name="ifscCode"
                  value={employeeData.ifscCode}
                  onChange={handleInputChange}
                  placeholder="IFSC Code"
                  className="w-full p-2 border mb-4"
                />
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2"
                >
                  Next
                </button>
              </div>
            )}
            {step === 4 && (
              <div>
                <input
                  type="number"
                  name="salary"
                  value={employeeData.salary}
                  onChange={handleInputChange}
                  placeholder="Salary"
                  className="w-full p-2 border mb-4"
                />
                <input
                  type="text"
                  name="role"
                  value={employeeData.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                  className="w-full p-2 border mb-4"
                />
                <button
                  onClick={handleCreateEmployee}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Employee
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;
