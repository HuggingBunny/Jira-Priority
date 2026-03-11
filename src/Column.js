import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableJiraTicket } from './SortableJiraTicket';

export function Column({ column, onRename, onEditTicket, onDeleteTicket }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [editing, setEditing]     = useState(false);
  const [draftId, setDraftId]     = useState('');
  const [draftName, setDraftName] = useState('');

  function startEdit() {
    setDraftId(column.headerId.replace('EISGRC-', ''));
    setDraftName(column.name);
    setEditing(true);
  }

  function commit() {
    const num  = draftId.trim();
    const name = draftName.trim();
    if (num) {
      onRename(column.id, `EISGRC-${num}`, name || `EISGRC-${num}`);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setEditing(false); }
  }

  return (
    <div className="column">
      {editing ? (
        <div className="col-header col-header--editing">
          <div className="col-header-edit-row">
            <span className="col-header-prefix">EISGRC-</span>
            <input
              className="col-header-input col-header-input--id"
              type="number"
              min="1"
              value={draftId}
              onChange={e => setDraftId(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <input
            className="col-header-input col-header-input--name"
            type="text"
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Name"
          />
          <div className="col-header-actions">
            <button className="col-header-save"   onClick={commit}>Save</button>
            <button className="col-header-cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="col-header" onDoubleClick={startEdit} title="Double-click to rename">
          <span className="col-header-id">{column.headerId}</span>
          <span className="col-header-name">{column.name}</span>
        </div>
      )}

      <SortableContext
        items={column.tickets.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="column-content">
          {column.tickets.map(ticket => (
            <SortableJiraTicket
              key={ticket.id}
              ticket={ticket}
              onEdit={onEditTicket}
              onDelete={onDeleteTicket}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
