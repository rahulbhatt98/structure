import React from 'react';
import Link from "next/link";
import Header from "../../components/common/Header";
import Image from "next/image";
import Footer from '../../components/common/Footer';
import Payments from '../../components/Profile/payments';

function PaymentMethods() {
    return (
        <>

            <section className="authbg">
                <Header />
                <div>
                    <nav className="lg:mt-28 md:mt-44 mt-28 p-4 px-12 bg-[#F0F8FF]">
                        <Link
                            href="/Home"
                            className="text-[#919EAB] font-medium text-base md:text-lg hover:underline"
                        >
                            Home
                        </Link>{" "}
                        &gt;
                        <span className="text-base md:text-lg font-medium">
                            {" "}
                            Manage Payment Methods
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4">
                            Manage Payment Methods
                        </h1>
                    </nav>
                </div>
                <div className='mx-12 mt-12'>

                    <Payments />
                </div>
                <Footer />
            </section>
        </>
    )
}

export default PaymentMethods;