import React from 'react'
import { notFound } from 'next/navigation'
import GameDetails from '@/data/game_details.json'
import ProductHeroSection from '@/components/sections/game_details/Product_Hero_Section'
import GalleryCarousel from '@/components/sections/game_details/Gallery_Carousel'
import DetailedFeatures from '@/components/sections/game_details/Detailed_Features'
import GameSpecifications from '@/components/sections/game_details/Game_Specifications'
import ReviewsSection from '@/components/sections/game_details/Reviews_Section'
import RelatedGames from '@/components/sections/game_details/Related_Games'

export default async function GameDetailPage({ params }) {
    const resolvedParams = await params
    const currentGameId = resolvedParams.id
    const currentIndex = GameDetails.findIndex((game) => game.id === currentGameId)
    if (currentIndex === -1) {
        notFound()
    }
    const currentGame = GameDetails[currentIndex]
    const prevGameId = currentIndex > 0 ? GameDetails[currentIndex - 1].id : null
    const nextGameId = currentIndex < GameDetails.length - 1 ? GameDetails[currentIndex + 1].id : null
    return (
        <main className="w-full bg-white pb-16 min-h-screen">
            <ProductHeroSection
                game={currentGame}
                prevGameId={prevGameId}
                nextGameId={nextGameId}
            />
            <GalleryCarousel
                mediaImages={currentGame.detailedDescription?.topGalleryImages}
                videoUrl={currentGame.detailedDescription?.mainVideoUrl}
            />
            <DetailedFeatures
                features={currentGame.detailedDescription?.features}
            />
            <GameSpecifications
                specifications={currentGame.specifications}
                options={currentGame.options}
            />
            <ReviewsSection
                reviews={currentGame.reviews || []}
                gameTitle={currentGame.title}
            />
            <RelatedGames
                currentGenre={currentGame.genre}
                currentGameId={currentGame.id}
            />
        </main>
    )
}