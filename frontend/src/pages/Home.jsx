import React from 'react'
import Header from '../components/Header'
import Speciality from '../components/Speciality'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import KnowDoctor from '../components/KnowDoctor'

const Home = () => {
  return (
    <div>
      <Header/>
      <KnowDoctor/>
      <Speciality/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home
