// src/components/WorkflowKanban.js

import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanColumn from "./KanbanColumn";
import "../styles/Kanban.css";

// ------------------------------
// Default columns for Workflow Kanban
// ------------------------------
const defaultColumns = {
  "column-1": {
    id: "column-1",
    title: "Leads",
    isSuccess: false,
    isFailure: false,
    cardIds: [],
  },
  "column-2": {
    id: "column-2",
    title: "Call 1",
    isSuccess: false,
    isFailure: false,
    cardIds: [],
  },
  "column-3": {
    id: "column-3",
    title: "Meeting booked",
    isSuccess: false,
    isFailure: false,
    cardIds: [],
  },
  "column-4": {
    id: "column-4",
    title: "Meeting attended",
    isSuccess: false,
    isFailure: false,
    cardIds: [],
  },
  "column-5": {
    id: "column-5",
    title: "Adopting",
    isSuccess: true,
    isFailure: false,
    cardIds: [],
  },
  "column-6": {
    id: "column-6",
    title: "Not adopting",
    isSuccess: false,
    isFailure: true,
    cardIds: [],
  },
};

// ------------------------------
// Generate 30 test customer records
// ------------------------------
const generateTestCustomers = () => {
  const riskLevels = ["Low", "Medium", "High"];
  const csms = ["Alice", "Bob", "Charlie"];
  const names = [
    "Acme Corp",
    "Beta Ltd",
    "Gamma Inc",
    "Delta Co",
    "Epsilon LLC",
    "Zeta Enterprises",
  ];
  let customers = {};
  for (let i = 1; i <= 30; i++) {
    const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const csm = csms[Math.floor(Math.random() * csms.length)];
    const name = `${names[Math.floor(Math.random() * names.length)]} ${i}`;
    customers[`customer-${i}`] = {
      id: `customer-${i}`,
      name,
      riskStatus: risk,
      healthRank: risk === "Low" ? "A" : risk === "Medium" ? "B" : "C",
      renewalDate: `15/0${Math.floor(Math.random() * 9) + 1}/2025`,
      CSM: csm,
      ARR: Math.floor(Math.random() * 100000) + 10000,
      usage: `${Math.floor(Math.random() * 100)}%`,
      lastContact: `0${Math.floor(Math.random() * 9) + 1}/10/2025`,
      tags:
        risk === "High"
          ? ["Urgent", "At Risk"]
          : risk === "Low"
          ? ["Healthy"]
          : ["Monitor"],
    };
  }
  return customers;
};

const testCustomers = generateTestCustomers();

// ------------------------------
// Initialize board with all test customers in "Leads"
// ------------------------------
const initializeBoard = () => {
  const board = {
    id: "board-1",
    name: "Default Board",
    columns: { ...defaultColumns },
    customers: { ...testCustomers },
  };
  // For simplicity, add every customer to the "Leads" column.
  board.columns["column-1"].cardIds = Object.keys(testCustomers);
  return board;
};

const initialBoards = {
  "board-1": initializeBoard(),
};

// ------------------------------
// WorkflowKanban Component
// ------------------------------
const WorkflowKanban = () => {
  const [boards, setBoards] = useState(initialBoards);
  const [currentBoardId, setCurrentBoardId] = useState("board-1");
  // Basic filter state for workflow kanban.
  const [filter, setFilter] = useState({ CSM: "", riskStatus: "", tag: "" });
  // Advanced filter state (if needed).
  const [advancedFilter, setAdvancedFilter] = useState({
    dueFrom: "",
    dueTo: "",
  });
  // Toggle for showing advanced filters.
  const [showFilters, setShowFilters] = useState(false);
  const currentBoard = boards[currentBoardId];

  // Load saved filter settings from localStorage.
  useEffect(() => {
    const savedFilter = localStorage.getItem("savedFilter");
    if (savedFilter) {
      setFilter(JSON.parse(savedFilter));
    }
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = currentBoard.columns[source.droppableId];
    const finishColumn = currentBoard.columns[destination.droppableId];

    // Update customer status based on destination column title.
    const customer = currentBoard.customers[draggableId];
    if (customer) {
      customer.status = finishColumn.title;
    }

    if (startColumn === finishColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...startColumn, cardIds: newCardIds };
      updateBoard({
        ...currentBoard,
        columns: { ...currentBoard.columns, [newColumn.id]: newColumn },
      });
    } else {
      const startCardIds = Array.from(startColumn.cardIds);
      startCardIds.splice(source.index, 1);
      const newStart = { ...startColumn, cardIds: startCardIds };

      const finishCardIds = Array.from(finishColumn.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finishColumn, cardIds: finishCardIds };

      updateBoard({
        ...currentBoard,
        columns: {
          ...currentBoard.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });

      // Check if the card was dropped into the "Adopting" column.
      if (finishColumn.title.toLowerCase() === "adopting") {
        // Trigger the fireworks (confetti) animation.
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Helper: update the current board.
  const updateBoard = (newBoard) => {
    setBoards({ ...boards, [currentBoardId]: newBoard });
  };

  // Filtering: only include a customer if they match all criteria.
  const getFilteredCustomer = (customer) => {
    if (filter.CSM && customer.CSM !== filter.CSM) return false;
    if (filter.riskStatus && customer.riskStatus !== filter.riskStatus)
      return false;
    if (filter.tag && !customer.tags.includes(filter.tag)) return false;
    // You can add advanced filter conditions here if needed.
    return true;
  };

  // Board management functions.
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
      name: "New Board",
      columns: { ...defaultColumns },
      customers: { ...testCustomers },
    };
    newBoard.columns["column-1"].cardIds = Object.keys(testCustomers);
    setBoards({ ...boards, [newBoardId]: newBoard });
    setCurrentBoardId(newBoardId);
  };

  const saveFilter = () => {
    localStorage.setItem("savedFilter", JSON.stringify(filter));
    alert("Filter saved!");
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
          </div>
        )}
        <div className="board-buttons">
          <button onClick={cloneBoard}>Clone Board</button>
          <button onClick={createNewBoard}>New Board</button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.keys(currentBoard.columns).map((columnId) => {
            const column = currentBoard.columns[columnId];
            const cards = column.cardIds
              .map((cardId) => currentBoard.customers[cardId])
              .filter(getFilteredCustomer)
              .sort((a, b) => b.ARR - a.ARR);
            return (
              <KanbanColumn key={column.id} column={column} cards={cards} />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default WorkflowKanban;
