import React from 'react'
import SalesBanner from '@/components/sections/sales_page/SalesBanner'
import CatalogLayout from '@/components/sections/games_page/CatalogueLayout'
import GameDetails from '@/data/game_details.json'

export default function OnSalePage() {
    const onSaleProducts = GameDetails.filter((game) => game.oldPrice && game.price < game.oldPrice).length;
    return (
        <main className='py-6 px-4 gap-20 flex flex-col'>
            <SalesBanner totalCount={onSaleProducts} />
            <CatalogLayout isSalesMode={true} heading="On-Sale Games" />
        </main>
    )
}