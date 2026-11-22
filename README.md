# Notique

A 3D sticky-note Kanban board with a calendar, pins and reminders.
Built with plain HTML, CSS and JavaScript, plus Bootstrap 5.

## Features
- Register and login (separate pages)
- Board with To Do, In Progress, Completed and Cancelled columns
- Sticky-note cards with title, description, timeline and tags
- 3D tilt effect, 4 paper styles, drag and drop
- Month calendar: tick notes done, drag to reschedule
- Pin notes and set reminders
- Tag filters, search, progress bar, light/dark theme
- Reusable, theme-matched confirmation and alert popups

## Data access
- Board code uses the Promise-based `getNotes()`, `saveNote(note)` and `deleteNote(id)` functions in `js/storage.js`.
- These functions currently persist notes in `localStorage`.
- Note IDs are assigned by the local storage adapter .
- Local demo passwords are stored as Base64, which is reversible and not encryption; this is temporary and must not be used for real credentials. 
- Notes include `priority`, `createdAt`, `completedAt`, `checklist`, `x`, `y`, `linkedTo` and `timeSpent` fields .
- Dates use `YYYY-MM-DD`; status values (`todo`, `progress`, `done`, `cancel`) and string-array tags are kept stable .
- Authentication/session and theme persistence still use the existing local storage helpers.

