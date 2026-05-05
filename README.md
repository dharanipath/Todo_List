:

📝 To-Do List App (Full Stack)

A full-stack To-Do List application built using HTML, CSS, JavaScript (frontend) and Node.js + Express.js (backend) with user authentication (Login/Signup).

Users must log in or sign up before accessing and managing their tasks. Tasks are stored per user.

📁 Project Structure
├── frontend/
│   ├── index.html      # Main UI (Login, Signup, Dashboard)
│   ├── styles.css      # Styling for UI
│   ├── script.js       # Frontend logic (auth + tasks handling)
│   └── images/         # Icon assets
│       ├── icon.png
│       ├── checked.png
│       └── unchecked.png
│
├── backend/
│   ├── node.js         # Express server entry point
│   ├── routes/         # API routes (auth, tasks)
│   ├── models/         # User & task models
│   ├── controllers/    # Business logic
│   └── node_modules/   # Dependencies
│
├── package.json        # Backend dependencies
└── README.md
🚀 Features
🔐 Authentication
User Signup
User Login
Protected access to tasks
📝 Task Management
Add new tasks
Mark tasks as completed
Delete tasks
User-specific task storage
💾 Data Handling
Backend API using Node.js + Express.js
Database integration (MongoDB / MySQL depending on setup)
Secure user-based task storage
⚙️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Express.js
JSON Web Token (JWT) (if implemented)
Database (MongoDB / MySQL)
🚀 Running the Project Locally
1. Clone repository
git clone https://github.com/dharanipath/Todo_List.git
cd Todo_List
2. Run Backend
cd backend
npm install
node node.js

Server will start on:

http://localhost:5000
3. Run Frontend

You can run frontend using:

Option 1: Live Server (VS Code)
Install Live Server extension
Right click index.html
Click Open with Live Server
Option 2: HTTP Server
npx -y http-server -p 5000 -a 0.0.0.0 -c-1 --cors -d false frontend
<!-- 🌐 API Endpoints (Backend)
Authentication
POST /api/auth/signup   → Register user
POST /api/auth/login    → Login user
Tasks
GET    /api/tasks       → Get user tasks
POST   /api/tasks       → Add task
PUT    /api/tasks/:id   → Update task
DELETE /api/tasks/:id   → Delete task -->
🔒 Authentication Flow
User signs up / logs in
Backend generates authentication token (JWT)
Token is stored in frontend (localStorage/sessionStorage)
All task requests require valid token
📌 Notes
Frontend and backend are now separated
API handles all authentication and task operations
Frontend communicates with backend via REST APIs
Designed for scalability (can extend to React or Angular later)
📄 License

This project is open-source and free to use.