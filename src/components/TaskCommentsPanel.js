// src/components/TaskCommentsPanel.js

import React, { useState } from "react";
import "../styles/TaskCommentsPanel.css";

const TaskCommentsPanel = ({ task, onClose, onAddComment }) => {
  const [commentInput, setCommentInput] = useState("");

  const handleAddComment = () => {
    if (commentInput.trim() !== "") {
      onAddComment(commentInput);
      setCommentInput("");
    }
  };

  return (
    <div className="task-comments-overlay">
      <div className="task-comments-modal">
        <div className="task-comments-header">
          <h3>Comments for {task.title}</h3>
          <button className="close-comments-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="task-comments-body">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((cmt, idx) => (
              <div key={idx} className="task-comment-item">
                {cmt}
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet.</p>
          )}
          <div className="task-add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCommentsPanel;
