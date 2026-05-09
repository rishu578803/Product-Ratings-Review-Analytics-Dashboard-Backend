# Product Ratings & Review Analytics Dashboard - Backend

A RESTful backend API built with **Node.js**, **Express.js**, and **PostgreSQL** for managing product data, importing CSV/Excel files, and powering a Product Ratings & Review Analytics Dashboard.

---

## 🚀 Features

- RESTful APIs using Node.js + Express.js
- PostgreSQL database integration
- Upload product data using **CSV / Excel**
- Store imported records in database
- Product analytics & statistics APIs
- Upload history tracking
- Data clear/reset API
- File validation & error handling
- Scalable MVC folder structure

---

## 📦 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize / pg (if used)
- Multer (file upload)
- CSV / XLSX Parser
- dotenv

---

## 📁 Project Setup

### Clone Repository

git clone https://github.com/yourusername/product-analytics-backend.git

cd product-analytics-backend

---

## 📥 Install Dependencies

npm install

---

## 🔐 Environment Variables

Create `.env` file in root directory:

```env id="w7a1dx"
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_dashboard
DB_USER=postgres
DB_PASSWORD=password

