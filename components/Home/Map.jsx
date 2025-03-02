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
import useLoadGoogleMaps from '../../utilities/useLoadGoogleMaps';
import SpInfo from '../modals/spInfo';
import RotatingLoaderWithImage from '../common/RotateLoader';

function Map({ onViewProvider, selectedService, headerSearch }) {

    // const isLoaded1 = useLoadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_KEY);
    const dispatch = useDispatch();
    const auth = useSelector(selectLoginAuth);
    const mapRef = useRef();
    const router = useRouter();
    const toastId = useRef(null);
    const [mapLoading, setMapLoading] = useState(false)
    const [selected, setSelected] = useState('nearby');
    const [activeMarker, setActiveMarker] = useState(null);
    const [showYouInfoWindow, setShowYouInfoWindow] = useState(true);

    const [myLocation, setMyLocation] = useState("")
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const verifiedLogin = Cookies.get("authToken");

    console.log(auth, "saaaaaaaaaaaaaaaaaaaaaaaaa");

    const [locationAccess, setLocationAccess] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };


    const [isInfoModalOpen, setisInfoModalOpen] = useState(false);

    const closeInfoModal = () => setisInfoModalOpen(false);

    // const handleOnLoad = (map) => {
    //     // console.log(markers,"Saaaaaaaaaaaaaaaaaa");
    //     // if(markers?.length > 0 ){
    //     //     const bounds = new window.google.maps.LatLngBounds();
    //     //     markers.forEach(({ position }) => bounds?.extend(position));
    //     //     map.fitBounds(bounds);
    //     // }

    // };

    const handleOnLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    function getUserLocation() {
        setMapLoading(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    getMapList(latitude, longitude)
                    setLocationAccess(true);
                    setMyLocation()
                    setMapLoading(false)
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("Please allow the request for Geolocation.");
                                setMapLoading(false)
                            }
                            break;
                        case error.POSITION_UNAVAILABLE:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("Location information is unavailable.");
                                setMapLoading(false)
                            }
                            break;
                        case error.TIMEOUT:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("The request to get user location timed out.");
                                setMapLoading(false)
                            }
                            break;
                        case error.UNKNOWN_ERROR:
                            if (!toast.isActive(toastId.current)) {
                                toastId.current = toast.error("An unknown error occurred.");
                                setMapLoading(false)
                            }
                            break;
                    }
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setMapLoading(false)
        }
    }

    const getMapList = (latitude, longitude) => {

        setIsLoading(true);
        let params = {
            page: 1,
            limit: 10,
            latitude: headerSearch ? headerSearch : (auth?.latitude && verifiedLogin) ? Number(auth?.latitude) : latitude,
            longitude: headerSearch ? headerSearch : (auth?.longitude && verifiedLogin) ? Number(auth?.longitude) : longitude,
            keyword: selectedService || undefined
        }

        if (auth?.id) {
            params = {
                "userId": auth?.id,
                ...params
            }
        }

        console.log(auth?.latitude, auth, params, latitude, "dssssssssssssssssssssssssss");
        dispatch(getTheMapList(params))
            .then((obj) => {
                setCenter(headerSearch ? headerSearch : {
                    lat: (auth?.latitude && (Number(auth?.latitude) > 0) && verifiedLogin) ? Number(auth?.latitude) : latitude,
                    lng: (auth?.longitude && (Number(auth?.longitude) > 0) && verifiedLogin) ? Number(auth?.longitude) : longitude
                })
                setMarkers(obj.payload.data.data.data);
                setIsLoading(false);
                console.log(auth, "dssssssssssssssssss");
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    const handleNavigation = (professional) => {
        if (verifiedLogin) {
            router.push({
                pathname: '/professionals/professionalData',
                query: {
                    id: professional?.user_id,
                    distance: professional?.user_details?.distance,
                },
            });
        } else {
            setIsModalOpen(true);
        }
    };

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

    useEffect(() => {
        if (selectedService || headerSearch) {
            getUserLocation();
        }
    }, [selectedService, headerSearch]);

    useEffect(() => {
        getUserLocation();
    }, []);

    // if (!isLoaded1) return <></>;

    console.log(locationAccess, "locatinAccesssssss");

    return (
        <>
            {
                mapLoading ?
                    <div className="h-[80vh] flex justify-center items-center bg-white">
                        <RotatingLoaderWithImage />
                    </div>
                    :
                    locationAccess ? (
                        <section className='relative md:mt-14'>

                            {
                                onViewProvider ? (

                                    <div className='flex justify-center relative z-20 mb-2'>
                                        <div className="flex justify-center  items-center bg-white md:p-2 p-1 rounded-full shadow-lg">
                                            <div
                                                className="
                                px-4 md:px-6  py-2  md:py-3 rounded-full text-xs md:text-base font-semibold focus:outline-none transition-colors duration-300"
                                            >
                                                Suggestions for Quick Job Professionals
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex justify-center relative -translate-y-1.5 mb-2 z-10'>
                                        <div className="flex justify-center items-center bg-white md:p-2 p-1 rounded-full shadow-md">
                                            <button
                                                className={`${selected === 'nearby' ? 'bg-[#1B75BC] text-white' : 'text-[#637381]'
                                                    } px-4 md:px-6  py-2  md:py-3  rounded-full text-xs md:text-base font-semibold focus:outline-none transition-colors duration-300`}
                                                onClick={() => setSelected('nearby')}
                                            >
                                                Professional Nearby
                                            </button>
                                            <button
                                                className={`${selected === 'urgent' ? 'bg-[#1B75BC] text-white' : 'text-[#637381]'
                                                    } px-4 md:px-6  py-2 md:py-3 flex items-center gap-2 rounded-full text-xs md:text-base font-semibold focus:outline-none transition-colors duration-300`}
                                            // onClick={() => setSelected('urgent')}
                                            >
                                                Create Urgent Request
                                                <Image width="18" height="16" src="/assets/Vector.svg" />
                                            </button>
                                        </div>
                                    </div>

                                )
                            }

                            <div className="w-full">

                                {<GoogleMap
                                    ref={mapRef}
                                    onLoad={handleOnLoad}
                                    // onClick={() => setActiveMarker(null)}
                                    onClick={() => {
                                        setActiveMarker(null);
                                        setShowYouInfoWindow(true)
                                        // Close the "you" info window when the map is clicked
                                    }}
                                    mapContainerStyle={{ width: "100%", height: "80vh", position: "relative" }}
                                    center={center}
                                    // center={{ lat: 30.6588066, lng: 76.7220969 }}
                                    zoom={15}
                                >
                                    <Marker
                                        // position={center}
                                        // icon={{
                                        //     url: auth?.profile_photo ? auth?.profile_photo : "https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg", // Use profile picture as marker icon
                                        //     scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
                                        //     origin: new window.google.maps.Point(0, 0), // Origin of the image
                                        //     anchor: new window.google.maps.Point(25, 25), // Anchor point for the icon
                                        //     borderRadius: "50%",
                                        //     position: "relative"
                                        // }}
                                        onClick={() => {
                                            setShowYouInfoWindow(!showYouInfoWindow); // Toggle info window on marker click
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
                                            text: ' ', // Empty text for custom styling
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

                                    {markers.map(({ user_id, user_details }, index) => (
                                        // <Marker

                                        //     key={user_id}
                                        //     position={{ lat: Number(user_details?.latitude), lng: Number(user_details?.longitude) }}
                                        //     icon={{
                                        //         url: user_details?.profile_photo ? user_details?.profile_photo : "https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg", // Use profile picture as marker icon
                                        //         scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
                                        //         origin: new window.google.maps.Point(0, 0), // Origin of the image
                                        //         anchor: new window.google.maps.Point(25, 25), // Anchor point for the icon
                                        //         borderRadius: "50%",
                                        //     }}
                                        //     onClick={() => handleActiveMarker(user_id)}
                                        // >
                                        //     {activeMarker === user_id ? (
                                        //         <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                        //             <div>{(user_details?.distance)?.toFixed(1)} km away</div>
                                        //         </InfoWindow>
                                        //     ) : null}
                                        // </Marker>

                                        <Marker
                                            key={user_id}
                                            position={{ lat: Number(user_details?.latitude), lng: Number(user_details?.longitude) }}
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
                                            onClick={() => { setActiveMarker(user_id); setisInfoModalOpen(true) }}
                                        >
                                            {activeMarker === user_id ? (
                                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                                    <div>{(user_details?.distance)?.toFixed(1)} km away</div>
                                                </InfoWindow>
                                            ) : null}
                                        </Marker>

                                    ))}
                                    {isInfoModalOpen && (
                                        <SpInfo
                                            isOpen={isInfoModalOpen}
                                            onClose={() => closeInfoModal()}
                                            id={activeMarker}
                                            markers={markers}
                                            handleNavigation={handleNavigation}
                                        />
                                    )}
                                </GoogleMap>
                                }
                                {
                                    <style>{`
                                  ${markers.map((marker, index) => `
                                    .custom-label-${index} {
                                      background-color: white;
                                      border-radius: 50%;
                                      padding: 5px;
                                    //   border: 2px solid white;
                                      background-image: url(${marker?.user_details?.profile_photo ? marker?.user_details?.profile_photo : "/assets/mapprofile.svg"});
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


                            {markers?.length > 0 && <section className='xl:absolute xl:right-0 xl:bottom-4 xl:w-[500px] '>
                                <aside className=" h-full bg-[#FFFFFF33] backdrop-blur-[2px]  border border-[#FFFFFF] p-4">
                                    <div>
                                        <div className='flex justify-between items-center'>
                                            <h2 className="text-3xl font-semibold">Professionals</h2>
                                            <button onClick={() => { verifiedLogin ? router.push(`/professionals?selectedService=${selectedService}`) : router.push(`/Home/professionalList?selectedService=${selectedService}`); }} className='bg-white mainbluetext border py-2 px-4 rounded-lg font-bold border-[#1B75BC]'>
                                                See All
                                            </button>
                                        </div>

                                        <ul className="professionals overflow-y-auto mt-3">
                                            {markers.map((professional, index) => {
                                                // Calculate experience outside of JSX
                                                const { years, months, days } = calculateExperience(professional.created_at);

                                                // Prepare experience string
                                                let experienceString = "";
                                                if (years > 0) {
                                                    experienceString += `${years} Year${years > 1 ? 's' : ''}`;
                                                }
                                                if (months > 0) {
                                                    experienceString += (years > 0 ? `, ` : ``) + `${months} Month${months > 1 ? 's' : ''}`;
                                                }
                                                if (days > 0) {
                                                    experienceString += (years > 0 || months > 0 ? `, ` : ``) + `${days} Day${days > 1 ? 's' : ''}`;
                                                }
                                                if (years === 0 && months === 0 && days === 0) {
                                                    experienceString = "N/A";
                                                }


                                                return (
                                                    <li
                                                        // onClick={() => router.push({
                                                        //     pathname: verifiedLogin ? "/professionals/professionalData" : ,
                                                        //     query: { id: professional?.user_id, distance: professional?.user_details?.distance },
                                                        // })}
                                                        onClick={() => handleNavigation(professional)}
                                                        key={professional.id}
                                                        className={`${activeMarker === professional.user_id ? "border-2 border-pink-700" : ""} flex cursor-pointer justify-between xl:justify-end items-center  gap-3 bg-white mb-4 p-2 rounded-lg shadow-md`}
                                                    >
                                                        <div className="md:ml-4 w-[90%] xl:w-2/3 mr-3 md:mr-0 ">
                                                            <div className="flex flex-wrap justify-between">
                                                                <h3 className="text-base md:text-lg font-semibold">
                                                                    {professional?.user_details?.first_name} {professional?.user_details?.last_name}
                                                                </h3>
                                                                <div className="flex items-center">
                                                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                                    <span className="ml-1 text-xs md:text-sm text-gray-800">
                                                                        {professional.user_details.status === 'active' ? 'Online' : 'Offline'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center flex-wrap justify-between text-xs md:text-sm text-gray-600">
                                                                <div className='flex gap-3 items-center pt-2'>
                                                                    <img src="/assets/locationSign.svg" alt="" width="15" height="15" />
                                                                    <span className="text-xs md:text-sm mainbluetext font-semibold">
                                                                        {(professional.user_details.distance).toFixed(1)} Km{' '}
                                                                        <span className="text-[#919EAB] font-medium ml-2">away</span>
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs md:text-sm text-[#919EAB]">
                                                                    <p className="text-xs md:text-sm text-[#919EAB]">
                                                                        Experience: <span className="text-black">{experienceString}</span>
                                                                    </p>
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center py-2 -ml-1">
                                                                <img src="/assets/pinkLocationIcon.svg" alt="Jobizz Logo" height="24" width="24" />
                                                                <p className="text-xs md:text-sm">{professional.user_details.address}</p>
                                                            </div>
                                                            <p className="text-xs md:text-sm text-[#919EAB] ml-1">
                                                                Profession: <span className="text-black">{professional.professionalUserServices[0]?.categories?.name || 'N/A'}</span>
                                                                {professional.professionalUserServices.length > 1 && (
                                                                    <button type='button' className='text-sm mainbluetext ml-1'>See more..</button>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="relative border-2">
                                                            <Image
                                                                src={professional?.user_details?.profile_photo ? professional?.user_details?.profile_photo : '/assets/professional1.png'}
                                                                alt="user"
                                                                width="500"
                                                                height="500"
                                                                className="rounded-lg w-[131px] h-[131px]"
                                                            />
                                                            <div className="absolute bottom-2 medmob:bottom-3.5 lmob:bottom-2 right-2 px-1 pr-2 bg-white rounded-2xl shadow">
                                                                <span className="text-yellow-500">★</span>
                                                                <span className="ml-1 text-sm text-gray-800">4.5</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                    </div>
                                </aside>
                                {isModalOpen && (
                                    <AutoModal
                                        isOpen={isModalOpen}
                                        onClose={() => closeModal()}
                                    />
                                )}
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

export default Map;