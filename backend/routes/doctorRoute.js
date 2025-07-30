import express from "express";
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashBoard, doctorList, doctorLogin, getDocProfile, updateDocprofile } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";


const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', doctorLogin)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.get('/dashboard', authDoctor, doctorDashBoard)
doctorRouter.post('/update-profile', authDoctor, updateDocprofile)
doctorRouter.get('/profile', authDoctor, getDocProfile)

export default doctorRouter