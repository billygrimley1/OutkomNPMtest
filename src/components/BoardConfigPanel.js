import React, { useState } from "react";
import "../styles/BoardConfigPanel.css";

const BoardConfigPanel = () => {
  const [config, setConfig] = useState({
    successColumn: "",
    failureColumn: "",
  });

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const saveConfig = () => {
    alert(
      `Board configuration saved:\nSuccess Column: ${config.successColumn}\nFailure Column: ${config.failureColumn}`
    );
  };

  return (
    <div className="board-config-container">
      <h2>Configure Workflow Board</h2>
      <div className="config-form">
        <label>
          Success Column:
          <input
            type="text"
            name="successColumn"
            value={config.successColumn}
            onChange={handleChange}
            placeholder="e.g., Adopting"
          />
        </label>
        <label>
          Failure Column:
          <input
            type="text"
            name="failureColumn"
            value={config.failureColumn}
            onChange={handleChange}
            placeholder="e.g., Not adopting"
          />
        </label>
        <button onClick={saveConfig}>Save Configuration</button>
      </div>
    </div>
  );
};

export default BoardConfigPanel;
