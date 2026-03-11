import React, { useState } from 'react';
import { getLogDates, getLog } from './storage';

export function Settings({ settings, onChangeSettings, onClose }) {
  const logDates = getLogDates();
  const [selectedDate, setSelectedDate] = useState(logDates[0] || '');

  const entries = selectedDate ? getLog(selectedDate) : [];

  function formatTime(isoString) {
    try {
      const d = new Date(isoString);
      return [
        String(d.getHours()).padStart(2, '0'),
        String(d.getMinutes()).padStart(2, '0'),
        String(d.getSeconds()).padStart(2, '0'),
      ].join(':');
    } catch {
      return '??:??:??';
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-panel">
        {/* Header */}
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose} title="Close">×</button>
        </div>

        {/* Body */}
        <div className="settings-body">

          {/* Section 1 — Display */}
          <div className="settings-section">
            <h3>Display</h3>
            <div className="theme-options">
              {['light', 'dark', 'system'].map(value => (
                <label
                  key={value}
                  className={`theme-option${settings.theme === value ? ' active' : ''}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={settings.theme === value}
                    onChange={() => onChangeSettings({ ...settings, theme: value })}
                  />
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Section 2 — App Logs */}
          <div className="settings-section">
            <h3>App Logs</h3>
            <p className="settings-note">Daily logs · 7-day rotation</p>

            {logDates.length === 0 ? (
              <div className="log-viewer">
                <div className="log-empty">No logs recorded yet.</div>
              </div>
            ) : (
              <>
                <select
                  className="log-date-select"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                >
                  {logDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>

                <div className="log-viewer">
                  {entries.length === 0 ? (
                    <div className="log-empty">No entries for this date.</div>
                  ) : (
                    entries.map((entry, i) => (
                      <div key={i} className="log-entry">
                        <span className="log-ts">{formatTime(entry.ts)}</span>
                        <span className="log-event">{entry.event}</span>
                        <span className="log-details">{String(entry.details)}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
