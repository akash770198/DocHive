import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const { token, backendURL, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendURL}/api/user/register`, { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const { data } = await axios.post(`${backendURL}/api/user/login`, { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  }, [token])


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-sl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl fonnt-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "Login"} to book appointment</p>

        {state === 'Sign Up' && <div className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} />
        </div>}
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit' className='bg-[#1ca9c9] text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? 'Sign up' : 'Login'}</button>
        {
          state === 'Sign Up' ?
            <p>Already have an account ? <span className='text-[#1ca9c9] underline cursor-pointer' onClick={() => setState('Login')}>Login here</span></p>
            : <p>Create a new account : <span className='text-[#1ca9c9] underline cursor-pointer' onClick={() => setState('Sign Up')}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
