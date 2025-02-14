// src/components/TaskKanban.js

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import TaskTemplateModal from "./TaskTemplateModal";
import "../styles/Kanban.css";

// ------------------------------
// Default columns for the Task Kanban board.
const defaultTaskColumns = {
  "task-column-1": {
    id: "task-column-1",
    title: "Not started",
    cardIds: [],
  },
  "task-column-2": {
    id: "task-column-2",
    title: "In progress",
    cardIds: [],
  },
  "task-column-3": {
    id: "task-column-3",
    title: "Completed",
    cardIds: [],
  },
};

// Helper function to create a sample task with subtasks.
const createSampleTask = (
  id,
  title,
  dueDate,
  priority,
  assignedTo,
  relatedCustomer,
  topPriority
) => ({
  id,
  title,
  dueDate,
  priority,
  assignedTo,
  relatedCustomer,
  topPriority,
  tags: [priority === "High" ? "Urgent" : "Standard"],
  subtasks: [
    {
      id: `${id}-subtask-1`,
      text: "Review requirements",
      completed: Math.random() > 0.5,
    },
    {
      id: `${id}-subtask-2`,
      text: "Prepare documents",
      completed: Math.random() > 0.5,
    },
    { id: `${id}-subtask-3`, text: "Send email", completed: false },
  ],
});

// Create 20 sample tasks.
const initialTasks = {
  // Not started (10 tasks)
  "task-1": createSampleTask(
    "task-1",
    "Task 1: Contact Client",
    "10/10/2025",
    "High",
    ["Alice"],
    "Acme Corp",
    true
  ),
  "task-2": createSampleTask(
    "task-2",
    "Task 2: Follow-up",
    "11/10/2025",
    "Medium",
    ["Bob"],
    "Beta Ltd",
    false
  ),
  "task-3": createSampleTask(
    "task-3",
    "Task 3: Prepare Quote",
    "12/10/2025",
    "Low",
    ["Charlie"],
    "Gamma Inc",
    false
  ),
  "task-4": createSampleTask(
    "task-4",
    "Task 4: Schedule Meeting",
    "13/10/2025",
    "High",
    ["Alice"],
    "Delta Co",
    true
  ),
  "task-5": createSampleTask(
    "task-5",
    "Task 5: Demo Presentation",
    "14/10/2025",
    "Medium",
    ["Bob"],
    "Epsilon LLC",
    false
  ),
  "task-6": createSampleTask(
    "task-6",
    "Task 6: Proposal Draft",
    "15/10/2025",
    "Low",
    ["Charlie"],
    "Zeta Enterprises",
    false
  ),
  "task-7": createSampleTask(
    "task-7",
    "Task 7: Follow-up Email",
    "16/10/2025",
    "High",
    ["Alice"],
    "Acme Corp",
    true
  ),
  "task-8": createSampleTask(
    "task-8",
    "Task 8: Contract Review",
    "17/10/2025",
    "Medium",
    ["Bob"],
    "Beta Ltd",
    false
  ),
  "task-9": createSampleTask(
    "task-9",
    "Task 9: Risk Analysis",
    "18/10/2025",
    "Low",
    ["Charlie"],
    "Gamma Inc",
    false
  ),
  "task-10": createSampleTask(
    "task-10",
    "Task 10: Final Proposal",
    "19/10/2025",
    "High",
    ["Alice"],
    "Delta Co",
    true
  ),
  // In progress (5 tasks)
  "task-11": createSampleTask(
    "task-11",
    "Task 11: Onboarding Setup",
    "20/10/2025",
    "Medium",
    ["Bob"],
    "Epsilon LLC",
    false
  ),
  "task-12": createSampleTask(
    "task-12",
    "Task 12: System Integration",
    "21/10/2025",
    "High",
    ["Charlie"],
    "Zeta Enterprises",
    true
  ),
  "task-13": createSampleTask(
    "task-13",
    "Task 13: User Training",
    "22/10/2025",
    "Medium",
    ["Alice"],
    "Acme Corp",
    false
  ),
  "task-14": createSampleTask(
    "task-14",
    "Task 14: Process Optimization",
    "23/10/2025",
    "Low",
    ["Bob"],
    "Beta Ltd",
    false
  ),
  "task-15": createSampleTask(
    "task-15",
    "Task 15: Quality Assurance",
    "24/10/2025",
    "High",
    ["Charlie"],
    "Gamma Inc",
    true
  ),
  // Completed (5 tasks)
  "task-16": createSampleTask(
    "task-16",
    "Task 16: Initial Setup",
    "08/10/2025",
    "High",
    ["Alice"],
    "Delta Co",
    true
  ),
  "task-17": createSampleTask(
    "task-17",
    "Task 17: Data Migration",
    "09/10/2025",
    "Medium",
    ["Bob"],
    "Epsilon LLC",
    false
  ),
  "task-18": createSampleTask(
    "task-18",
    "Task 18: System Audit",
    "08/10/2025",
    "Low",
    ["Charlie"],
    "Zeta Enterprises",
    false
  ),
  "task-19": createSampleTask(
    "task-19",
    "Task 19: Final Review",
    "09/10/2025",
    "High",
    ["Alice"],
    "Acme Corp",
    true
  ),
  "task-20": createSampleTask(
    "task-20",
    "Task 20: Go Live",
    "10/10/2025",
    "Medium",
    ["Bob"],
    "Beta Ltd",
    false
  ),
};

