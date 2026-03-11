import React from 'react';

export function JiraTicket({ ticket, onDeleteClick }) {
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
      <span className="ticket-badge">{ticket.type}</span>
      <span className="ticket-id">{ticket.id}</span>
      {ticket.label && ticket.label !== ticket.id && (
        <span className="ticket-label">{ticket.label}</span>
      )}
    </div>
  );
}
