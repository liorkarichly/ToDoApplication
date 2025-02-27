# 📌 Node.js Task Management API with WebSockets & Authentication

## 📜 Overview
This is a **Task Management API** built with **Node.js, Express, MongoDB, and WebSockets**. It supports **JWT-based authentication**, **task CRUD operations**, **real-time updates using WebSockets**, and **design patterns** for scalability.

## 🚀 Features
- ✅ **User Authentication (JWT)** → Register, Login, and use JWT for API access.
- ✅ **Task Management (CRUD)** → Create, update, delete, and list tasks.
- ✅ **Task Prioritization & Due Dates** → Set task priority (`low`, `medium`, `high`) and a due date.
- ✅ **Edit Locking System** → Only one user can edit a task at a time.
- ✅ **WebSocket Real-Time Updates** → Users receive live updates when tasks change.
- ✅ **Structured Design Patterns** → Implements Repository, Factory, Singleton, and Middleware patterns.

---

## 📂 Project Structure
```
todo-backend/
│── config/
│   ├── database.js        # MongoDB connection
│   ├── auth.js
│── controllers/
│   ├── authController.js  # Login & Registration logic
│   ├── tasksController.js # Task management logic
│
│── middlewares/
│   ├── authMiddleware.js  # JWT authentication middleware
│
│── models/
│   ├── userModel.js       # User Schema
│   ├── taskModel.js       # Task Schema
│
│── repositories/
│   ├── taskRepository.js  # Handles task database operations
│   ├── userRepository.js  # Handles user database operations
│
│── factories/
│   ├── taskFactory.js     # Task creation logic (Factory Pattern)
│
│── socket/
│   ├── socket.js          # WebSocket server
│
│── utils/
│   ├── logger.js          # Logging system (Singleton Pattern)
│
│── routes/
│   ├── authRouter.js      # Authentication routes
│   ├── tasksRouter.js     # Task-related routes
│
│── .env                   # Environment variables
│── server.js              # Main entry point
│── package.json           # Dependencies
```

---

## 🛠️ Installation & Setup

### 1️⃣ **Clone the Repository**
```bash
cd todo-backend
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a `.env` file in the project root and add:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/todo_realtime
JWT_SECRET=your-super-secret-key
```

### 4️⃣ **Start MongoDB**
Ensure **MongoDB** is running locally:
```bash
mongod
```
Or, if using Docker:
```bash
docker start mongodb_container_name
```

### 5️⃣ **Run the Server**
```bash
npm start
```

---

## 📡 API Endpoints

### 🔹 **Authentication**
#### ✅ **Register a User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

#### ✅ **Login and Get JWT Token**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```
📌 **Response:**
```json
{ "token": "YOUR_JWT_TOKEN" }
```

### 🔹 **Task Management (Requires JWT Token)**
#### ✅ **Get All Tasks**
```http
GET /api/tasks
Authorization: Bearer YOUR_JWT_TOKEN
```

#### ✅ **Create a Task**
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "title": "New Task",
    "priority": "high",
    "dueDate": "2025-03-10T18:00:00.000Z"
}
```

#### ✅ **Update a Task**
```http
PUT /api/tasks/TASK_ID
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "title": "Updated Task",
    "isCompleted": true
}
```

#### ✅ **Delete a Task**
```http
DELETE /api/tasks/TASK_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

#### ✅ **Lock a Task for Editing**
```http
PUT /api/tasks/TASK_ID/lock
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "userId": "client-1234"
}
```

#### ✅ **Release Task Lock**
```http
PUT /api/tasks/TASK_ID/release
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "userId": "client-1234"
}
```

---

## 🎯 Design Patterns Implemented
| Pattern | Purpose |
|---------|---------|
| **Singleton Pattern** | Used for `logger.js` to ensure a single logging instance. |
| **Repository Pattern** | Separates business logic from database operations (`taskRepository.js`, `userRepository.js`). |
| **Factory Pattern** | Encapsulates task creation logic (`taskFactory.js`). |
| **Middleware Pattern** | Used for JWT authentication (`authMiddleware.js`). |

---

## 📡 WebSocket Events
| Event | Description |
|-------|-------------|
| **`taskCreated`** | Sent when a task is created. |
| **`taskUpdated`** | Sent when a task is updated. |
| **`taskDeleted`** | Sent when a task is deleted. |
| **`taskLocked`** | Sent when a task is locked for editing. |
| **`taskUnlocked`** | Sent when a task lock is released. |

---
