import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, PercentCircle } from 'lucide-react';
import Image from 'next/image';
import heroBanner from '@/../public/images/heroBanner1.jpg';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';
import heroBanner3 from '@/../public/images/heroBanner3.jpg';
import starfield from '@/../public/images/starfieldlogo.png';
import deadisland from '@/../public/images/deadislandlogo.png';
import stalkerLogo from '@/../public/images/stalkerLogo.png';

const HERO_SLIDES = [
  {
    id: 1,
    img: heroBanner,
    logo: starfield,
    title: 'STARFIELD',
    Available_Platforms: ['PC', 'XBOX', 'PS5'],
    text: 'In this next generation role-playing game set amongst the stars, create any character you freedom.',
    releaseDate: '09.06.23'
  },
  {
    id: 2,
    img: heroBanner2,
    logo: deadisland,
    title: 'CYBERPUNK 2077',
    Available_Platforms: ['PC', 'PS5'],
    text: 'Explore the vibrant and dangerous megalopolis of Night City in this action-adventure RPG.',
    releaseDate: '10.12.20'
  },
  {
    id: 3,
    img: heroBanner3,
    logo: stalkerLogo,
    title: 'HALO INFINITE',
    Available_Platforms: ['PC', 'XBOX'],
    text: 'Step inside the armor of humanity’s greatest hero to experience an epic adventure.',
    releaseDate: '08.12.21'
  },
];

const DISCOUNTED_GAMES = [
  { id: 1, title: "Tiny Tina's Wonderlands", rating: 3.5, oldPrice: 59.99, newPrice: 27.00, img: heroBanner },
  { id: 2, title: "Little Nightmares II", rating: 4.5, oldPrice: 29.99, newPrice: 21.55, img: heroBanner },
  { id: 3, title: "Voltaire: The Vegan Vampire", rating: 4.0, oldPrice: 14.99, newPrice: 11.10, img: heroBanner },
  { id: 4, title: "Red Dead Redemption 2", rating: 5.0, oldPrice: 59.99, newPrice: 39.99, img: heroBanner },
  { id: 5, title: "Hogwarts Legacy", rating: 4.5, oldPrice: 59.99, newPrice: 47.95, img: heroBanner },
];

function Hero_Section() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('init', onSelect);
  }, [emblaApi, onSelect]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <section className='flex flex-col lg:flex-row gap-2'>
      <div className="hero_banner w-full md:w-[75%] relative rounded-xl overflow-hidden shadow-xl" ref={emblaRef}>
        <div className="flex h-full cursor-grab active:cursor-grabbing">
          {HERO_SLIDES.map((slide, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={slide.id}>
              <Image
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-fit"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
              <AnimatePresence mode="wait">
                {selectedIndex === index && (
                  <motion.div
                    key={`text-${slide.id}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 p-10 flex flex-col justify-center h-full max-w-md text-white"
                  >
                    <Image
                      src={slide.logo}
                      alt={slide.title}
                      className='w-46 h-16 object-fit mb-4'
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm text-gray-300">Available on:</span>
                      {slide.Available_Platforms.map(platform => (
                        <span key={platform} className="text-xs font-semibold px-2 py-1 border border-gray-400 rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-8">
                      {slide.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="bg-indigo-600 hover:bg-indigo-800 transition-colors text-white font-medium py-3 px-6 rounded-full text-sm cursor-pointer">
                        Take It Now!
                      </button>
                      <span className="text-sm text-gray-300">
                        Release date: {slide.releaseDate}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 right-6 flex gap-2 bg-white backdrop-blur-md px-3 py-2 rounded-full z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === selectedIndex ? 'bg-black w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="discounted_games w-full lg:w-[25%] flex flex-col">
        <div className="flex items-center gap-2 mb-4 px-2">
          <PercentCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-800">Discounted Games</h2>
        </div>
        <div className="bg-gray-50/80 rounded-2xl p-4 flex flex-col gap-4">
          {DISCOUNTED_GAMES.map((game) => (
            <div key={game.id} className="flex items-center gap-4 hover:bg-white p-2 rounded-xl transition-colors cursor-pointer">
              <Image
                src={game.img}
                alt={game.title}
                width={64}
                height={80}
                className="w-16 h-20 object-cover rounded-lg shadow-sm"
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{game.title}</h3>
                <div className="flex items-center gap-1 my-1">
                  {renderStars(game.rating)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 line-through">${game.oldPrice.toFixed(2)}</span>
                  <span className="text-sm font-bold text-indigo-600">${game.newPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero_Section;