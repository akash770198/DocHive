import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-10 text-gray-400'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to DocHive, Your trusted platform Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione eius voluptates consectetur perferendis! Minima officia odit accusantium alias ex sequi ullam minus reiciendis optio sed.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae sapiente quas repellat libero expedita harum consequuntur accusantium culpa quam? Nihil?</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our Vision at DocHive is create a seamless Healthcare experience, Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam dolorum nostrum facere laudantium error veniam numquam quibusdam similique libero quis.</p>
        </div>
      </div>

      <div className='text-xl my-4 text-gray-400'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#1ca9c9] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#1ca9c9] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#1ca9c9] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALISATION:</b>
          <p>Tailored recommendations adn reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
