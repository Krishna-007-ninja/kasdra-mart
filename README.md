# KasdraMart - MERN E-Commerce Platform

KasdraMart is a full-stack E-Commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
The project is designed with scalability, security, and production-level structure in mind.

---

# Tech Stack

## Frontend
- React.js (Vite)
- Tailwind CSS
- Context API

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication & Security
- JWT Authentication
- bcryptjs Password Hashing
- Express Rate Limiting
- CORS Protection
- Environment Variables

---

# Features

- User Authentication & Authorization
- Admin Dashboard
- Product Management
- Shopping Cart System
- Product Search & Filtering
- Product Reviews & Ratings
- Order Management
- Delivery Status Tracking
- Responsive UI for Mobile & Desktop
- Cloud Image Upload Support
- Secure REST API
- Production Deployment Ready

---

# Project Structure

```bash
E-CART/
│
├── client/                 # Frontend React Application
│   ├── public/
│   ├── src/
│   └── ...
│
├── server/                 # Backend Express Application
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── ...
│
├── .gitignore
├── README.md
└── PROJECT_DOCUMENT.md

Installation & Setup
1. Clone Repository
git clone YOUR_GITHUB_REPOSITORY_LINK
cd E-CART
Backend Setup
Navigate to Server Folder
cd server
Install Dependencies
npm install
Create .env File

Create a .env file inside the server folder.

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
Start Backend Server
npm run dev

or

node server.js
Frontend Setup
Navigate to Client Folder
cd client
Install Dependencies
npm install
Create .env File

Create a .env file inside the client folder.

VITE_API_URL=http://localhost:5000
Start Frontend
npm run dev
Database Seeder (Optional)

To import demo data into MongoDB:

npm run data:import

To destroy demo data:

npm run data:destroy

Seeder creates demo users and products for testing purposes only.

Recommended Backend Scripts
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "data:import": "node seeder.js",
  "data:destroy": "node seeder.js -d"
}

Deployment
Frontend Deployment
Vercel
Backend Deployment
Render
Database
MongoDB Atlas
Media Storage
Cloudinary

Security Practices
Sensitive credentials are stored using environment variables
Passwords are hashed using bcryptjs
API access protected with JWT Authentication
CORS configured for frontend domain restriction
Rate limiting added to prevent abuse
Future Improvements
Payment Gateway Integration
Real-Time Order Tracking
Wishlist Feature
Redis Caching
Advanced Analytics Dashboard
AI-Based Product Recommendation
Author

Developed by Krishna Kumar