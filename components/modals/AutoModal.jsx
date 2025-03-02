import { useRouter } from 'next/router';
import React from 'react'

function AutoModal({ isOpen, onClose }) {
    const router = useRouter();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-4 mx-4 md:p-8">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>
                <div className="text-center">
                    <h2 className="text-2xl text-black font-bold mb-4">Please Login or Sign Up</h2>
                    <p className="text-gray-700 mb-6">
                        To proceed further, please log in or sign up to continue.
                    </p>
                    <div className="flex justify-center gap-5 items-center">
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="mainblue text-sm text-white font-semibold px-4 py-3 rounded-xl"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => router.push("/auth/signup")}
                            className="border-2 border-[#1B75BC] mainbluetext font-semibold text-sm  px-4 py-2.5  bg-white rounded-xl"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AutoModal