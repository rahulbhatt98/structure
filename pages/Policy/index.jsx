import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Link from "next/link";
import { TermsAndPolicy } from "../../redux/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import moment from "moment-timezone";


const Policy = () => {
    const [termsData, setTermsData] = useState(null);

    const dispatch = useDispatch();

    const GetTermsData = () => {

        dispatch(TermsAndPolicy())
            .then(unwrapResult)
            .then((obj) => {

                const terms = obj.data.data.find(item => item.slug === 'privacy_policy');
                setTermsData(terms);

            })
            .catch((obj) => { });
    }

    const formatDate = (isoString) => {
        return moment(isoString).format('D MMMM, YYYY');
    };

    useEffect(() => {
        GetTermsData();
    }, [dispatch])

    return (
        <>
            <section className="authbg">
                <Header />
                <nav className="lg:mt-24 md:mt-40 lmob:mt-60 medmob:mt-60 smob:mt-72 p-4 px-20 bg-[#F0F8FF]">
                    <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home</Link> &gt;
                    <span className="text-base md:text-lg font-medium"> Privacy Policy</span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4">Privacy Policy</h1>
                </nav>
                <div className="border-[#DBE7F1] border-b mx-auto px-4 py-3 sm:px-8 sm:py-4 lg:px-16 lg:py-5 bg-white">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 policyShadow">
                        <h2 className="mb-3 font-semibold">Privacy Policy</h2>
                        <p className="text-xs mb-4">Last Updated: {termsData?.updated_at ? formatDate(termsData?.updated_at) : 'N/A'}</p>
                        <div dangerouslySetInnerHTML={{ __html: termsData?.description }} />
                    </div>
                </div>
                <Footer />
            </section >
        </>
    );
}

export default Policy;
