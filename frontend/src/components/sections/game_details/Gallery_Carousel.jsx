"use client";
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons'

export default function GalleryCarousel({ mediaImages = [], videoUrl = "" }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const onSelect = useCallback((emblaApi) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])
    useEffect(() => {
        if (!emblaApi) return
        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-8 border-t border-gray-100 select-none">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Description</h2>
                {mediaImages.length > 3 && (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={scrollPrev}
                            disabled={prevBtnDisabled}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#6C47FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={nextBtnDisabled}
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#6C47FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {videoUrl && (
                        <div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer border border-gray-100 shadow-sm">
                                <iframe
                                    src={videoUrl}
                                    className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-[#6C47FF] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-200 pl-0.5">
                                        <FontAwesomeIcon icon={faPlay} className="text-sm" />
                                    </div>
                                    <span className="mt-2.5 text-[11px] font-bold tracking-wider text-white uppercase bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                                        Watch Gameplay
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {mediaImages.map((img, index) => (
                        <div key={index} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group cursor-zoom-in">
                                <Image
                                    src={img}
                                    alt={`Gallery Image ${index + 1}`}
                                    fill
                                    sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}