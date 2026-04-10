# 🎯 Smart Internship & Placement Tracker

> **Full Stack Development Lab — Mini Project**
> MIT-WPU | Semester 6

A full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) to help students and institutions efficiently track internship applications, placement drives, and hiring outcomes in one centralized platform.

---

## 🎯 Objective

Managing internship and placement data across spreadsheets and emails is chaotic. This project aims to:

- Provide a **centralized dashboard** for tracking internship & placement applications
- Enable **role-based access** for students, coordinators, and administrators
- Offer **real-time status tracking** of applications (Applied → Shortlisted → Placed)
- Simplify **placement analytics** and reporting for institutions
- Secure user data with **JWT-based authentication**

---

## 📁 Project Structure

```
smart-internship-placement-tracker/
├── client/                    → React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── App.js             # Root component
│   │   ├── App.css            # Global styles
│   │   ├── index.js           # React entry point
│   │   └── ...
│   └── package.json           # Frontend dependencies
│
├── server/                    → Node.js/Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection
│   ├── server.js              # Express entry point
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
├── README.md
└── LICENSE
```

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| **Frontend**     | React 19 (Create React App)         |
| **Backend**      | Express 5 · Node.js                 |
| **Database**     | MongoDB Atlas (Mongoose 9 ODM)      |
| **Authentication** | JSON Web Tokens (JWT) · bcryptjs  |
| **Dev Tools**    | Nodemon · dotenv · CORS             |
| **Version Control** | Git & GitHub                     |

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **MongoDB Atlas** account (or a local MongoDB instance) — [Sign Up](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Shravani808/smart-internship-placement-tracker.git
cd smart-internship-placement-tracker
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (or update the existing one):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npx nodemon server.js
```

The API will be running at **http://localhost:5000**

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

The React app will open at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| `GET`  | `/`             | API health check          |
| *More endpoints coming soon as features are developed* |

---

## 🗂️ Key Features (Planned)

- [x] Project scaffolding (React + Express + MongoDB)
- [x] MongoDB Atlas integration
- [x] JWT authentication setup
- [ ] User registration & login (Student / Admin)
- [ ] Student profile management
- [ ] Internship application tracker
- [ ] Placement drive management
- [ ] Application status pipeline (Applied → Shortlisted → Placed)
- [ ] Admin dashboard with analytics
- [ ] Email notifications
- [ ] Export reports (CSV/PDF)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "Add your feature"`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <i>Built with ❤️ using the MERN Stack</i>
</p>