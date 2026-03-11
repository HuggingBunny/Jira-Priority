# EISGRC Ticket Organizer

A local React app for visually organizing Jira-style tickets across sprints.
Built for quick planning work — no Jira login required.

## Location

```
/Users/chad/jira-dnd-organizer
```

## Running

```bash
cd /Users/chad/jira-dnd-organizer
npm start
# → http://localhost:3000
```

## Features

- **10 sprint columns** with horizontal scroll
- **Drag and drop** — reorder within a column or move tickets between columns
- **3 ticket types** with color coding:
  - 🟣 **Epic** — purple
  - 🟢 **Story** — green
  - 🔵 **Task** — blue
- **EISGRC- prefix** — enter just the number, prefix is fixed
- **Type + column selector** on the add form
- **Duplicate detection** — won't let you add the same ticket number twice

## Stack

- React 19 (Create React App)
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
  (react-beautiful-dnd was dropped — incompatible with React 19)

## File Structure

```
src/
  App.js                  # Main component, board state, DnD context
  Column.js               # Individual column (droppable + sortable context)
  SortableJiraTicket.js   # Drag wrapper around JiraTicket
  JiraTicket.js           # Pure visual ticket component (also used by DragOverlay)
  App.css                 # Dark board theme, ticket colors
```

## Notes

- State is in-memory only — refreshing the page resets to sample data
- Future: add localStorage persistence, editable labels, column renaming
