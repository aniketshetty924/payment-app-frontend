import camelCaseToTitleCase from "@/utils/camelCaseToTitleCase";
import React from "react";

const Table = ({ headers, tableData }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <div className="text-center text-gray-700 mt-4">No data available</div>
    );
  }

  const updatedHeaders = headers.map((header) => camelCaseToTitleCase(header));

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300 mt-4">
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            {updatedHeaders.map((header, index) => (
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
          {tableData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-blue-100 ${
                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {Object.keys(row).map((key, cellIndex) => (
                <td
                  key={cellIndex}
                  className="py-3 px-6 border border-gray-300 text-sm text-black font-semibold"
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
