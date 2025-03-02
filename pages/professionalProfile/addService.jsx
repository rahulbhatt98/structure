import React from 'react'
import Header from '../../components/common/Header'
import Services1 from '../../components/auth/Services1'

const AddService = () => {
    return (
        <section className='authbg'>
            <Header />
            <div className="xl:px-8 mx-auto xl:p-4 mt-28 md:mt-44 lg:mt-28">
            <div className="mx-auto xl:p-4 flex justify-center items-center">
                <div className="flex  flex-col lg:flex-row w-full lmob:mx-5 md:mx-10 shadow-lg rounded-xl border-2 border-[#FFFFFF] overflow-hidden">
                    <div className="w-full lg:w-1/4 bg-white pl-6">
                        <div className="mb-8">
                            <h2 className="text-[32px] font-semibold">Add Service</h2>

                        </div>
                    </div>
                    <Services1 />
                </div>
            </div>
            </div>


        </section>
    )
}

export default AddService