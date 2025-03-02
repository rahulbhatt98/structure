import React, { useEffect } from 'react'
import Image from "next/image";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectLoginAuth } from '../../redux/auth/authSlice';
import Cookies from "js-cookie";
import { getCurrentYear } from '../../utilities/helper';

const SelectedProfile = (props) => {
    const router = useRouter()

    const auth = useSelector(selectLoginAuth);

    const roleSelected = Cookies.get("roleSelected");

    console.log(auth,"auth dataaaaaaaaaaaaaaaaaaaaaaa");

    const handleSelectRole = (role) => {
        console.log(role, "role")
        if (role === "customer") {
            Cookies.set("roleSelected", "customer");
            if (auth?.first_name && auth?.last_name) {
                Cookies.set("profileStatus", true);
                router.push('/Home');
            } else {
                router.push('/auth/ProfileSetup');
                Cookies.set("profileStatus", false);
            }
        } else if (role === "professional") {
            Cookies.set("roleSelected", "professional");

            if (!auth?.professional?.admin_status && auth?.customStep != "4") {
                router.push('/auth/ProfessionalProfileSetup');
                Cookies.set("profileStatus", false);
            }
            else if (auth?.professional?.admin_status === "accepted") {
                Cookies.set("profileStatus", true);
                router.push('/tasks');
            } else {
                Cookies.set("profileStatus", false);
                Cookies.set("stepsDone", true);
                router.push('/auth/professionalVefication');
            }
        }
    }

    // useEffect(() => {
    //     if(roleSelected){
    //         if(!auth?.professional?.admin_verify && auth?.customStep != "4"){
    //             router.push('/auth/ProfessionalProfileSetup');
    //             Cookies.set("profileStatus", false);
    //         }
    //         else if (auth?.professional?.admin_verify) {
    //                 router.push('/tasks');
    //         } else {
    //             router.push('/auth/professionalVefication');
    //         }  
    //     }
    // }, [roleSelected])



    return (
        <>

            <section className="authbg  relative  overflow-y-auto flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
                <div className='flex gap-1 xl:gap-3 items-center absolute right-1 mid:right-2 xl:right-8 top-1 mid:top-3 xl:top-6 xl:w-36 px-2 rounded-lg cursor-pointer h-8 xl:h-10  bg-white border border-[#1B75BC26] dropdown'>
                    <Image
                        src="/assets/english.svg"
                        alt="Jobizz Logo"
                        height="16"
                        width="24"
                        className="mx-auto"
                    />
                    <span>English</span>
                    <Image
                        src="/assets/arrowdown.svg"
                        alt="Jobizz Logo"
                        height="18"
                        width="18"
                        className="mx-auto"
                    />
                </div>
                <div className="pinkshadow w-full  md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
                    <div className="text-center mb-4 md:mb-6">
                        <Image
                            src="/assets/logo.svg"
                            alt="Jobizz Logo"
                            height="71"
                            width="120"
                            className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px] cursor-pointer"
                            onClick={() => router.push('/')}
                        />
                        <h2 className="maxmid:text-xl text-base font-bold mt-2 maxmid:mt-5">Choose Your Role</h2>
                    </div>
                    <section>
                        <div onClick={() => handleSelectRole("customer")} className='grid grid-cols-3 pinkshadow outer hover:border-2 hover:border-[#1B75BC80] cursor-pointer py-5 px-3 rounded-xl w-full border-2 border-[#FFFFFF] bg-[#FFFFFF66]'>
                            <div className='customer md:ml-5 flex justify-center w-[83px] h-[83px] bg-white rounded-full hover-image'>
                                <Image
                                    src="/assets/customer.svg"
                                    alt="Jobizz Logo"
                                    height="49"
                                    width="32"
                                />
                            </div>
                            <div className='flex col-span-2 items-center'>
                                <div>
                                    <h2 className='text-lg font-bold'>Customer</h2>
                                    <p className='mid:text-sm text-xs font-normal maingray'>I am currently in search of professional services tailored to my needs.</p>
                                </div>

                                <div >
                                    <Image
                                        src="/assets/forward.svg"
                                        alt="forward"
                                        height="120"
                                        width="120"
                                    />
                                </div>
                            </div>
                        </div>



                        <div onClick={() => handleSelectRole("professional")} className='grid grid-cols-3 mt-4 outer hover:border-2 mb-4 hover:border-[#1B75BC80] pinkshadow cursor-pointer py-5 px-3 rounded-xl w-full border-2 border-[#FFFFFF] bg-[#FFFFFF66]'>
                            <div className='customer hover-image flex md:ml-5 justify-center w-[83px] h-[83px] bg-white rounded-full'>
                                <Image
                                    src="/assets/professionalMan.svg"
                                    alt="Jobizz Logo"
                                    height="49"
                                    width="42"
                                    className='ml-2'
                                />
                            </div>
                            <div className='flex col-span-2 items-center'>
                                <div>
                                    <h2 className='text-lg font-bold'>Professional</h2>
                                    <p className='mid:text-sm text-xs font-normal maingray'>I offer specialized services tailored to meet your specific requirements.</p>
                                </div>

                                <div>
                                    <Image
                                        src="/assets/forward.svg"
                                        alt="forward"
                                        height="120"
                                        width="120"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
                    © {getCurrentYear()} Jobizz, all rights reserved
                </div>
            </section >
        </>
    )
}

export default SelectedProfile