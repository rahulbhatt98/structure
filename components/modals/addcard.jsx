import React, { useState } from 'react';

function Addcard({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">Add New Card</h2>
                <form >
                    <div className="mb-4 relative">
                        <label htmlFor="card_number" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">Card Number</label>
                        <input
                            id="card_number"
                            // {...register("card_number")}
                            type='number'
                            maxLength={10}
                            placeholder="Enter Card Number"
                            className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="card_name" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">Name on card</label>
                        <input
                            id="card_name"
                            // {...register("card_name")}
                            maxLength={35}
                            type='text'
                            placeholder="Enter name on card"
                            className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <div className="mb-4 relative">
                            <label htmlFor="valid_upto" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">Valid Through</label>
                            <input
                                id="valid_upto"
                                // {...register("card_name")}
                                type='date'
                                placeholder="Enter name on card"
                                className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="valid_upto" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">CVV</label>
                            <input
                                id="valid_upto"
                                // {...register("card_name")}
                                type='text'
                                placeholder="Enter CVV"
                                className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <button type="submit" className="font-bold mainblue text-white py-4 px-20 blueshadow shadow-lg  shadow-[#1B75BC] rounded-xl">
                            Add Card
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default Addcard;