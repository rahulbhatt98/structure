import React from 'react';
import Image from "next/image";


function Services() {
    return (
        <>
            <section className="bg-gray-50 py-3 md:py-8 pb-20">
                <div className=" mx-auto px-5  md:px-20">
                    <h2 className="text-xl md:text-5xl font-semibold text-center my-8">Discover Our Services</h2>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg  text-center pinkshadow">
                            <div className="flex  justify-center md:mb-4">
                                <Image src="/assets/carmechanic.png" alt="Car Mechanics" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Car Mechanics</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center  md:mb-4">
                                <Image src="/assets/electrician.png" alt="Electrical Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Electrical Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center  md:mb-4">
                                <Image src="/assets/hvac.png" alt="HVAC Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">HVAC Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center   md:mb-4">
                                <Image src="/assets/plumber.png" alt="Plumber Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Plumber Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center   md:mb-4 ">
                                <Image src="/assets/beautician.png" alt="Beautician Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Beautician Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center   md:mb-4 ">
                                <Image src="/assets/maintenance.png" alt="House Maintenance" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">House Maintenance</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center   md:mb-4 ">
                                <Image src="/assets/landscaping.png" alt="Landscaping & Outdoor Maintenance" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Landscaping & Outdoor Maintenance</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center">
                            <div className="flex justify-center   md:mb-4 ">
                                <Image src="/assets/carpenter.png" alt="Carpenter & Flooring Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Carpenter & Flooring Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center  lg:col-start-2">
                            <div className="flex justify-center   md:mb-4">
                                <Image src="/assets/roofing.png" alt="Roofing & Gutter Services" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Roofing & Gutter Services</h3>
                        </div>

                        <div className="bg-white p-2 md:p-3 2xl:p-6 rounded-lg pinkshadow  text-center  lg:col-start-3">
                            <div className="flex justify-center   md:mb-4">
                                <Image src="/assets/painting.png" alt="Painting And Wall Treatments" width="113" height="112" className='md:w-[113px] md:h-[112px] w-auto h-auto pt-3'/>
                            </div>
                            <h3 className="text-xs md:text-lg font-semibold">Painting And Wall Treatments</h3>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Services;