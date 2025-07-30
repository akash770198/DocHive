import express from 'express'
import { getDoctorCategory } from '../controllers/knowDoctor.js'

const knowDocRouter = express.Router()

knowDocRouter.post('/', getDoctorCategory)

export default knowDocRouter