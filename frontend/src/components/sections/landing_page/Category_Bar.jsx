import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import genre from '@/data/genre.json';

function Category_Bar() {
  const [emblaRef] = useEmblaCarousel({ 
    dragFree: true, 
    containScroll: 'trimSnaps' 
  });

  return (
    <section className="w-full">
      <div 
        className="overflow-hidden cursor-grab active:cursor-grabbing" 
        ref={emblaRef}
      >
        <div className="flex gap-5 px-2">
          {genre.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_auto] w-[210px] flex flex-col gap-2 group select-none text-center"
            >
              <div className="relative w-full h-28 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="w-full h-full rotate-[12deg] scale-110 origin-center transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-[8deg]">
                  <img
                    src={item.bgImg}
                    alt={item.name}
                    className="w-full h-full object-cover shadow-md"
                    draggable="false"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm tracking-wide transition-colors duration-200 group-hover:text-indigo-600 pointer-events-none">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Category_Bar;