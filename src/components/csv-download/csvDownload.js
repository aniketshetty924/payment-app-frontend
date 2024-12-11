//

import React from "react";

const DownloadCsv = ({ data, headers, fileName }) => {
  const downloadCSV = () => {
    const csvRows = [];

    // Add the header row to the CSV
    csvRows.push(headers.join(","));

    // Add the data rows to the CSV
    data.forEach((item) => {
      const row = headers.map((header) => {
        // Handle data formatting here (e.g., if value is a string, wrap it in quotes)
        return `"${item[header] || ""}"`;
      });
      csvRows.push(row.join(","));
    });

    // Convert the CSV array to a string
    const csvData = csvRows.join("\n");

    // Create a Blob for the CSV file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger it
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.click();
    }
  };

  return (
    <button
      onClick={downloadCSV}
      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Download CSV
    </button>
  );
};

export default DownloadCsv;
