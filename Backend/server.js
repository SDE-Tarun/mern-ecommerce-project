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

const corsOptions = {
    origin: '*', // Production ke liye sabhi origins allow kar sakte hain ya apna frontend URL de sakte hain
    credentials: true
}

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