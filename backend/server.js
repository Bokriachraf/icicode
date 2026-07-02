
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import inscriptionRoutes from './routes/inscriptionRoutes.js'
import userRouter from './routes/userRoute.js'
import courseRouter from './routes/courseRoutes.js'
import niveauRouter from './routes/niveauRoutes.js'
import chapitreRouter from './routes/chapitreRoutes.js'
import exerciceRouter from './routes/exerciceRoutes.js'
import seanceRouter from './routes/seanceRoutes.js'
import progressionRouter from './routes/progressionRoutes.js'
import userAdminRouter from './routes/userAdminRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRouter);
app.use('/api/shipments', shipmentRoutes)
app.use('/api/inscription', inscriptionRoutes)
app.use('/api/courses', courseRouter)
app.use('/api/niveaux', niveauRouter)
app.use('/api/chapitres', chapitreRouter)
app.use('/api/exercices', exerciceRouter)
app.use('/api/seances', seanceRouter)
app.use('/api/progression', progressionRouter)
app.use('/api/admin/users', userAdminRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
