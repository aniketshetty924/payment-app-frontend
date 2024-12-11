import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    // Navigate to the previous page; if on the first page, go to the last page
    onPageChange(currentPage === 1 ? totalPages : currentPage - 1);
  };

  const handleNext = () => {
    // Navigate to the next page; if on the last page, go to the first page
    onPageChange(currentPage === totalPages ? 1 : currentPage + 1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Page navigation example"
      className="flex justify-center mt-6"
    >
      <ul className="flex list-none space-x-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={handlePrevious}
            className="px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-md hover:bg-gray-200 hover:text-gray-700 transition duration-200"
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 ${
                currentPage === page
                  ? "text-white bg-blue-500"
                  : "text-gray-700 bg-white"
              } border border-gray-300 rounded-full shadow-md hover:bg-gray-100 hover:text-blue-500 transition duration-200`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={handleNext}
            className="px-4 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-md hover:bg-gray-200 hover:text-gray-700 transition duration-200"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
