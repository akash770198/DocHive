import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })

        res.json({
            success: true,
            message: 'Availability Changed'
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({
            success: true,
            doctors
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor login
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Incomplete credentials'
            })
        }

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: 'Invalid Credentials'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments 
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.doctor.id

        const appointments = await appointmentModel.find({ docId })

        res.json({
            success: true,
            appointments
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//  API to mark appointment completed
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.doctor.id
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({
                success: true,
                message: 'Appointment Completed'
            })
        } else {
            return res.json({
                success: false,
                message: 'Action Failed'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const docId = req.doctor.id
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({
                success: true,
                message: 'Appointment Cancelled'
            })
        } else {
            return res.json({
                success: false,
                message: 'Action Failed'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor
const doctorDashBoard = async (req, res) => {
    try {
        const docId = req.doctor.id
        const appointments = await appointmentModel.find({ docId })

        let totalEarnings = appointments.reduce((total, appointment) => {
            return total + ((appointment.isCompleted || appointment.payment) ? appointment.amount : 0)
        }, 0)

        let totalPatients = []
        appointments.map((item) => {
            if (!totalPatients.includes(item.userId)) {
                totalPatients.push(item.userId)
            }
        })

        const dashData = {
            totalEarnings,
            appointments: appointments.length,
            totalPatients: totalPatients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({
            success: true,
            dashData
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for doctor panel
const getDocProfile = async (req, res) => {
    try {
        const docId = req.doctor.id

        const docProfile = await doctorModel.findById(docId).select('-password')
        res.json({
            success: true,
            docProfile
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile
const updateDocprofile = async (req, res) => {
    try {
        const docId = req.doctor.id
        const { fees, available, address } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({
            success: true,
            message: 'Profile updated'
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    doctorLogin,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashBoard,
    getDocProfile,
    updateDocprofile
}