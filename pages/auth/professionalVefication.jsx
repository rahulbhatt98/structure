import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getServiceStepAsync, logout, logoutApiAsync, selectLoginAuth } from '../../redux/auth/authSlice';
import { getCurrentYear } from '../../utilities/helper';
import Image from 'next/image';
import { unwrapResult } from '@reduxjs/toolkit';

function ProfessionalVefication() {
    const router = useRouter()
    const dispatch = useDispatch();
    const auth = useSelector(selectLoginAuth);
    const admin_status = auth?.professional?.admin_status;
    const reason = auth?.professional?.user_details?.reports;
    const professionalServices = auth?.professional?.professionalUserServices

    console.log(professionalServices?.filter(val => val?.admin_status === "refuse"),"saaaaaaaaaaaaaaaaaa11111111111111");

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    let imageSrc = "/assets/verified.svg";
    let imageHeight = "71";
    let imageWidth = "120";

    if (admin_status === "under_review" && professionalServices?.filter(val => val?.admin_status === "refuse")?.length === 0) {
        imageSrc = "/assets/underReview.png";
        imageHeight = "250";
        imageWidth = "375";
    } else if (admin_status === "document_rejected" || ((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)) {
        imageSrc = "/assets/docsRejected.png";
        imageHeight = "250";
        imageWidth = "375";
    } else if (admin_status === "profile_rejected") {
        imageSrc = "/assets/redcross.svg";
        imageHeight = "71";
        imageWidth = "120";
    }

    const handleLogout = () => {
        
        dispatch(logoutApiAsync())
        .then(unwrapResult)
        .then((obj) => {
            setIsLoggingOut(true);
            Cookies.remove("authToken");
            Cookies.remove("roleSelected");
            Cookies.remove("profileStatus");
            Cookies.remove("stepsDone");
            dispatch(logout());
            router.replace('/');
        })
        .catch((obj) => {
        });
        // window.location.reload();
    };


    const uploadDocument = () => {
        if(((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)){
            dispatch(getServiceStepAsync("1"));
        }
        else{
            dispatch(getServiceStepAsync("2"));
        }
        router.push("/auth/ProfessionalProfileSetup");
    };

    if (isLoggingOut) {
        return null;
    }

    return (
        <>
            <section className="authbg  relative  overflow-y-auto flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
                <div className="pinkshadow w-full  md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">

                    <div className="text-center mb-6">

                        <Image
                            // src="/assets/verified.svg"
                            src={imageSrc}
                            alt="Jobizz Logo"
                            height={(admin_status === "under_review" || admin_status === "document_rejected" || ((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)) ? "250" : "71"}
                            width={(admin_status === "under_review" || admin_status === "document_rejected" || ((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)) ? "375" : "120"}
                            className="mx-auto"
                        />
                        <h2 className="text-2xl font-bold mt-4">
                            {
                                (admin_status === "under_review" && professionalServices?.filter(val => val?.admin_status === "refuse")?.length === 0)
                                    ? "Profile under review"
                                    : admin_status === "profile_rejected"
                                        ? "Profile Refused"
                                        : admin_status === "document_rejected"
                                            ? "Document Rejected"
                                            :((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)?
                                            "Service Document Rejected":
                                             "Your details have been submitted successfully."
                            }

                        </h2>
                    </div>
                    <div>
                        <p className="maingray text-base font-medium text-center">
                            {
                                ((admin_status === "document_rejected" && reason?.report_type === "document") || (((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0)))
                                    ? reason?.description
                                    : "Our team will verify your details. Then you will be able to take the benefits and you will be informed on your email."
                            }


                        </p>
                    </div>
                    <div className="flex justify-center ">
                        {
                            ((admin_status === "document_rejected" && reason?.report_type === "document") || (((admin_status === null || admin_status === "under_review") && professionalServices?.filter(val => val?.admin_status === "refuse")?.length > 0))) ?
                                (
                                    <button
                                        onClick={() => { uploadDocument(); Cookies.set("stepsDone", false); }}
                                        type="button"
                                        className="w-44 mainblue text-white p-4 blueshadow shadow-lg font-semibold mt-8 mb-5 shadow-[#1B75BC] rounded-xl"
                                    >
                                        Upload Document
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {handleLogout(); Cookies.set("stepsDone", false);}}
                                        type="button"
                                        className="w-40 mainblue text-white p-4 blueshadow shadow-lg font-semibold mt-8 mb-5 shadow-[#1B75BC] rounded-xl"
                                    >
                                        Got it
                                    </button>

                                )
                        }

                    </div>
                    <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
                        © {getCurrentYear()} Jobizz, all rights reserved
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProfessionalVefication;