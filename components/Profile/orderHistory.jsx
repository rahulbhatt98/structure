import React, { useState } from 'react';
import Image from 'next/image';
import RateServiceProviderModal from '../modals/rateService';


function OrderHistory() {

    const [isRateModalOpen, setIsRateModalOpen] = useState(false);

    const openModal = () => {
        setIsRateModalOpen(true);
    };

    const closeModal = () => setIsRateModalOpen(false);

    return (
        <>
            <section>
                <h3 className="text-xl font-semibold text-gray-800 ml-3 my-3">Order History</h3>
                <div className='bg-white mx-auto paymentsBorder rounded-xl px-6 py-5'>

                    <div className='borderbottom pb-4'>

                        <div className='flex justify-between'>
                            <div className='flex gap-3 items-center'>
                                <span className='maingray'>#85689</span>
                                <Image src="/assets/completed.svg" alt="call" width="93" height="93" />
                            </div>
                            <span className='mainbluetext text-xl md:text-3xl'>$25</span>
                        </div>

                        <div className='mt-3 md:mt-1'>
                            <h2 className='font-medium text-lg'>Want to clean my home, I like deep cleaning under beds and couches</h2>
                            <div className='mt-2 flex gap-4 flex-wrap'>
                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/graylocation.svg" alt="call" width="20" height="20" />
                                    <p className='text-xs textGray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/graycalendar.svg" alt="call" width="14" height="16" />
                                    <p className='text-xs textGray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/graytimer.svg" alt="call" width="16" height="16" />
                                    <p className='text-xs textGray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                </div>
                            </div>

                            <div className='mt-5 flex items-center justify-between sm:justify-normal sm:gap-20'>
                                <div>
                                    <h3 className='text-xs textGray font-semibold'>Service </h3>
                                    <h4 className='text-sm font-medium'>House Maintenance </h4>
                                </div>
                                <div>
                                    <h3 className='text-xs textGray font-semibold'>Service Type  </h3>
                                    <h4 className='text-sm font-medium'>Cleaning</h4>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='mt-3'>
                        <h3 className='text-sm font-medium maingray'>Service Provider</h3>
                        <div className='mt-3 flex flex-wrap justify-between'>
                            <div className='flex flex-wrap items-center gap-3'>
                                <Image src="/assets/professional1.png" alt="call" width="50" height="50" />
                                <h5 className='text-xl font-medium'>Leslie Alexander</h5>
                                <button onClick={openModal} className='mainbluetext mainblueBorder rounded-lg px-3 py-1 md:ml-6 text-sm md:text-base font-bold'>Rate Service Provider</button>
                            </div>
                            {isRateModalOpen && (
                                <RateServiceProviderModal
                                    isOpen={isRateModalOpen}
                                    onClose={() => closeModal()}
                                />
                            )}

                            <div className='flex gap-3 md:gap-4 mt-3 lg:mt-0'>
                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/needhelp.svg" alt="call" width="20" height="20" />
                                    <span className='text-xs font-medium underline'>Need Help</span>
                                </div>
                                <button className='text-white mainblue  font-semibold py-1 px-4 md:px-6 rounded-lg'>
                                    Book Again
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default OrderHistory;