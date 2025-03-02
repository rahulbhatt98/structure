import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import Addcard from '../modals/addcard';
import Cookies from 'js-cookie';

function Payments() {
    const roleSelected = Cookies.get("roleSelected");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <section className='pb-10'>
                <h3 className="text-xl font-semibold text-gray-800 ml-3 my-3">{roleSelected === "professional" ? "My Earning" : "Payment Method"}</h3>


                {
                    roleSelected === "professional" && (
                        <div className="px-2 py-2">
                            <div className="flex flex-wrap gap-4 ">
                                {/* Total Earning */}
                                <div className="bg-white w-60 paymentsBorder rounded-lg p-6">
                                    <p className="text-gray-600 font-medium">Total Earning</p>
                                    <p className="text-3xl font-bold mainbluetext mt-2">$256</p>
                                </div>
                                {/* Pending Amount */}
                                <div className="bg-white paymentsBorder w-60 rounded-lg p-6">
                                    <p className="text-gray-600 font-medium">Pending Amount</p>
                                    <p className="text-3xl font-bold mainbluetext mt-2">$186</p>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className='space-y-6 mt-5'>

                    <div className='flex flex-wrap sm:flex-nowrap items-center justify-between bg-white mx-auto paymentsBorder rounded-xl px-9 py-5'>
                        <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-10'>
                            <Image src="/assets/creditcards.svg" alt="call" width="93" height="93" />
                            <div className='space-y-1'>
                                <h1 className='font-semibold text-xl'>Credit Card / Debit card</h1>
                                <p className='text-sm textgray'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has  standard dummy text.     </p>
                            </div>
                        </div>
                        <div>
                            {/* onClick={openModal} */}
                            <button className='buttonBorder textgray h-14 w-32 xl:w-36 mt-3 md:mt-0 rounded-lg font-bold text-sm xl:text-lg'>Add New Card</button>
                        </div>
                    </div>
                    {isModalOpen && (
                        <Addcard
                            isOpen={isModalOpen}
                            onClose={() => closeModal()}
                        />
                    )}

                    <div className='flex  flex-wrap sm:flex-nowrap items-center justify-between bg-white mx-auto paymentsBorder rounded-xl px-9 py-5'>
                        <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-10'>
                            <Image src="/assets/paypal.svg" alt="call" width="93" height="93" />
                            <div className='space-y-1'>
                                <h1 className='font-semibold text-xl'>PayPal Wallet</h1>
                                <p className='text-sm textgray'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has  standard dummy text.     </p>
                            </div>
                        </div>
                        <div>
                            <button className='buttonBorder textgray mt-3 md:mt-0 rounded-lg h-14 w-32 font-bold text-sm xl:text-lg'>Link Account</button>
                        </div>
                    </div>

                    <div className='flex flex-wrap sm:flex-nowrap items-center justify-between bg-white mx-auto paymentsBorder rounded-xl px-9 py-5'>
                        <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-10'>
                            <Image src="/assets/applepay.svg" alt="call" width="93" height="93" />
                            <div className='space-y-1'>
                                <h1 className='font-semibold text-xl'>Apple pay</h1>
                                <p className='text-sm textgray'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has  standard dummy text.     </p>
                            </div>
                        </div>
                        <div>
                            <button className='buttonBorder mt-3 md:mt-0 textgray h-14 w-32 rounded-lg  font-bold text-sm xl:text-lg'>Link Account</button>
                        </div>
                    </div>

                    <div className='flex flex-wrap sm:flex-nowrap items-center justify-between bg-white mx-auto paymentsBorder rounded-xl px-9 py-5'>
                        <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-10'>
                            <Image src="/assets/gpay.svg" alt="call" width="93" height="93" />
                            <div className='space-y-1'>
                                <h1 className='font-semibold text-xl'>Google Pay</h1>
                                <p className='text-sm textgray'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has  standard dummy text.     </p>
                            </div>
                        </div>
                        <div>
                            <button className='buttonBorder mt-3 md:mt-0 textgray h-14 w-32 rounded-lg font-bold text-sm xl:text-lg'>Link Account</button>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Payments;