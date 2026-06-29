import React, { Suspense } from 'react'
import SalesBanner from '@/components/sections/sales_page/SalesBanner'
import CatalogLayout from '@/components/sections/games_page/CatalogueLayout'
import { getOnSaleCount } from '@/store/api/gameApi'

export default async function OnSalePage() {
  const onSaleCount = await getOnSaleCount();
  return (
    <main className='py-6 px-4 gap-20 flex flex-col'>
      <SalesBanner totalCount={onSaleCount} />
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-medium text-lg">Loading games...</div>}>
        <CatalogLayout isSalesMode={true} heading="On-Sale Games" />
      </Suspense>
    </main>
  )
}
