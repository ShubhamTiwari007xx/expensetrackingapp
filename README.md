# Expense Tracking App

A full-stack expense tracking application built with Express, Prisma ORM, PostgreSQL/Supabase, JWT authentication, and Tailwind CSS.

## Features

- User registration, login, and logout
- Password hashing with bcrypt
- JWT authentication using HTTP-only cookies
- Authorization header fallback for API clients
- Add, view, and delete personal expenses
- User-specific expense access control
- Prisma ORM with PostgreSQL/Supabase
- Tailwind CSS frontend assets

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / Supabase
- JWT
- bcrypt
- Tailwind CSS

## Project Structure

```text
.
|-- db.js
|-- server.js
|-- prisma/
|   `-- schema.prisma
|-- public/
|   |-- index.html
|   |-- output.css
|   `-- script.js
`-- src/
    |-- controllers/
    |   |-- auth.js
    |   `-- expenses.js
    |-- middleware/
    |   `-- authTokenChecker.js
    |-- routes/
    |   |-- authRuth.js
    |   `-- expense.js
    `-- input.css
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShubhamTiwari007xx/expensetrackingapp.git
cd expensetrackingapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_or_supabase_connection_string"
JWT_SECRET="your_jwt_secret"
NODE_ENV="development"
```

### 4. Set up Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Push the schema to your database:

```bash
npx prisma db push
```

### 5. Run the app

```bash
npm run dev
```

The server runs at:

```text
http://localhost:5000
```

## Available Scripts

```bash
npm run dev
```

Runs the Express server with Nodemon and watches Tailwind CSS.

```bash
npm run build:css
```

Builds Tailwind CSS from `src/input.css` into `public/output.css`.

```bash
npm run watch:css
```

Watches Tailwind CSS and rebuilds on changes.

## API Routes

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in an existing user |
| POST | `/auth/logout` | Log out the current user |

### Expenses

These routes require authentication through the `token` cookie or an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/expenses` | Get expenses for the logged-in user |
| POST | `/expenses` | Create a new expense |
| DELETE | `/expenses/:id` | Delete one of the logged-in user's expenses |

## Example Requests

### Register

```json
{
  "username": "shubham",
  "email": "shubham@example.com",
  "password": "password123"
}
```

### Create Expense

```json
{
  "title": "Groceries",
  "amount": 500,
  "category": "Food"
}
```

## Database Models

The app uses two main Prisma models:

- `User`: stores username, email, hashed password, and related expenses
- `Expense`: stores title, amount, category, timestamp, and owner user ID
- stores amounts by adding them

## Notes

- Do not commit your `.env` file.
- For production, update cookie security settings to use secure cookies over HTTPS.
- The default server port is `5000`.
