import React from 'react';
import Image from 'next/image';


const RateServiceProviderModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white relative p-8 rounded-xl shadow-lg max-w-lg w-full">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>
                <h2 className="text-3xl font-semibold mb-1">Rate Service Provider</h2>
                <p className="text-base text-gray-600 mb-6">
                    Your email address and profile image will not be published.
                </p>

                <div className="flex items-center gap-3 mb-4 inputshadow p-2 rounded-lg">
                    <Image src="/assets/professional1.png" alt="call" width="50" height="50" />
                    <div>
                        <h3 className="font-semibold">Leslie Alexander</h3>
                        <p className="text-sm text-gray-500">Car Mechanics</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Give Rating
                    </label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-8 h-8 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write Your Review
                    </label>
                    <textarea
                        className="w-full grayBorder rounded-lg p-3 focus:outline-none inputshadow"
                        rows="4"
                        placeholder="Enter Service place address"
                    />
                </div>

                <div className='flex justify-center'>
                    <button type="submit" className="font-bold mainblue text-white py-4 px-20 blueshadow shadow-lg  shadow-[#1B75BC] rounded-xl">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RateServiceProviderModal;
