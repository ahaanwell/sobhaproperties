# Sobha Properties — Admin Panel

Production-grade React admin panel with React Router v6, Redux Toolkit, TipTap Rich Text Editor, and Recharts.

## Project Structure
```
src/
├── pages/
│   ├── LoginPage.jsx          ← JWT login
│   ├── DashboardPage.jsx      ← Stats, charts, recent projects
│   ├── ProjectsPage.jsx       ← List, search, filter, paginate
│   ├── ProjectFormPage.jsx    ← Add/Edit with TipTap rich text editor
│   ├── ProjectViewPage.jsx    ← Full project detail + gallery manage
│   ├── AdminsPage.jsx         ← Manage admins (superadmin only)
│   └── ProfilePage.jsx        ← Update profile, change password
├── components/
│   ├── layout/
│   │   ├── Layout.jsx         ← Main layout wrapper
│   │   ├── Sidebar.jsx        ← Nav sidebar
│   │   └── Topbar.jsx         ← Header with breadcrumbs
│   └── common/
│       ├── UI.jsx             ← Input, Select, Button, Badge, Card...
│       ├── RichTextEditor.jsx ← TipTap WYSIWYG editor
│       ├── Toast.jsx          ← Toast notifications
│       ├── ConfirmDialog.jsx  ← Delete confirmation modal
│       └── ProtectedRoute.jsx ← Auth guards
├── store/
│   ├── store.js               ← Redux store
│   └── slices/
│       ├── authSlice.js       ← Login, logout, profile, password
│       ├── projectSlice.js    ← All project CRUD + stats
│       ├── adminSlice.js      ← Admin management
│       └── uiSlice.js         ← Toasts, sidebar state
├── hooks/
│   └── useToast.js            ← Toast hook
└── utils/
    └── api.js                 ← Axios instance with interceptors
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure backend URL
Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Run development server
```bash
npm run dev
```
Opens at http://localhost:5173

### 4. Build for production
```bash
npm run build
```

## Features

### Dashboard
- Total projects, by status (ongoing/upcoming/completed), by type
- Bar chart (status) + Donut chart (type) using Recharts
- Recent projects table

### Projects
- Searchable, filterable (status, type) with pagination
- **Add/Edit form with 6 tabs:**
  - Basic Info — name, location, price, RERA, status, type, units, towers
  - SEO & Meta — title, meta description with live preview, summary
  - Content — 5 rich text editors (TipTap) with toolbar: H1/H2/H3, bold, italic, underline, lists, blockquote, align, links
  - Plans & Pricing — floor plans table, price plans table
  - Media — main image upload with preview, gallery multi-upload
  - FAQ — add/remove Q&A pairs
- View page — hero image, tabs for all content sections, gallery with delete, floor plans, FAQ accordion
- Toggle active/inactive per project
- Delete with confirmation

### Admins (Super Admin only)
- Card grid view of all admins
- Register new admin with role selection
- Delete admin with confirmation

### Profile
- Update name/email
- Change password with strength indicator

## Backend
Your Express + MongoDB backend at port 5000 must have CORS enabled for the frontend origin:
```js
// In your app.js
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
```
