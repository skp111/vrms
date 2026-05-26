# RentalSphere 🚗

RentalSphere is a full-stack vehicle rental management system. It features a **Spring Boot (Java)** backend and a dynamic **Angular** frontend.

This guide will walk you through exactly how to set up and run this project on your local machine.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your system:
1. **Java Development Kit (JDK 17 or higher)**
2. **Node.js & npm** (v18+ recommended)
3. **Angular CLI** (`npm install -g @angular/cli`)
4. **MySQL Server & MySQL Workbench**

---

## 💾 1. Database Setup

1. Open **MySQL Workbench**.
2. Connect to your local MySQL server.
3. Open a new SQL tab and run the following command to create the database:
   ```sql
   CREATE DATABASE rentalsphere;
   ```
4. **Important Security Step**: Go to `backend/src/main/resources/application.properties` and change the placeholder password to your **actual MySQL root password**:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
   ```
*(Note: Because `ddl-auto=update` is enabled, Spring Boot will automatically create all the necessary tables for you when it first starts!)*

---

## ⚙️ 2. Backend Setup (Spring Boot)

You can run the backend either through your IDE (like IntelliJ/VS Code) or the terminal.

**Via Terminal:**
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run the application using the Maven Wrapper:
   - On **Windows**: `.\mvnw spring-boot:run`
   - On **Mac/Linux**: `./mvnw spring-boot:run`

*The backend server will start on `http://localhost:8080`.*

---

## 🖥️ 3. Frontend Setup (Angular)

1. Open a **new** terminal (keep the backend running) and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install all the necessary dependencies (this might take a minute):
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm run start
   ```
   *(Note: You can also use `ng serve`)*

*The frontend server will start on `http://localhost:4200`.*

---

## 🚀 4. Run the Application

1. Open your web browser.
2. Navigate to: **http://localhost:4200**
3. Register a new account, or log in to an existing one, and start renting!
