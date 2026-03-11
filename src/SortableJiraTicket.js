import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JiraTicket } from './JiraTicket';

export function SortableJiraTicket({ ticket, onEdit, onDelete }) {
  const [editing, setEditing]           = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [draftNum, setDraftNum]         = useState('');
  const [draftLabel, setDraftLabel]     = useState('');
  const [draftPriority, setDraftPriority] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  function startEdit() {
    setDraftNum(ticket.id.replace('EISGRC-', ''));
    setDraftLabel(ticket.label === ticket.id ? '' : ticket.label);
    setDraftPriority(ticket.priority || '');
    setEditing(true);
  }

  function commit() {
    const num = draftNum.trim();
    if (num) {
      onEdit(ticket.id, `EISGRC-${num}`, draftLabel.trim() || `EISGRC-${num}`, draftPriority);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setEditing(false); }
  }

  // ── Confirm delete ───────────────────────────────────────
  if (confirming) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`jira-ticket ticket-${ticket.type} ticket--confirming`}
      >
        <span className="confirm-message">Delete <strong>{ticket.id}</strong>?</span>
        <div className="confirm-actions">
          <button
            className="confirm-yes"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onDelete(ticket.id)}
          >Yes</button>
          <button
            className="confirm-no"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => setConfirming(false)}
          >No</button>
        </div>
      </div>
    );
  }

  // ── Inline edit ──────────────────────────────────────────
  if (editing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`jira-ticket ticket-${ticket.type} ticket--editing`}
      >
        <div className="ticket-edit-row">
          <span className="ticket-edit-prefix">EISGRC-</span>
          <input
            className="ticket-edit-input ticket-edit-input--id"
            type="number"
            min="1"
            value={draftNum}
            onChange={e => setDraftNum(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <input
          className="ticket-edit-input ticket-edit-input--label"
          type="text"
          value={draftLabel}
          onChange={e => setDraftLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Label"
        />
        <select
          className="ticket-edit-select"
          value={draftPriority}
          onChange={e => setDraftPriority(e.target.value)}
        >
          <option value="">— No Priority —</option>
          <option value="p1">P1 — Critical</option>
          <option value="p2">P2 — High</option>
          <option value="p3">P3 — Medium</option>
          <option value="p4">P4 — Low</option>
        </select>
        <div className="ticket-edit-actions">
          <button className="ticket-edit-save"   onClick={commit}>Save</button>
          <button className="ticket-edit-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── Default view ─────────────────────────────────────────
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={startEdit}
    >
      <JiraTicket
        ticket={ticket}
        onDeleteClick={e => {
          e.stopPropagation();
          setConfirming(true);
        }}
      />
    </div>
  );
}
