import "dotenv/config"
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import router from './Routes/authRoutes.js'
import productrouter from './Routes/ProductRoutes.js'
import cartrouter from './Routes/cartRoutes.js'
import addressrouter from './Routes/addressRoutes.js'
import orderRouter from './Routes/orderRoutes.js'

connectDB()
const app = express()

// CORS Configuration (Fixed for credentials + specific frontend origin)
const allowedOrigins = [
    'https://apna-store-frontend-wahx.onrender.com', // Aapka live frontend URL
    'http://localhost:5173', // Localhost Vite dev server (agar use kar rahe hain)
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json())

// API Routes
app.use('/api/auth', router)
app.use('/api/products', productrouter)
app.use('/api/cart', cartrouter)
app.use('/api/address', addressrouter)
app.use('/api/order', orderRouter)
app.use('/api/orders', orderRouter);

// Root route to check if backend is running
app.get('/', (req, res) => {
    res.send('Apna Store Backend is Running Successfully! 🚀');
});

const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});