import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const currency = 'inr'

// api to register new user
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({
                success: false,
                message: 'Incomplete credentials'
            })
        }

        // validating the email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please Enter Valid Email'
            })
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists'
            })
        }

        // validating the password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Password must be 8 digits long'
            })
        }

        // hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// api for user login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Incomplete credentials'
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: 'No such user exists'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
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

//api to get user data
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const userData = await userModel.findById(userId).select('-password')

        if (userData) {
            res.json({
                success: true,
                userData
            })
        } else {
            res.json({
                success: false,
                message: 'Error getting user details'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({
                success: false,
                message: 'Data Missing'
            })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({
            success: true,
            message: "Profile Updated"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// api to book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.user.id
        const { docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({
                success: false,
                message: 'Doctor not available'
            })
        }

        let slots_booked = docData.slots_booked

        //checking for slot availabilty
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: 'Slot not available'
                })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = [] // create new arr
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        // becoz appointment model will not require to store this filed of doc data
        const plainDocData = docData.toObject();//now its normal js object
        delete plainDocData.slots_booked //this really removes the field

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: plainDocData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //now saving our new slots to doctor data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        await newAppointment.save()

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to get user appontments
const listAppointments = async (req, res) => {
    try {
        const userId = req.user.id
        const appointments = await appointmentModel.find({ userId })

        res.json({
            success: true,
            appointments
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//api to cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: 'Unauthorised access'
            })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //releasing doc slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({
            success: true,
            message: 'Appointment Cancelled'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to make payment of appointment using razorpay
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: 'Appointment Cancelled or Not Found'
            })
        }

        if (appointmentData.payment) {
            return res.json({
                success: false,
                message: 'Payment alrady done'
            })
        }

        const line_items = [{
            price_data: {
                currency: currency,
                product_data: {
                    name: `Consultation with Dr. ${appointmentData.docData.name}`,
                },
                unit_amount: appointmentData.amount * 100,
            },
            quantity: 1,
        }];

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/my-appointments?success=true&appointmentId=${appointmentId}`,
            cancel_url: `${origin}/my-appointments?success=false&appointmentId=${appointmentId}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const verifyStripe = async (req, res) => {
    const { appointmentId, success } = req.body;

    try {
        if (success === 'true') {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true })
        } else {
            return res.json({ success: false, message: 'Payment Failed or Cancelled' })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



export { userRegister, userLogin, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentStripe, verifyStripe }