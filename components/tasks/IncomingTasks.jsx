import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { convertTo12Hour } from '../../utilities/helper';
import DeclineModal from '../modals/declineModal';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { selectLoginAuth } from '../../redux/auth/authSlice';

const IncomingTasks = ({ isExpanded, toggleExpand, data, declined, getTask, expendableId, opened }) => {

    const [isModalDeclineOpen, setisModalDeclineOpen] = useState(false);
    const [declinedId, setDeclinedId] = useState("")
    const openDeclineModal = (data) => {
        setDeclinedId(data)
        setisModalDeclineOpen(true);
    };

    const auth = useSelector(selectLoginAuth)

    console.log(data,"ssssssssssssssssssssssss")

    const closeDeclineModal = () => setisModalDeclineOpen(false);

    const scrollToSection = (expendableId) => {
        const element = document.getElementById(expendableId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    useEffect(() => {
        if (expendableId) {
            setTimeout(() => {
                scrollToSection(expendableId)
            }, 400);
        }
    }, [expendableId])


    return (
        <div className='mx-5 md:mx-10 space-y-5 my-10'>

            <div className='bg-white  paymentsBorder rounded-xl px-6 py-5' id={data?.id}>

                <div className='borderbottom pb-4' >

                    <div className='flex justify-between'>
                        <div className='flex gap-3 items-center'>
                            <span className='maingray text-xs md:text-base'>#{data?.request_id}</span>
                            {/* {data?.request_details?.request === "global_request" ? <Image src="/assets/requested.svg" alt="call" width="131" height="33" /> :(data?.request_details?.request === "private_request" && data?.request_status !== "declined")?
                            <Image src="/assets/private.svg" alt="call" width="131" height="33" />
                        :(data?.request_details?.request === "private_request" && data?.request_status === "declined")
                        ?<Image src="/assets/denied.svg" alt="call" width="86" height="33" />
                        :
                        <Image src="/assets/urgent.svg" alt="call" width="131" height="33" />
                        } */}
                        </div>
                        {
                            data?.request_details?.budget && (
                                <div className='flex'>
                                    <span className='text-gray-400 text-sm mr-1'>Offer Price</span>
                                    <span className='mainbluetext text-xl md:text-3xl'>{data?.request_details?.budget ? `$${data?.request_details?.budget}` : ""}</span>
                                </div>
                            )
                        }
                    </div>

                    <div className='mt-3 md:mt-1'>
                        <h2 className='font-bold capitalize'>{data?.request_details?.title}</h2>
                        {(isExpanded && data?.id === expendableId) && (
                            <p className='text-sm font-normal my-2'>{data?.request_details?.details}</p>
                        )}
                        {((data?.id != expendableId)) && (
                            <div className='mt-2 flex gap-4 flex-wrap'>
                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/graylocation.svg" alt="call" width="20" height="20" />
                                    <p className='text-xs maingray font-semibold'>{data?.request_details?.request_type === "door_step" ?  data?.request_details?.address : auth?.address}</p>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <Image src="/assets/graycalendar.svg" alt="call" width="14" height="16" />
                                    <p className='text-xs maingray font-semibold'>{data?.request_details?.date}</p>
                                </div>

                                {<div className='flex items-center gap-1'>
                                    <Image src="/assets/graytimer.svg" alt="call" width="16" height="16" />
                                    <p className='text-xs maingray font-semibold'>{convertTo12Hour(data?.request_details?.time)}</p>
                                </div>}
                            </div>
                        )}

                        <div className='mt-5 flex items-center flex-wrap justify-between sm:justify-normal  sm:gap-10 lg:gap-20'>
                            <div>
                                <h3 className='text-xs maingray font-semibold'>Service </h3>
                                <h4 className='text-sm font-medium'>{data?.request_details?.request_services?.length > 0 && data?.request_details?.request_services.map(item => item.services.name).join(', ')} </h4>
                            </div>
                            <div>
                                <h3 className='text-xs maingray font-semibold'>Service Type  </h3>
                                <h4 className='text-sm font-medium'>{data?.request_details?.request_services?.length > 0 && data?.request_details?.request_services[0]?.services?.categories?.name}</h4>
                            </div>
                            <div className='sm:-mt-5 lg:-mt-0'>
                                <h3 className='text-xs maingray font-semibold'>Total Price  </h3>
                                <h4 className='text-sm mainbluetext font-medium'>{`$${data?.request_details?.total_amount}`}</h4>
                            </div>

                            {(isExpanded && data?.id === expendableId) && (
                                <>
                                    <div className='my-2 md:my-0'>
                                        <h3 className='text-xs maingray font-semibold'>Location </h3>
                                        <h4 className='text-sm font-medium'>{data?.request_details?.request_type === "door_step" ?  data?.request_details?.address : auth?.address} </h4>
                                    </div>
                                    <div className='sm:-mt-5 lg:-mt-0'>
                                        <h3 className='text-xs maingray font-semibold'>Date & time  </h3>
                                        <h4 className='text-sm  font-medium'>{moment(data?.request_details?.date).format("DD-MM-YYYY")} &nbsp; {convertTo12Hour(data?.request_details?.time)}</h4>
                                    </div>
                                </>
                            )}

                        </div>

                        {(isExpanded && data?.id === expendableId) && <div className='w-full mt-3'>
                            <div  className=''>

                                {
                                    (data?.request_details?.images && data?.request_details?.images?.length > 0) &&
                                    <>
                                        <h3 className='text-xs maingray font-semibold mb-3'>Image</h3>
                                        <div className='flex gap-4 flex-wrap'>
                                            {data?.request_details?.images?.map((val, index) =>
                                               (val?.toLowerCase()?.slice(-3) === 'mp4' || val?.toLowerCase()?.slice(-3) === 'mov' || val?.toLowerCase()?.slice(-3) === 'avi' )?
                                               <video
                                               key={index}
                                               src={val}
                                               controls
                                               className="w-[150px] h-[150px] border object-cover rounded-lg"
                                             />
                                               :
                                               <Image key={index} src={val} alt="call" className='rounded-lg' width="150" height="150" />
                                            )}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>}
                    </div>
                </div>


                <div className='mt-3' >
                    <h3 className='text-sm maingray'>Client</h3>
                    <div className='mt-3 flex flex-wrap justify-between'>
                        <div className='flex flex-wrap items-center gap-3'>
                            <Image src={data?.request_details?.user_details?.profile_photo ? data?.request_details?.user_details?.profile_photo : "/assets/professional1.png"} alt="call" className='w-[50px] h-[50px]' width="50" height="50" />
                            <h5 className='text-xl font-semibold'>{data?.request_details?.user_details?.first_name} {data?.request_details?.user_details?.last_name}</h5>
                            {/* <div className='flex gap-2 items-center'>
                                <span className='text-sm maingray font-semibold'>Rated:</span>
                                <Image src="/assets/darkstar.svg" alt="star" width="16" height="15" className=" rounded-full " />
                            </div> */}
                        </div>

                        {(isExpanded && data?.id === expendableId) ? (
                            <div className='flex flex-wrap mt-2 lg:mt-0 gap-5 items-center'>
                                <button type="button" className='maingray text-sm border-b-2' onClick={() => toggleExpand("close", data?.id)}>Show less</button>
                                {
                                    declined ?
                                        <></>
                                        : opened ?
                                            <button className='text-white mainblue  font-semibold py-1 px-4 md:px-6 rounded-lg' onClick={() => toggleExpand("open", data?.id)}>
                                                Offer
                                            </button>
                                            :
                                            <>
                                                <button type="button" className='text-white mainblue rounded-lg px-5 py-1 md:py-2'>Start Chat</button>
                                                <button type="button" className='text-white bg-[#0FC281] rounded-lg px-5 py-1 md:py-2'>Accept</button>
                                                <button type="button" onClick={() => { openDeclineModal(data) }} className='text-white bg-[#F14336] rounded-lg px-5 py-1 md:py-2'>Decline</button>
                                            </>
                                }
                            </div>
                        ) :
                            <div className='flex gap-3 md:gap-4 mt-3 lg:mt-0'>
                                <button className='text-white mainblue  font-semibold py-1 px-4 md:px-6 rounded-lg' onClick={() => toggleExpand("open", data?.id)}>
                                    View Details
                                </button>
                            </div>
                        }

                    </div>
                    {isModalDeclineOpen && (
                        <DeclineModal
                            isOpen={isModalDeclineOpen}
                            onClose={() => closeDeclineModal()}
                            declinedId={declinedId}
                            getTask={getTask}
                            toggleExpand={toggleExpand}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default IncomingTasks