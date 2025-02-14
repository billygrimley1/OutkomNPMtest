import React from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaCogs,
  FaSlidersH,
} from "react-icons/fa";
import "../styles/LeftNav.css";

const LeftNav = ({ setView, currentView }) => {
  return (
    <div className="left-nav">
      <div className="nav-logo">
        <img
          src="https://img1.wsimg.com/isteam/ip/de9689e2-bb99-4fce-8adb-f427be1de7cb/blob-43f47c0.png/:/rs=w:200,h:200,cg:true,m/cr=w:200,h:200/qt=q:95"
          alt="Outkom Logo"
        />
      </div>
      <ul className="nav-list">
        <li
          className={currentView === "workflows" ? "active" : ""}
          onClick={() => setView("workflows")}
        >
          <FaProjectDiagram /> Workflows
        </li>
        <li
          className={currentView === "actions" ? "active" : ""}
          onClick={() => setView("actions")}
        >
          <FaTasks /> Actions
        </li>
        <li
          className={currentView === "customers" ? "active" : ""}
          onClick={() => setView("customers")}
        >
          <FaUsers /> Customers
        </li>
        <li
          className={currentView === "users" ? "active" : ""}
          onClick={() => setView("users")}
        >
          <FaUsers /> Users
        </li>
        <li
          className={currentView === "customFields" ? "active" : ""}
          onClick={() => setView("customFields")}
        >
          <FaCogs /> Custom Fields
        </li>
        <li
          className={currentView === "boardConfig" ? "active" : ""}
          onClick={() => setView("boardConfig")}
        >
          <FaSlidersH /> Board Config
        </li>
        <li
          className={currentView === "reports" ? "active" : ""}
          onClick={() => setView("reports")}
        >
          <FaChartBar /> Reports
        </li>
      </ul>
    </div>
  );
};

export default LeftNav;
