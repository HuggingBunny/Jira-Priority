import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Column } from './Column';
import { JiraTicket } from './JiraTicket';
import './App.css';

const generateColumns = () => {
  const cols = {};
  for (let i = 1; i <= 10; i++) {
    cols[`col-${i}`] = {
      id: `col-${i}`,
      headerId: `EISGRC-${i}`,
      name: `Column ${i}`,
      tickets: [],
    };
  }
  // Seed a couple so the board isn't blank
  cols['col-1'].name = 'Auth Platform';
  cols['col-1'].tickets = [
    { id: 'EISGRC-11', type: 'story', label: 'Login Page' },
    { id: 'EISGRC-12', type: 'task',  label: 'Setup OAuth' },
  ];
  cols['col-2'].name = 'Reporting';
  cols['col-2'].tickets = [
    { id: 'EISGRC-21', type: 'story', label: 'Dashboard View' },
  ];
  return cols;
};

function findColumnOfTicket(columns, ticketId) {
  for (const colId in columns) {
    if (columns[colId].tickets.some(t => t.id === ticketId)) {
      return colId;
    }
  }
  return null;
}

function App() {
  const [columns, setColumns] = useState(generateColumns);
  const [activeTicket, setActiveTicket] = useState(null);

  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketLabel, setTicketLabel]   = useState('');
  const [ticketType, setTicketType]     = useState('story');
  const [targetCol, setTargetCol]       = useState('col-1');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },  // must move 8px before drag starts — lets double-click fire cleanly
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart({ active }) {
    const colId = findColumnOfTicket(columns, active.id);
    if (colId) {
      setActiveTicket(columns[colId].tickets.find(t => t.id === active.id));
    }
  }

  function handleDragOver({ active, over }) {
    if (!over) return;
    const activeColId = findColumnOfTicket(columns, active.id);
    const overColId   = columns[over.id]
      ? over.id
      : findColumnOfTicket(columns, over.id);

    if (!activeColId || !overColId || activeColId === overColId) return;

    setColumns(prev => {
      const activeTickets = [...prev[activeColId].tickets];
      const overTickets   = [...prev[overColId].tickets];
      const activeIdx     = activeTickets.findIndex(t => t.id === active.id);
      const [moved]       = activeTickets.splice(activeIdx, 1);
      let overIdx         = overTickets.findIndex(t => t.id === over.id);
      if (overIdx === -1) overIdx = overTickets.length;
      overTickets.splice(overIdx, 0, moved);
      return {
        ...prev,
        [activeColId]: { ...prev[activeColId], tickets: activeTickets },
        [overColId]:   { ...prev[overColId],   tickets: overTickets },
      };
    });
  }

  function handleDragEnd({ active, over }) {
    setActiveTicket(null);
    if (!over) return;
    const activeColId = findColumnOfTicket(columns, active.id);
    const overColId   = findColumnOfTicket(columns, over.id) || over.id;
    if (activeColId !== overColId) return;

    setColumns(prev => {
      const tickets  = [...prev[activeColId].tickets];
      const oldIndex = tickets.findIndex(t => t.id === active.id);
      const newIndex = tickets.findIndex(t => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      return {
        ...prev,
        [activeColId]: { ...prev[activeColId], tickets: arrayMove(tickets, oldIndex, newIndex) },
      };
    });
  }

  function handleAdd() {
    const num = ticketNumber.trim();
    if (!num) return;
    const id = `EISGRC-${num}`;

    for (const colId in columns) {
      if (columns[colId].tickets.some(t => t.id === id)) {
        alert(`${id} already exists.`);
        return;
      }
    }

    setColumns(prev => ({
      ...prev,
      [targetCol]: {
        ...prev[targetCol],
        tickets: [
          ...prev[targetCol].tickets,
          { id, type: ticketType, label: ticketLabel.trim() || id },
        ],
      },
    }));
    setTicketNumber('');
    setTicketLabel('');
  }

  function handleRename(colId, newHeaderId, newName) {
    setColumns(prev => ({
      ...prev,
      [colId]: { ...prev[colId], headerId: newHeaderId, name: newName },
    }));
  }

  function handleEditTicket(oldId, newId, newLabel) {
    if (oldId !== newId) {
      for (const colId in columns) {
        if (columns[colId].tickets.some(t => t.id === newId)) {
          alert(`${newId} already exists.`);
          return;
        }
      }
    }
    setColumns(prev => {
      const next = { ...prev };
      for (const colId in next) {
        const idx = next[colId].tickets.findIndex(t => t.id === oldId);
        if (idx !== -1) {
          const tickets = [...next[colId].tickets];
          tickets[idx] = { ...tickets[idx], id: newId, label: newLabel };
          next[colId] = { ...next[colId], tickets };
          break;
        }
      }
      return next;
    });
  }

  function handleDeleteTicket(ticketId) {
    setColumns(prev => {
      const next = { ...prev };
      for (const colId in next) {
        if (next[colId].tickets.some(t => t.id === ticketId)) {
          next[colId] = {
            ...next[colId],
            tickets: next[colId].tickets.filter(t => t.id !== ticketId),
          };
          break;
        }
      }
      return next;
    });
  }

  return (
    <div className="App">
      <h1>EISGRC Ticket Organizer</h1>

      <div className="add-ticket">
        <span className="ticket-prefix">EISGRC-</span>
        <input
          className="input-number"
          type="number"
          min="1"
          placeholder="###"
          value={ticketNumber}
          onChange={e => setTicketNumber(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          className="input-label"
          type="text"
          placeholder="Label (optional)"
          value={ticketLabel}
          onChange={e => setTicketLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <select value={ticketType} onChange={e => setTicketType(e.target.value)}>
          <option value="story">Story</option>
          <option value="task">Task</option>
        </select>
        <select value={targetCol} onChange={e => setTargetCol(e.target.value)}>
          {Object.values(columns).map(col => (
            <option key={col.id} value={col.id}>{col.headerId} — {col.name}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Add</button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {Object.values(columns).map(col => (
            <Column
              key={col.id}
              column={col}
              onRename={handleRename}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTicket ? <JiraTicket ticket={activeTicket} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
