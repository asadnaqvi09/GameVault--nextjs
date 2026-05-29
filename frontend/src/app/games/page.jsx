import CatalogLayout from '@/components/sections/games_page/CatalogueLayout'
import React from 'react'

export default function GamePage() {
    return (
        <main>
            <CatalogLayout isSalesMode={false} heading="All Games" />
        </main>
    )
}