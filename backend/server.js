import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import knowDocRouter from './routes/knowDocRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

// middleware
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/know-doctor', knowDocRouter)

app.get('/', (req, res) => {
    res.send('API working')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})