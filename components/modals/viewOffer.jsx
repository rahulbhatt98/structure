import React from 'react';

function ViewOffer({ isOpen, onClose }) {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-xl w-full mx-2 max-w-7xl shadow-lg relative">
                    <button
                        className="absolute top-1 font-bold right-4 text-2xl text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <h2 className="text-lg font-semibold text-gray-400 px-3 py-2 shadow-sm">#85689</h2>
                    <div className='h-[50vh] 2xl:h-[40vh] overflow-y-auto'>
                        <div className='px-3 pb-2'>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-2">
                                Want to clean my home, I like deep cleaning under beds and couches
                            </h3>
                            <p className="text-sm mt-2 leading-5">
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                            </p>
                        </div>

                        <div className="flex flex-wrap px-3 py-3 gap-5 lg:gap-10">
                            <div>
                                <span className="font-medium text-gray-600 text-xs block">Service:</span>
                                House
                            </div>
                            <div>
                                <span className="font-medium text-gray-600 text-xs block">Service Type</span> Cleaning
                            </div>
                            <div>
                                <span className="font-medium text-gray-600 text-xs block">Location</span>
                                15205 North Kierland Blvd. Suite 100
                            </div>
                            <div className=''>
                                <h3 className='text-xs maingray font-semibold'>Date & time  </h3>
                                <h4 className='text-sm  font-medium'>18/08/2024   08:00AM</h4>
                            </div>
                        </div>

                        <div className='col-span-4 w-full px-3'>
                            <span className="font-medium text-gray-600 text-xs block">Images</span>
                            <div className="flex gap-2 mt-2">
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="Room 1"
                                    className="w-24 h-20 md:w-40 md:h-32 object-cover rounded-md"
                                />
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="Room 2"
                                    className="w-24 h-20 md:w-40 md:h-32 object-cover rounded-md"
                                />
                            </div>
                        </div>

                        <div class="p-4">
                            <div class="flex items-start mb-2">
                                <input type="checkbox" id="terms" class="mt-1 mr-3" />
                                    <label for="terms" class="text-gray-800 text-sm font-bold">
                                        I accept the
                                        <a href="/TermsAndConditions" class="mainbluetext hover:underline"> Terms & Conditions</a>.
                                    </label>
                            </div>

                            <div class="flex items-start">
                                <input type="checkbox" id="insurance" class="mt-1 mr-3" />
                                    <label for="insurance" class="text-gray-800 text-sm font-bold">
                                        Add Insurance <span class="text-gray-500">(Optional)</span>
                                        <p class="text-gray-400 text-xs mt-1">
                                            Add $2 for your security in case anything unfortunate happens.
                                        </p>
                                    </label>
                            </div>
                        </div>



                    </div>

                    <div className="mt-2 flex border-t pt-2 pb-4 px-3 justify-between flex-wrap items-center">
                        <div className="flex items-center gap-5 px-2">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Client</label>
                                <div className='flex items-center'>
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="Provider"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="ml-3">
                                        <p className="text-gray-800 font-medium">Leslie Alexander</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-1 mt-5'>
                                <span className="font-medium text-gray-600 text-xs">Rated:</span>
                                <p className="text-yellow-400 text-sm flex items-center">
                                    ★★★★★
                                </p>
                            </div>
                        </div>
                        <div className='flex gap-3 mt-4'>
                            <button type="button" className='text-white bg-[#0FC281] rounded-lg px-5 py-1 md:py-2'>Accept</button>
                            <button type="button" className='text-white bg-[#F14336] rounded-lg px-5 py-1 md:py-2'>Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewOffer;