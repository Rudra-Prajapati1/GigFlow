# GigFlow API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the following header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user. Always creates a **Sales** role by default.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name` — required
- `email` — must be valid email format
- `password` — minimum 6 characters

**Success Response — 201:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  }
}
```

**Error Response — 400:**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Valid email is required",
      "path": "email"
    }
  ]
}
```

**Error Response — 400 (duplicate email):**

```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### POST /auth/login

Login with existing credentials and receive a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response — 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  }
}
```

**Error Response — 401:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### GET /auth/me

Get the currently authenticated user's details.

🔒 **Protected — requires token**

**Success Response — 200:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Lead Endpoints

All lead endpoints are 🔒 **Protected — require token**.

---

### GET /leads

Get a paginated list of leads with optional filters.

**Admin** sees all leads. **Sales** users see only their own leads.

**Query Parameters:**

| Parameter | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| status    | string | No       | Filter by status: `new`, `contacted`, `qualified`, `lost` |
| source    | string | No       | Filter by source: `website`, `instagram`, `referral`      |
| search    | string | No       | Search by name or email (case-insensitive)                |
| sort      | string | No       | `latest` (default) or `oldest`                            |
| page      | number | No       | Page number, default `1`                                  |
| limit     | number | No       | Results per page, default `10`                            |

**Example Request:**

```
GET /api/leads?status=qualified&source=instagram&search=Rahul&sort=latest&page=1
```

**Success Response — 200:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc123...",
      "name": "Rahul Shah",
      "email": "rahul@example.com",
      "status": "qualified",
      "source": "instagram",
      "createdBy": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### GET /leads/:id

Get a single lead by its ID.

**Sales** users can only access their own leads.

**Success Response — 200:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "Rahul Shah",
    "email": "rahul@example.com",
    "status": "qualified",
    "source": "instagram",
    "createdBy": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Response — 404:**

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### POST /leads

Create a new lead.

**Request Body:**

```json
{
  "name": "Rahul Shah",
  "email": "rahul@example.com",
  "status": "new",
  "source": "instagram"
}
```

**Validation Rules:**

- `name` — required
- `email` — must be valid email format
- `status` — optional, must be one of: `new`, `contacted`, `qualified`, `lost` (defaults to `new`)
- `source` — required, must be one of: `website`, `instagram`, `referral`

**Success Response — 201:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "Rahul Shah",
    "email": "rahul@example.com",
    "status": "new",
    "source": "instagram",
    "createdBy": "64def456...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT /leads/:id

Update an existing lead.

**Sales** users can only update their own leads.

**Request Body (all fields optional):**

```json
{
  "name": "Rahul Shah",
  "email": "rahul@example.com",
  "status": "contacted",
  "source": "referral"
}
```

**Success Response — 200:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "Rahul Shah",
    "email": "rahul@example.com",
    "status": "contacted",
    "source": "referral",
    "createdBy": "64def456...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### DELETE /leads/:id

Delete a lead permanently.

🔒 **Admin only**

**Success Response — 200:**

```json
{
  "success": true,
  "message": "Lead deleted"
}
```

**Error Response — 403 (non-admin):**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

### GET /leads/export

Download all visible leads as a CSV file.

**Admin** exports all leads. **Sales** users export only their own leads.

**Response:** `text/csv` file download with filename `leads.csv`

**CSV Columns:**

```
Name, Email, Status, Source, Created At
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human readable error message"
}
```

Validation errors from express-validator follow this format:

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| 200  | Success                                   |
| 201  | Resource Created                          |
| 400  | Bad Request / Validation Error            |
| 401  | Unauthorized — missing or invalid token   |
| 403  | Forbidden — insufficient role permissions |
| 404  | Resource Not Found                        |
| 500  | Internal Server Error                     |

---

## Role Permissions Summary

| Endpoint            | Admin        | Sales             |
| ------------------- | ------------ | ----------------- |
| POST /auth/register | ✅           | ✅                |
| POST /auth/login    | ✅           | ✅                |
| GET /auth/me        | ✅           | ✅                |
| GET /leads          | ✅ All leads | ✅ Own leads only |
| GET /leads/:id      | ✅ Any lead  | ✅ Own leads only |
| POST /leads         | ✅           | ✅                |
| PUT /leads/:id      | ✅ Any lead  | ✅ Own leads only |
| DELETE /leads/:id   | ✅           | ❌ 403            |
| GET /leads/export   | ✅ All leads | ✅ Own leads only |
