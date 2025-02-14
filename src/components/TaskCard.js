// src/components/TaskCard.js
import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import TaskCommentsPanel from "./TaskCommentsPanel";
import {
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "../styles/TaskCard.css";
import { supabase } from "../utils/supabase";

// Helper to determine color for priority.
const getPriorityColor = (priority, topPriority, isCompletedColumn) => {
  if (isCompletedColumn) return "#32CD32"; // Green for completed tasks
  if (topPriority) return "#FFD700"; // Gold for top priority
  const colors = { High: "#FF4500", Medium: "#FFA500", Low: "#32CD32" };
  return colors[priority] || "#ccc";
};

// Helper to normalize a value into an array.
const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value !== null && value !== undefined) return [value];
  return [];
};

const TaskCard = ({ task, index, updateTask, isCompletedColumn }) => {
  // State for showing comments.
  const [showComments, setShowComments] = useState(false);
  // Main task edit mode state.
  const [editMode, setEditMode] = useState(false);
  // Subtask edit mode state.
  const [editSubtasks, setEditSubtasks] = useState(false);

  // Normalize assigned_to and tags.
  const assignedToArray = normalizeArray(task.assigned_to);
  const tagsArray = normalizeArray(task.tags);
  const initialAssignedTo = assignedToArray.join(", ");
  const initialTags = tagsArray.join(", ");

  // State for main task fields (for inline editing).
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    dueDate: task.due_date,
    priority: task.priority,
    assignedTo: initialAssignedTo,
    relatedCustomer: task.related_customer || "",
    tags: initialTags,
  });

  // Local state for subtasks editing.
  const [localSubtasks, setLocalSubtasks] = useState(
    normalizeArray(task.subtasks)
  );
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // When task.subtasks changes externally (e.g. after a DB update), update localSubtasks.
  useEffect(() => {
    setLocalSubtasks(normalizeArray(task.subtasks));
  }, [task.subtasks]);

  // Calculate subtask progress.
  const totalSubtasks = localSubtasks.length;
  const completedSubtasks = localSubtasks.filter((st) => st.completed).length;
  const progressPercentage =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  // Toggle a subtask's completion (when not in subtask edit mode).
  const toggleSubtaskCompletion = (subtaskId) => {
    const updatedSubtasks = localSubtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    // Immediately update in DB.
    supabase
      .from("tasks")
      .update({
        subtasks: updatedSubtasks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id)
      .then(({ error }) => {
        if (error) console.error("Error toggling subtask:", error.message);
        else {
          updateTask({ ...task, subtasks: updatedSubtasks });
          setLocalSubtasks(updatedSubtasks);
        }
      });
  };

  // Handlers for main task editing.
  const handleChange = (field, value) => {
    setEditedTask({ ...editedTask, [field]: value });
  };

  const saveEdits = async () => {
    const updatedTask = {
      ...task,
      title: editedTask.title,
      due_date: editedTask.dueDate,
      priority: editedTask.priority,
      assigned_to: editedTask.assignedTo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      related_customer: editedTask.relatedCustomer,
      tags: editedTask.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    updateTask(updatedTask);
    // Optionally, update in DB here.
    setEditMode(false);
  };

  // Subtask editing functions.
  const addLocalSubtask = () => {
    if (newSubtaskText.trim() === "") return;
    const newSubtask = {
      id: Date.now().toString(), // temporary id
      text: newSubtaskText.trim(),
      completed: false,
    };
    setLocalSubtasks([...localSubtasks, newSubtask]);
    setNewSubtaskText("");
  };

  const removeLocalSubtask = (subtaskId) => {
    setLocalSubtasks(localSubtasks.filter((st) => st.id !== subtaskId));
  };

  const moveSubtaskUp = (index) => {
    if (index === 0) return;
    const newList = [...localSubtasks];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setLocalSubtasks(newList);
  };

  const moveSubtaskDown = (index) => {
    if (index === localSubtasks.length - 1) return;
    const newList = [...localSubtasks];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setLocalSubtasks(newList);
  };

  const handleSubtaskTextChange = (id, text) => {
    const newList = localSubtasks.map((st) =>
      st.id === id ? { ...st, text } : st
    );
    setLocalSubtasks(newList);
  };

  const saveSubtasks = async () => {
    const updatedTask = { ...task, subtasks: localSubtasks };
    const { error } = await supabase
      .from("tasks")
      .update({ subtasks: localSubtasks, updated_at: new Date().toISOString() })
      .eq("id", task.id);
    if (error) {
      console.error("Error updating subtasks:", error.message);
    } else {
      updateTask(updatedTask);
      setEditSubtasks(false);
    }
  };

  const cancelSubtasksEdit = () => {
    setLocalSubtasks(normalizeArray(task.subtasks));
    setEditSubtasks(false);
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided) => (
          <div
            className={`task-card ${task.top_priority ? "top-priority" : ""}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => {
              if (!editSubtasks && !editMode) setShowComments((prev) => !prev);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditMode(true);
            }}
            style={{
              ...provided.draggableProps.style,
              borderLeft: `5px solid ${getPriorityColor(
                task.priority,
                task.top_priority,
                isCompletedColumn
              )}`,
            }}
          >
            <div className="task-card-main">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="editable-input"
                  />
                  <input
                    type="date"
                    value={editedTask.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    className="editable-input"
                  />
                  <select
                    value={editedTask.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    className="editable-input"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <input
                    type="text"
                    value={editedTask.assignedTo}
                    onChange={(e) => handleChange("assignedTo", e.target.value)}
                    placeholder="Assigned To (comma separated)"
                    className="editable-input"
                  />
                  <input
                    type="text"
                    value={editedTask.relatedCustomer}
                    onChange={(e) =>
                      handleChange("relatedCustomer", e.target.value)
                    }
                    placeholder="Related Customer"
                    className="editable-input"
                  />
                  <input
                    type="text"
                    value={editedTask.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="editable-input"
                  />
                  <button onClick={saveEdits} className="save-button">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h4>{task.title}</h4>
                  <p>
                    <strong>Due:</strong> {task.due_date}
                  </p>
                  <p>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Assigned:</strong>{" "}
                    {normalizeArray(task.assigned_to).join(", ")}
                  </p>
                  {task.related_customer && (
                    <p>
                      <strong>Customer:</strong> {task.related_customer}
                    </p>
                  )}
                  <p>
                    <strong>Tags:</strong>{" "}
                    {normalizeArray(task.tags).join(", ")}
                  </p>
                  <div className="subtasks-header">
                    <h5>Subtasks</h5>
                    <button
                      className="subtasks-edit-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditSubtasks(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(true);
                    }}
                    className="comments-button"
                  >
                    Comments
                  </button>
                </>
              )}
            </div>
            {/* When not in subtask-edit mode, display the subtasks in read-only mode */}
            {expanded && !editMode && !editSubtasks && (
              <div className="subtasks-section">
                {localSubtasks.length > 0 ? (
                  <ul>
                    {localSubtasks.map((st) => (
                      <li
                        key={st.id}
                        className={st.completed ? "completed" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubtaskCompletion(st.id);
                        }}
                      >
                        {st.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No subtasks</p>
                )}
                {localSubtasks.length > 0 && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        background: isCompletedColumn ? "#32CD32" : "#ffd700",
                        width: `${
                          localSubtasks.length > 0
                            ? Math.round(
                                (localSubtasks.filter((st) => st.completed)
                                  .length /
                                  localSubtasks.length) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    >
                      {localSubtasks.length > 0
                        ? Math.round(
                            (localSubtasks.filter((st) => st.completed).length /
                              localSubtasks.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Subtask editing UI */}
            {editSubtasks && (
              <div
                className="subtasks-edit-area"
                onClick={(e) => e.stopPropagation()}
              >
                <h5>Edit Subtasks</h5>
                <ul className="subtasks-edit-list">
                  {localSubtasks.map((st, idx) => (
                    <li key={st.id} className={st.completed ? "completed" : ""}>
                      <input
                        type="text"
                        value={st.text}
                        onChange={(e) =>
                          handleSubtaskTextChange(st.id, e.target.value)
                        }
                      />
                      <div className="subtask-edit-buttons">
                        <button
                          onClick={() => moveSubtaskUp(idx)}
                          disabled={idx === 0}
                        >
                          <FaArrowUp />
                        </button>
                        <button
                          onClick={() => moveSubtaskDown(idx)}
                          disabled={idx === localSubtasks.length - 1}
                        >
                          <FaArrowDown />
                        </button>
                        <button onClick={() => removeLocalSubtask(st.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="subtask-add-area">
                  <input
                    type="text"
                    placeholder="New subtask..."
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                  />
                  <button onClick={addLocalSubtask}>Add</button>
                </div>
                <div className="subtask-edit-actions">
                  <button onClick={saveSubtasks}>
                    <FaSave /> Save
                  </button>
                  <button onClick={cancelSubtasksEdit}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Draggable>
      {showComments && (
        <TaskCommentsPanel task={task} onClose={() => setShowComments(false)} />
      )}
    </>
  );
};

export default TaskCard;
