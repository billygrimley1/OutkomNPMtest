// src/components/Card.js

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import CommentsPanel from "./CommentsPanel";
import "../styles/Card.css";

// Helper function to choose a border color based on risk level.
const getRiskColor = (riskStatus) => {
  if (riskStatus === "High") return "#FF0000"; // Red for High risk
  if (riskStatus === "Medium") return "#FFA500"; // Orange for Medium risk
  if (riskStatus === "Low") return "#00AA00"; // Green for Low risk
  return "#ccc"; // Default color
};

const Card = ({ card, index }) => {
  const [showComments, setShowComments] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            className="kanban-card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowComments(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...provided.draggableProps.style,
              borderLeft: `5px solid ${getRiskColor(card.riskStatus)}`,
            }}
          >
            <h4>{card.name}</h4>
            <p>
              <strong>Risk:</strong> {card.riskStatus}
            </p>
            <p>
              <strong>Health:</strong> {card.healthRank}
            </p>
            <p>
              <strong>Renewal:</strong> {card.renewalDate}
            </p>
            <p>
              <strong>CSM:</strong> {card.CSM}
            </p>
            <p>
              <strong>ARR:</strong> €{card.ARR.toLocaleString()}
            </p>
            <p>
              <strong>Tags:</strong> {card.tags.join(", ")}
            </p>
            {isHovered && (
              <div className="card-hover-details">
                <p>
                  <strong>Usage:</strong> {card.usage || "N/A"}
                </p>
                <p>
                  <strong>Last Contact:</strong> {card.lastContact || "N/A"}
                </p>
              </div>
            )}
          </div>
        )}
      </Draggable>
      {showComments && (
        <CommentsPanel card={card} onClose={() => setShowComments(false)} />
      )}
    </>
  );
};

export default Card;
