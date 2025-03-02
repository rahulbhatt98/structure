import React, { useState } from "react";
import Header from "../../components/common/Header";
import Link from "next/link";
import PaymentSummaryCard from "../../components/chats/paymentCard";
import Image from "next/image";

function OfferPayment() {
    const [selectedMethod, setSelectedMethod] = useState('paypal');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
        if (method == "mastercard") {
            setShowDropdown(!showDropdown)
        }
    };
    console.log(showDropdown, "showDropdown")


    return (
        <>
            <section className="authbg">
                <Header />
                <div>
                    <nav className="lg:mt-28 md:mt-44 mt-28 p-4 px-12">
                        <Link
                            href="/Home"
                            className="text-[#919EAB] font-medium text-base md:text-lg hover:underline"
                        >
                            Home
                        </Link>{" "}
                        &gt;
                        <Link
                            href="/chats"
                            className="text-[#919EAB] font-medium text-base md:text-lg hover:underline"
                        >
                            Chat
                        </Link>{" "}
                        &gt;
                        <span>Offer Payment</span>
                    </nav>
                </div>
                <section className="px-3 sm:px-10 grid grid-cols-12 gap-5 pb-3">
                    <section className="bg-white policyShadow rounded-lg col-span-12 lg:col-span-8 px-3 pb-3">
                        <h2 className="text-lg font-medium text-[#919EAB] px-3 py-2">
                            #85689
                        </h2>
                        <div className="px-3 pb-2">
                            <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mt-2">
                                Want to clean my home, I like deep cleaning under beds and
                                couches
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 leading-5">
                                Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium
                                assumenda est corrupti quia in doloribus veritatis ut voluptas
                                libero. Est placeat optio est illo minima eum debitis laboriosam
                                hic quaerat officiis sed unde perferendis! Lorem ipsum dolor sit
                                amet. Vel fuga molestiae est laudantium assumenda est corrupti
                                quia in doloribus veritatis ut voluptas libero. Est placeat
                                optio est illo minima eum debitis laboriosam hic quaerat
                                officiis sed unde perferendis! Lorem ipsum dolor sit amet. Vel
                                fuga molestiae est laudantium assumenda est corrupti quia in
                                doloribus veritatis ut voluptas libero. Est placeat optio est
                                illo minima eum debitis laboriosam hic quaerat officiis.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between px-3">
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
                        <div className="px-3 mt-2 lg:mt-7 grid grid-cols-12">
                            <div className='col-span-12 lg:col-span-4'>
                                <h3 className='text-xs maingray font-semibold'>Date & time  </h3>
                                <h4 className='text-sm  font-medium'>18/08/2024   08:00AM</h4>
                            </div>
                            <div className='col-span-12 lg:col-span-8 mt-2'>
                                <span className="font-medium text-gray-600 text-xs block">Images</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {/* <img
                                        src="https://via.placeholder.com/100"
                                        alt="Room 1"
                                        className="w-24 h-20 md:w-40 md:h-32 object-cover rounded-md"
                                    /> */}
                                  
                                </div>
                            </div>
                        </div>
                        <div className="px-6 maxmid:w-1/2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h2>

                            <div
                                className={`flex items-center p-4  inputshadow mb-2 rounded-lg ${selectedMethod === 'paypal' ? '' : ''
                                    }`}
                                onClick={() => handleMethodChange('paypal')}
                            >
                                <input
                                    type="radio"
                                    checked={selectedMethod === 'paypal'}
                                    onChange={() => handleMethodChange('paypal')}
                                    className="form-radio h-5 w-5 radio-custom mr-2"
                                />
                                <Image src="/assets/paypal.svg" alt="call" width="49" height="49" />
                                <div className="ml-4">
                                    <p className="font-semibold">PayPal</p>
                                    {/* <p className="text-sm text-gray-500">Lorem Ipsum is simply dummy text.</p> */}
                                </div>
                            </div>

                            <div
                                className={`flex items-center inputshadow p-4 mb-2 rounded-lg  ${selectedMethod === 'applepay' ? '' : ''
                                    }`}
                                onClick={() => handleMethodChange('applepay')}
                            >
                                <input
                                    type="radio"
                                    checked={selectedMethod === 'applepay'}
                                    onChange={() => handleMethodChange('applepay')}
                                    className="form-radio h-5 w-5 radio-custom mr-2"
                                />
                                <Image src="/assets/applepay.svg" alt="call" width="49" height="49" />
                                <div className="ml-4">
                                    <p className="font-semibold">Apple Pay</p>
                                </div>
                            </div>

                            <div
                                className={`flex items-center p-4 mb-2 inputshadow rounded-lg  ${selectedMethod === 'mastercard' ? '' : ''
                                    }`}
                                onClick={() => handleMethodChange('mastercard')}
                            >
                                <input
                                    type="radio"
                                    checked={selectedMethod === 'mastercard'}
                                    onChange={() => handleMethodChange('mastercard')}
                                    className="form-radio h-5 w-5 radio-custom mr-2"
                                />
                                <Image src="/assets/creditcards.svg" alt="call" width="47" height="47" />
                                <div className="ml-4 flex-1">
                                    <p className="font-semibold">Mastercard **** 5644</p>
                                    <p className="text-sm text-gray-500">Expires on 05/26</p>
                                </div>
                                {/* Dropdown Icon  */}
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Image alt="Jobizz Logo" width="20" height="16" src="/assets/arrowdown.svg" />
                                </button>
                            </div>

                            {/* Dropdown Content */}
                            {/* {selectedMethod === 'mastercard' && showDropdown && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                                    <p className="text-gray-700">Additional options for Mastercard</p>
                                </div>
                            )} */}

                            {/* Add New Payment Method */}
                            <div className="flex items-center mt-4">
                                <a href="/Profile" className="ml-2 mainbluetext font-semibold">
                                    + Add New Payment Method
                                </a>
                            </div>
                        </div>
                    </section>
                    <div className="col-span-12 lg:col-span-4">
                        <PaymentSummaryCard />
                    </div>
                </section>
            </section>
        </>
    );
}

export default OfferPayment;
