import React, { createContext, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'

const KnowDoctor = () => {
    const { backendURL } = useContext(AppContext)
    const [showInput, setShowInput] = useState(false)
    const [symptoms, setSymptoms] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async () => {
        if (!symptoms.trim()) return;

        setLoading(true)
        try {
            const { data } = await axios.post(`${backendURL}/api/know-doctor`, { symptoms })

            if (data.success) {
                setCategory(data.category)
                setSymptoms('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10">
            <div className="w-full px-4 py-8 md:py-12 rounded-lg bg-[#1ca9c9] text-white">
                <div className='flex justify-center mb-6'>
                    <img className='w-40 h-auto sm:w-48 md:w-56 lg:w-60 object-contain' src={assets.sutika} alt="" />
                </div>
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-lg md:text-xl font-semibold mb-4">
                        Tell Sutika about your symptoms
                    </p>
                    <button
                        onClick={() => setShowInput(prev => !prev)}
                        className="bg-white px-6 py-2 rounded-full text-black shadow hover:bg-gray-200 transition duration-200"
                    >
                        {showInput ? 'Close Chat' : 'Know Your Doctor'}
                    </button>
                </div>

                {showInput && (
                    <div className="max-w-xl mx-auto mt-6 text-left px-2">
                        <textarea
                            className="w-full p-3 rounded-md bg-white text-black text-sm sm:text-base"
                            rows={4}
                            placeholder="Describe your symptoms..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                        <div className="flex justify-center">
                            <button
                                className="bg-green-500 text-white mt-3 px-5 py-2 rounded-full hover:bg-green-600 transition duration-200"
                                onClick={onSubmitHandler}
                                disabled={loading}
                            >
                                {loading ? "Analyzing..." : "Get Specialist"}
                            </button>
                        </div>

                        {category && (
                            <p className="mt-4 text-white text-sm sm:text-base text-center">
                                Suggested Doctor Specialist: <strong className="text-yellow-200">{category}</strong>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default KnowDoctor
