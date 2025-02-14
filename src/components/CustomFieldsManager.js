import React, { useState, useEffect } from "react";
import "../styles/CustomFieldsManager.css";

const CustomFieldsManager = () => {
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    label: "",
    name: "",
    type: "text",
  });

  useEffect(() => {
    const stored = localStorage.getItem("customFields");
    if (stored) {
      setFields(JSON.parse(stored));
    }
  }, []);

  const handleNewFieldChange = (e) => {
    setNewField({ ...newField, [e.target.name]: e.target.value });
  };

  const addField = () => {
    if (newField.label && newField.name) {
      const updatedFields = [...fields, newField];
      setFields(updatedFields);
      localStorage.setItem("customFields", JSON.stringify(updatedFields));
      setNewField({ label: "", name: "", type: "text" });
    } else {
      alert("Please provide both label and name for the custom field.");
    }
  };

  const removeField = (name) => {
    const updatedFields = fields.filter((field) => field.name !== name);
    setFields(updatedFields);
    localStorage.setItem("customFields", JSON.stringify(updatedFields));
  };

  return (
    <div className="custom-fields-container">
      <h2>Custom Fields Manager</h2>
      <div className="new-field-form">
        <label>
          Field Label:
          <input
            type="text"
            name="label"
            value={newField.label}
            onChange={handleNewFieldChange}
          />
        </label>
        <label>
          Field Name:
          <input
            type="text"
            name="name"
            value={newField.name}
            onChange={handleNewFieldChange}
          />
        </label>
        <label>
          Field Type:
          <select
            name="type"
            value={newField.type}
            onChange={handleNewFieldChange}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
        </label>
        <button onClick={addField}>Add Field</button>
      </div>
      <div className="fields-list">
        <h3>Existing Custom Fields:</h3>
        {fields.length === 0 && <p>No custom fields defined.</p>}
        <ul>
          {fields.map((field, idx) => (
            <li key={idx}>
              <span>
                {field.label} ({field.name}) - {field.type}
              </span>
              <button onClick={() => removeField(field.name)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomFieldsManager;
