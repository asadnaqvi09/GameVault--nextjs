'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';
import { useWishlist } from '@/hooks/useWishlist';

export default function GameCard({ id, image, title, tags = [], rating, price, oldPrice, variant = 'compact' }) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const router = useRouter();

  const underlineVariants = {
    initial: { width: 0 },
    hover: { width: "100%" }
  };

  const favorited = isWishlisted(id);
  const discountPercentage = oldPrice && price < oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const handleCardClick = () => {
    router.push(`/games/${id}`);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, image, title, tags, rating, price, oldPrice });
  };

  const handleCtaClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      id="game-card-root-container"
      onClick={handleCardClick}
      className="relative flex flex-col w-full group select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div id="game-card-media-wrapper" className={`relative w-full overflow-hidden rounded bg-[#F9F9F9] ${variant === 'expanded' ? 'h-64 md:h-72' : 'h-48 md:h-64'}`}>
        <motion.img
          src={image || heroBanner2.src}
          alt={title}
          className="w-full h-full object-contain"
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <div id="game-card-badge-container" className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercentage > 0 && (
            <span id="game-card-discount-tag" className="px-2 py-0.5 text-[10px] font-extrabold bg-white text-gray-900 rounded border border-gray-100 shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {discountPercentage > 25 && (
            <span id="game-card-hot-tag" className="px-2 py-0.5 text-[9px] font-black bg-white text-gray-900 rounded border border-gray-100 shadow-sm uppercase tracking-wider text-center">
              Hot
            </span>
          )}
        </div>
        <AnimatePresence>
          {(isHovered || favorited) && (
            <motion.button
              id="game-card-wishlist-button"
              onClick={handleWishlistClick}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-2.5 right-2.5 p-2 bg-white rounded-full shadow-sm z-10 hover:shadow transition-all ${favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              aria-label="Add to wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div id="game-card-info-layout" className="pt-3 pb-1 flex flex-col flex-grow">
        <div id="game-card-header-row" className="flex items-start justify-between gap-2 mb-2">
          <h3 id="game-card-title-heading" className="text-base font-bold text-gray-900 uppercase tracking-tight line-clamp-1">
            {title}
          </h3>
          <div id="game-card-rating-badge" className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-medium text-gray-500">{rating?.toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div id="game-card-action-container" className="relative h-7 overflow-hidden mt-auto">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="price"
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center gap-2"
              >
                <span id="game-card-current-price" className="text-lg font-bold text-[#5B42F3]">
                  ${price}
                </span>
                {oldPrice && (
                  <span id="game-card-original-price" className="text-sm font-medium text-gray-400 line-through">
                    ${oldPrice}
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center"
              >
                <Link
                  id="game-card-options-link"
                  href={`/games/${id}`}
                  onClick={handleCtaClick}
                  className="relative inline-block text-base font-bold text-[#5B42F3] pb-0.5"
                >
                  Select Options
                  <motion.span
                    className="absolute left-0 bottom-0 h-[2px] bg-[#5B42F3]"
                    initial="initial"
                    whileHover="hover"
                    variants={underlineVariants}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}