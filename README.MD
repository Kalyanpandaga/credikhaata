# CrediKhaata - Loan Management System

CrediKhaata is a backend-only Loan (Credit Sale) Management system, allowing customers to manage credit sales and track repayments. Built with **Node.js**, **Express**, and **MongoDB**, it supports secure authentication, customer and loan management, and repayment tracking.

## 🚀 Features

- User authentication using JWT
- Customer management (CRUD)
- Loan management (create, fetch by status)
- Repayment recording and history viewing
- Status handling: `PENDING`, `PAID`, `OVERDUE`
- User-scoped access: data isolation per user
- Rate limiting for security
- Basic validation and error handling

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt
- **Other:** dotenv, moment, node-cron, express-rate-limit

---

## 🔧 Setup Instructions

```bash
git clone https://github.com/Kalyanpandaga/credikhaata.git
cd credikhaata
npm install
```

Create a `.env` file in the root with:

```env
MONGO_URI=<your Mongo URL>
JWT_PRIVATE_KEY=<your JWT secret>
PORT=5000
FRONTEND_URL=<your frontend URL>
```

Start the server:

```bash
npm start
```

## 📦 Dependencies

```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "express-rate-limit": "^7.5.0",
  "jsonwebtoken": "^9.0.2",
  "moment": "^2.30.1",
  "mongoose": "^8.14.1",
  "node-cron": "^3.0.3",
  "validator": "^13.15.0"
}
```

---

## 📘 API Documentation

### 🔐 Auth Routes

#### POST `/api/signup`

Registers a new user.

- Request:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "password123",
  "role": "MERCHANT" (optional)(default MERCHANT)
}
```

- Response: `201 Created`

```json
{
  "message": "User registered successfully"
}
```

#### POST `/api/login`

Logs in a user and returns a token.

- Request:

```json
{
  "emailId": "john@example.com",
  "password": "password123"
}
```

- Response:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": "userId",
    "firstName": "John",
    "emailId": "john@example.com"
  }
}
```

---

### 👤 Customer Routes

Authenticated routes - Token required in headers.

#### POST `/api/customers`

Create a customer.

- Request:

```json
{
  "name": "Alice",
  "phoneNumber": "9876543210",
  "address": "Hyderabad",
  "trustScore": 5,
  "creditLimit": 10000
}
```

- Response: `201 Created`

#### GET `/api/customers`

Returns all customers created by the user.

#### PUT `/api/customers/:customerId`

Update customer fields.

#### DELETE `/api/customers/:customerId`

Delete a customer by ID.

---

### 💸 Loan Routes

#### POST `/api/loans`

Create a loan for a specific customer.

- Request:

```json
{
  "customerId": "<id>",
  "itemDescription": "TV on EMI",
  "loanAmount": 15000,
  "issueDate": "2024-01-01",
  "dueDate": "2024-06-01",
  "frequency": "MONTHLY",
  "interestRate": 10,
  "graceDays": 5
}
```

#### GET `/api/loans?status=PENDING|PAID|OVERDUE`

Fetch loans filtered by status (optional).

#### GET `/api/loans/summary`

Returns total loaned amount, collected, overdue, and avg repayment days.

#### GET `/api/loans/overdue`

Returns grouped overdue loan data by customer.

---

### 💰 Repayment Routes

#### POST `/api/repayments/:loanId`

Record a repayment for a loan.

- Request:

```json
{
  "amount": 5000,
  "date": "2024-04-15"
}
```

#### GET `/api/repayments/:loanId`

Returns loan repayments.
Returns repayments sorted by date in descending order. User must own the loan.

---

## 🚨 Status Rules

- Loan becomes `PAID` when repayments fully match amount.
- Loan is `OVERDUE` if dueDate passed and not yet paid.
- `node-cron` runs every night to update statuses.

---

## 🌐 Links

- GitHub: [https://github.com/Kalyanpandaga/credikhaata](https://github.com/Kalyanpandaga/credikhaata)
- Deployed URL: `https://render something` (update with actual Render link)

---

Happy Tracking 💸!
