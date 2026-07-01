'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, PercentCircle } from 'lucide-react';
import Image from 'next/image';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';
import {
  getTopSellers,
  getGameBySlug,
  getOnSaleGames,
} from '@/store/api/gameApi';
import {
  mapGameToHeroSlide,
  pickCheapestDiscountedGames,
} from '@/lib/landingHelpers';

function Hero_Section() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [discountedGames, setDiscountedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const loadHeroData = async () => {
      try {
        const [topSellersRes, onSaleRes] = await Promise.all([
          getTopSellers(3),
          getOnSaleGames({ limit: 50 }),
        ]);

        const topCards = topSellersRes.data || [];
        const slideDetails = await Promise.all(
          topCards.map(async (card) => {
            try {
              const detailRes = await getGameBySlug(card.id);
              return detailRes.data?.game ?? card;
            } catch {
              return card;
            }
          })
        );

        if (!isMounted) return;

        setHeroSlides(slideDetails.map(mapGameToHeroSlide));
        setDiscountedGames(
          pickCheapestDiscountedGames(onSaleRes.data || [], 5).map((game) => ({
            id: game.id,
            title: game.title,
            rating: game.rating,
            oldPrice: game.oldPrice,
            newPrice: game.price,
            img: game.image,
          }))
        );
      } catch {
        if (isMounted) {
          setHeroSlides([]);
          setDiscountedGames([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

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

  if (isLoading) {
    return (
      <section className="flex flex-col lg:flex-row gap-2">
        <div className="w-full md:w-[75%] min-h-[420px] rounded-xl bg-gray-100 animate-pulse" />
        <div className="w-full lg:w-[25%] min-h-[420px] rounded-2xl bg-gray-100 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="flex flex-col lg:flex-row gap-2">
      <div
        className="hero_banner w-full md:w-[75%] relative rounded-xl overflow-hidden shadow-xl min-h-[420px]"
        ref={emblaRef}
      >
        {heroSlides.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[420px] text-gray-500">
            No featured games available.
          </div>
        ) : (
          <>
            <div className="flex h-full cursor-grab active:cursor-grabbing">
              {heroSlides.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative min-h-[420px]" key={slide.id}>
                  <Image
                    src={slide.img || heroBanner2}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        key={`text-${slide.id}`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="relative z-10 p-10 flex flex-col justify-center h-full max-w-md text-white"
                      >
                        {slide.logo && (
                          <h1 className="text-2xl font-bold mb-4">{slide.title}</h1>
                        )}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="text-sm text-gray-300">Available on:</span>
                          {slide.Available_Platforms.map((platform) => (
                            <span
                              key={platform}
                              className="text-xs font-semibold px-2 py-1 border border-gray-400 rounded-full"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-8">
                          {slide.text}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <Link
                            href={`/games/${slide.id}`}
                            className="bg-indigo-600 hover:bg-indigo-800 transition-colors text-white font-medium py-3 px-6 rounded-full text-sm cursor-pointer"
                          >
                            Take It Now!
                          </Link>
                          {slide.releaseDate && (
                            <span className="text-sm text-gray-300">
                              Release date: {slide.releaseDate}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2 bg-white backdrop-blur-md px-3 py-2 rounded-full z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === selectedIndex ? 'bg-black w-4' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="discounted_games w-full lg:w-[25%] flex flex-col">
        <div className="flex items-center gap-2 mb-4 px-2">
          <PercentCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-800">Discounted Games</h2>
        </div>
        <div className="bg-gray-50/80 rounded-2xl p-4 flex flex-col gap-4">
          {discountedGames.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No discounted games right now.</p>
          ) : (
            discountedGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="flex items-center gap-4 hover:bg-white p-2 rounded-xl transition-colors cursor-pointer"
              >
                <Image
                  src={game.img || heroBanner2}
                  alt={game.title}
                  width={64}
                  height={80}
                  className="w-16 h-20 object-fit rounded-lg shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{game.title}</h3>
                  <div className="flex items-center gap-1 my-1">
                    {renderStars(game.rating)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      ${Number(game.oldPrice).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      ${Number(game.newPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero_Section;
