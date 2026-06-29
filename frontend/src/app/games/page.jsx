import React, { Suspense } from 'react'
import CatalogLayout from '@/components/sections/games_page/CatalogueLayout'

export default function GamePage() {
  return (
    <main>
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-medium text-lg">Loading games...</div>}>
        <CatalogLayout isSalesMode={false} heading="All Games" />
      </Suspense>
    </main>
  )
}
