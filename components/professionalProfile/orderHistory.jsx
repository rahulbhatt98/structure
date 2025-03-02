import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function OrderHistory() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Order History</h3>
            <div className='mx-5 space-y-5 my-8'>
                <div className='bg-white  paymentsBorder rounded-xl px-6 py-5'>

                    <div className='borderbottom pb-4'>

                        <div className='flex justify-between'>
                            <div className='flex gap-3 items-center'>
                                <span className='maingray'>#85689</span>
                                <Image src="/assets/requested.svg" alt="call" width="93" height="93" />
                            </div>
                            <span className='mainbluetext text-xl md:text-3xl'>$25</span>
                        </div>

                        <div className='mt-3 md:mt-1'>
                            <h2>Want to clean my home, I like deep cleaning under beds and couches</h2>
                            {isExpanded && (
                                <p className='text-sm font-normal my-2'>Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium assumenda est corrupti quia in doloribus veritatis ut voluptas libero. Est placeat optio est illo minima eum debitis laboriosam hic quaerat officiis sed unde perferendis! Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium assumenda est corrupti quia in doloribus veritatis ut voluptas libero. Est placeat optio est illo minima eum debitis laboriosam hic quaerat officiis sed unde perferendis! Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium assumenda est corrupti quia in doloribus veritatis ut voluptas libero. Est placeat optio est illo minima eum debitis laboriosam hic quaerat officiis sed unde perferendis! Lorem ipsum dolor sit amet. Vel fuga molestiae est laudantium assumenda est corrupti quia in doloribus veritatis ut voluptas libero. Est placeat optio est illo minima eum debitis laboriosam hic quaerat officiis sed unde perferendis! </p>
                            )}

                            {!isExpanded && (
                                <div className='mt-2 flex gap-4 flex-wrap'>
                                    <div className='flex items-center gap-1'>
                                        <Image src="/assets/graylocation.svg" alt="call" width="20" height="20" />
                                        <p className='text-xs maingray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <Image src="/assets/graycalendar.svg" alt="call" width="14" height="16" />
                                        <p className='text-xs maingray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <Image src="/assets/graytimer.svg" alt="call" width="16" height="16" />
                                        <p className='text-xs maingray font-semibold'>15205 North Kierland Blvd. Suite 100</p>
                                    </div>
                                </div>
                            )}

                            <div className='mt-5 flex items-center flex-wrap justify-between sm:justify-normal  sm:gap-10 lg:gap-20'>
                                <div>
                                    <h3 className='text-xs maingray font-semibold'>Service </h3>
                                    <h4 className='text-sm font-medium'>House Maintenance </h4>
                                </div>
                                <div>
                                    <h3 className='text-xs maingray font-semibold'>Service Type  </h3>
                                    <h4 className='text-sm font-medium'>Cleaning</h4>
                                </div>
                                {isExpanded && (
                                    <>
                                        <div className='my-2 md:my-0'>
                                            <h3 className='text-xs maingray font-semibold'>Location </h3>
                                            <h4 className='text-sm font-medium'>15205 North Kierland Blvd. Suite 100 </h4>
                                        </div>
                                        <div className='sm:-mt-5 lg:-mt-0'>
                                            <h3 className='text-xs maingray font-semibold'>Date & time  </h3>
                                            <h4 className='text-sm font-medium'>18/08/2024   08:00AM</h4>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>


                    <div className='mt-3'>
                        <h3 className='text-sm maingray'>Client</h3>
                        <div className='mt-3 flex flex-wrap justify-between'>
                            <div className='flex flex-wrap items-center gap-3'>
                                <Image src="/assets/professional1.png" alt="call" width="50" height="50" />
                                <h5 className='text-xl font-semibold'>Leslie Alexander</h5>
                                <div className='flex gap-2 items-center'>
                                    <span className='text-sm maingray font-semibold'>Rated:</span>
                                    <Image src="/assets/darkstar.svg" alt="star" width="16" height="15" className=" rounded-full " />
                                </div>
                            </div>
                            {!isExpanded && (
                                <div className='flex gap-3 md:gap-4 mt-3 lg:mt-0'>
                                    <button className='text-white mainblue  font-semibold py-1 px-4 md:px-6 rounded-lg' onClick={toggleExpand}>
                                        View Details
                                    </button>
                                </div>
                            )}
                            {isExpanded && (
                                <div className='flex flex-wrap gap-5 items-center'>
                                    <button className='maingray text-sm border-b-2' onClick={toggleExpand}>Show less</button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OrderHistory;