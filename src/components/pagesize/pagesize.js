import React from "react";
import "./pagesize.css";
const PageSize = ({ pageSize, onPageSizeChange }) => {
  return (
    <div className="page-size">
      <label htmlFor="page-size">Rows per page:</label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
        <option value="8">8</option>
      </select>
    </div>
  );
};

export default PageSize;
