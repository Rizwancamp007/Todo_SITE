# 🌌 TaskFlow — Cosmic Dark Glassmorphic MERN Todo Application

TaskFlow is a premium, feature-rich Task Management and Productivity Application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a custom-designed, stunning **Cosmic Dark** interface incorporating glassmorphism, animated glow effects, micro-interactions, responsive dashboard grids, interactive monthly calendars, drag-ready Kanban columns, and color-swatched task categories.

---
## ☯️ Live Deployement Link
* **https://todo-site-orpin.vercel.app/dashboard

  
## ✨ Features

*   **🌌 Cosmic Dark UI & Glassmorphism**: Tailored space theme styling (`#07070f`), blurred background glass effects, pulsing border highlights, custom scrollbars, and floating background animated orbs.
*   **📊 Dynamic Dashboard Overview**: Real-time stats (Total, In Progress, Completed, Overdue), dynamic SVG-gradient progress rings, upcoming deadline warnings, and priority breakdown graphs.
*   **📋 Dual-View Tasks Manager**: Switch seamlessly between a fluid List view and an interactive Kanban board (Pending, In Progress, Completed columns) with live search and multi-filtering (Status, Priority, Category).
*   **📅 Event Deadline Calendar**: Custom calendar grid showing due dates. Click priority-colored flags on calendar dates to instantly view or edit tasks.
*   **📁 Custom Swatched Categories**: Create categories to organize tasks. Customize with visual emoji folder icons and gorgeous background color swatches.
*   **⚡ Zustand Global State**: High-performance React state management with zero boilerplate, pre-configured queries, and optimistic UI updates for instantaneous toggle status switches.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React (Vite.js)
*   **State Management**: Zustand
*   **Routing**: React Router DOM (v6 nested structures)
*   **Styling**: Pure CSS (Design System Tokens, Glass Utilities)
*   **Utilities**: `date-fns` (time calculations), `lucide-react` (icons)
*   **Notifications**: `react-hot-toast`

### Backend & Database
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (Mongoose schemas)
*   **Validation**: Joi (Request payload schemas)
*   **Debugging**: Morgan, Nodemon

---

## 📂 Project Directory Structure

```text
todo/
├── server/                    # Node.js Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB Connection
│   ├── controllers/
│   │   ├── categoryController.js
│   │   └── todoController.js  # Task aggregations, stats & CRUD
│   ├── middleware/
│   │   └── errorHandler.js    # Mongoose error wrapper
│   ├── models/
│   │   ├── Category.js
│   │   └── Todo.js            # Compounds & Text search indexes
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   └── todoRoutes.js
│   ├── server.js              # Main App entry point
│   ├── .env                   # Server Environment Config
│   └── package.json
│
└── client/                    # Vite React Frontend
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Pre-configured client instance
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── ProgressRing.jsx
    │   │   │   └── StatsCard.jsx
    │   │   ├── layout/
    │   │   │   ├── Header.jsx
    │   │   │   ├── Layout.jsx   # Root sidebar and animated orbs shell
    │   │   │   └── Sidebar.jsx
    │   │   └── todos/
    │   │       ├── TodoCard.jsx
    │   │       ├── TodoFilters.jsx
    │   │       ├── TodoForm.jsx # Add/Edit modal dialog
    │   │       └── TodoList.jsx # Dual-mode Kanban and List view
    │   ├── hooks/
    │   │   └── useDebounce.js   # Keyboard search delay
    │   ├── pages/
    │   │   ├── Calendar.jsx     # Date planner page
    │   │   ├── Categories.jsx   # Emoji folder swatcher page
    │   │   ├── Dashboard.jsx
    │   │   └── Tasks.jsx
    │   ├── store/
    │   │   ├── useCategoryStore.js
    │   │   └── useTodoStore.js
    │   ├── utils/
    │   │   ├── dateUtils.js
    │   │   └── priorityUtils.js
    │   ├── App.jsx            # Router and toaster bootstrap
    │   ├── index.css          # Premium design tokens sheet
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 2. Configure Backend
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/todo-app
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Configure Frontend
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Endpoints Reference

### Todos (`/api/todos`)
*   `GET /api/todos` — Get list of todos (Supports filter queries: `status`, `priority`, `category`, `search`, and sorting: `sort`, `order`).
*   `GET /api/todos/stats` — Retrieve complex dashboard aggregates (percentages, overdue, upcoming, priority breakdown shares).
*   `POST /api/todos` — Create a new todo task.
*   `PUT /api/todos/:id` — Update an existing todo.
*   `PATCH /api/todos/:id/status` — Quick toggle status (`pending`, `in-progress`, `completed`).
*   `DELETE /api/todos/:id` — Delete a todo.

### Categories (`/api/categories`)
*   `GET /api/categories` — Get list of all categories.
*   `POST /api/categories` — Create a new category folder.
*   `PUT /api/categories/:id` — Edit category name, accent color, or emoji.
*   `DELETE /api/categories/:id` — Delete a category.

---

## 🎨 Global Styling Tokens

The application's theme and parameters are managed strictly in `client/src/index.css` via custom CSS properties. You can easily adjust the aesthetics:

```css
:root {
  /* Color Accents */
  --accent-purple: #7c3aed;
  --accent-purple-light: #a78bfa;
  --accent-blue: #2563eb;
  --accent-blue-light: #60a5fa;
  --accent-cyan: #06b6d4;

  /* Priority Visuals */
  --priority-high: #f43f5e;
  --priority-medium: #f59e0b;
  --priority-low: #10b981;

  /* Surface Glows & Blurs */
  --glass-bg: rgba(22, 22, 31, 0.65);
  --glass-border: rgba(255, 255, 255, 0.05);
  --bg-card: rgba(13, 13, 21, 0.45);
}
```

---

## 📝 License
This project is built with ☕ & 💓 by Rizwan Khan ©️ 2026

