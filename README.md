# Stackly - Document Management App

Stackly is a modern, clean, and bold document management application. It allows users to upload, organize, and manage documents using a simple hierarchy: **Queue → Spaces → Stacks → Labels**.

---

## Table of Contents

1. [Overview](#overview)
2. [Terminology](#terminology)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Development Roadmap](#development-roadmap)
6. [Setup Instructions](#setup-instructions)
7. [Future Enhancements](#future-enhancements)

---

## Overview

Stackly allows documents to be uploaded into a Queue, assigned to Spaces (top-level categories), and optionally grouped into Stacks inside each Space. Labels can be added to documents for easy searching. This project is intended as a **portfolio project**, functional but not necessarily production-ready.

---

## Project Status

**Overall Progress:** Phase 1 – Frontend UI Shell

### Phase 0 – Setup

- [x] Install Node.js, Java, VSCode, IntelliJ
- [x] Initialize frontend (`stackly-ui`) and backend (`stackly-api`) projects
- [x] Clean React boilerplate files
- [x] Create folder structure for frontend (`components/`, `pages/`, `api/`, `styles/`)

### Phase 1 – Frontend UI Shell

- [x] Create global CSS (colors/fonts)
- [x] Build basic Sidebar component
- [x] Build main workspace placeholder
- [x] Make sidebar interactive (clickable Spaces)
- [x] Integrate Bootstrap for responsive layout

### Phase 2 – Backend Setup

- [x] Initialize Spring Boot project
- [x] Add Spring Web, Spring Data JPA, PostgreSQL dependencies
- [x] Configure database connection (Currently with H2)
- [x] Create basic health endpoint (`/api/health`)

### Phase 3 – Data Models

- [x] Create JPA entities: Space, Stack, Document
- [x] Seed sample data for testing

### Phase 4 – Display Spaces & Stacks

- [x] Sidebar shows Spaces and allows adding a Space
- [ ] Clicking a Space shows its Stacks
- [ ] Clicking a Stack shows its documents

### Phase 5 – File Upload & Queue

- [ ] Implement POST `/api/documents/upload`
- [ ] Implement GET `/api/documents/queue`
- [ ] Display unassigned documents in frontend Queue

### Phase 6 – Moving Documents

- [ ] Implement PUT endpoints to assign documents to Spaces and Stacks
- [ ] Frontend UI for moving documents from Queue → Space → Stack

### Phase 7 – Labels & Search

- [ ] Add Label entity (many-to-many with Document)
- [ ] Search documents by name, label, Space, or Stack

### Phase 8 – Polish & Extras

- [ ] Apply Clean + Bold styling (Slate Purple accent)
- [ ] Make layout responsive for smaller screens
- [ ] Add hover effects, buttons, and subtle shadows
- [ ] Optional: drag-and-drop document organization
- [ ] Optional: authentication and multiple users

---

## Terminology

| Term       | Level               | Purpose                                         | Example                           |
| ---------- | ------------------- | ----------------------------------------------- | --------------------------------- |
| **Queue**  | Entry point         | Holds newly uploaded documents not yet assigned | Newly uploaded invoices           |
| **Space**  | Top-level           | Categorizes documents by department/project     | HR, Accounting, Project X         |
| **Stack**  | Nested inside Space | Groups related documents                        | Employee Contracts, Invoices 2025 |
| **Labels** | Tagging             | Searchable descriptors for documents            | Confidential, Q1, Budget          |

**Visual Flow:**

```
Queue (Unassigned Documents)
  │
  ├─ Space: HR
  │     ├─ Stack: Employee Contracts
  │     │     ├─ Document 1
  │     │     └─ Document 2
  │     └─ Stack: Recruitment
  │           ├─ Document 3
  │           └─ Document 4
  │
  ├─ Space: Accounting
  │     ├─ Stack: Invoices 2025
  │     │     ├─ Document 5
  │     │     └─ Document 6
  │     └─ Stack: Expense Reports
  │           └─ Document 7
  │
  └─ Space: Project X
        └─ Document 8 (directly in Space)
```

This shows how documents move from the Queue into Spaces, then optionally into Stacks.

---

## Tech Stack

**Frontend:**

- React
- Axios
- Bootstrap (for UI components and layout)
- CSS variables for custom styling (Slate Purple accent)

**Backend:**

- Java + Spring Boot
- Spring Web, Spring Data JPA
- PostgreSQL (or H2 for testing)

**Storage:**

- Local filesystem for document uploads during development

---

## Project Structure

### Frontend (React)

```
src/
  components/   // reusable UI components (Sidebar, TopBar, etc.)
  pages/        // screen components (QueuePage, SpacePage, StackPage)
  api/          // API calls (documents.js, spaces.js, stacks.js)
  styles/       // global variables and layout CSS
  App.js        // main layout container
  index.js      // entry point
```

### Backend (Spring Boot)

```
stackly-api/
  src/main/java/.../controller/   // REST controllers
  src/main/java/.../model/        // JPA entities (Document, Space, Stack, Label)
  src/main/java/.../repository/   // JPA repositories
  src/main/java/.../service/      // optional service layer
  src/main/resources/application.properties  // DB config
```

---

## Setup Instructions

### Frontend

```bash
# create React app
npx create-react-app stackly-ui
cd stackly-ui
# install Bootstrap
npm install bootstrap
# start dev server
npm start
```

### Backend

```bash
# create Spring Boot project in IntelliJ
# add Spring Web, Spring Data JPA, PostgreSQL driver
# configure database in application.properties
# run server locally
```

### Notes

- Start with frontend UI shell first to visualize layout
- Add backend APIs progressively
- Keep folder structure organized for maintainability

---

## Future Enhancements

- Drag-and-drop document organization
- User authentication & roles
- Cloud storage support
- Export/Download document bundles
- Advanced search & filtering

---

**Author:** Cat Meza
**Portfolio Project:** Stackly
