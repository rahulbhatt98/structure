import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { getCurrentYear } from '../../utilities/helper';
import Cookies from 'js-cookie';


function Footer() {
    const router = useRouter();
    const roleSelected = Cookies.get("roleSelected");


    return (
        <>
            <section className='bg-white'>
                <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-6 md:gap-10 border-b border-[#DBE7F1] px-4 md:px-9'>

                    <div className='flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-7 border-b lg:border-b-0 lg:border-r border-[#DBE7F1] py-4 lg:py-10'>
                        <Image
                            src="/assets/logo.svg"
                            alt="Jobizz Logo"
                            height="86"
                            width="117"
                            className="cursor-pointer"
                            onClick={() => router.push('/')}
                        />
                        <p className='text-gray-600 font-normal text-sm'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since printing and typesetting industry. Lorem Ipsum dummy text has standard dummy text ever since printing and.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 py-4 lg:py-10 text-sm font-normal'>
                        <div>
                            <ul className='space-y-2'>
                                <li onClick={() => router.push('/')} className='text-gray-600 cursor-pointer'>Home</li>
                                <li onClick={() => router.push('/TermsAndConditions')} className='text-gray-600 cursor-pointer'>Terms and Conditions</li>
                                <li onClick={() => router.push('/Policy')} className='text-gray-600 cursor-pointer'>Privacy Policy</li>
                            </ul>
                        </div>
                        <div>
                            <ul className='space-y-2'>
                                <li onClick={() =>
                                    router.push(
                                        `/${roleSelected === "customer"
                                            ? "Home/blogs-customer"
                                            : roleSelected === "professional"
                                                ? "blogs/blogs-professional"
                                                : "blogs/allBlogs"
                                        }`
                                    )
                                } className='text-gray-600 cursor-pointer'>Blogs</li>
                                <li className='text-gray-600 cursor-pointer'>Help and Support</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-gray-600 mb-3'>Follow Us:</h3>
                            <ul className='flex space-x-3'>
                                <li className='cursor-pointer'>
                                    <Image
                                        src="/assets/Facebook.svg"
                                        alt="Facebook Logo"
                                        height="20"
                                        width="20"
                                    />
                                </li>
                                <li className='cursor-pointer'>
                                    <Image
                                        src="/assets/insta.svg"
                                        alt="Instagram Logo"
                                        height="20"
                                        width="20"
                                    />
                                </li>
                                <li className='cursor-pointer'>
                                    <Image
                                        src="/assets/twitter.svg"
                                        alt="Twitter Logo"
                                        height="20"
                                        width="20"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='py-4 px-4 md:px-6'>
                    <p className='text-[#637381] text-sm'>© {getCurrentYear()} Jobizz, all rights reserved</p>
                </div>
            </section>


        </>
    )
}

export default Footer;