// src/components/TaskTemplateModal.js

import React, { useState } from "react";
import "../styles/TaskTemplateModal.css";

const defaultTemplates = [
  {
    id: "template-1",
    name: "Onboarding Checklist",
    title: "Onboarding: New Client",
    dueDate: "", // User can fill in after creation
    priority: "High",
    assignedTo: ["Alice"],
    relatedCustomer: "",
    topPriority: false,
    tags: ["Onboarding"],
    subtasks: [
      { id: "subtask-1", text: "Send Welcome Email", completed: false },
      { id: "subtask-2", text: "Set Up Account", completed: false },
      { id: "subtask-3", text: "Schedule Kickoff Meeting", completed: false }
    ]
  },
  {
    id: "template-2",
    name: "Monthly Review",
    title: "Monthly Client Review",
    dueDate: "",
    priority: "Medium",
    assignedTo: ["Bob"],
    relatedCustomer: "",
    topPriority: false,
    tags: ["Review"],
    subtasks: [
      { id: "subtask-1", text: "Prepare Report", completed: false },
      { id: "subtask-2", text: "Conduct Review Call", completed: false }
    ]
  }
];

const TaskTemplateModal = ({ onClose, onApplyTemplate }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplates[0].id);

  const handleApply = () => {
    const template = defaultTemplates.find((t) => t.id === selectedTemplateId);
    if (template) {
      onApplyTemplate(template);
      onClose();
    }
  };

  return (
    <div className="template-modal-overlay">
      <div className="template-modal">
        <h3>Select a Task Template</h3>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
        >
          {defaultTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <div className="modal-buttons">
          <button onClick={handleApply}>Apply Template</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskTemplateModal;
