# 🛒 MERN E-Commerce Project

A full-stack e-commerce web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features include user authentication with **JWT** and **bcrypt**, product browsing, add to cart, address management, and order placement.

---

## 🔗 Repository

```bash
git clone https://github.com/Manvendra-2006/mern-ecommerce-project.git
```

---

## 📁 Project Structure

```
mern-ecommerce-project/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js       # Signup & Login logic
│   │   ├── cartController.js       # Add to Cart logic
│   │   ├── addressController.js    # Address CRUD operations
│   │   └── orderController.js      # Place Order logic
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT token verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Address.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── addressRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Home.jsx
        │   ├── Cart.jsx
        │   ├── Address.jsx
        │   └── OrderSuccess.jsx
        ├── components/
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Frontend       | React.js                       |
| Backend        | Node.js + Express.js           |
| Database       | MongoDB (Mongoose ODM)         |
| Authentication | JWT (JSON Web Token)           |
| Encryption     | bcrypt (password hashing)      |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) >= 18.x
- [MongoDB](https://www.mongodb.com/) running locally
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/Manvendra-2006/mern-ecommerce-project.git
cd mern-ecommerce-project
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder and add the following:

```env
PORT=8900
MONGO_URI=mongodb://localhost:27017/WebsiteData
JWT_SECRET=MYJWTSECRETKEY123
BCRYPT_SALT_ROUNDS=10
```

Start the backend server:

```bash
npm run dev
```

The backend will run at: `http://localhost:PORT`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at: `'/api`

---

## 🗄️ Database

- **MongoDB URL:** `mongodb_URL`
- **Database Name:** `Database_name`
- **ODM:** Mongoose

Make sure your local MongoDB service is running before starting the backend:

```bash
# On Windows
net start MongoDB

# On macOS / Linux
sudo systemctl start mongod
```

---

## 🔐 Authentication — JWT & bcrypt

### How it works

1. When a user **signs up**, their password is hashed using `bcrypt` before being saved to the database.
2. When a user **logs in**, the entered password is compared with the stored hash using `bcrypt.compare()`.
3. On a successful login, a **JWT token** is generated and sent to the client.
4. The client stores the token and sends it in the `Authorization` header for all protected requests.
5. The **auth middleware** verifies the JWT token on every protected route before allowing access.

---

### JWT Middleware

```js
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
```

---

## 📡 API Endpoints

### 🔑 Auth Routes — `/api/auth`

| Method | Endpoint   | Description              | Auth Required |
|--------|------------|--------------------------|---------------|
| POST   | `/signup`  | Register a new user      | ❌            |
| POST   | `/login`   | Login and receive token  | ❌            |

**Signup Request Body:**
```json
{
  "name": "Manvendra",
  "email": "manvendra@example.com",
  "password": "securepassword123"
}
```

**Signup Response:**
```json
{
  "message": "User registered successfully",
  "token": "<jwt_token>"
}
```

**Login Request Body:**
```json
{
  "email": "manvendra@example.com",
  "password": "securepassword123"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>"
}
```

---

### 🛒 Cart Routes — `/api/cart`

| Method | Endpoint       | Description                   | Auth Required |
|--------|----------------|-------------------------------|---------------|
| GET    | `/`            | Get the logged-in user's cart | ✅            |
| POST   | `/add`         | Add a product to the cart     | ✅            |
| PUT    | `/update/:id`  | Update item quantity in cart  | ✅            |
| DELETE | `/remove/:id`  | Remove an item from the cart  | ✅            |

**Add to Cart Request Body:**
```json
{
  "productId": "64abc123def456",
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "Product added to cart successfully",
  "cart": {}
}
```

---

### 📍 Address Routes — `/api/address`

| Method | Endpoint | Description              | Auth Required |
|--------|----------|--------------------------|---------------|
| GET    | `/`      | Get all saved addresses  | ✅            |
| POST   | `/add`   | Add a new address        | ✅            |
| PUT    | `/:id`   | Update an existing address | ✅          |
| DELETE | `/:id`   | Delete an address        | ✅            |

