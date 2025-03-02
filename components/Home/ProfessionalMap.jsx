import React, { useCallback, useEffect, useRef } from 'react';
import Image from "next/image";
import { useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { getTheMapList, selectLoginAuth } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import AutoModal from '../modals/AutoModal';
import SpCustomerInfo from '../modals/spCustomerInfo';

function ProfessionalMap({ taskData, setTaskView, setExpendableId, setIsExpanded, headerSearch }) {
    const dispatch = useDispatch();
    const auth = useSelector(selectLoginAuth);
    const mapRef = useRef();
    const router = useRouter();
    const toastId = useRef(null);
    const [activeMarker, setActiveMarker] = useState(null);
    const [showYouInfoWindow, setShowYouInfoWindow] = useState(true);

    const [myLocation, setMyLocation] = useState("")
    const [center, setCenter] = useState("")
    const [locationAccess, setLocationAccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const [isInfoModalOpen, setisInfoModalOpen] = useState(false);
    const closeInfoModal = () => setisInfoModalOpen(false);
    const handleOnLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const calculateExperience = (createdAt) => {
        if (!createdAt) return { years: 0, months: 0, days: 0 }; // Return zeros if no date is provided

        const createdDate = new Date(createdAt); // Convert string to Date
        const currentDate = new Date(); // Get current date

        let years = currentDate.getFullYear() - createdDate.getFullYear();
        let months = currentDate.getMonth() - createdDate.getMonth();
        let days = currentDate.getDate() - createdDate.getDate();

        // Adjust for negative days and months
        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate(); // Get the last month's date
        }

        if (months < 0) {
            years--;
            months += 12; // Add 12 months to the current month
        }

        return { years, months, days }; // Return the experience as an object
    };

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    setLocationAccess(true);
                    setCenter(headerSearch ? headerSearch : {
                        lat: (auth?.latitude && (Number(auth?.latitude) > 0)) ? Number(auth?.latitude) : latitude,
                        lng: (auth?.longitude && (Number(auth?.longitude) > 0)) ? Number(auth?.longitude) : longitude
                    })
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("Please allow the request for Geolocation.");
                            }
                            break;
                        case error.POSITION_UNAVAILABLE:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("Location information is unavailable.");
                            }
                            break;
                        case error.TIMEOUT:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("The request to get user location timed out.");
                            }
                            break;
                        case error.UNKNOWN_ERROR:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("An unknown error occurred.");
                            }
                            break;
                    }
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }


    const handleNavigation = (professional) => {
        console.log(professional, "sssssssssssssssssssssssss");
        setExpendableId(professional?.id)
        setIsExpanded(true)
        setTaskView("list")
    };

    useEffect(() => {
        getUserLocation();
    }, [headerSearch]);

    console.log(taskData, "task responseeeeeeeeeeeeeeee");

    return (
        <>
            {locationAccess ? (
                <section className='relative'>

                    <div className="w-full h-full">

                        {<GoogleMap
                            ref={mapRef}
                            onLoad={handleOnLoad}
                            onClick={() => {
                                setActiveMarker(null);
                                setShowYouInfoWindow(true)
                            }}
                            mapContainerStyle={{ width: "100%", height: "100vh", position: "relative" }}
                            center={center}
                            zoom={15}
                        >
                            <Marker
                                onClick={() => {
                                    setShowYouInfoWindow(!showYouInfoWindow);
                                }}
                                position={center}
                                icon={{
                                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          `),
                                    scaledSize: new window.google.maps.Size(40, 40)
                                }}
                                label={{
                                    text: ' ',
                                    className: `custom-label custom-blue`
                                }}
                            >


                                {showYouInfoWindow && center && center?.lat && center?.lng && (
                                    <InfoWindow position={{ lat: center.lat + 0.0010, lng: center.lng }} onCloseClick={() => setShowYouInfoWindow(false)}>

                                        <div className='flex  items-center justify-center gap-2 rounded-2xl'>
                                            <Image
                                                src='/assets/you.svg'
                                                width="23"
                                                height="23"
                                                alt="you"
                                            />
                                            <div>you</div>
                                        </div>

                                    </InfoWindow>
                                )}

                            </Marker>

                            {taskData.map(({ user_id, latitude, longitude, request_details, user_details }, index) => (
                                <Marker
                                    key={user_id}
                                    position={{ lat: Number(request_details?.latitude ? request_details?.latitude : latitude), lng: Number(request_details?.longitude ? request_details?.longitude : longitude) }}
                                    icon={{
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              `),
                                        scaledSize: new window.google.maps.Size(40, 40)
                                    }}
                                    label={{
                                        text: ' ', // Empty text for custom styling
                                        className: `custom-label-${index} custom-blue`
                                    }}
                                    onClick={() => { setActiveMarker(request_details?.user_details?.user_id ? request_details?.user_details?.user_id : user_details?.user_id); setisInfoModalOpen(true) }}
                                >
                                    {activeMarker === user_id ? (
                                        <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                            <div>{(request_details?.distance ? request_details?.distance : user_details?.distance ? user_details?.distance : 0.00)?.toFixed(1)} km away</div>
                                        </InfoWindow>
                                    ) : null}
                                </Marker>

                            ))}
                            {isInfoModalOpen && (
                                <SpCustomerInfo
                                    isOpen={isInfoModalOpen}
                                    onClose={() => closeInfoModal()}
                                    id={activeMarker}
                                    markers={taskData}
                                    handleNavigation={handleNavigation}
                                />
                            )}
                        </GoogleMap>
                        }
                        {
                            <style>{`
                                  ${taskData.map((marker, index) => `
                                    .custom-label-${index} {
                                      background-color: white;
                                      border-radius: 50%;
                                      padding: 5px;
                                    //   border: 2px solid white;
                                      background-image: url(${marker?.request_details?.user_details?.profile_photo ? marker?.request_details?.user_details?.profile_photo : marker?.user_details?.profile_photo ? marker?.user_details?.profile_photo : "/assets/mapprofile.svg"});
                                      background-size: cover;
                                      width: 40px;
                                      height: 40px;
                                    //   box-shadow: 0 0 8px rgba(0,0,0,0.5);
                                    }
                                  `).join('')}
                                `}</style>
                        }
                        {
                            <style>
                                {`.custom-label {
                                    background - color: white;
                                border-radius: 50%;
                                padding: 5px;
                                //   border: 2px solid white;
                                background-image: url(${auth?.profile_photo ? auth?.profile_photo : "/assets/mapprofile.svg"});
                                background-size: cover;
                                width: 40px;
                                height: 40px;
                                    //   box-shadow: 0 0 8px rgba(0,0,0,0.5);
}`}
                            </style>
                        }
                    </div>


                    {taskData?.length > 0 && <section className='xl:absolute xl:right-0 xl:bottom-4 xl:w-[500px] '>
                        <aside className=" h-full bg-[#FFFFFF33] border border-[#FFFFFF] p-4">
                            <div>
                                <div className='flex justify-between items-center'>
                                    <h2 className="text-3xl font-semibold">Clients</h2>
                                    <button type="button" onClick={() => setTaskView("list")} className='bg-white mainbluetext border py-2 px-4 rounded-lg font-bold border-[#1B75BC]'>
                                        See All
                                    </button>
                                </div>

                                <ul className="professionals overflow-y-auto mt-3">
                                    {taskData.map((professional, index) => {
                                        return (
                                            <li
                                                onClick={() => handleNavigation(professional)}
                                                key={professional.id}
                                                className={`${(activeMarker === (professional?.request_details?.user_details?.user_id ?professional?.request_details?.user_details?.user_id : professional?.user_details?.user_id)) ? "border-2 border-pink-700" : ""} flex cursor-pointer justify-between xl:justify-end items-center  gap-3 bg-white mb-4 p-2 rounded-lg shadow-md`}
                                            >
                                                <div className="md:ml-4 w-[90%] xl:w-2/3 mr-3 md:mr-0 ">
                                                    <div className="flex flex-wrap justify-between">
                                                        <h3 className="text-base md:text-lg font-semibold">
                                                            {professional?.request_details?.user_details?.first_name ? professional?.request_details?.user_details?.first_name :professional?.user_details?.first_name} {professional?.request_details?.user_details?.last_name ? professional?.request_details?.user_details?.last_name : professional?.user_details?.last_name}
                                                        </h3>
                                                        <div className="flex items-center">
                                                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                            <span className="ml-1 text-xs md:text-sm text-gray-800">
                                                                {(professional?.request_details?.user_details?.status ? professional?.request_details?.user_details?.status : professional?.user_details?.status) === 'active' ? 'Online' : 'Offline'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center flex-wrap justify-between text-xs md:text-sm text-gray-600">
                                                        <div className='flex gap-3 items-center pt-2'>
                                                            <img src="/assets/locationSign.svg" alt="" width="15" height="15" />
                                                            <span className="text-xs md:text-sm mainbluetext font-semibold">
                                                                {(professional?.request_details?.distance ? professional?.request_details?.distance :  professional?.user_details?.distance ? professional?.user_details?.distance : 0.00)?.toFixed(1)} Km{' '}
                                                                <span className="text-[#919EAB] font-medium ml-2">away</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center py-2 -ml-1">
                                                        <img src="/assets/pinkLocationIcon.svg" alt="Jobizz Logo" height="24" width="24" />
                                                        <p className="text-xs md:text-sm">{professional?.request_details?.address ? professional?.request_details?.address : professional?.address}</p>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-[#919EAB] ml-1">
                                                        {/* Profession: <span className="text-black">{professional?.professionalUserServices[0]?.categories?.name || 'N/A'}</span> */}
                                                    </p>
                                                </div>
                                                <div className="relative border-2">
                                                    <Image
                                                        src={professional?.request_details?.user_details?.profile_photo ? professional?.request_details?.user_details?.profile_photo : professional?.user_details?.profile_photo  ? professional?.user_details?.profile_photo : '/assets/professional1.png'}
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
                                        )
                                    }
                                    )}
                                </ul>
                                {isModalOpen && (
                                    <AutoModal
                                        isOpen={isModalOpen}
                                        onClose={() => closeModal()}
                                    />
                                )}
                            </div>
                        </aside>
                    </section>}
                </section >
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-gray-200">
                    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm text-center">
                        <p className="font-semibold text-lg mb-1">Allow “Location Access” to access</p>
                        <p className="font-semibold text-lg">Map location to see Nearby Professional</p>
                        {/* <p className="text-gray-500 text-sm mt-1 border-b-2 pb-2">Click retry button to allow access</p> */}
                        <div className="mt-2 flex items-center justify-center">
                            <button type="button" onClick={getUserLocation} className="flex items-center justify-center gap-1 text-blue-500 font-semibold">
                                Retry
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="M3.51 9a9 9 0 0114.88-3.36L23 10M1 14l5.09 5.09A9 9 0 0020.49 15"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default ProfessionalMap;