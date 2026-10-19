# Apna Store — MERN Stack E-Commerce Application

A full-stack e-commerce web application built using the MERN stack, designed to provide a smooth shopping experience for customers and product/order management capabilities for administrators.

Apna Store includes customer-facing pages for browsing products, viewing product details, managing the shopping cart, completing checkout, and tracking orders. It also provides an admin section for managing products and orders.

> **Project status:** Update the repository URL, environment variables, available scripts, and API endpoints below to match the final implementation before publishing this README.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Application Routes](#application-routes)
- [API Documentation](#api-documentation)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database](#database)
- [Error Handling and Troubleshooting](#error-handling-and-troubleshooting)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

**Apna Store** is a full-stack e-commerce project developed to demonstrate practical web application development using React.js, Node.js, Express.js, and MongoDB.

The application separates the customer shopping experience from administrative functionality. The frontend communicates with the backend through HTTP APIs, while the backend handles application logic, authentication, order processing, and database operations.

### Project objectives

- Build a responsive and user-friendly shopping interface.
- Organize frontend functionality into reusable React components and pages.
- Integrate the frontend with backend REST APIs.
- Implement user authentication and role-based access where configured.
- Support product, cart, checkout, and order workflows.
- Provide an administrative interface for managing store data.
- Maintain a clear and modular full-stack project structure.

---

## Features

### Customer Features

- **Home page:** Customer-facing landing page.
- **User authentication:** Login and signup pages.
- **Product details:** View information about individual products.
- **Shopping cart:** Access and manage cart items.
- **Checkout address:** Enter or select delivery details.
- **Checkout:** Continue through the order checkout workflow.
- **Order confirmation:** Display the order success page.
- **My Orders:** View previous orders and their available status or tracking information.
- **Navigation:** Navigate between customer-facing pages through the shared navbar.
- **Notifications:** Display application feedback using React Toastify.

### Admin Features

- **Admin dashboard:** Access the administrative section.
- **Product listing:** View products in the admin interface.
- **Add product:** Access the product creation form.
- **Edit product:** Update existing product information.
- **Order management:** Access the administrative orders page.

### Technical Features

- Component-based frontend architecture using React.
- Client-side navigation using React Router.
- REST API integration.
- Backend application logic using Node.js and Express.js.
- MongoDB database integration, if configured in the backend.
- Authentication and role-based authorization support.
- Centralized frontend layout for customer pages.
- Separate admin layout and routes.
- API error handling and user notifications.

> Feature availability depends on the final implementation. Update this list if any feature is incomplete or not enabled in the current version.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Programming language | JavaScript |
| Routing | React Router DOM |
| API communication | Axios or the configured API client |
| Notifications | React Toastify |
| Backend | Node.js |
| Backend framework | Express.js |
| Database | MongoDB |
| Database integration | Mongoose, if used by the backend |
| Authentication | JWT, if enabled in the backend |
| Version control | Git and GitHub |

---

## Application Architecture

The application follows a client-server architecture.

```text
Customer / Admin
       |
       v
React.js Frontend
       |
       | HTTP Requests / REST APIs
       v
Node.js + Express.js Backend
       |
       v
MongoDB Database
```

### Request flow

1. The user interacts with a React page or component.
2. The frontend sends an HTTP request to the relevant backend API.
3. The Express.js backend validates the request and executes the required application logic.
4. The backend reads or updates database records when necessary.
5. The backend returns a response to the frontend.
6. The frontend updates the UI and displays the result to the user.

---

## Project Structure

The frontend paths below reflect the current application structure. The backend tree is a suggested representation; confirm its actual filenames and folder names in your repository before publishing.

```text
apna-store/
│
├── frontend/
│   └── mern/
│       ├── public/
│       │
│       ├── src/
│       │   ├── Admin/
│       │   │   ├── AdminLayout.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── ProductList.jsx
│       │   │   ├── AddProduct.jsx
│       │   │   ├── EditProduct.jsx
│       │   │   └── Orders.jsx
│       │   │
│       │   ├── Components/
│       │   │   ├── Header.jsx
│       │   │   └── Cart.jsx
│       │   │
│       │   ├── Pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Signup.jsx
│       │   │   ├── ProductDetails.jsx
│       │   │   ├── CheckOutAddress.jsx
│       │   │   ├── CheckOut.jsx
│       │   │   ├── OrderSuccess.jsx
│       │   │   └── MyOrders.jsx
│       │   │
│       │   ├── App.jsx
│       │   └── ...
│       │
│       ├── package.json
│       └── ...
│
├── backend/                  # Confirm actual folder name
│   ├── routes/                # If present
│   ├── controllers/            # If present
│   ├── models/                 # If present
│   ├── middleware/             # If present
│   ├── config/                 # If present
│   ├── server.js               # Confirm actual entry point
│   ├── package.json
│   └── .env                    # Create locally; do not commit
│
├── .gitignore
└── README.md
```

### Frontend directory

**`frontend/mern/src/Admin/`**

Contains the administrative layout, dashboard, product listing, product creation/editing pages, and orders page.

**`frontend/mern/src/Components/`**

Contains shared UI components, including the customer navigation header and shopping cart component.

**`frontend/mern/src/Pages/`**

Contains customer-facing pages for authentication, product details, checkout, order confirmation, and order history.

**`frontend/mern/src/App.jsx`**

Configures application routing. Customer routes use a shared layout containing the navbar, while admin routes use a separate admin layout.

**Backend directory**

The backend is responsible for API endpoints, business logic, database operations, and authentication. The exact file organization should reflect the actual backend implementation.

---

## Prerequisites

Install the following tools before running the application.

- **Node.js:** Use a version compatible with the project's dependencies. An active LTS release is generally recommended.
- **npm:** Included with Node.js.
- **Git:** Required to clone the repository.
- **MongoDB:** A local MongoDB server or a MongoDB Atlas database, if the backend uses MongoDB.
- **Code editor:** Visual Studio Code or another editor of your choice.

Verify your installations:

```bash
node --version
npm --version
git --version
```

---

## Getting Started

Follow these steps to download and run the project locally.

### 1. Clone the repository

Open a terminal and run:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the actual HTTPS or SSH URL of your GitHub repository.

For example, the command should use the URL copied from your repository's **Code** menu.

### 2. Navigate into the project

```bash
cd <YOUR_REPOSITORY_FOLDER>
```

Replace the placeholder with the folder created by Git when the repository is cloned.

### 3. Install frontend dependencies

```bash
cd frontend/mern
npm install
```

This installs the dependencies declared in the frontend's `package.json`.

### 4. Install backend dependencies

Open another terminal from the project root and navigate to the actual backend folder.

If the backend directory is named `backend`, run:

```bash
cd backend
npm install
```

If your backend uses a different directory name, replace `backend` with that directory.

### 5. Configure environment variables

Create a local `.env` file in the backend directory and add the variables required by your backend configuration.

A common example is shown in the [Environment Configuration](#environment-configuration) section. The variable names must match those actually read by your code.

### 6. Start MongoDB

If the backend uses MongoDB, ensure your local MongoDB service is running or that your Atlas connection string is valid and accessible.

### 7. Start the backend

Use the script configured in the backend's `package.json`.

For example, if the project defines a `dev` script:

```bash
npm run dev
```

If it defines a `start` script instead:

```bash
npm start
```

Run the command from the backend directory.

### 8. Start the frontend

Open another terminal and run:

```bash
cd frontend/mern
npm run dev
```

The command above applies if the frontend defines a `dev` script, as many Vite-based projects do. Otherwise, use the appropriate script from its `package.json`.

Open the local URL printed in the terminal to access the application.

---

## Environment Configuration

Environment variables keep local configuration and secrets outside the source code.

### Backend `.env`

Create a `.env` file in the backend directory.

Example template:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/apna_store
JWT_SECRET=replace_with_a_long_random_secret
```

**Important:** This is a template, not a verified list of your application's exact variable names. Check your backend source code for the variables it reads. For example, your implementation may use `MONGODB_URI` instead of `MONGO_URI`, may use a different port, or may not use JWT.

| Variable | Purpose |
|---|---|
| `PORT` | Backend listening port, if configured through this variable |
| `MONGO_URI` | MongoDB connection string, if this is the name used by the application |
| `JWT_SECRET` | Secret used for signing or verifying JWTs, if JWT authentication is enabled |

Never commit real database credentials, access tokens, JWT secrets, or other sensitive configuration to GitHub.

### Frontend API configuration

If the frontend uses a configurable API base URL, set it using the environment-variable convention supported by your frontend build tool.

For example, a Vite application commonly uses:

```dotenv
VITE_API_BASE_URL=http://localhost:5000
```

This is only an example. Use the variable name and URL expected by your API client.

If the API URL is currently hardcoded in the frontend, update the relevant API configuration file or refactor it to use an environment variable before publishing.

> Frontend environment variables are visible to users in the built application. Never put database passwords, JWT signing secrets, or private API credentials in frontend environment variables.

---

## Running the Application

Start the backend and frontend in separate terminal windows.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Use this command only if the backend defines a `dev` script. Otherwise, use its configured start command.

### Terminal 2 — Frontend

```bash
cd frontend/mern
npm run dev
```

Use this command if the frontend defines a `dev` script.

Once both processes are running, open the frontend's local development URL in your browser.

### Verifying the application

After startup, verify the following:

- The frontend loads without a build error.
- The backend starts without a database connection error.
- The home page is accessible.
- Signup and login work, if authentication is configured.
- Product details load correctly.
- Cart and checkout workflows behave as expected.
- The order success page displays after a successful order.
- The My Orders page displays the shared customer navbar.
- Admin pages are accessible only to appropriately authorized users, if role-based authorization is implemented.
- Browser developer tools and backend logs show no unexpected errors.

---

## Application Routes

The following routes are configured in the current frontend routing structure.

### Customer Routes

| Route | Page / Purpose |
|---|---|
| `/` | Home page |
| `/login` | User login |
| `/signup` | User registration |
| `/products/:id` | Product details |
| `/user/cart` | Shopping cart |
| `/cart` | Redirects to `/user/cart` |
| `/checkout-address` | Checkout address |
| `/checkout` | Checkout |
| `/order-success/:id` | Order confirmation |
| `/my-orders` | Customer order history |

Customer routes are rendered through a shared layout containing the navbar.

### Admin Routes

| Route | Page / Purpose |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/products` | Product listing |
| `/admin/products/add` | Add product |
| `/admin/products/edit/:id` | Edit product |
| `/admin/orders` | Order management |

Admin routes use a separate admin layout.

**Note:** A frontend route is not a security boundary by itself. Sensitive admin operations must also be authorized by the backend.

---

## API Documentation

The frontend communicates with the backend through HTTP API requests. Confirm the final API paths and methods against the backend routes before treating this section as a complete API reference.

### Verified frontend API usage

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/order/my-orders` | Retrieve the current user's orders, as called by the My Orders page |

The endpoint may require an authenticated request, depending on the backend implementation.

### Additional API groups

Document the actual endpoints implemented in your backend for these features, if present:

| API group | Typical responsibility |
|---|---|
| Authentication | Registration, login, and user identity |
| Products | Fetching, creating, updating, and deleting products |
| Cart | Reading or updating cart items |
| Orders | Creating orders and retrieving order details |
| Admin orders | Administrative order listing and status management |

The table above describes API categories, not verified endpoint paths. Add each actual route, HTTP method, required authentication, request body, and response format from the backend implementation.

### API testing

You can use Postman or another HTTP client to test your endpoints.

For each endpoint, verify:

- The HTTP method and URL are correct.
- Required request fields are provided.
- Authentication headers are included when required.
- Successful responses use appropriate HTTP status codes.
- Invalid requests return useful error responses.
- Unauthorized users cannot access protected resources.

---

## Authentication and Authorization

The application includes login and signup pages. JWT authentication and role-based access control should be documented as enabled only if they are implemented in the backend.

If JWT is used, the typical authentication flow is:

1. The user submits login credentials.
2. The backend validates the credentials.
3. The backend returns an authentication token or establishes the configured session.
4. The frontend uses the configured authentication mechanism for protected requests.
5. The backend validates the user's identity and permissions before processing protected operations.

If the application has separate customer and admin roles, the backend should enforce the relevant permissions for administrative operations.

Do not assume that hiding a button or restricting a React route is sufficient to protect sensitive data.

---

## Database

If MongoDB is used by the backend, it stores the application's persistent data.

Depending on the implemented schema, the database may contain collections for:

- Users
- Products
- Orders
- Other application-specific entities

The actual collection names, fields, relationships, validation rules, and indexes should be documented from the project's database models.

### Database setup

1. Start a local MongoDB server or create an accessible MongoDB Atlas deployment.
2. Copy the connection string.
3. Add it to the backend `.env` file using the variable name expected by the application.
4. Start the backend.
5. Verify that the connection succeeds in the backend logs.
6. Create or seed the required initial data if the application does not do so automatically.

Never publish a database connection string containing real credentials.

---

## Error Handling and Troubleshooting

### 1. `npm install` fails

Check that Node.js and npm are installed and that the terminal is in the correct directory.

```bash
node --version
npm --version
```

Run `npm install` separately in the frontend and backend directories.

### 2. `npm run dev` is not recognized

The relevant `package.json` may not define a `dev` script.

Inspect the `scripts` section of that package file and run one of the commands that is actually defined.

### 3. Frontend cannot connect to the backend

- Verify that the backend process is running.
- Confirm the backend port.
- Check the API base URL used by the frontend.
- Check CORS configuration.
- Inspect the browser's Network tab for failed requests.
- Review the backend logs for errors.

### 4. MongoDB connection fails

- Confirm the connection string is correct.
- Ensure the database server is running or Atlas is reachable.
- Verify network access and database credentials.
- Confirm the environment-variable name matches the backend code.

### 5. My Orders page does not display the navbar

The `/my-orders` route should be nested inside the customer layout that renders the shared `Navbar` and an `Outlet`.

Check that:

- `/my-orders` is declared inside the customer layout route.
- The customer layout renders `<Navbar />` and `<Outlet />`.
- `MyOrders.jsx` does not render a second navbar.
- The navbar's user-dependent links behave as expected.

### 6. A page fails to load

- Confirm the route path matches the link destination.
- Check import paths and filename capitalization.
- Review the browser console for React errors.
- Verify that all imported components exist.
- Restart the frontend after changing build configuration.

### 7. API returns `401` or `403`

Check whether the endpoint requires authentication or a specific role. Verify that the frontend sends credentials using the mechanism expected by the backend and that the backend validates authorization correctly.

### 8. Port is already in use

Stop the conflicting process or configure an available port using the environment variable or configuration supported by your project. Update the frontend API URL if the backend port changes.

---

## Security Considerations

Before deploying the application publicly:

- Keep `.env` files out of version control.
- Store secrets only on the server.
- Validate and sanitize incoming request data.
- Enforce authentication and authorization on protected backend routes.
- Hash user passwords securely rather than storing plaintext passwords.
- Configure CORS for the intended frontend origin.
- Handle errors without exposing stack traces or sensitive information in production.
- Validate uploaded files if product image uploads are supported.
- Use HTTPS in production.
- Avoid logging passwords, tokens, or private customer information.
- Protect administrative endpoints against unauthorized access.

These are recommended security practices; confirm which are already implemented before describing them as completed features.

---

## Future Improvements

Potential improvements for future versions include:

- Product search, sorting, and category filtering.
- Pagination for product listings and order history.
- Product reviews and ratings.
- Wishlist functionality.
- Inventory and stock management.
- Payment gateway integration.
- Order status notifications.
- Improved form validation and accessibility.
- Automated unit and integration tests.
- API documentation using Swagger or OpenAPI.
- CI/CD and production deployment.
- Logging, monitoring, and performance optimization.

These items are suggestions for future development, not claims that they already exist.

---

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes.
4. Test the affected functionality.
5. Commit your changes.

   ```bash
   git add .
   git commit -m "Add: describe your change"
   ```

6. Push the branch.

   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a pull request with a clear description of the changes.

---

## License

No license has been specified in this README.

If you intend to make the project open source, choose an appropriate license and add its corresponding `LICENSE` file to the repository. Do not claim a license until one has actually been selected.

---

## Author

**Tarun Kumar**

Full Stack Developer | MERN Stack

- GitHub: [github.com/SDE-Tarun](https://github.com/SDE-Tarun)
- LinkedIn: [linkedin.com/in/tarun-kumar-b788a9250](https://www.linkedin.com/in/tarun-kumar-b788a9250)

---

*Apna Store — A full-stack e-commerce project built to demonstrate modern web application development with the MERN stack.*
