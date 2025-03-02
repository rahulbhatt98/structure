import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

function MakeOffer({ isOpen, onClose }) {
    const router = useRouter();

    if (!isOpen) return null;
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
                    <h2 className="text-lg font-semibold text-gray-800 px-3 py-2 shadow-sm">#85689</h2>
                    <div className='h-[50vh] 2xl:h-[40vh] overflow-y-auto'>
                        <div className='px-3 pb-2'>
                            <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mt-2">
                                Want to clean my home, I like deep cleaning under beds and couches
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 leading-5">
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium ...
                            </p>
                        </div>
                        <div className='flex w-full px-3 flex-wrap lg:flex-nowrap gap-2'>

                            <div className="mt-4 w-full lg:w-[60%] col-span-8">
                                <div className="flex flex-wrap justify-between">
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
                                </div>
                                <div className="flex-1 mt-2">
                                    <label className="block text-gray-600 font-medium mb-1">Final Offer (You can moderate this now)</label>
                                    <div class="relative flex-1">
                                        <span class="absolute left-2 top-1/2 transform -translate-y-1/2 mainbluetext">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            className="w-full lg:w-80 px-4 py-2 inputshadow rounded-md text-gray-700 GrayBorder outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center mt-2 gap-2">

                                    <div className="flex-1">
                                        <label className="block text-gray-600 font-medium mb-1">Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full lg:w-80 px-4 py-2 GrayBorder inputshadow rounded-md text-gray-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-gray-600 font-medium mb-1">Time</label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                className="w-full lg:w-80 px-4 py-2 GrayBorder inputshadow rounded-md text-gray-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-4 w-full lg:w-[40%]'>
                                <span className="font-medium text-gray-600 text-xs block">Images</span>
                                <div className="flex gap-2 mt-2">
                                    <img
                                        src="https://via.placeholder.com/100"
                                        alt="Room 1"
                                        className="w-24 h-20 md:w-44 md:h-36 object-cover rounded-md"
                                    />
                                    <img
                                        src="https://via.placeholder.com/100"
                                        alt="Room 2"
                                        className="w-24 h-20 md:w-44 md:h-36 object-cover rounded-md"
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="mt-4 p-3 font-bold">
                            <input type="checkbox" className="mr-2" />
                            I accept the <a href="#" className="mainbluetext">Terms & Conditions</a>.
                        </div>
                    </div>

                    <div className="mt-2 flex border-t pt-2 border-b pb-2 justify-between flex-wrap items-center">

                        <div className="flex items-center gap-5 px-2">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Provider</label>
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
                        <button
                            onClick={() => router.push("/chats/offerPayment")}
                            type='button'
                            className="bg-[#0FC281] greenShadow text-white px-6 py-2 mx-3 mt-3 md:mt-0 rounded-md font-semibold">
                            Confirm Payment & Make Offer
                        </button>
                    </div>

                    <div className="my-3 md:mr-3 px-1 flex gap-1 justify-end items-center">
                        <Image
                            src="/assets/iLogo.svg"
                            alt="message"
                            height="22"
                            width="22"
                            className="sm:w-4 sm:h-4"
                        />
                        <p className="text-xs text-gray-500">
                            When provider accepts, the amount will be deposited to the Jobizz.
                        </p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default MakeOffer;
