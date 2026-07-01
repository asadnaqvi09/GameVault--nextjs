'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';
import { getOnSaleGames, getGameBySlug } from '@/store/api/gameApi';
import { buildAdvertiseStatus, getAdvertiseButtonText } from '@/lib/landingHelpers';

function Advertise() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });

  const [slidesData, setSlidesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        const onSaleRes = await getOnSaleGames({ limit: 4 });
        const cards = onSaleRes.data || [];

        const slides = await Promise.all(
          cards.map(async (card, index) => {
            let smallDescription = '';
            let platforms = [];
            try {
              const detailRes = await getGameBySlug(card.id);
              const game = detailRes.data?.game;
              smallDescription = game?.smallDescription || '';
              platforms = game?.options?.platforms || [];
            } catch {
              // use card-only data
            }

            return {
              id: card.id,
              title: card.title,
              desc: smallDescription,
              image: card.image,
              status: buildAdvertiseStatus({
                ...card,
                options: { platforms },
              }),
              buttonText: getAdvertiseButtonText(index),
            };
          })
        );

        if (isMounted) setSlidesData(slides);
      } catch {
        if (isMounted) setSlidesData([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="w-full overflow-hidden p-6">
        <div className="flex -ml-6">
          {[1, 2].map((key) => (
            <div key={key} className="flex-[0_0_100%] md:flex-[0_0_50%] pl-6 min-w-0">
              <div className="aspect-[16/9] rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (slidesData.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden p-6" ref={emblaRef}>
      <div className="flex -ml-6">
        {slidesData.map((slide) => (
          <div
            className="flex-[0_0_100%] md:flex-[0_0_50%] pl-6 min-w-0 relative group cursor-grab active:cursor-grabbing"
            key={slide.id}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden aspect-[16/9]">
              <Image
                src={slide.image || heroBanner2}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                </p>
                <Link
                  href={`/games/${slide.id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all transform active:scale-95 shadow-lg"
                >
                  {slide.buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Advertise;
