import React from 'react'
import GameDetails from '@/data/game_details.json'
import GameCard from '@/components/shared/GameCard'

export default function RelatedGames({ currentGenre = "", currentGameId = "" }) {
    const matchingGames = GameDetails.filter(
        (game) => game.genre?.toLowerCase() === currentGenre?.toLowerCase() && game.id !== currentGameId
    )
    const displayedGames = matchingGames.length > 0 ? matchingGames.slice(0, 4) : GameDetails.filter((game) => game.id !== currentGameId).slice(0, 4)
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-10 border-t border-gray-100 select-none">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">More Like This</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedGames.map((game) => (
                    <GameCard key={game.id} id={game.id} image={game.image} title={game.title} tags={game.tags} rating={game.rating} price={game.price} oldPrice={game.oldPrice} variant={game.variant} />
                ))}
            </div>
        </div>
    )
}