// src/components/KanbanColumn.js

import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";

const KanbanColumn = ({ column, cards, updateColumn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [automationTrigger, setAutomationTrigger] = useState(
    column.automationTrigger
  );

  const handleSave = () => {
    setIsEditing(false);
    // Update the column with new title and automation setting
    updateColumn(column.id, { ...column, title, automationTrigger });
  };

  return (
    <div className="kanban-column">
      <div className="column-header" onDoubleClick={() => setIsEditing(true)}>
        {isEditing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "4px", width: "90%", padding: "4px" }}
            />
            <label style={{ fontSize: "0.8em", marginBottom: "4px" }}>
              <input
                type="checkbox"
                checked={automationTrigger}
                onChange={(e) => setAutomationTrigger(e.target.checked)}
                style={{ marginRight: "4px" }}
              />
              Enable Auto Trigger
            </label>
            <button
              onClick={handleSave}
              style={{ padding: "4px 8px", fontSize: "0.8em" }}
            >
              Save
            </button>
          </div>
        ) : (
          <h3>{title}</h3>
        )}
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="card-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
