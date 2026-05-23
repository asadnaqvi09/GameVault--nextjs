import React from 'react'
import Image from 'next/image'
import GameCover from '@/../public/images/singleGameCover.jpg'
import GameLogo from '@/../public/images/singleGameLogo.jpg'

function Single_Game() {
  return (
    <section className='flex flex-col md:flex-row w-full px-0 md:px-2 gap-6 bg-gray-50'>
      <div className='hidden md:block image-section w-[60%] h-[820px]'>
        <Image
          src={GameCover}
          alt={`game-image`}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='info-section w-full md:w-[40%] flex flex-col items-center gap-6 px-6 sm:px-8 py-12 text-center'>
        <div className="logo w-[150px] sm:w-[180px] h-auto flex items-center justify-center mb-2">
          <Image
            src={GameLogo}
            alt={`game-logo`}
            className='w-full h-auto object-contain'
          />
        </div>
        <div className="game-title">
          <h1 className='text-2xl md:text-4xl text-gray-700 font-semibold tracking-tight'>
            Stand Against the Darkness
          </h1>
        </div>
        <div className="desc max-w-xl mx-auto">
          <p className='text-gray-500 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-balance'>
            The story of Cal Kestis continues in STAR WARS Jedi: Survivor™, an epic new adventure that will push Cal further than ever as he fights to protect the galaxy from descending into darkness.
          </p>
        </div>
        <div className="intro-video grid grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/VRaobDJjiec"
              title="STAR WARS Jedi: Survivor Trailer 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/4HLDaBGdnLc"
              title="STAR WARS Jedi: Survivor Trailer 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="cta flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col gap-[3px] items-end opacity-40">
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm"></div>
            <div className="w-9 sm:w-12 h-[2px] bg-gray-600 rounded-sm"></div>
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm"></div>
          </div>
          <button className="bg-[#6042ef] hover:bg-[#5035d8] text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 shadow-md text-xs sm:text-sm md:text-base min-w-[120px] sm:min-w-[140px]">
            Take It Now!
          </button>
          <div className="flex flex-col gap-[3px] items-start opacity-40">
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm"></div>
            <div className="w-9 sm:w-12 h-[2px] bg-gray-600 rounded-sm"></div>
            <div className="w-6 sm:w-8 h-[2px] bg-gray-600 rounded-sm"></div>
          </div>
        </div>
        <div className="guidelines max-w-lg mt-4">
          <p className='text-gray-400 text-[10px] sm:text-xs md:text-sm font-normal leading-normal text-balance'>
            *Internet connection. Some content may require gameplay to unlock. Mandatory content updates may be downloaded automatically, require additional storage.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Single_Game