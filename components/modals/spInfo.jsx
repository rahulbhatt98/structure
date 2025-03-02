import Image from 'next/image';
import React from 'react'

function SpInfo({ isOpen, onClose, markers, id, handleNavigation }) {
    const matchedMarker = markers.find(marker => marker.user_id === id);

    console.log(matchedMarker, "matchedMarker")

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white relative p-4 pt-8 rounded-xl shadow-lg max-w-lg w-full">
                    <button
                        type='button'
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        &#x2715;
                    </button>

                    <li
                        onClick={() => handleNavigation(matchedMarker)}
                        // key={professional.id}
                        className='flex cursor-pointer justify-between items-center  gap-3'
                    // className={`${activeMarker === professional.user_id ? "border-2 border-pink-700" : ""} flex cursor-pointer justify-between xl:justify-end items-center  gap-3 bg-white mb-4 p-2 rounded-lg shadow-md`}
                    >
                        <div className="w-[90%] xl:w-2/3 mr-3 md:mr-0 ">
                            <div className="flex flex-wrap justify-between">
                                <h3 className="text-base md:text-lg font-semibold">
                                    {matchedMarker?.user_details?.first_name} {matchedMarker?.user_details?.last_name}
                                </h3>
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="ml-1 text-xs md:text-sm text-gray-800">
                                        {/* {professional.user_details.status === 'active' ? 'Online' : 'Offline'} */}
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center flex-wrap justify-between text-xs md:text-sm text-gray-600">
                                <div className='flex gap-3 items-center pt-2'>
                                    <img src="/assets/locationSign.svg" alt="" width="15" height="15" />
                                    <span className="text-xs md:text-sm mainbluetext font-semibold">
                                        {(matchedMarker?.user_details.distance).toFixed(1)} Km{' '}
                                        <span className="text-[#919EAB] font-medium ml-2">away</span>
                                    </span>
                                </div>
                                {/* <p className="text-xs md:text-sm text-[#919EAB]">
                                                        Experience: <span className="text-black">
                                                            {professional.work_experience ? `(${professional.work_experience} Years)` : "N/A"}
                                                        </span>
                                                    </p> */}
                            </div>
                            <div className="flex items-center py-2 -ml-1">
                                <img src="/assets/pinkLocationIcon.svg" alt="Jobizz Logo" height="24" width="24" />
                                <p className="text-xs md:text-sm">
                                    {matchedMarker?.user_details.address}
                                </p>
                            </div>
                            <p className="text-xs md:text-sm text-[#919EAB] ml-1">
                                Profession: <span className="text-black">{matchedMarker?.professionalUserServices[0]?.categories?.name || 'N/A'}</span>
                            </p>
                        </div>
                        <div className="relative">
                            <Image
                                src={matchedMarker?.user_details?.profile_photo ? matchedMarker?.user_details?.profile_photo : '/assets/professional1.png'}
                                alt="user"
                                width="131"
                                height="131"
                                className="rounded-lg w-[131px] h-[131px]"
                            />
                            <div className="absolute bottom-2 medmob:bottom-3.5 lmob:bottom-2 right-2 px-1 pr-2 bg-white rounded-2xl shadow">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 text-sm text-gray-800">4.5</span>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </>
    )
}

export default SpInfo;