# 🏨 HBnB Evolution: A Full-Stack Property Rental Application

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.0+-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> **HBnB Evolution** is a comprehensive software engineering project that recreates a property rental platform (AirBnB clone). The project evolves through four distinct phases, starting from architectural design and moving towards a fully functional full-stack application.

---

## 🌟 Project Overview & Objectives

The goal of this project is to build a scalable and modular application while applying industry-standard design patterns and development practices.

- **Modular Design:** Using a three-layered architecture (Presentation, Business Logic, Persistence).
- **RESTful API:** Building robust endpoints with Flask-RESTX and Swagger documentation.
- **Data Persistence:** Transitioning from in-memory storage to a relational database with SQLAlchemy.
- **Security:** Implementing JWT-based authentication and role-based access control.
- **Modern Frontend:** Developing a responsive UI with React 19 and Tailwind CSS.

---

## 🏗️ Project Evolution (Structure)

The repository is organized into four main parts, each representing a milestone in the development lifecycle:

| Part | Title | Focus | Technologies |
| :--- | :--- | :--- | :--- |
| **[Part 1](./part1)** | **Design & Architecture** | UML diagrams, data modeling, and system design. | Mermaid.js, UML |
| **[Part 2](./part2)** | **API Implementation** | Core API logic with in-memory persistence. | Python, Flask, Flask-RESTX |
| **[Part 3](./part3)** | **Database Persistence** | SQL persistence and User Authentication. | SQLAlchemy, SQLite, JWT |
| **[Part 4](./part4)** | **Full-Stack Integration** | Final backend refinement and React Frontend. | React, Vite, Tailwind CSS |
| **[Part 4 Old](./part4-old)** | **Legacy Full-Stack** | Initial prototype of the full-stack version (incomplete). | HTML, CSS, JS |

---

## 🛠️ Technologies & Tools

### Backend
- **Language:** Python 3.8+
- **Framework:** Flask / Flask-RESTX
- **ORM:** SQLAlchemy
- **Database:** SQLite
- **Auth:** Flask-JWT-Extended
- **Documentation:** Swagger UI (Auto-generated)

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **State Management:** Hooks & Context API

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **OS:** Linux, macOS, or Windows (WSL recommended)
- **Python:** `3.8` or higher
- **Node.js:** `v18` or higher
- **npm:** `v9` or higher
- **SQLite3:** For database management

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ylabate/holbertonschool-hbnb.git
cd holbertonschool-hbnb
```

### 2. Setup the Backend (Example for Part 4)
```bash
cd part4/hbnb-backend
pip install -r requirement.txt
# Initialize database
mkdir instance
cat schema.sql | sqlite3 instance/development.db
cat seed.sql | sqlite3 instance/development.db
# Run the server
python run.py
```
*API will be available at `http://localhost:5000/api/v1/`*

### 3. Setup the Frontend (Part 4)
```bash
cd ../hbnb-frontend
npm install
npm run dev
```
*Frontend will be available at `http://localhost:5173/`*

---

## ✨ Features

- **User Management:** Registration, Login, and Profile updates.
- **Property Listings:** Create, view, update, and delete places to stay.
- **Amenity Management:** Categorize properties with various amenities.
- **Review System:** Users can leave ratings and comments on properties.
- **Authentication:** Secure access to protected routes via JWT tokens.
- **Responsive UI:** Fluid design that works on mobile and desktop.

---

## 🤝 Contributing

This project was developed as part of the **Holberton School** curriculum.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if applicable).

---

<p align="center">Made with ❤️ for the Holberton School community.</p>
