import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const { backendURL, token, getDoctorData } = useContext(AppContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArr = slotDate.split('_')
    return dateArr[0] + " " + months[dateArr[1]] + " " + dateArr[2]
  }

  const listUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/list-appointments`, { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId)
      const { data } = await axios.post(`${backendURL}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        listUserAppointments()
        getDoctorData()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const paymentStripe = async (appointmentId) => {
    try {
      const responseStripe = await axios.post(`${backendURL}/api/user/payment-stripe`, { appointmentId }, { headers: { token } })
      if (responseStripe.data.success) {
        //extract the session url
        const { session_url } = responseStripe.data
        window.location.replace(session_url)
      } else {
        toast.error(responseStripe.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const verify_stripe = async (appointmentId, success) => {
    try {
      const { data } = await axios.post(`${backendURL}/api/user/verify-payment`, { appointmentId, success }, { headers: { token } })

      if (data.success) {
        toast.success('Verified')
        listUserAppointments()
      } else {
        toast.error(data.message || 'Payment verification failed')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    if (token) {
      listUserAppointments();

      const appointmentId = searchParams.get('appointmentId');
      const success = searchParams.get('success');

      if (appointmentId && success) {
        verify_stripe(appointmentId, success);
        navigate('/my-appointments'); // cleanup
      }
    }
  }, [token]);



  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {
          appointments.reverse().map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => paymentStripe(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#1ca9c9] hover:text-white transition-all duration-300'>Pay online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-600 rounded text-green-600'>Completed</button>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}


export default MyAppointments
