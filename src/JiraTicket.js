import React from 'react';

const PRIORITY_LABELS = { p1: 'P1', p2: 'P2', p3: 'P3', p4: 'P4' };

export function JiraTicket({ ticket, onDeleteClick, onAcknowledgeMove }) {
  return (
    <div className={`jira-ticket ticket-${ticket.type}`}>
      {onDeleteClick && (
        <button
          className="ticket-delete"
          onPointerDown={e => e.stopPropagation()}
          onClick={onDeleteClick}
          title="Delete"
        >×</button>
      )}
      <div className="ticket-top">
        <span className="ticket-badge">{ticket.type}</span>
        {ticket.priority && PRIORITY_LABELS[ticket.priority] && (
          <span className={`priority-badge priority-${ticket.priority}`}>
            {PRIORITY_LABELS[ticket.priority]}
          </span>
        )}
        {ticket.moved && onAcknowledgeMove && (
          <button
            className="moved-badge"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onAcknowledgeMove(ticket.id); }}
            title="Ticket was moved to this column — click to acknowledge"
          >↗ moved</button>
        )}
      </div>
      <span className="ticket-id">{ticket.id}</span>
      {ticket.label && ticket.label !== ticket.id && (
        <span className="ticket-label">{ticket.label}</span>
      )}
    </div>
  );
}
