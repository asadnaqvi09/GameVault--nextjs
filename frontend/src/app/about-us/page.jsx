import AboutHero from '@/components/sections/about_page/about_hero'
import HeroCards from '@/components/sections/about_page/hero_cards'
import React from 'react'

function AboutPage() {
    return (
        <main className='py-6 px-4 gap-20 flex flex-col'>
            <AboutHero />
            <HeroCards />
        </main>
    )
}

export default AboutPage