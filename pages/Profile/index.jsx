import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { selectLoginAuth } from '../../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import { useRouter } from "next/router";
import Ratings from '../../components/Profile/ratings';
import Payments from '../../components/Profile/payments';
import OrderHistory from '../../components/Profile/orderHistory';
import ServiceUsage from '../../components/Profile/serviceUsage';
import moment from 'moment-timezone';

function Profile() {
    const loginData = useSelector(selectLoginAuth);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Payment Methods');

    return (
        <>
            <section className='authbg'>
                <Header />
                <div className="px-8 mx-auto p-4 mt-28 md:mt-44 lg:mt-28">
                    {/* Profile Header */}
                    <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home</Link> &gt;
                    <span className="text-base md:text-lg font-medium "> My Profile</span>

                    <div className="bg-blue-100 profileBG mt-2 relative rounded-3xl p-6 space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-start">
                        {/* Profile Picture */}
                        <div className=" md:translate-y-16 border-[10px] rounded-full lmob:ml-5 border-white mb-4">
                            <Image src={loginData?.profile_photo ? loginData?.profile_photo : "/assets/profileman.png"} alt="Profile Picture" width="243" height="234" className="rounded-full w-[200px] bg-white h-[200px] object-cover" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 w-full md:w-auto">
                            <div className='flex flex-wrap justify-between items-start'>
                                {/* Name and Rating */}
                                <div className="text-center sm:text-left flex flex-col lg:flex-row lg:items-baseline gap-2 mb-4 sm:mb-10">
                                    <h2 className="text-4xl md:text-5xl xl:text-6xl text-white font-medium capitalize">{loginData?.first_name} {loginData?.last_name}</h2>
                                    <div className="bg-white flex items-center space-x-1 w-[61px] h-[26px] px-2 rounded-2xl mt-2">
                                        <Image src="/assets/darkstar.svg" alt="star" width="18" height="18" />
                                        <span className="text-base font-semibold mainbluetext">4.5</span>
                                    </div>
                                </div>
                                {/* Edit Button */}
                                <button onClick={() => router.push("/Profile/EditProfile")} className="flex items-center bg-[#FFFFFF33] inputbg gap-2 border text-white border-[#FFFFFF] py-2 px-4 rounded-lg">
                                    <Image src="/assets/Edit.svg" alt="edit" width="24" height="24" />
                                    <span className='text-sm font-bold'>Edit</span>
                                </button>
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 sm:mt-0 text-center sm:text-left">
                                <div className='flex items-center gap-3 text-left'>
                                    <Image src="/assets/Message.svg" alt="message" width="34" height="34" />
                                    <div className="text-white text-sm md:text-base xl:text-lg font-medium">
                                        <span className='text-[#ACDAFF]  block text-sm font-medium'>Email</span>
                                        {loginData?.email}
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 text-left'>
                                    <Image src="/assets/Call.svg" alt="call" width="34" height="34" />
                                    <div className="text-white text-sm md:text-base xl:text-lg  font-medium">
                                        <span className='text-[#ACDAFF] text-left block text-sm font-medium'>Phone</span>
                                        {loginData?.phone_code} {loginData?.phone_number}
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 text-left'>
                                    <Image src="/assets/Calendar.svg" alt="calendar" width="30" height="30" />
                                    <div className="text-white text-sm md:text-base xl:text-lg  font-medium">
                                        <span className='text-[#ACDAFF] text-left  block text-sm font-medium'>Date of Birth</span>
                                        {moment(loginData?.dob).format("DD/MM/YYYY")}
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 text-left col-span-1 lg:col-span-3'>
                                    <Image src="/assets/Location.svg" alt="location" width="24" height="24" />
                                    <div className="text-white text-sm md:text-base xl:text-lg  font-medium">
                                        <span className='text-[#ACDAFF] text-left  block text-sm font-medium'>Address</span>
                                        {loginData?.address}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Profile Navigation */}
                    <div className="flex justify-center text-xs sm:text-base font-medium mt-8 space-x-7 md:space-x-12">
                        <a
                            onClick={() => setActiveTab('Order History')}
                            className={`text-gray-600 border-b-4 cursor-pointer ${activeTab === 'Order History' ? 'border-[#EC008C]' : 'border-transparent hover:border-[#EC008C]'}`}
                        >
                            Order History
                        </a>
                        <a
                            onClick={() => setActiveTab('Payment Methods')}
                            className={`text-gray-600 border-b-4 cursor-pointer ${activeTab === 'Payment Methods' ? 'border-[#EC008C]' : 'border-transparent hover:border-[#EC008C]'}`}
                        >
                            Payment Methods
                        </a>
                        <a
                            onClick={() => setActiveTab('Rating and Reviews')}
                            className={`text-gray-600 border-b-4 cursor-pointer ${activeTab === 'Rating and Reviews' ? 'border-[#EC008C]' : 'border-transparent hover:border-[#EC008C]'}`}
                        >
                            Rating and Reviews
                        </a>
                        <a
                            onClick={() => setActiveTab('Service Usage Statistics')}
                            className={`text-gray-600 border-b-4 cursor-pointer ${activeTab === 'Service Usage Statistics' ? 'border-[#EC008C]' : 'border-transparent hover:border-[#EC008C]'}`}
                        >
                            Service Usage Statistics
                        </a>
                    </div>

                    {activeTab === 'Order History' && <OrderHistory />}
                    {activeTab === 'Payment Methods' && <Payments />}
                    {activeTab === 'Rating and Reviews' && <Ratings />}
                    {activeTab === 'Service Usage Statistics' && <ServiceUsage />}

                </div>
                <Footer />
            </section>
        </>
    )
}

export default Profile;