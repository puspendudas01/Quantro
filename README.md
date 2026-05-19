# 🎓 Exam Nova – Online Exam System

## 📌 Project Overview

Exam Nova is a secure, LAN-based online examination platform with real-time proctoring, blueprint-driven exam generation, and scalable multi-user support.

Designed for institutions to conduct exams over a local network (LAN) without requiring internet connectivity.

---
## Key Highlights
- Secure JWT-based authentication system
- Blueprint-driven exam generation engine
- Real-time evaluation with subject-wise analytics
- Bulk question upload via Excel (Apache POI)
- Timed exams with auto-save and resume support
- Advanced proctoring with violation detection & auto-submit
- LAN-based deployment (no internet required)

---

## Features

**Admin**
- Platform overview (student, teacher, and subject counts)
- Approve pending teacher accounts
- Create and manage subjects
- Build exam blueprints (subject → question count → marks/negatives)
- Create and publish exams with scheduled start/end windows
- View all student results with subject-wise breakdown and violation logs

**Teacher**
- Upload questions manually or via `.xlsx` bulk upload (Apache POI)
- Browse and manage per-subject question bank
- View exam results for all assigned exams

**Student**
- Dashboard showing live and upcoming exams
- Fullscreen-enforced exam session with per-student question shuffle
- Colour-coded question navigator (Not Visited / Not Answered / Answered / Marked for Review / Answered & Marked)
- Auto-save every 30 seconds; resumes if session is interrupted
- Timer with warning colours; auto-submit on expiry
- Result page with score, breakdown, and PDF download

**Proctoring**
- Fullscreen enforcement with grace-period modal on exit
- Tab-switch detection
- Copy/paste and right-click blocking
- Keyboard shortcut blocking (F12, Ctrl+Shift+I, etc.)
- DevTools size heuristic
- Mouse-leave debounced detection
- Configurable violation threshold → auto-submit

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* HTML, CSS, JavaScript

### Backend

* Spring Boot
* REST APIs
* JWT Authentication

### Database

* PostgreSQL

---
## 📂 Project Structure

```
backend/
├── src/main/java/com/examportal/
│   ├── auth/          # JWT service, filter, login/register
│   ├── user/          # User entity, roles (ADMIN, TEACHER, STUDENT)
│   ├── subject/       # Subject CRUD
│   ├── question/      # Question bank, Excel upload
│   ├── exam/          # Blueprint, Exam, publish engine
│   ├── attempt/       # Exam session, autosave, submit
│   ├── evaluation/    # Marking, result storage
│   ├── proctor/       # Violation tracking, auto-submit
│   ├── reporting/     # iText7 PDF generation
│   ├── admin/         # Stats, teacher approval
│   └── common/        # ApiResponse, GlobalExceptionHandler
└── src/main/resources/
│    ├── application.yml
│    └── db/schema.sql
└── .env

frontend/
└── src/
    ├── api/           # axiosConfig, authApi, examApi, attemptApi, adminApi
    ├── context/       # AuthContext (JWT storage)
    ├── hooks/         # useTimer, useViolationDetector
    ├── pages/         # LoginPage, StudentDashboard, ExamPage, ResultPage,
    │                  # TeacherDashboard, AdminDashboard
    └── components/    # ExamResultsViewer, Spinner, Badge
```

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

* JWT-based authentication system
* Secure API access
* Token expiration handling

---

## 📌 Future Improvements

* AI-based proctoring
* Multi-language support
* Advanced analytics dashboard

---


## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

This project is licensed under the MIT License.

---


## 👨‍💻 Author

**Puspendu Sekhar Das**
