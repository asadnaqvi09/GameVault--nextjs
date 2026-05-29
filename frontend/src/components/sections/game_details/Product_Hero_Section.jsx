"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt, faMinus, faPlus, faPlay, faGamepad, faGlobe, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faXTwitter, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import ProductTopNav from './Product_Top_Nav'

export default function ProductHeroSection({ game, prevGameId, nextGameId }) {
    const [selectedPlatform, setSelectedPlatform] = useState('')
    const [selectedEdition, setSelectedEdition] = useState('')
    const [quantity, setQuantity] = useState(1)
    const renderStars = (rating) => {
        const stars = []
        const floorRating = Math.floor(rating)
        for (let i = 1; i <= 5; i++) {
            if (i <= floorRating) {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-xs" />)
            } else if (i - 0.5 <= rating) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-amber-400 text-xs" />)
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-200 text-xs" />)
            }
        }
        return stars
    }
    return (
        <section className="w-full bg-white select-none">
            <div className="w-full max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div id="hero-left-poster-column" className="md:col-span-4 relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                        src={game.detailedDescription?.topGalleryImages?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'}
                        alt={game.title}
                        fill
                        priority
                        sizes="(max-w-768px) 100vw, 33vw"
                        className="object-cover"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                        <span className="bg-white text-gray-900 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">HOT</span>
                        <span className="bg-white text-gray-900 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">NEW</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                            <FontAwesomeIcon icon={faPlay} className="text-gray-700 text-sm ml-0.5" />
                        </div>
                    </div>
                </div>
                <div id="hero-right-content-column" className="md:col-span-8 flex flex-col w-full">
                    <ProductTopNav genre={game.genre} title={game.title} prevGameId={prevGameId} nextGameId={nextGameId} />
                    <div id="content-split-wrapper" className="flex flex-col lg:flex-row gap-8 mt-6 w-full">
                        <div id="content-details-pane" className="flex-1 flex flex-col gap-4">
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{game.title}</h1>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">{renderStars(game.rating || 4.5)}</div>
                                <span className="text-xs font-semibold text-gray-400">({game.reviews?.length || 0} customer reviews)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl">{game.smallDescription}</p>
                            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-5 pt-2">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-gray-900">Release date</span>
                                    <span className="text-xs text-gray-400">{game.specifications?.releaseDate}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-gray-900">Publisher</span>
                                    <span className="text-xs text-gray-400 line-clamp-1">{game.specifications?.publisher}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-gray-900">Developer</span>
                                    <span className="text-xs text-gray-400 line-clamp-1">{game.specifications?.developer}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2 bg-gray-50/50 flex-1 min-w-[110px]">
                                    <FontAwesomeIcon icon={faGamepad} className="text-gray-400 text-xs" />
                                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{game.genre}</span>
                                </div>
                                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-1.5 bg-gray-50/50 flex-1 min-w-[150px]">
                                    <div className="bg-[#e5a00d] text-white font-black text-xs px-1.5 py-0.5 rounded">12</div>
                                    <span className="text-[10px] text-gray-400 font-bold leading-tight uppercase tracking-wide">Mild Language<br />Violence</span>
                                </div>
                                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2 bg-gray-50/50 flex-1 min-w-[140px]">
                                    <FontAwesomeIcon icon={faGlobe} className="text-gray-400 text-xs" />
                                    <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap">{game.specifications?.languages?.length || 10} Languages</span>
                                </div>
                                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2 bg-gray-50/50 flex-1 min-w-[110px]">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
                                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">{game.gameMode}</span>
                                </div>
                            </div>
                        </div>
                        <div id="content-purchase-pane" className="w-full lg:w-[300px] border border-gray-100 rounded-2xl p-5 shadow-[0_8px_25px_rgba(0,0,0,0.02)] flex flex-col gap-5 self-start bg-white">
                            <div className="text-3xl font-black text-[#6C47FF]">${game.price}</div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-wider w-14">Platform</label>
                                    <div className="relative flex-1">
                                        <select
                                            value={selectedPlatform}
                                            onChange={(e) => setSelectedPlatform(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-xs font-bold text-gray-400 outline-none appearance-none cursor-pointer focus:border-[#6C47FF] transition-all"
                                        >
                                            <option value="">Choose Platform</option>
                                            {(game.options?.platforms || []).map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-[9px]">▼</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-wider w-14">Edition</label>
                                    <div className="relative flex-1">
                                        <select
                                            value={selectedEdition}
                                            onChange={(e) => setSelectedEdition(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-xs font-bold text-gray-400 outline-none appearance-none cursor-pointer focus:border-[#6C47FF] transition-all"
                                        >
                                            <option value="">Choose Edition</option>
                                            {(game.options?.editions || []).map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-[9px]">▼</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                                <div className="flex items-center justify-between border border-gray-200 rounded-full h-10 px-1 w-20 shrink-0 bg-gray-50/50">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900">
                                        <FontAwesomeIcon icon={faMinus} className="text-[9px]" />
                                    </button>
                                    <span className="text-xs font-bold text-gray-900">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900">
                                        <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                                    </button>
                                </div>
                                <button className="flex-1 h-10 bg-[#6C47FF] text-white text-xs font-bold rounded-full hover:bg-[#5b3ae6] transition-all">
                                    Add To Cart
                                </button>
                                <button className="flex-1 h-10 bg-[#F4F0FF] text-[#6C47FF] text-xs font-bold rounded-full hover:bg-[#e9e2ff] transition-all">
                                    Buy Now
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                                <button className="font-bold text-gray-900 hover:text-[#6C47FF] transition-colors flex items-center gap-1">
                                    <span className="text-base leading-none">♡</span> Wishlist
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">Share:</span>
                                    <div className="flex items-center gap-2.5 text-gray-400">
                                        <a href="#" className="hover:text-blue-600 transition-colors"><FontAwesomeIcon icon={faFacebookF} className="text-xs" /></a>
                                        <a href="#" className="hover:text-black transition-colors"><FontAwesomeIcon icon={faXTwitter} className="text-xs" /></a>
                                        <a href="#" className="hover:text-gray-700 transition-colors"><FontAwesomeIcon icon={faEnvelope} className="text-xs" /></a>
                                        <a href="#" className="hover:text-blue-500 transition-colors"><FontAwesomeIcon icon={faTelegramPlane} className="text-xs" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}