**Add Address Request Body:**
```json
{
  "fullName": "Manvendra Singh",
  "phone": "9876543210",
  "street": "123, MG Road",
  "city": "Raipur",
  "state": "Chhattisgarh",
  "pincode": "492001",
  "country": "India"
}
```

---

### 🧾 Order Routes — `/api/order`

| Method | Endpoint      | Description                    | Auth Required |
|--------|---------------|--------------------------------|---------------|
| POST   | `/place`      | Place a new order              | ✅            |
| GET    | `/my-orders`  | Get all orders of the user     | ✅            |
| GET    | `/:id`        | Get details of a specific order | ✅           |

**Place Order Request Body:**
```json
{
  "addressId": "64addr789xyz",
  "paymentMethod": "COD",
  "cartItems": [
    { "productId": "64abc123def456", "quantity": 2, "price": 499 }
  ],
  "totalAmount": 998
}
```

**Place Order Response:**
```json
{
  "message": "Order placed successfully!",
  "orderId": "ORD-20240315-001",
  "status": "Confirmed"
}
```

---

## 🗃️ Database Models

### User Model
```js
{
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,     // Hashed with bcrypt
  createdAt: { type: Date, default: Date.now }
}
```

### Product Model
```js
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number
}
```

### Cart Model
```js
{
  userId: { type: ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ]
}
```

### Address Model
```js
{
  userId: { type: ObjectId, ref: 'User' },
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: String
}
```

### Order Model
```js
{
  userId: { type: ObjectId, ref: 'User' },
  items: Array,
  addressId: { type: ObjectId, ref: 'Address' },
  totalAmount: Number,
  paymentMethod: String,
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🔒 Security Features

| Feature               | Implementation                                      |
|-----------------------|-----------------------------------------------------|
| Password Hashing      | `bcrypt` with configurable salt rounds via `.env`   |
| Token Authentication  | JWT Bearer token sent in `Authorization` header     |
| Protected Routes      | Auth middleware validates token on every request    |
| Token Expiry          | JWT expires in 7 days (`expiresIn: '7d'`)           |
| Environment Secrets   | All sensitive data stored securely in `.env` file   |

---

## 📦 Dependencies

### Backend

```json
{
  "express": "^4.18.x",
  "mongoose": "^8.x.x",
  "bcryptjs": "^2.4.x",
  "jsonwebtoken": "^9.x.x",
  "dotenv": "^16.x.x",
  "cors": "^2.8.x"
}
```

### Dev Dependencies

```json
{
  "nodemon": "^3.x.x"
}
```

### Frontend

```json
{
  "react": "^18.x.x",
  "react-dom": "^18.x.x",
  "react-router-dom": "^6.x.x",
  "axios": "^1.x.x"
}
```

---

## 🧪 Testing the API

Use **Postman** or **Thunder Client** (VS Code extension) to test all API endpoints.

**Step 1:** Register a new user
```
POST http://localhost:PORT/api/auth/signup
```

**Step 2:** Login and copy the JWT token from the response
```
POST http://localhost:PORT/api/auth/login
```

**Step 3:** Add the token to all protected route requests as a header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🌐 Environment Variables Reference

| Variable             | Description                        | Value                                   |
|----------------------|------------------------------------|-----------------------------------------|
| `PORT`               | Backend server port                | `PORT`                                  |
| `MONGO_URI`          | MongoDB connection string          | `mongodb_URL` |
| `JWT_SECRET`         | Secret key for signing JWT tokens  | `MYJWTSECRETKEY123`                     |
| `BCRYPT_SALT_ROUNDS` | Number of salt rounds for bcrypt   | `10`                                    |

---

## 📌 Future Enhancements

- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Product search and filter functionality
- [ ] Order tracking with real-time status updates
- [ ] Admin dashboard for managing products and orders
- [ ] Email notifications on order placement
- [ ] Product reviews and star ratings
- [ ] Wishlist feature
- [ ] Coupon and discount code system

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add: your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request on GitHub

---

## 👤 Author

**Manvendra**
- GitHub: [@Manvendra-2006](https://github.com/Manvendra-2006)
- Repository: [mern-ecommerce-project](https://github.com/Manvendra-2006/mern-ecommerce-project)


> Built with ❤️ using the MERN Stack — MongoDB · Express.js · React.js · Node.js
