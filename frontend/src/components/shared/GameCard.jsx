import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import heroBanner2 from '@/../public/images/heroBanner2.jpg';

export default function GameCard({ id, image, title, tags = [], rating, price, oldPrice, variant = 'compact' }) {
  const [isHovered, setIsHovered] = useState(false);
  const MotionLink = motion.create(Link);
  const underlineVariants = {
    initial: { width: 0 },
    hover: { width: "100%" }
  };
  return (
    <div
      className="relative flex flex-col w-full overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full overflow-hidden rounded-md bg-gray-100 ${variant === 'expanded' ? 'h-64 md:h-72' : 'h-48 md:h-64'
        }`}>
        <motion.img
          src={image || heroBanner2.src}
          alt={title}
          className="w-full h-full object-cover object-center"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm bg-white text-gray-900"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-600 hover:text-red-500 shadow-md z-10 cursor-pointer"
              aria-label="Add to favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 pb-2 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-medium text-gray-500">{rating?.toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="relative h-7 overflow-hidden mt-auto">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="price"
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center gap-2"
              >
                <span className="text-lg font-bold text-[#5B42F3]">
                  ${price}
                </span>
                {oldPrice && (
                  <span className="text-sm font-medium text-gray-400 line-through">
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
                <MotionLink
                  href={`/product/${id}`}
                  className="relative inline-block text-base font-bold text-[#5B42F3] pb-0.5"
                  initial="initial"
                  whileHover="hover"
                >
                  Select Options
                  <motion.span
                    className="absolute left-0 bottom-0 h-[2px] bg-[#5B42F3]"
                    variants={underlineVariants}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </MotionLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}