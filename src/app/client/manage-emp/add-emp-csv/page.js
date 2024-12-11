"use client";
import { useEffect, useState } from "react";
import { uploadEmployeesCSV } from "@/lib/clientServices";
import PageSize from "@/components/pagesize/pagesize";
import Pagination from "@/components/pagination/pagination";
import Table from "@/components/table/table";
import { getAllEmployees } from "@/lib/clientServices";

const AddEmployeeCsv = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Filter States
  const [nameFilter, setNameFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getAllEmployees();
      if (response) {
        const sortedEmployees = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by `createdAt` descending
        );
        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees); // Initially set all employees as filtered employees
        setTotalEmployees(sortedEmployees.length);
      }
    };

    fetchEmployees();
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadCSV = async () => {
    if (!file) {
      setUploadError("Please select a CSV file to upload.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    // Log FormData content
    for (let pair of formData.entries()) {
      console.log("Hello:", pair[0], pair[1]); // Logs form data key-value pairs
    }

    try {
      const response = await uploadEmployeesCSV(formData);

      if (response.status === 201) {
        setEmployees((prevEmployees) => [
          ...response.data.data,
          ...prevEmployees,
        ]);
        setTotalEmployees((prevTotal) => prevTotal + response.data.data.length);
        setShowUploadModal(false); // Close modal
        setShowSuccessModal(true); // Show success modal
      } else {
        setUploadError("Failed to upload the CSV. Please try again.");
      }
    } catch (error) {
      setUploadError("An error occurred during CSV upload.");
      console.error(error);
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
    currentPage * pageSize
  );

  // Convert employees data into CSV format
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

  // Trigger CSV download
  const triggerDownload = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download the CSV of employees
  const downloadCSV = async () => {
    const csvData = convertToCSV(filteredEmployees);
    triggerDownload(csvData, "employees.csv");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Add Employees CSV
        </h2>
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
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Employee CSV
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

      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
              Upload Employees CSV
            </h3>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border mb-4"
            />

            {uploadError && (
              <p className="text-red-500 text-sm mb-4">{uploadError}</p>
            )}

            <button
              onClick={handleUploadCSV}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Employees Uploaded Successfully!
            </h3>
            <p className="text-gray-700">The employee data has been saved.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployeeCsv;
