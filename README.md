# HR Management System - Bugbusters

This is a Human Resources (HR) Management System built with **Node.js and React**.  
The system includes three main roles: **Admin**, **Manager**, and **Employee**, and supports typical HR operations like leave requests, expense tracking, and user role management.

---

## Roles & Permissions

#### Admin
- Create and manage **Managers** and **Companies**
- Update manager and company information

#### Manager
- View and manage their **Employees**
- Approve or reject:
  - **Leave Requests**
  - **Expense Requests**
- Add employees to the company. Upon creation, employees receive an email to set their password and log in.

#### Employee
- Submit **Leave Requests**
- Submit **Expense Requests** for approval

---

## Technologies Used

- **Node.js**
- **Typescript**
- **Prisma ORM**
- **PostgreSQL**
- **React**


---

## Running on your Local

### Start the Database with Docker

You can use the provided `docker-compose.yml` file on hr-management-api folder to start the database locally:

```bash
docker-compose up -d
```

This will spin up an PostgreSQL Server container.

### Seed Mock Data

Using seed.ts in hr-management-api/prisma to seed mock data:

```bash
cd ../hr-management-api
npm run prisma:seed
```

This will populate the database with initial data, and you can use the seeded credentials to log in.

#### You can run this project:
For api server:
```bash
cd ../hr-management-api
npm run dev
```
For frontend:
```bash
cd ../../hr-management-ui
npm run dev
```


### 🔐 Default Login Credentials (From Mock Data)

Here are example credentials you can use to log in after seeding the database:


| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@busbusters.com      | password     |
| Manager  | manager@example.com    | password   |
| Employee | employee1@example.com   | password  |



You can navigate three different roles and more than 12 designed pages and explore features.