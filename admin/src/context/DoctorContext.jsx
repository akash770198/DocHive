import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const get_doc_appointments = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/appointments`, { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const complete_appointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/doctor/complete-appointment`, { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                get_doc_appointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancel_appointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                get_doc_appointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const doc_dashData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/dashboard`, { headers: { dToken } })

            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const get_doc_Profile = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/profile`, { headers: { dToken } })

            if (data.success) {
                setProfileData(data.docProfile)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendURL, get_doc_appointments, appointments, setAppointments,
        complete_appointment, cancel_appointment, dashData, setDashData,
        doc_dashData, profileData, setProfileData, get_doc_Profile
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider