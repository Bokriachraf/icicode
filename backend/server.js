
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import devisRoute from './routes/devisRoute.js'
import inscriptionRoutes from './routes/inscriptionRoutes.js'
import userRouter from './routes/userRoute.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRouter);
app.use('/api/shipments', shipmentRoutes)
app.use('/api/inscription', inscriptionRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
