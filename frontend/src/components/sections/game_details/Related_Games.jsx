'use client';
import React, { useEffect, useState } from 'react'
import GameCard from '@/components/shared/GameCard'
import { getRelatedGames } from '@/store/api/gameApi'

export default function RelatedGames({ slug = '' }) {
  const [relatedGameList, setRelatedGameList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const loadRelatedGames = async () => {
      try {
        const response = await getRelatedGames(slug);
        if (isMounted) {
          setRelatedGameList(response.data || []);
        }
      } catch {
        if (isMounted) {
          setRelatedGameList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadRelatedGames();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-10 border-t border-gray-100 select-none">
      <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">More Like This</h2>
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading related games...</div>
      ) : relatedGameList.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">No related games found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedGameList.map((game) => (
            <GameCard key={game.id} id={game.id} image={game.image} title={game.title} tags={game.tags} rating={game.rating} price={game.price} oldPrice={game.oldPrice} variant={game.variant} />
          ))}
        </div>
      )}
    </div>
  )
}
