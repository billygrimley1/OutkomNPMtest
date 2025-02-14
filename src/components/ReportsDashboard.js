import React from "react";
import "../styles/ReportsDashboard.css";

const ReportsDashboard = () => {
  // Simulated data for demonstration
  const sampleWorkflowData = {
    totalCustomers: 2,
    successCount: 1,
    failureCount: 1,
    averageTimeInStage: "5 days",
  };

  const sampleTaskData = {
    openTasks: 2,
    completedTasks: 0,
    averageCompletionTime: "3 days",
  };

  return (
    <div className="reports-dashboard">
      <h2>Reports &amp; Analytics</h2>
      <div className="report-section">
        <h3>Workflow Kanban Performance</h3>
        <p>
          <strong>Total Customers:</strong> {sampleWorkflowData.totalCustomers}
        </p>
        <p>
          <strong>Success Count:</strong> {sampleWorkflowData.successCount}
        </p>
        <p>
          <strong>Failure Count:</strong> {sampleWorkflowData.failureCount}
        </p>
        <p>
          <strong>Average Time in Stage:</strong>{" "}
          {sampleWorkflowData.averageTimeInStage}
        </p>
      </div>
      <div className="report-section">
        <h3>Task Kanban Performance</h3>
        <p>
          <strong>Open Tasks:</strong> {sampleTaskData.openTasks}
        </p>
        <p>
          <strong>Completed Tasks:</strong> {sampleTaskData.completedTasks}
        </p>
        <p>
          <strong>Average Task Completion Time:</strong>{" "}
          {sampleTaskData.averageCompletionTime}
        </p>
      </div>
    </div>
  );
};

export default ReportsDashboard;
