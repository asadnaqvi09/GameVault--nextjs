'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { getAllGenres } from '@/store/api/gameApi';
import { getGenreBgImage } from '@/lib/landingHelpers';

function Category_Bar() {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  useEffect(() => {
    let isMounted = true;

    const loadGenres = async () => {
      try {
        const response = await getAllGenres();
        if (isMounted) {
          setGenres(response.data || []);
        }
      } catch {
        if (isMounted) setGenres([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="flex gap-5 px-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((key) => (
            <div key={key} className="flex-[0_0_auto] w-[210px] h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (genres.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-5 px-2">
          {genres.map((item) => {
            const genreSlug = item.name.toLowerCase();
            const bgImg = getGenreBgImage(item.name);

            return (
              <Link
                key={item._id || item.name}
                href={`/games?genre=${encodeURIComponent(genreSlug)}`}
                className="flex-[0_0_auto] w-[210px] flex flex-col gap-2 group select-none text-center"
              >
                <div className="relative w-full h-28 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <div className="w-full h-full rotate-[12deg] scale-110 origin-center transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-[8deg]">
                    <img
                      src={bgImg}
                      alt={item.name}
                      className="w-full h-full object-cover shadow-md"
                      draggable="false"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm tracking-wide transition-colors duration-200 group-hover:text-indigo-600">
                  {item.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Category_Bar;
