# Campus Connect 🎓

Campus Connect is a **full-stack web application** designed to streamline interaction between **students and administrators** within a campus ecosystem. It provides role-based access, secure authentication, and a structured backend–frontend architecture suitable for real-world academic platforms.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**
  Secure login system with role-based access (Admin / Student)

* 👤 **Admin Controls**
  Admin creation, reset, and debugging utilities

* 🎓 **Student Management**
  Test student creation and database seeding support

* 🌐 **RESTful APIs**
  Well-structured backend APIs using Express

* 🎨 **Modern Frontend**
  Responsive UI built with Tailwind CSS

* 🗄️ **Database Integration**
  MongoDB with Mongoose schemas

* 🧩 **Full-Stack Architecture**
  Separate frontend and backend folders for scalability

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Tools & Utilities

* Git & GitHub
* VS Code
* npm

---

## 📁 Project Structure

```
campus-connect/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── server.js        # Backend entry point
│   ├── seed.js          # Database seeding
│   ├── createorresetadmin.js
│   ├── makeAdminUser.js
│   ├── createTestStudent.js
│   └── .env             # Environment variables
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/             # Frontend source code
│   ├── index.html
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/diya-122/campus-connect.git
cd campus-connect
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the backend server:

```bash
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will run locally and communicate with the backend APIs.

---

## 🔑 Admin Utilities

The backend includes helper scripts for administration:

* `createorresetadmin.js` – Create or reset admin credentials
* `makeAdminUser.js` – Promote a user to admin
* `debugPrintadmin.js` – Debug admin-related data
* `createTestStudent.js` – Generate test student accounts

Run them using:

```bash
node filename.js
```


