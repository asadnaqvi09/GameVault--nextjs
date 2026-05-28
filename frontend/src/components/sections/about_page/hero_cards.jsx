"use client"

import React, { useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import gsap from 'gsap'

export default function HeroCards() {
    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: 'start',
            containScroll: false
        },
        [
            Autoplay({
                delay: 2500,
                stopOnInteraction: false,
                playOnInit: true
            })
        ]
    )

    const cards = [
        {
            id: 1,
            title: 'Experience',
            description: 'Our company has been working in this field for more than 8 years.',
            bgImage: 'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/06/wd-vgs-experiance-w.jpg',
        },
        {
            id: 2,
            title: 'Safe Payments',
            description: 'Make secure payments and settlements, we will protect your funds.',
            bgImage: 'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/06/wd-vgs-safe-payments-w.jpg',
        },
        {
            id: 3,
            title: 'Support',
            description: 'Need help or have a wish for our store? Contact our 24/7 support.',
            bgImage: 'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/06/wd-vgs-support-w.jpg',
        },
        {
            id: 4,
            title: 'Our Stores',
            description: 'Special selections of offers are available for you and your friends.',
            bgImage: 'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/06/wd-vgs-our-stores-w.jpg',
        },
        {
            id: 5,
            title: 'Customers',
            description: 'Advanced data protection systems to keep your account safe.',
            bgImage: 'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/06/wd-vgs-customers-w.jpg',
        }
    ]

    const handleMouseMove = (e, imgElement) => {
        if (!imgElement) return
        const { left, top, width, height } = imgElement.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        gsap.to(imgElement, {
            scale: 1.15,
            x: x * 40,
            y: y * 40,
            rotationY: x * 15,
            rotationX: -y * 15,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000
        })
    }

    const handleMouseLeave = (imgElement) => {
        if (!imgElement) return
        gsap.to(imgElement, {
            scale: 1,
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: "power3.out"
        })
    }

    return (
        <section className="w-full bg-white select-none overflow-hidden">
            <div ref={emblaRef}>
                <div className="flex backface-hidden ">
                    {cards.map((card) => {
                        const imgRef = React.createRef()
                        return (
                            <div
                                key={card.id}
                                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_25%] px-2"
                            >
                                <div
                                    className="h-[450px] rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group transition-all duration-300 transform-gpu cursor-pointer"
                                    onMouseMove={(e) => handleMouseMove(e, imgRef.current)}
                                    onMouseLeave={() => handleMouseLeave(imgRef.current)}
                                >
                                    <img
                                        ref={imgRef}
                                        src={card.bgImage}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none origin-center"
                                    />
                                    <div className="flex flex-col gap-3 text-white z-10 relative pointer-events-none">
                                        <h3 className="text-3xl font-bold tracking-wide">
                                            {card.title}
                                        </h3>
                                        <p className="text-[15px] leading-relaxed opacity-90 font-medium max-w-[240px]">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}