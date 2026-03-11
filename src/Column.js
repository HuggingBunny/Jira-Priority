import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableJiraTicket } from './SortableJiraTicket';

export function Column({ column, autoEdit, onRename, onDeleteColumn, onEditTicket, onDeleteTicket, onAcknowledgeMove }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const [editing, setEditing]         = useState(false);
  const [confirming, setConfirming]   = useState(false);
  const [draftId, setDraftId]         = useState('');
  const [draftName, setDraftName]     = useState('');

  // Auto-open edit mode for newly created columns
  useEffect(() => {
    if (autoEdit) startEdit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startEdit() {
    setDraftId(column.headerId.replace('EISGRC-', ''));
    setDraftName(column.name === 'New Column' ? '' : column.name);
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

  const ticketCount = column.tickets.length;

  return (
    <div className="column">
      {/* ── Column header ── */}
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
      ) : confirming ? (
        <div className="col-header col-header--confirming">
          <span className="confirm-message">
            Delete <strong>{column.headerId}</strong>?
            {ticketCount > 0 && (
              <span className="confirm-ticket-warning"> ({ticketCount} ticket{ticketCount !== 1 ? 's' : ''} will be lost)</span>
            )}
          </span>
          <div className="confirm-actions">
            <button className="confirm-yes" onClick={() => onDeleteColumn(column.id)}>Yes</button>
            <button className="confirm-no"  onClick={() => setConfirming(false)}>No</button>
          </div>
        </div>
      ) : (
        <div className="col-header" onDoubleClick={startEdit} title="Double-click to rename">
          <button
            className="col-delete-btn"
            onClick={() => setConfirming(true)}
            title="Delete column"
          >×</button>
          <span className="col-header-id">{column.headerId}</span>
          <span className="col-header-name">{column.name}</span>
        </div>
      )}

      {/* ── Tickets ── */}
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
              onAcknowledgeMove={onAcknowledgeMove}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
