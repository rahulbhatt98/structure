import React, { useEffect, useReducer, useState } from 'react';
import PersonalDetails from '../../components/auth/PersonalDetails';
import Image from "next/image";
import Services from '../../components/auth/Services';
import Documents from '../../components/auth/Documents';
import Portfolio from '../../components/auth/Portfolio';
import { useRouter } from 'next/router';
import useLocalStorage from '../../utilities/useLocalStorage';
import Cookies from "js-cookie";
import { getServiceStepAsync, logout, logoutApiAsync, selectLoginAuth } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

function ProfessionalProfileSetup() {
    const router = useRouter()
    const dispatch = useDispatch()

    const auth = useSelector(selectLoginAuth)
    const localValue = (auth?.customStep)?.toString()

    console.log(auth , "auth")

    const handleLogout = () => {
        dispatch(logoutApiAsync())
        .then(unwrapResult)
        .then((obj) => {
            Cookies.remove("authToken");
            Cookies.remove("roleSelected");
            Cookies.remove("profileStatus");
            Cookies.remove("stepsDone");
            dispatch(logout());
            router.push('/')
            window.location.reload();
        })
        .catch((obj) => {
        });
    };

    return (
        <>
            <section className="authbg relative h-full ">
                <div className='flex justify-between items-center pt-8 py-3 px-3 md:px-6'>
                    <div>
                        <Image
                            src="/assets/logo.png"
                            alt="Jobizz Logo"
                            height="46"
                            width="77"
                            className="mx-auto cursor-pointer"
                            onClick={() => router.push('/')}
                        />
                    </div>
                    <div className='flex items-center smob:mt-2 gap-2 md:gap-4'>
                        <button onClick={handleLogout} className='flex items-center gap-1 md:gap-3 border-[#EA4335] logoutshadow rounded-lg px-2 py-1 border bg-white'>
                            <Image
                                src="/assets/logoutred.svg"
                                alt="Jobizz Logo"
                                height="24"
                                width="24"
                                className='md:w-[24px] md:h-[24px] w-[20px] h-[20px]'
                            />
                            <span className='text-[#FF4242] text-sm md:text-lg'>Log Out</span>
                        </button>
                        
                        <div className='flex gap-1 md:gap-3 items-center w-28  md:w-36 px-1 md:px-2 rounded-lg cursor-pointer h-8 md:h-10  bg-white border border-[#1B75BC26] dropdown'>
                            <Image
                                src="/assets/english.svg"
                                alt="Jobizz Logo"
                                height="16"
                                width="24"
                                className="mx-auto"
                            />
                            <span className='text-sm md:text-base'>English</span>
                            <Image
                                src="/assets/arrowdown.svg"
                                alt="Jobizz Logo"
                                height="16"
                                width="24"
                                className="mx-auto"
                            />
                        </div>
                    </div>
                </div>
                <div className="mx-auto p-4 flex justify-center items-center">
                    <div className="flex  flex-col lg:flex-row w-full lmob:mx-5 md:mx-10 shadow-lg rounded-xl border-2 border-[#FFFFFF] overflow-hidden">
                        {/* <!-- Sidebar --> */}
                        <div className="w-full lg:w-1/4 bg-white p-4 pl-6">
                            <div className="mb-8">
                                <h2 className="text-[32px] font-semibold">Profile Setup</h2>
                                <ul className="relative mt-5">
                                    <li className="absolute left-4 top-9 h-10 w-[2px] bg-[#8DC63F]"></li>
                                    <li className="flex items-center mb-14">
                                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-[#8DC63F] text-white font-bold rounded-full">
                                            1
                                        </div>
                                        <span className="ml-4 text-lg font-semibold text-gray-800">Personal details</span>
                                    </li>
                                    <li className={`${(localValue === "1" || localValue === "2" || localValue === "3") ? 'bg-[#8DC63F]' : 'bg-[#D1E3F2]'} absolute left-4  top-32 h-10 w-[2px]`}></li>

                                    <li className="flex items-center mb-14">
                                        <div className={`${(localValue === "1" || localValue === "2" || localValue === "3") ? 'bg-[#8DC63F] text-white' : 'bg-[#1B75BC1A] text-[#919EAB]'} relative z-10 flex items-center justify-center w-8 h-8 font-bold rounded-full`}>
                                            2
                                        </div>
                                        <span className={`${(localValue === "1" || localValue === "2" || localValue === "3") ? 'text-gray-800' : 'text-[#919EAB]'} ml-4 text-lg font-semibold`}>Services</span>
                                    </li>
                                    <li className={`${(localValue === "2" || localValue === "3") ? 'bg-[#8DC63F]' : 'bg-[#D1E3F2]'} absolute left-4  top-[215px] h-10 w-[2px]`}></li>

                                    <li className="flex items-center mb-14">
                                        <div className={`${(localValue === "2" || localValue === "3") ? 'bg-[#8DC63F] text-white' : 'bg-[#1B75BC1A] text-[#919EAB]'} relative z-10 flex items-center justify-center w-8 h-8 font-bold rounded-full`}>
                                            3
                                        </div>
                                        <span className={`${(localValue === "2" || localValue === "3") ? 'text-gray-800' : 'text-[#919EAB]'} ml-4 text-lg font-semibold`}>Documents</span>
                                    </li>

                                    <li className="flex items-center">
                                        <div className={`${(localValue === "3") ? 'bg-[#8DC63F] text-white' : 'bg-[#1B75BC1A] text-[#919EAB]'} relative z-10 flex items-center justify-center w-8 h-8 font-bold rounded-full`}>
                                            4
                                        </div>
                                        <span className={`${(localValue === "3") ? 'text-gray-800' : 'text-[#919EAB]'} ml-4 text-lg font-semibold`}>Portfolio</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        {(!localValue || localValue === "0") && <PersonalDetails />}
                        {localValue === "1" && <Services />}
                        {localValue === "2" && <Documents />}
                        {localValue === "3" && <Portfolio />}
                    </div>
                </div>
            </section >
        </>
    )
}

export default ProfessionalProfileSetup;