# 🎓 Smart College Event Management System

A full-stack web app built with **React.js + Node.js + MySQL**.

## 📁 Project Structure

```
smart-college-ems/
├── backend/          ← Node.js + Express API
│   ├── server.js
│   ├── database.sql  ← Run this first!
│   ├── .env.example
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   └── routes/
└── frontend/         ← React.js App
    └── src/
        ├── pages/
        │   ├── admin/      (Dashboard, Events, Resources, Users, Reports)
        │   ├── faculty/    (Home, Events, CreateEvent)
        │   └── student/    (Home, Events, MyRegistrations)
        ├── components/
        ├── context/
        └── utils/
```

---

## 🚀 Setup Instructions

### Step 1: Database Setup
1. Open MySQL and run the schema:
```sql
SOURCE path/to/backend/database.sql;
```
This creates the DB, tables, sample resources, and a default admin.

**Default Admin:** `admin@college.edu` / `password`

---

### Step 2: Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

---

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Approve/reject events, manage resources, view reports, view all users, export PDF |
| **Faculty** | Create events, request resources, view own event status |
| **Student** | View & register for approved events, check seats |

---

## ✨ Key Features

- **JWT Authentication** with role-based routing
- **Resource Conflict Detection** — blocks double-booking of halls/projectors
- **Admin Approval Flow** — events need admin approval before students can register
- **PDF Report Export** — admin can download complete events report
- **Dashboard Analytics** — monthly charts, most used resources, upcoming events
- **Seat Management** — real-time seat tracking with visual progress bars
- **Responsive Design** — works on mobile

---

## 🔗 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| GET | `/api/events` | All logged in |
| POST | `/api/events` | Faculty |
| PATCH | `/api/events/:id/status` | Admin |
| POST | `/api/events/:id/register` | Student |
| GET/POST/PUT/DELETE | `/api/resources` | Admin |
| GET | `/api/reports/stats` | Admin |
| GET | `/api/reports/pdf` | Admin |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MySQL with mysql2
- **Auth:** JWT + bcryptjs
- **PDF:** PDFKit
