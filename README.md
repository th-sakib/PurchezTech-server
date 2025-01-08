# PurchezTech Server

## Overview

The PurchezTech Server is the backend component for PurchezTech, an e-commerce platform specializing in selling electrical devices. This server manages core functionalities such as:

- User authentication
- Product management
- Order processing
- Payments
- Ensuring a seamless shopping experience

## Features

- **User Authentication**: Secure login and signup using JSON Web Tokens (JWT) and password hashing with bcrypt.
- **Product Management**: Efficient handling of product data, including creation, updates, and retrieval.
- **Order Management**: Smooth processing of orders and tracking.
- **Payment Integration**: Integrated payment handling via SSLCommerz.
- **Cloudinary Integration**: Product image management and storage.
- **Validation**: Strong data validation using Zod.

---

## Prerequisites

Ensure the following tools are installed on your system:

- **Node.js** (>=16.x)
- **Yarn** (for dependency management)

To install Yarn globally, run:

```bash
npm install --global yarn
```

---

## Installation and Setup

Follow these steps to set up and run the server locally:

### 1. Clone the Repository

```bash
git clone git@github.com:th-sakib/PurchezTech-server.git
cd PurchezTech-server
```

### 2. Install Dependencies

Use Yarn to install all dependencies:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
SSL_COMMERZ_STORE_ID=your_store_id
SSL_COMMERZ_STORE_PASSWORD=your_store_password
```

### 4. Start the Server

- For production:
  ```bash
  yarn start
  ```
- For development with live reload (using nodemon):
  ```bash
  yarn dev
  ```

---

## Project Structure

```
PurchezTech-server/
├── src/
│   ├── index.js       # Entry point of the application
│   ├── routes/        # API route handlers
│   ├── controllers/   # Logic for handling requests
│   ├── models/        # Mongoose models
│   ├── middlewares/   # Custom middleware
├── .env                # Environment variables (not included in repo)
├── package.json        # Project metadata and scripts
```

---

## Available Scripts

- **`yarn start`**: Runs the server in production mode.
- **`yarn dev`**: Runs the server in development mode with live reload.

---

## Dependencies

Key dependencies used in this project:

- **[Express](https://expressjs.com/)**: For creating RESTful APIs.
- **[Mongoose](https://mongoosejs.com/)**: For MongoDB interactions.
- **[JWT](https://jwt.io/)**: For secure user authentication.
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)**: For password hashing.
- **[Cloudinary](https://cloudinary.com/)**: For image storage and management.
- **[SSLCommerz](https://developer.sslcommerz.com/)**: For payment processing.

---

## Useful Links

- Live Link: [purchezTech](https://purcheztech.onrender.com)

- Client repo: [purchezTech-client](https://github.com/th-sakib/PurchezTech)

- server repo: [purchezTech-server](https://github.com/th-sakib/PurchezTech-server)

---

## Author

**TH Sakib**

- GitHub: [@th-sakib](https://github.com/th-sakib)
