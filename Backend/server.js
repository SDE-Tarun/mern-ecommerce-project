import "dotenv/config"
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import router from './Routes/authRoutes.js'
import productrouter from './Routes/ProductRoutes.js'
import cartrouter from './Routes/cartRoutes.js'
import addressrouter from './Routes/addressRoutes.js'
import orderRouter from './Routes/orderRoutes.js'
import path from 'path'
 // dotenv is a npm pacakge and dotenv.config() is a function which loads .env file variable in node.js application
connectDB()
const app = express()
const __dirname = path.resolve()
console.log(__dirname)
const corsOptions = {
        origin: 'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))
app.use(express.json()) // This middleware converts json data into javaScript object
app.use('/api/auth',router) // It connects router and /api/auth
app.use('/api/products',productrouter)
app.use('/api/cart',cartrouter)
app.use('/api/address',addressrouter)
app.use('/api/order',orderRouter)
app.use('/api/orders', orderRouter);
app.use(express.static(path.join(__dirname,"/Frontend/mern/dist"))) 
app.get('*',(req,resp)=>{
    resp.sendFile(path.resolve(__dirname,"Frontend","mern","dist","index.html"))
})
app.listen(8900)