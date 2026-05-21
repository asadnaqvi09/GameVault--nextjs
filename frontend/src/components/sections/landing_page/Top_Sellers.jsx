import React from 'react'

function Top_Sellers() {
  return (
    <section className='flex md:flex-col'>
      <div className="headers flex justify-between items-center">
        <h1 className='text-2xl font-bold'>
          Top Sellers
        </h1>
        <button className='shop-all py-3 px-8 text-center text-sm font-semibold bg-gray-300 rounded-4xl'>
          Shop All
        </button>
      </div>
      <div>
        This is Top Seller Items Component
      </div>
    </section>
  )
}

export default Top_Sellers