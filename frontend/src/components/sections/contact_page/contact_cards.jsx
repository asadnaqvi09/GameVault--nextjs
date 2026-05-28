"use client"

import React from 'react'

export default function ContactCards() {
    const cards = [
        {
            id: 1,
            title: 'Join us on Discord',
            description: 'Come to the official GameVault deals server and chat with fellow users.',
            isPrimary: true,
            hasDiscord: true
        },
        {
            id: 2,
            title: 'Follow us',
            description: 'Stay up to date with the best deals! Join us on Facebook, Twitter and Steam.',
            isPrimary: false,
            hasSocials: true
        },
        {
            id: 3,
            title: 'Vote for features',
            description: 'Tell us how to improve GameVault. Go to our to vote & comment on feature requests.',
            isPrimary: false,
            hasBranding: true
        },
        {
            id: 4,
            title: 'Your feedback',
            description: 'Help us create the best version of GameVault. Go to our & suggest your ideas.',
            isPrimary: false,
            hasButton: true
        }
    ]

    return (
        <section className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className={`h-[280px] rounded-2xl p-8 flex flex-col items-center justify-between text-center select-none ${card.isPrimary
                                ? 'bg-[#6d4bf6] text-white'
                                : 'bg-[#f9f9f9] text-neutral-900'
                                }`}
                        >
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl font-bold tracking-wide">
                                    {card.title}
                                </h3>
                                <p className={`text-sm leading-relaxed max-w-[220px] mx-auto ${card.isPrimary ? 'text-white/80' : 'text-neutral-500'
                                    }`}>
                                    {card.description}
                                </p>
                            </div>

                            <div className="w-full flex items-center justify-center min-h-[44px]">
                                {card.hasDiscord && (
                                    <svg className="w-10 h-10 fill-current" viewBox="0 0 127.14 96.36">
                                        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.71-11,68.6,68.6,0,0,1-10.57-5.12c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,72.9,0c.82.7,1.68,1.39,2.58,2a68.43,68.43,0,0,1-10.57,5.12,74.37,74.37,0,0,0,6.71,11,105.73,105.73,0,0,0,31-18.83C129.92,50.32,123.82,27.55,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z" />
                                    </svg>
                                )}

                                {card.hasSocials && (
                                    <div className="flex items-center gap-5 text-neutral-700">
                                        <svg className="w-5 h-5 fill-current hover:text-indigo-600 cursor-pointer transition-colors" viewBox="0 0 24 24">
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                        </svg>
                                        <svg className="w-4 h-4 fill-current hover:text-indigo-600 cursor-pointer transition-colors" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <svg className="w-5 h-5 fill-current hover:text-indigo-600 cursor-pointer transition-colors" viewBox="0 0 24 24">
                                            <path d="M2.004 22l1.352-4.961C1.819 14.366 1 11.218 1 7.823 1 3.502 4.512 0 8.834 0c2.094 0 4.063.816 5.545 2.298 1.481 1.482 2.293 3.454 2.291 5.531-.004 4.322-3.516 7.822-7.838 7.822a7.792 7.792 0 01-3.791-.983L2.004 22z" />
                                        </svg>
                                        <svg className="w-5 h-5 fill-current hover:text-indigo-600 cursor-pointer transition-colors" viewBox="0 0 24 24">
                                            <path d="M11.944 0C5.352 0 0 5.352 0 12s5.352 12 11.944 12c6.592 0 12.056-5.352 12.056-12S18.536 0 11.944 0zm5.488 8.432c-.176 1.84-1.024 6.848-1.456 9.136-.184.96-.536 1.28-.88 1.312-.752.072-1.32-.496-2.048-.976-1.144-.752-1.792-1.216-2.904-1.952-1.28-.848-.448-1.312.28-2.064.192-.192 3.504-3.208 3.568-3.48.008-.032.016-.16-.056-.224-.072-.064-.176-.04-.256-.024-.112.024-1.896 1.208-5.36 3.552-.504.352-.96.52-1.36.512-.44-.008-1.288-.248-1.92-.456-.768-.256-1.384-.392-1.328-.832.032-.232.352-.472.96-.72 3.76-1.632 6.264-2.712 7.512-3.24 3.576-1.512 4.32-1.776 4.8-.136.032.104.048.224.04.352z" />
                                        </svg>
                                    </div>
                                )}

                                {card.hasBranding && (
                                    <div className="flex items-center gap-1.5 font-bold text-lg text-neutral-900 tracking-tight">
                                        <span className="text-[#6d4bf6] text-xl">🎮</span>
                                        <span>GameVault</span>
                                    </div>
                                )}

                                {card.hasButton && (
                                    <button className="px-5 py-2 bg-[#e8e4fd] hover:bg-[#dbd5fc] text-[#6d4bf6] font-semibold text-xs rounded-full transition-colors duration-200">
                                        Share Feedback
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}