import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'

export default function DetailedFeatures({ features = [] }) {
    if (!features || features.length === 0) return null
    const mainFeature = features[0]
    const subFeatures = features.slice(1)
    return (
        <div id="detailed-features-main-container" className="w-full max-w-[1400px] mx-auto px-4 py-10 select-none border-t border-gray-100">
            <div id="features-split-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div id="main-feature-left-column" className="lg:col-span-7 flex flex-col gap-4">
                    <h2 id="main-feature-heading" className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        {mainFeature.title}
                    </h2>
                    <p id="main-feature-paragraph" className="text-sm text-gray-600 leading-relaxed font-medium">
                        {mainFeature.description}
                    </p>
                    {mainFeature.image && (
                        <div id="main-feature-video-thumbnail" className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-50 mt-2 group cursor-pointer shadow-sm border border-gray-100">
                            <Image
                                src={mainFeature.image}
                                alt={mainFeature.title}
                                fill
                                sizes="(max-w-1024px) 100vw, 60vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div id="video-play-button-overlay" className="absolute inset-0 flex items-center justify-center z-10">
                                <FontAwesomeIcon
                                    icon={faCirclePlay}
                                    className="text-white/90 text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:text-white transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div id="sub-features-right-column" className="lg:col-span-5 flex flex-col gap-8 pt-1">
                    {subFeatures.map((feature, index) => {
                        const isTextLeft = index % 2 !== 0
                        return (
                            <div key={feature.id || index} id={`sub-feature-row-${index}`} className="grid grid-cols-2 gap-5 sm:gap-6 items-center">
                                <div id={`sub-feature-image-wrapper-${index}`} className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm ${isTextLeft ? 'order-2' : 'order-1'}`}>
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        sizes="(max-w-1024px) 50vw, 25vw"
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div id={`sub-feature-content-wrapper-${index}`} className={`flex flex-col gap-2 ${isTextLeft ? 'order-1' : 'order-2'}`}>
                                    <h3 id={`sub-feature-title-${index}`} className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p id={`sub-feature-description-${index}`} className="text-[13px] text-gray-500 leading-relaxed line-clamp-4">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}