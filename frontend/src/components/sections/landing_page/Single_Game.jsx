'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';
import { getGameBySlug } from '@/store/api/gameApi';
import { LANDING_FEATURED_GAME_SLUG } from '@/lib/landingHelpers';

function Single_Game({ gameSlug = LANDING_FEATURED_GAME_SLUG }) {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedGame = async () => {
      try {
        const detailRes = await getGameBySlug(gameSlug);
        if (isMounted) {
          setGame(detailRes.data?.game ?? null);
        }
      } catch {
        if (isMounted) setGame(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadFeaturedGame();
    return () => {
      isMounted = false;
    };
  }, [gameSlug]);

  if (isLoading) {
    return (
      <section className="flex flex-col md:flex-row w-full px-0 md:px-2 gap-6 bg-gray-50">
        <div className="hidden md:block w-[60%] h-[820px] bg-gray-200 animate-pulse" />
        <div className="w-full md:w-[40%] flex flex-col items-center gap-6 px-6 sm:px-8 py-12">
          <div className="w-[180px] h-24 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
    );
  }

  if (!game) {
    return null;
  }

  const coverImage =
    game.detailedDescription?.topGalleryImages?.[0] ||
    game.coverImage ||
    heroBanner2;
  const logoImage = game.coverImage || coverImage;
  const mainVideoUrl = game.detailedDescription?.mainVideoUrl;
  const galleryImage = game.detailedDescription?.topGalleryImages?.[1];

  return (
    <section className="flex flex-col md:flex-row w-full px-0 md:px-2 gap-6 bg-gray-50">
      <div className="hidden md:block image-section w-[60%] h-[820px] relative">
        <Image
          src={coverImage}
          alt={game.title}
          fill
          sizes="60vw"
          className="object-cover"
        />
      </div>
      <div className="info-section w-full md:w-[40%] flex flex-col items-center justify-center gap-6 px-6 sm:px-8 py-12 text-center">
        <div className="game-title">
          <h1 className="text-2xl md:text-4xl text-gray-700 font-semibold tracking-tight">
            {game.title}
          </h1>
        </div>
        <div className="desc max-w-xl mx-auto">
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-balance">
            {game.smallDescription}
          </p>
        </div>
        <div className="intro-video grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {mainVideoUrl && (
            <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={mainVideoUrl}
                title={`${game.title} Trailer 1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {galleryImage ? (
            <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
              <Image
                src={galleryImage}
                alt={`${game.title} screenshot`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
          ) : mainVideoUrl ? (
            <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={mainVideoUrl}
                title={`${game.title} Trailer 2`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
        <div className="cta flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col gap-[3px] items-end opacity-40">
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm" />
            <div className="w-9 sm:w-12 h-[2px] bg-gray-600 rounded-sm" />
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm" />
          </div>
          <Link
            href={`/games/${game.id}`}
            className="bg-[#6042ef] hover:bg-[#5035d8] text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 shadow-md text-xs sm:text-sm md:text-base min-w-[120px] sm:min-w-[140px]"
          >
            Take It Now!
          </Link>
          <div className="flex flex-col gap-[3px] items-start opacity-40">
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm" />
            <div className="w-9 sm:w-12 h-[2px] bg-gray-600 rounded-sm" />
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm" />
          </div>
        </div>
        <div className="guidelines max-w-lg mt-4">
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-normal leading-normal text-balance">
            *Internet connection. Some content may require gameplay to unlock. Mandatory content updates may be downloaded automatically, require additional storage.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Single_Game;
