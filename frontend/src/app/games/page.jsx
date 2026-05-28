import CatalogLayout from '@/components/sections/games_page/CatalogueLayout'
import React from 'react'

function page() {
    return (
        <main>
            <CatalogLayout isSalesMode={false} heading="All Games" />
        </main>
    )
}

export default page