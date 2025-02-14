// src/components/TaskReportDashboard.js

import React from "react";

const TaskReportDashboard = ({ board }) => {
  // We'll assume that any column whose title (case-insensitive) equals "completed" holds completed tasks.
  let completedCount = 0;
  let openCount = 0;
  
  Object.values(board.columns).forEach((column) => {
    if (column.title.toLowerCase() === "completed") {
      completedCount += column.cardIds.length;
    } else {
      openCount += column.cardIds.length;
    }
  });
  
  const totalCount = completedCount + openCount;

  return (
    <div style={{
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginBottom: "15px",
      background: "#fff"
    }}>
      <h3 style={{ margin: "0 0 10px 0" }}>Task Report Dashboard</h3>
      <p style={{ margin: "4px 0" }}>Total Tasks: {totalCount}</p>
      <p style={{ margin: "4px 0" }}>Open Tasks: {openCount}</p>
      <p style={{ margin: "4px 0" }}>Completed Tasks: {completedCount}</p>
    </div>
  );
};

export default TaskReportDashboard;
