import express from "express";
import { bookAppointment, cancelAppointment, getProfile, listAppointments, paymentStripe, updateProfile, userLogin, userRegister, verifyStripe } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/list-appointments', authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-stripe', authUser, paymentStripe)
userRouter.post('/verify-payment', authUser, verifyStripe)

export default userRouter