# 📘 School Attendance Management System (SAMS) – Backend API

**Node.js • Express • PostgreSQL (Neon) • JWT Authentication**

This backend provides all API services for the School Attendance Management System (SAMS).  
Designed to work with a Vue.js frontend.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login  
- Role-based access control (`admin`, `teacher`, `student`)  
- Secure password hashing using bcrypt  

### 👨‍🏫 User Management
- Admin users  
- Teachers  
- Students  

### 🏫 Academic Structure
- School Years  
- Terms  
- Majors  
- Classes  
- Subjects  
- Class–Subject assignments  
- Teacher–Class assignments  
- Rooms  

### 🗓 Schedule & Attendance
- Class schedules  
- Student attendance  
- Teacher attendance  
- Attendance filtering  

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── controllers/
│   ├── models/
│   └── routes/
├── .env
├── package.json
└── README.md
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone the project

```bash
git clone https://gitlab.com/testing980844/backend.git
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create .env file

Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@your-project-pooler.neon.tech/neondb?sslmode=require

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=8h
```

### 4️⃣ Start the server

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

---

## 🗄️ Database Setup (Neon)

### Get the connection string

Create a project on [neon.tech](https://neon.tech), copy the connection string from the
dashboard and set it as `DATABASE_URL` in `.env`.

### Create the tables and load the data

```bash
npm run db:import
```

This creates the tables from `database/schema.postgres.sql` and loads the rows from
`drawSQL-mysql-export.sql`. It runs in one transaction and stops if the tables already exist,
so it can't overwrite existing data.

### Generate password hash

```bash
node gen-hash.js
```

---

## 🔌 API Endpoints Overview

### 🔐 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login & get JWT token |

### 👤 Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### 🏫 Classes / Students / Teachers

Includes class list, teacher list, student list, mappings.

### 📚 Subjects

Manage subjects and subject assignments.

### 🗓 Schedules

- Get schedules per class
- Create / Update / Delete schedules

### ✔️ Attendance

- Student attendance tracking
- Teacher attendance tracking

---

## 🔥 Development Tools

- **Nodemon** - Auto-restart on file changes
- **Morgan** - HTTP request logger
- **Helmet** - Security headers
- **pg** - PostgreSQL database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

---

## 🛡️ Middleware

- **auth.js** - JWT validation + role checking
- **notFound.js** - Handles unknown routes (404)
- **errorHandler.js** - Central error handler

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start nodemon dev mode |
| `npm install` | Install dependencies |

---

## 🧪 Testing the Login (Postman)
**Admin**
**Request:**

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "admin@sams.edu.kh",
  "password": "1234"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@sams.edu.kh",
    "role": "admin"
  }
}
```

**Teacher**
**Request:**

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "chenda.keo@sams.edu.kh",
  "password": "1234"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "Keo Chenda",
    "email": "chenda.keo@sams.edu.kh",
    "role": "teacher"
  }
}
```

**Student**
**Request:**

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "vannak.sok@sams.edu.kh",
  "password": "1234"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "Sok Vannak",
    "email": "vannak.sok@sams.edu.kh",
    "role": "student"
  }
}
```
---

## 🛠️ Troubleshooting

### ❌ Login always returns "Invalid email or password"

**Check DB row:**

The hash may be wrong. Generate a new hash:

```bash
node gen-hash.js
```

### ❌ "JWT_SECRET not defined"

Add `JWT_SECRET` to your `.env` file and restart the server.

### ❌ "app is not defined"

Make sure your `app.js` contains:

```javascript
const app = express();
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Merge Request

---

## 📄 License

Private project – for SAMS development only.

---

## 👥 Authors

Phearom Chea / Year4(SE2)

## 📧 Support

For support, open an issue in the repository or contact the development team.

---

**Built with ❤️ for School Attendance Management System**