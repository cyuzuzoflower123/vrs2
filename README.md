# Swift Wheels Rental

Black and white vehicle reservation/rental system built with React Vite, Tailwind CSS, Node.js, Express, Express Session, and raw MySQL SQL.

## Features

- Customer signup and login
- Session based authentication
- Customer dashboard for creating and viewing reservations
- Admin dashboard for managing vehicles, customers, and reservations
- Admin report page for customer rental and payment details
- Raw SQL queries with `mysql2`
- XAMPP/phpMyAdmin ready database script
- Simple readable code structure

## Requirements

- Node.js 18+
- XAMPP with MySQL running
- phpMyAdmin

## 1. Create Database

Open phpMyAdmin, go to the SQL tab, paste everything from:

```text
database/swift_wheels.sql
```

Then click **Go**.

If you already imported an older version and want to keep existing data, run this extra SQL file once:

```text
database/add_report_fields_if_database_exists.sql
```

Default admin account:

```text
username: admin
password: admin123
```

## 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

If your XAMPP MySQL uses a password, update `backend/.env`.

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## App Rules

- A customer must sign up first.
- After login, customers can only access the reservation pages.
- Admin can access customers, vehicles, and all reservations.
- Each reservation belongs to one customer.
- Each reservation uses one vehicle.
- A vehicle can be reserved many times.
