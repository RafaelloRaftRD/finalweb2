# Coffee Shop API

## Overview
A backend application for managing a coffee shop. It allows you to manage products, orders, and users.

## Setup and Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file and add the necessary variables (MONGO_URI, PORT).
4. Start the server: `node server.js`

## API Documentation
### Auth
- `POST /api/auth/register` — Registration (Public)
- `POST /api/auth/login` — Login (Public)

### Products
- `GET /api/products` — Get all products (Public)
- `POST /api/products` — Add product (Private/Admin)

### Orders
- `POST /api/orders` — Create order (Private)