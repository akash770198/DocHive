import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                
                {/* Left Section */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo_compact} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Trusted by thousands, our platform connects you with verified doctors in seconds.
                        Book appointments easily and prioritize your health today.Your well-being is just a click away.
                        Book, consult, and stay healthy — all in one place.</p>
                </div>

                {/* center Section */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* rightt Section */}
                <div>
                    <p className='text-xl font-medium mb-5'>Get In Touch</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91-011-23456789</li>
                        <li>support@dochive.in</li>
                    </ul>
                </div>

            </div>

            {/* Copyright text */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ DocHive - All Right Reserved</p>
            </div>
        </div>
    )
}

export default Footer
