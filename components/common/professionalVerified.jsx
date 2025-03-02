import React from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import { getCurrentYear } from '../../utilities/helper';

function ProfessionalVerified() {
    return (
        <>
            <section className="authbg  relative  overflow-y-auto flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
                <div className="pinkshadow w-full  md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">

                    <div className="text-center mb-6">
                        <Image
                            src="/assets/verified.svg"
                            alt="Jobizz Logo"
                            height="71"
                            width="120"
                            className="mx-auto"
                        />
                        <h2 className="text-2xl font-bold mt-4">Your details has been
                            submitted Successfully.</h2>
                    </div>
                    <div>
                        <p className="maingray text-base font-medium text-center">Our team will verify your details. Then you will be able to take the benefits and you will be informed on your email.</p>
                    </div>
                    <div className="flex justify-center ">
                        <button
                            // onClick={() => {
                            //     props?.setLoginType(""); router.replace({
                            //         pathname: router.pathname,
                            //         query: {},
                            //     })
                            // }}
                            type="button"
                            className="w-40 mainblue text-white p-4 blueshadow shadow-lg font-semibold mt-8 mb-5 shadow-[#1B75BC] rounded-xl"
                        >
                            Got it
                        </button>
                    </div>
                    <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
                        © {getCurrentYear()} Jobizz, all rights reserved
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProfessionalVerified;