import React, { useState } from "react";
import "../styles/UserForm.css";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "CSM",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted user:", formData);
    alert("User added (prototype)");
    setFormData({
      name: "",
      email: "",
      role: "CSM",
      phone: "",
    });
  };

  return (
    <div className="user-form-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="CSM">CSM</option>
            <option value="Manager">Manager</option>
          </select>
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default UserForm;
