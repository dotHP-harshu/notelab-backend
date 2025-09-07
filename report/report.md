## ✅ **Project Overview**

**Project Name:** NoteLab
**Stack:**

* **Backend Framework:** Express.js (v5.1.0)
* **Database:** MongoDB via Mongoose
* **Authentication:** Google OAuth2 using Passport.js
* **Storage:** Supabase Storage (for unit file uploads)
* **Session Handling:** JWT in cookies
* **File Uploads:** Multer
* **Environment Variables:** `.env` used via dotenv
* **Deployment Ready:** Partial (has hardcoded URLs)

---

## 🧩 Project Structure Breakdown

```
dothp-harshu-notelab-backend/
│
├── index.js                         # Entry point
├── package.json                    # Dependencies & scripts
│
├── config/                         # Config files (DB, OAuth, Supabase)
│   ├── db.js
│   ├── google-auth.js
│   └── supabase.js
│
├── controllers/                    # Business logic
│   ├── auth.js
│   ├── bookmark.js
│   ├── subject.js
│   ├── unit.js
│   └── user.js
│
├── middleware/
│   └── auth.js                     # JWT-based Auth middleware
│
├── models/                         # Mongoose Schemas
│   ├── bookmark.model.js
│   ├── subject.model.js
│   ├── unit.model.js
│   └── user.model.js
│
├── routes/                         # Express Routers
│   ├── auth.routes.js
│   ├── bookmark.routes.js
│   ├── subject.routes.js
│   └── unit.routes.js
│
└── utils/
    └── response.js                # Custom success/error response formatters
```

---

## 🔒 Authentication & Security

### ✔ Auth Flow:

* Google OAuth with `passport-google-oauth20`
* JWT generated on login and stored in `cookies`
* `authMiddleware` checks token and attaches user to request

### ⚠ Observations:

* `authMiddleware` is used properly on most protected routes
* `getUser` uses `req.userId.id`, which assumes `jwt.sign({ id: ... })` – this is fine, but slightly fragile.

### 🔐 Recommendations:

* Sanitize & validate all input (`express-validator` or `zod`)
* Add rate limiting to auth/login routes (`express-rate-limit`)
* Implement CSRF protection (especially if using cookies)

---

## 📂 Database & Models (MongoDB)

### Models:

* **User:** Google-based, role-based (`default: student`)
* **Subject:** Contains `title`, `description`, `tags`, `keywords`, and image
* **Unit:** Belongs to subject; stores Supabase `filePath`
* **Bookmark:** Connects `userId` + `subjectId`

### ⚠ Observations:

* Clean schema design.
* Missing indexes: you can index `tags`, `keywords` for better search.
* No validation/schema constraints (`required`, `minLength`, etc.).

---

## 📁 File Uploads (Subjects + Units)

* **Subjects:** Image is stored as base64 in MongoDB (not optimal for large scale)
* **Units:** Uploaded to Supabase Storage using `subjectId/file.name` pathing
* **Signed URLs** used to access files (valid for 120 seconds)

### 🔄 Suggestions:

* **Store subject images in Supabase too** instead of base64 in DB
* Use `uuid` filenames to prevent collisions in Supabase

---

## 🔍 Subject Search Logic

```js
const searchQuery = {
  $or: [
    { title: { $regex: query, $options: "i" } },
    { tags: { $regex: query, $options: "i" } },
    { keywords: { $regex: query, $options: "i" } },
  ],
};
```

✔ Works well
⚠ **But inefficient for large data** without indexes and full-text search.
✅ Consider using MongoDB's **\$text** search with proper indexing.

---

## ⚙ API Design Quality

### 🔹 Strengths:

* Pagination included (`page`, `limit`) in most routes
* Response format is consistent using `sendSuccess` / `sendError`
* Clean REST structure for resources

### 🔸 Weaknesses:

* Some missing status checks, e.g.:

  * `updateSubject` does not check if new values exist before update
  * `deleteUnit` logs error instead of responding properly
* Response objects could benefit from **standard HTTP status codes** and not hardcoded strings

---

## 🔧 Config & Environment

### `.env` (expected keys):

```env
MONGODB_URI=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
SUPABASE_KEY=...
CLIENT_URL=http://localhost:5173
```

### Improvements:

* Hardcoded callback URL and client origin – **make dynamic using env**
* No fallback or logging setup (consider using `winston` or `pino`)

---

## 🚀 Deployment Readiness

### ✅ What's ready:

* MongoDB connection via `MONGODB_URI`
* Express app with port 3000
* Supabase client initialized via env key
* Google OAuth integrated

### ❌ What needs work:

* Hardcoded `localhost` URLs in:

  * Google OAuth callback
  * CORS origin
  * Redirect URLs

```js
callbackURL: "http://localhost:3000/auth/google/callback",
origin: "http://localhost:5173"
```

✅ Make these dynamic using env:

```js
callbackURL: `${process.env.API_BASE}/auth/google/callback`
origin: process.env.CLIENT_URL
```

---

## 🛠 Suggested Enhancements

| Area                   | Suggestion                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| **Validation**         | Use `Joi`, `Zod`, or `express-validator` to validate request payloads |
| **Rate Limiting**      | Add `express-rate-limit` to login and sensitive routes                |
| **Logging**            | Use `winston` or `pino` instead of `console.log()`                    |
| **Error Tracking**     | Integrate with Sentry or similar tool                                 |
| **Testing**            | Add Jest tests for controllers and routes                             |
| **Environment Config** | Create `.env.example` file for easier setup                           |
| **File Uploads**       | Move all file storage to Supabase instead of MongoDB base64           |
| **API Docs**           | Add Swagger or Postman collection for API docs                        |

---

## 📌 Overall Evaluation

| Category             | Rating (⭐ out of 5)                      |
| -------------------- | ---------------------------------------- |
| Project Structure    | ⭐⭐⭐⭐☆ (Clean & Modular)                  |
| Auth Implementation  | ⭐⭐⭐⭐☆ (JWT + Google OAuth)               |
| File Handling        | ⭐⭐⭐☆☆ (Split b/w MongoDB + Supabase)     |
| API Quality          | ⭐⭐⭐⭐☆ (Pagination + Modularity)          |
| Security Practices   | ⭐⭐⭐☆☆ (Needs validation & rate-limiting) |
| Deployment Readiness | ⭐⭐⭐☆☆ (Hardcoded URLs)                   |
| Maintainability      | ⭐⭐⭐⭐☆ (Good separation of concerns)      |

---

## 📁 Final Suggestions for Production Readiness

* ✅ Add `.env.example` with all required keys
* ✅ Move all static assets (images, files) to Supabase
* ✅ Replace all hardcoded URLs with `process.env.*`
* ✅ Add `helmet`, `rate-limit`, `logger` middlewares
* ✅ Add Dockerfile + Deployment script (if going cloud)

---
