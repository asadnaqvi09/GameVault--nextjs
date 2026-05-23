import React from 'react'
import GameCard from '@/components/shared/GameCard'
import games from '@/data/game_details.json'
function Top_Sellers({ id, image, title, tags, rating, price, oldPrice, variant = 'expanded' }) {
  const topSellers = games.slice(0, 5).sort((a, b) => {
    const aiSHot = Array.isArray(a.tags) && a.tags.includes('Hot');
    const biSHot = Array.isArray(b.tags) && b.tags.includes('Hot');
    return aiSHot - biSHot;
  });
  return (
    <section className='flex flex-col gap-8'>
      <div className="headers flex justify-between items-center">
        <h1 className='text-2xl font-bold'>
          Top Sellers
        </h1>
        <button className='shop-all py-2 px-6 text-center text-sm font-medium bg-gray-100 hover:bg-gray-300 duration-300 transistion-all rounded-4xl cursor-pointer flex items-center gap-2 group'>
          Shop All
          <svg
            className="w-4 h-4 group-hover:translate-x-1.5 duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="top-seller-items grid grid-cols-1 lg:grid-cols-5 gap-4">
        {
          topSellers.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              image={game.image}
              title={game.title}
              tags={game.tags}
              rating={game.rating}
              price={game.price}
              oldPrice={game.oldPrice}
              variant={variant}
            />
          ))
        }
      </div>
    </section>
  )
}

export default Top_Sellers