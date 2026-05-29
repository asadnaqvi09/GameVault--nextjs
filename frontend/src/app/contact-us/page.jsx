import ContactCards from '@/components/sections/contact_page/contact_cards'
import ContactForm from '@/components/sections/contact_page/contact_form'
import React from 'react'

export default function ContactPage() {
    return (
        <main className='py-6 px-4 gap-20 flex flex-col'>
            <ContactForm />
            <ContactCards />
        </main>
    )
}