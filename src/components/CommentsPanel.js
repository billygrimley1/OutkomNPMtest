// src/components/CommentsPanel.js

import React, { useState } from "react";
import "../styles/CommentsPanel.css";

const CommentsPanel = ({ card, onClose }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const addComment = () => {
    if (input.trim() !== "") {
      setComments([...comments, input]);
      setInput("");
    }
  };

  return (
    <div className="comments-overlay">
      <div className="comments-modal">
        <div className="comments-header">
          <h3>{card.name} Details</h3>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="comments-body">
          {/* Basic Information Section */}
          <div className="card-info">
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
          </div>
          {/* Additional Information Section */}
          <div className="additional-info">
            <h4>Additional Information</h4>
            <p>
              <strong>Usage:</strong> {card.usage || "N/A"}
            </p>
            <p>
              <strong>Last Contact:</strong> {card.lastContact || "N/A"}
            </p>
            <p>
              <strong>Contract Start:</strong> {card.contractStart || "N/A"}
            </p>
            <p>
              <strong>Last Login:</strong> {card.lastLogin || "N/A"}
            </p>
            <p>
              <strong>Product Usage:</strong> {card.productUsage || "N/A"}
            </p>
            <p>
              <strong>Number of Users:</strong> {card.numberOfUsers || "N/A"}
            </p>
            <p>
              <strong>Main Contact Email:</strong>{" "}
              {card.mainContactEmail || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {card.status || "N/A"}
            </p>
          </div>
          {/* Comments Section */}
          <div className="comments-section">
            <h4>Comments</h4>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  {comment}
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet.</p>
            )}
            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={addComment}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;
