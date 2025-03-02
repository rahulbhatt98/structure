import React from 'react'

function PortfolioModal({ isOpen, onClose, portfolioData }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white w-full max-w-2xl mx-8 ounded-2xl shadow-lg">
          <button
            type='button'
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &#x2715;
          </button>
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mt-4 text-center">Portfolio</h3>
            <div className="bg-white rounded-xl px-1 lmob:px-3 md:px-6 py-5 mt-3 max-h-72 lg:max-h-full overflow-y-auto">
              {/* Display Portfolio Images */}
              <div className="mt-4 flex gap-1 md:gap-2 flex-wrap justify-center sm:justify-normal">
                {portfolioData[0]?.images?.length > 0 ? (
                  portfolioData[0]?.images?.map((img, index) => (
                    <div
                      key={index}
                      className="relative flex servicesShadow justify-center w-36 h-36 bg-white rounded-xl"
                    >
                      <img
                        src={img}
                        alt={`Portfolio Image ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ))
                ) : (
                  <p>No images available</p>
                )}

              </div>

              {/* Display Portfolio Description */}
              <div className="mt-4">
                <h5 className='text-xs ml-1 mb-1 maingray'>Description</h5>
                <p className="block servicesShadow mb-5 w-full  max-h-60 overflow-y-auto text-xs md:text-sm font-medium p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500 outline-none sm:text-sm"
                >{portfolioData[0]?.description || 'No description available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PortfolioModal;