const initializeBoard = () => {
  const board = {
    id: "board-1",
    name: "Default Task Board",
    columns: { ...defaultTaskColumns },
    tasks: { ...initialTasks },
  };
  board.columns["task-column-1"].cardIds = Object.keys(initialTasks).slice(
    0,
    10
  );
  board.columns["task-column-2"].cardIds = Object.keys(initialTasks).slice(
    10,
    15
  );
  board.columns["task-column-3"].cardIds = Object.keys(initialTasks).slice(
    15,
    20
  );
  return board;
};

const initialBoards = {
  "board-1": initializeBoard(),
};

const TaskKanban = () => {
  // Multi-board state.
  const [boards, setBoards] = useState(initialBoards);
  const [currentBoardId, setCurrentBoardId] = useState("board-1");
  // View toggle: "all" vs. "my" tasks.
  const [viewFilter, setViewFilter] = useState("all");
  // Basic filter state.
  const [filter, setFilter] = useState({ CSM: "", riskStatus: "", tag: "" });
  // Advanced filter state.
  const [advancedFilter, setAdvancedFilter] = useState({
    dueFrom: "",
    dueTo: "",
    assignedTo: "",
    priority: "",
  });
  // Toggle for showing advanced filters.
  const [showFilters, setShowFilters] = useState(false);
  // Toggle for showing the Task Template Modal.
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const currentUser = "Alice";
  const currentBoard = boards[currentBoardId];

  useEffect(() => {
    const savedAdvFilter = localStorage.getItem("savedAdvancedFilter");
    if (savedAdvFilter) {
      setAdvancedFilter(JSON.parse(savedAdvFilter));
    }
  }, []);

  // Function to update a task and auto-move if all subtasks are completed.
  const updateTask = (updatedTask) => {
    setBoards((prevBoards) => {
      const board = prevBoards[currentBoardId];
      board.tasks = { ...board.tasks, [updatedTask.id]: updatedTask };
      if (
        updatedTask.subtasks &&
        updatedTask.subtasks.every((st) => st.completed)
      ) {
        const currentColId = Object.keys(board.columns).find((colId) =>
          board.columns[colId].cardIds.includes(updatedTask.id)
        );
        if (
          currentColId &&
          board.columns[currentColId].title.toLowerCase() !== "completed"
        ) {
          const completedColId = Object.keys(board.columns).find(
            (colId) => board.columns[colId].title.toLowerCase() === "completed"
          );
          if (completedColId) {
            board.columns[currentColId].cardIds = board.columns[
              currentColId
            ].cardIds.filter((id) => id !== updatedTask.id);
            board.columns[completedColId].cardIds.push(updatedTask.id);
          }
        }
      }
      return { ...prevBoards, [currentBoardId]: board };
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const board = boards[currentBoardId];
    const startCol = board.columns[source.droppableId];
    const finishCol = board.columns[destination.droppableId];

    if (startCol === finishCol) {
      const newCardIds = Array.from(startCol.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      board.columns[startCol.id].cardIds = newCardIds;
    } else {
      const startCardIds = Array.from(startCol.cardIds);
      startCardIds.splice(source.index, 1);
      const newStart = { ...startCol, cardIds: startCardIds };

      const finishCardIds = Array.from(finishCol.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finishCol, cardIds: finishCardIds };

      board.columns[newStart.id] = newStart;
      board.columns[newFinish.id] = newFinish;

      // If the task was moved to the "Completed" column, trigger fireworks!
      if (finishCol.title.toLowerCase() === "completed") {
        // Fire confetti with some custom parameters
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
    setBoards({ ...boards, [currentBoardId]: board });
  };

  const sortTasks = (taskIds) => {
    return taskIds
      .map((id) => currentBoard.tasks[id])
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      });
  };

  const filterTaskIds = (cardIds) => {
    let filteredIds = cardIds;
    if (viewFilter === "my") {
      filteredIds = cardIds.filter((id) =>
        currentBoard.tasks[id].assignedTo.includes(currentUser)
      );
    }
    filteredIds = filteredIds.filter((id) => {
      const task = currentBoard.tasks[id];
      if (advancedFilter.dueFrom) {
        const fromDate = new Date(advancedFilter.dueFrom);
        const taskDate = new Date(task.dueDate);
        if (taskDate < fromDate) return false;
      }
      if (advancedFilter.dueTo) {
        const toDate = new Date(advancedFilter.dueTo);
        const taskDate = new Date(task.dueDate);
        if (taskDate > toDate) return false;
      }
      if (
        advancedFilter.assignedTo &&
        !task.assignedTo.includes(advancedFilter.assignedTo)
      )
        return false;
      if (advancedFilter.priority && task.priority !== advancedFilter.priority)
        return false;
      return true;
    });
    return filteredIds;
  };

  const cloneBoard = () => {
    const newBoardId = `board-${Object.keys(boards).length + 1}`;
    const newBoard = {
      ...boards[currentBoardId],
      id: newBoardId,
      name: boards[currentBoardId].name + " (Clone)",
    };
    setBoards({ ...boards, [newBoardId]: newBoard });
    setCurrentBoardId(newBoardId);
  };

  const createNewBoard = () => {
    const newBoardId = `board-${Object.keys(boards).length + 1}`;
    const newBoard = {
      id: newBoardId,
      name: "New Task Board",
      columns: { ...defaultTaskColumns },
      tasks: { ...initialTasks },
    };
    newBoard.columns["task-column-1"].cardIds = Object.keys(initialTasks).slice(
      0,
      10
    );
    newBoard.columns["task-column-2"].cardIds = Object.keys(initialTasks).slice(
      10,
      15
    );
    newBoard.columns["task-column-3"].cardIds = Object.keys(initialTasks).slice(
      15,
      20
    );
    setBoards({ ...boards, [newBoardId]: newBoard });
    setCurrentBoardId(newBoardId);
  };

  const saveFilter = () => {
    localStorage.setItem("savedFilter", JSON.stringify(filter));
    alert("Filter saved!");
  };

  const saveAdvancedFilter = () => {
    localStorage.setItem("savedAdvancedFilter", JSON.stringify(advancedFilter));
    alert("Advanced Filter saved!");
  };

  // Handler for applying a task template.
  const handleApplyTemplate = (template) => {
    const newTaskId = "task-" + Date.now();
    const newTask = {
      ...template,
      id: newTaskId,
      dueDate: template.dueDate || "",
      assignedTo: Array.isArray(template.assignedTo)
        ? template.assignedTo
        : [template.assignedTo],
      tags: Array.isArray(template.tags) ? template.tags : [template.tags],
    };
    const board = boards[currentBoardId];
    board.tasks = { ...board.tasks, [newTaskId]: newTask };
    board.columns["task-column-1"].cardIds.push(newTaskId);
    setBoards({ ...boards, [currentBoardId]: board });
  };

  return (
    <div className="kanban-container">
      {/* Grouped Board Controls */}
      <div className="board-controls">
        <div className="board-management">
          <label>
            Select Board:
            <select
              value={currentBoardId}
              onChange={(e) => setCurrentBoardId(e.target.value)}
            >
              {Object.values(boards).map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            View:
            <select
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="my">My Tasks</option>
            </select>
          </label>
          <label>
            Filter by CSM:
            <input
              type="text"
              placeholder="e.g., Alice"
              value={filter.CSM}
              onChange={(e) => setFilter({ ...filter, CSM: e.target.value })}
            />
          </label>
          <label>
            Filter by Risk:
            <select
              value={filter.riskStatus}
              onChange={(e) =>
                setFilter({ ...filter, riskStatus: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <label>
            Filter by Tag:
            <select
              value={filter.tag}
              onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
            >
              <option value="">All</option>
              <option value="Healthy">Healthy</option>
              <option value="At Risk">At Risk</option>
              <option value="Urgent">Urgent</option>
              <option value="Monitor">Monitor</option>
            </select>
          </label>
          <button onClick={saveFilter}>Save Filter</button>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="toggle-filters"
        >
          {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </button>
        {showFilters && (
          <div className="advanced-filters">
            <label>
              Due From:
              <input
                type="date"
                value={advancedFilter.dueFrom}
                onChange={(e) =>
                  setAdvancedFilter({
                    ...advancedFilter,
                    dueFrom: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Due To:
              <input
                type="date"
                value={advancedFilter.dueTo}
                onChange={(e) =>
                  setAdvancedFilter({
                    ...advancedFilter,
                    dueTo: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Assigned To:
              <input
                type="text"
                placeholder="e.g., Alice"
                value={advancedFilter.assignedTo}
                onChange={(e) =>
                  setAdvancedFilter({
                    ...advancedFilter,
                    assignedTo: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Priority:
              <select
                value={advancedFilter.priority}
                onChange={(e) =>
                  setAdvancedFilter({
                    ...advancedFilter,
                    priority: e.target.value,
                  })
                }
              >
                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
            <button onClick={saveAdvancedFilter}>Save Advanced Filter</button>
          </div>
        )}
        <div className="board-buttons">
          <button onClick={cloneBoard}>Clone Board</button>
          <button onClick={createNewBoard}>New Board</button>
          <button onClick={() => setShowTemplateModal(true)}>
            Add Task from Template
          </button>
        </div>
      </div>

      {/* Task Template Modal */}
      {showTemplateModal && (
        <TaskTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onApplyTemplate={handleApplyTemplate}
        />
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.keys(currentBoard.columns).map((columnId) => {
            const column = currentBoard.columns[columnId];
            const filteredIds = filterTaskIds(column.cardIds);
            const sortedTasks = sortTasks(filteredIds);
            const isCompletedColumn =
              column.title.toLowerCase() === "completed";
            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    className="kanban-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="column-header">
                      <h3>{column.title}</h3>
                    </div>
                    <div className="card-list">
                      {sortedTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          updateTask={updateTask}
                          isCompletedColumn={isCompletedColumn}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskKanban;
