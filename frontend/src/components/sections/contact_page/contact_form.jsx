"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import ContactImage from '@/../public/images/contact_Image.png'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState('idle')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                setStatus('success')
                setFormData({ firstName: '', lastName: '', email: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <section className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                            The online store of equipment and electronics is one of the leading online stores.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-6 py-3 border border-neutral-200 rounded-full text-sm text-neutral-800 placeholder-neutral-400 bg-white outline-none focus:border-indigo-600 transition-colors"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-6 py-3 border border-neutral-200 rounded-full text-sm text-neutral-800 placeholder-neutral-400 bg-white outline-none focus:border-indigo-600 transition-colors"
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-6 py-3 border border-neutral-200 rounded-full text-sm text-neutral-800 placeholder-neutral-400 bg-white outline-none focus:border-indigo-600 transition-colors"
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-6 py-4 border border-neutral-200 rounded-[32px] text-sm text-neutral-800 placeholder-neutral-400 bg-white outline-none focus:border-indigo-600 transition-colors resize-none"
                        />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="px-8 py-3 bg-[#5c3df5] hover:bg-[#4a2cd4] cursor-pointer text-white font-medium text-sm rounded-full transition-colors duration-200 disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'success' && (
                                <p className="text-green-600 text-sm font-medium">Message sent successfully!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 text-sm font-medium">Failed to send message. Please try again.</p>
                            )}
                        </div>
                    </form>
                </div>
                <div className="w-full flex justify-center items-center relative min-h-[300px] md:min-h-[450px]">
                    <Image
                        src={ContactImage}
                        alt="Contact support 3d illustration"
                        className="w-full max-w-[540px] h-auto object-contain select-none pointer-events-none"
                    />
                </div>
            </div>
        </section>
    )
}