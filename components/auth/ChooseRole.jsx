import React from 'react';
import Image from "next/image";
function ChooseRole(props) {
    return (
        <>
            <section>
                <div onClick={() => props?.setLoginType("login")} className='grid grid-cols-3 pinkshadow outer hover:border-2 hover:border-[#1B75BC80] cursor-pointer py-5 px-3 rounded-xl w-full border-2 border-[#FFFFFF] bg-[#FFFFFF66]'>
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
                            <p className='text-sm font-normal maingray'>I am currently in search of professional services tailored to my needs.</p>
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

                <div onClick={() => props?.setLoginType("login")} className='grid grid-cols-3 mt-4 outer hover:border-2 mb-4 hover:border-[#1B75BC80] pinkshadow cursor-pointer py-5 px-3 rounded-xl w-full border-2 border-[#FFFFFF] bg-[#FFFFFF66]'>
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
                            <p className='text-sm font-normal maingray'>I offer specialized services tailored to meet your specific requirements.</p>
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
            </section>
        </>
    )
}

export default ChooseRole;