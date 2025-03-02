# Task Management Application - Architecture & Setup Guide

## 1. Project Architecture

This document outlines the structure and setup of the **Task Management Application**, built using **Angular Standalone Components** and Material UI. The application is designed to manage tasks with features like **CRUD operations, real-time updates using WebSockets, authentication.**

## 2. Folder Structure
```
todo-frontend/
│-- src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
|   |   |   ├── confirm-dialog/
│   │   │   ├── home/
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── task-list/
│   │   │   │   │   ├── task-page/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── websocket.service.ts
│   │   ├── guard/
│   │   │   ├── auth.guard.ts
|   |   ├── interceptor/
|   |   |   ├── auth.interceptor.ts
|   |   ├── modules/
|   |   |   ├── material/
|   |   |      ├── material.module.ts
│   │   ├── models/
│   │   │   ├── task.ts
│   │   ├── routes/
│   │   │   ├── app.routes.ts
│   ├── assets/
│   ├── environments/
│   ├── main.ts
│-- angular.json
│-- package.json
│-- tsconfig.json
```

## 3. Technology Stack
- **Frontend:** Angular Standalone (Angular 19+)
- **UI Framework:** Angular Material
- **State Management:** BehaviorSubject (RxJS)
- **Real-Time Communication:** WebSockets
- **Authentication:** JWT-based authentication
- **Backend (optional integration):** Node.js + Express.js + PostgreSQL

## 4. Installation Guide

### Prerequisites
- **Node.js (v23+)** installed
- **Angular CLI** installed globally
- **A running backend API** (optional for authentication and database operations)

### Steps to Install

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up environment variables** (if applicable)
   src/environment

## 5. Running the Application

### Development Mode
To run the application locally:
```sh
npm start
```
The app will be available at `http://localhost:4200/`
