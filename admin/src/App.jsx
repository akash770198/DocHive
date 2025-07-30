import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorsList from './pages/Admin/DoctorsList';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DocDashboard from './pages/Doctor/DocDashboard';
import DocAppointments from './pages/Doctor/DocAppointments';

const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path='/' element={aToken ? <Dashboard/> : dToken ? <DocDashboard/> : <Login/>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/add-doctor' element={<AddDoctor />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DocDashboard/>} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-appointments' element={<DocAppointments />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
