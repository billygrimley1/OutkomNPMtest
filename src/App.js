import React, { useState } from "react";
import LeftNav from "./components/LeftNav";
import TopBar from "./components/TopBar";
import WorkflowKanban from "./components/WorkflowKanban";
import TaskKanban from "./components/TaskKanban";
import CustomerForm from "./components/CustomerForm";
import UserForm from "./components/UserForm";
import CustomFieldsManager from "./components/CustomFieldsManager";
import ReportsDashboard from "./components/ReportsDashboard";
import BoardConfigPanel from "./components/BoardConfigPanel";
import Todos from "./components/Todos"; // Import the Todos component
import "./styles/App.css";

function App() {
  // The view state controls which page is visible.
  const [view, setView] = useState("workflows");

  const renderView = () => {
    switch (view) {
      case "workflows":
        return <WorkflowKanban />;
      case "actions":
        return <TaskKanban />;
      case "customers":
        return <CustomerForm />;
      case "users":
        return <UserForm />;
      case "customFields":
        return <CustomFieldsManager />;
      case "boardConfig":
        return <BoardConfigPanel />;
      case "reports":
        return <ReportsDashboard />;
      case "todos": // New case for the Todos view
        return <Todos />;
      default:
        return <WorkflowKanban />;
    }
  };

  return (
    <div className="app-container">
      <LeftNav setView={setView} currentView={view} />
      <div className="main-content">
        <TopBar setView={setView} currentView={view} />
        <div className="view-container">{renderView()}</div>
      </div>
    </div>
  );
}

export default App;
