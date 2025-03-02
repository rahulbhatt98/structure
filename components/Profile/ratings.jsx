import React from 'react';
import Image from 'next/image';

function Ratings() {
    return (
        <div>
            <div className='flex gap-3 items-center my-5'>
                <h3 className="text-xl font-semibold text-gray-800">Rating and Reviews</h3>
                <div className="text-gray-500 text-xs sm:text-sm flex items-center gap-2 bg-white rounded-2xl px-2 py-1 pinkshadow">
                    <Image src="/assets/darkstar.svg" alt="star" width="20" height="20" className=" rounded-full " />
                    <span className="font-semibold mainbluetext ">4.5</span>
                    <span>(926.6k reviews)</span>
                </div>
            </div>
            <div className="shadow rounded-lg mt-6 bg-white p-4">

                <div className="space-y-6 mt-6 mx-5">
                    {/* Review 1 */}
                    <div className="border-b-2 border-b-[#FAECF3] pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Annalena</h4>
                                <div className="flex items-center space-x-1 text-yellow-500">
                                    {/* Star Rating */}
                                    <Image src="/assets/darkstar.svg" alt="star" width="20" height="20" className=" rounded-full " />

                                </div>
                            </div>
                            <div className="text-gray-500 text-sm">March 15, 2024</div>
                        </div>
                        <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit lorem vitae ultrices tempor...</p>
                    </div>

                    {/* Add more reviews as necessary */}
                    {/* Example Review */}
                    <div className="border-b-2 border-b-[#FAECF3] pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Anna Palermo</h4>
                                <div className="flex items-center space-x-1 text-yellow-500">
                                    <Image src="/assets/darkstar.svg" alt="star" width="20" height="20" className=" rounded-full " />
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm">March 15, 2024</div>
                        </div>
                        <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit lorem vitae ultrices tempor...</p>
                    </div>

                    <div className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Anna Palermo</h4>
                                <div className="flex items-center space-x-1 text-yellow-500">
                                    <Image src="/assets/darkstar.svg" alt="star" width="20" height="20" className=" rounded-full " />
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm">March 15, 2024</div>
                        </div>
                        <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit lorem vitae ultrices tempor...</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-center my-8'>
                <button className='mainbluetext bg-white border-2 px-6 font-bold text-lg py-2 blueBorder rounded-lg'>See more</button>
            </div>
        </div>
    )
}

export default Ratings;