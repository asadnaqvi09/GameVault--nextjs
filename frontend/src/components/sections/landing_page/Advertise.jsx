import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

function Advertise() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start'
    });

    const [slidesData] = useState([
        { id: 1, title: "Hogwarts Legacy", desc: "The wizarding world awaits you. Freely roam Hogwarts, Hogsmeade, the Forbidden Forest, Overland area.", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", status: "Now on Nintendo Switch system", buttonText: "Buy Now" },
        { id: 2, title: "Need for Speed Unbound", desc: "Race against time, outsmart the cops, and take on weekly qualifiers to reach The Grand, Lakeshore's ultimate street.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800", status: "Discount off 20%", buttonText: "To Shop" },
        { id: 3, title: "The Witcher 3: Wild Hunt", desc: "A legendary RPG adventure across a vast, war-torn open world.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800", status: "Now on Xbox", buttonText: "Explore" },
        { id: 4, title: "Cyberpunk 2077", desc: "An open-world, action-adventure story set in Night City.", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800", status: "Red Hot Deal", buttonText: "Buy Now" },
    ]);

    return (
        <section className="w-full overflow-hidden p-6" ref={emblaRef}>
            {/* 1. Yahan se gap-6 hata kar negative margin (-ml-6) lagaya hai */}
            <div className="flex -ml-6">
                {slidesData.map((slide) => (
                    <div
                        // 2. Yahan pl-6 (left padding) lagayi hai gap create karne ke liye
                        // 3. Width ko md:flex-[0_0_50%] kiya hai kyunki spacing ab padding handle kar rahi hai
                        className="flex-[0_0_100%] md:flex-[0_0_50%] pl-6 min-w-0 relative group cursor-grab active:cursor-grabbing"
                        key={slide.id}
                    >
                        {/* Inner Wrapper taake border-radius aur border sahi se dikhein */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden aspect-[16/9]">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                width={100}
                                height={100}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 p-8 flex flex-col justify-end items-start text-left z-10"
                            >
                                <span className="text-gray-300 text-sm font-medium mb-1 drop-shadow-sm">
                                    {slide.status}
                                </span>
                                <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 drop-shadow">
                                    {slide.title}
                                </h3>
                                <p className="text-gray-300 text-sm md:text-base mb-6 max-w-md line-clamp-2 drop-shadow-sm">
                                    {slide.desc}
                                    Blonde</p>
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all transform active:scale-95 shadow-lg">
                                    {slide.buttonText}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Advertise;