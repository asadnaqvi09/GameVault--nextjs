import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faLanguage } from '@fortawesome/free-solid-svg-icons'

export default function GameSpecifications({ specifications = {}, options = {} }) {
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-10 border-t border-gray-100 select-none">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">Specification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-sm text-[#6C47FF]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Overview</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Platform</span>
                            <span className="col-span-8 font-medium text-gray-500">
                                {options.platforms?.join(', ') || 'PC'}
                            </span>
                        </div>
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Release date</span>
                            <span className="col-span-8 font-medium text-gray-500">
                                {specifications.releaseDate || 'N/A'}
                            </span>
                        </div>
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Publisher</span>
                            <span className="col-span-8 font-medium text-gray-500">
                                {specifications.publisher || 'N/A'}
                            </span>
                        </div>
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Developer</span>
                            <span className="col-span-8 font-medium text-gray-500">
                                {specifications.developer || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
                        <FontAwesomeIcon icon={faLanguage} className="text-sm text-[#6C47FF]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Languages</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Language</span>
                            <span className="col-span-8 font-medium text-gray-500 leading-relaxed">
                                {specifications.languages?.join(', ') || 'English'}
                            </span>
                        </div>
                        <div className="grid grid-cols-12 text-xs sm:text-sm py-1">
                            <span className="col-span-4 font-bold text-gray-900">Audio</span>
                            <span className="col-span-8 font-medium text-gray-500 leading-relaxed">
                                {specifications.audio?.join(', ') || 'English'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}