import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import salesBannerBg from '@/../public/images/sales_banner.jpg'

export default function SalesBanner({ totalCount }) {
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 select-none">
            <div className="w-full flex justify-between items-center py-3 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-bold">All Games</span>
                </div>
                <div className="text-gray-500">
                    Showing all {totalCount} results
                </div>
            </div>
            <div className="relative w-full rounded-md overflow-hidden bg-[#6C47FF] aspect-[3.2/1] min-h-[220px]">
                <Image
                    src={salesBannerBg}
                    alt="Super Week Sale Background"
                    fill
                    priority
                    className="object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6C47FF]/90 via-[#6C47FF]/40 to-transparent z-10" />
                <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center max-w-[55%] pl-6 sm:pl-12 lg:pl-16 gap-2 sm:gap-3 text-white">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80">
                        Discounts up to -75%
                    </span>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
                        Super Week Sale
                    </h1>
                    <p className="text-[11px] sm:text-xs lg:text-sm text-white/90 font-medium leading-relaxed line-clamp-3 max-w-xl">
                        Spring is the nicest season. It's the one that shows up and shovels all the Winter snow off your driveway, tips its hat at you, and strolls away. Then it wakes all the bears and squirrels out of hibernation and fills up all the streams with babbling water.
                    </p>
                </div>
            </div>
        </div>
    )
}