import React, { useEffect, useRef, useState } from 'react';
import Header from '../common/Header';
import Intro from './Intro';
import Image from 'next/image';
import BasicPagination from '../common/basicPagination';
import RequestNow from './RequestNow';
import Footer from '../common/Footer';
import { getTheMapList, selectLoginAuth } from '../../redux/auth/authSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import AutoModal from '../modals/AutoModal';
import { toast } from 'react-toastify';


function ListOfProfessionals() {
    const dispatch = useDispatch();
    const router = useRouter();
    const toastId = useRef(null);
    const [headerSearch, setHeaderSearch] = useState("");
    console.log(headerSearch, "headerSearch")

    const { selectedService } = router.query;

    console.log(selectedService, "saaaaaaaaaaaaaaaa");
    const verifiedLogin = Cookies.get("authToken");
    const [selectedServices, setSelectedServices] = useState(selectedService ? selectedService : "")

    const [markers, setMarkers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const auth = useSelector(selectLoginAuth);
    const [searchValue, setsearchValue] = useState("");

    const [Total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    getMapList(latitude, longitude)
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

    const getMapList = (latitude, longitude) => {
        setIsLoading(true);
        let params = {
            page: page,
            limit: 10,
            latitude: headerSearch ? headerSearch : (auth?.latitude && verifiedLogin) ? Number(auth?.latitude) : latitude,
            longitude: headerSearch ? headerSearch : (auth?.longitude && verifiedLogin) ? Number(auth?.longitude) : longitude,
            keyword: selectedServices || undefined
        };
        dispatch(getTheMapList(params))
            .then((obj) => {
                setMarkers(obj.payload?.data?.data?.data);
                setIsLoading(false);
                setTotal(obj?.payload?.data?.data?.totalRecords);
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


    useEffect(() => {
        getMapList();
    }, [page, selectedServices]);


    useEffect(() => {
        getUserLocation();
    }, []);

    return (
        <>
            <section className="authbg relative max-h-full h-screen">
                <Header setHeaderSearch={setHeaderSearch} />
                <Intro fromProfessional={true} setSelectedService={setSelectedServices} setsearchValue={setsearchValue} />

                <div className={`px-3 md:px-10 mb-3 flex ${searchValue ? "justify-between" : "justify-end"} items-center flex-wrap`}>
                    {
                        searchValue && (
                            <h3 className="font-semibold">
                                Showing Results for{" "}
                                <span className="pinkText">
                                    {`"${searchValue}"`}
                                </span>
                            </h3>
                        )
                    }
                    <div className="flex items-center py-2 -ml-1">
                        <Image
                            src="/assets/pinkLocationIcon.svg"
                            alt="Jobizz Logo"
                            height="24"
                            width="24"
                        />
                        <p className="text-xs md:text-sm">
                            15205 North Kierland Blvd. Suite 100
                        </p>
                    </div>
                </div>

                <section className="grid gris-cols-1 lg:grid-cols-2 lg:gap-4 px-3 md:px-10">
                    {markers && markers?.length > 0 && markers.map((professional) => (
                        <div
                            onClick={() => handleNavigation(professional)}
                            key={professional?.id}
                            className="flex cursor-pointer items-center w-full justify-between bg-white mb-4 p-2 border rounded-lg shadow-md"
                        >
                            <div className="md:ml-4 mr-3 md:mr-0 w-2/3">
                                <div className="flex flex-wrap justify-between">
                                    <h3 className="text-base md:text-lg font-semibold">
                                        {professional?.user_details?.first_name}{" "}
                                        {professional?.user_details?.last_name}
                                    </h3>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                        <span className="ml-1 text-sm text-gray-800">
                                            {professional?.user_details?.status === "active"
                                                ? "Online"
                                                : "Offline"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center flex-wrap justify-between text-xs md:text-sm text-gray-600">
                                    <div className="flex gap-3 items-center pt-2">
                                        <Image
                                            src="/assets/locationSign.svg"
                                            alt="away"
                                            width="15"
                                            height="15"
                                            className=""
                                        />
                                        <span className="text-xs md:text-sm mainbluetext font-semibold">
                                            {professional?.user_details?.distance.toFixed(1)} Km{" "}
                                            <span className="text-[#919EAB] font-medium ml-2">
                                                away
                                            </span>
                                        </span>
                                    </div>
                                    {/* <p className="text-xs md:text-sm text-[#919EAB]">
                                        Experience:{" "}
                                        <span className="text-black">
                                            {professional?.work_experience ? `(${professional?.work_experience} Years)` : "N/A"}
                                        </span>
                                    </p> */}
                                </div>
                                <div className="flex items-center py-2 -ml-1">
                                    <Image
                                        src="/assets/pinkLocationIcon.svg"
                                        alt="Jobizz Logo"
                                        height="24"
                                        width="24"
                                    />
                                    <p className="text-xs md:text-sm">
                                        {professional?.user_details?.address}
                                    </p>
                                </div>
                                <p className="text-xs md:text-sm text-[#919EAB] ml-1">
                                    Profession:{" "}
                                    <span className="text-black">
                                        {professional?.professionalUserServices[0]?.categories
                                            ?.name || "N/A"}
                                    </span>
                                </p>
                            </div>

                            <div className="relative">
                                <Image
                                    src={
                                        professional?.user_details?.profile_photo ? professional?.user_details?.profile_photo :
                                            "/assets/professional1.png"
                                    }
                                    alt="profile"
                                    width="131"
                                    height="131"
                                    className="rounded-lg w-[131px] h-[131px]"
                                />
                                <div className="absolute bottom-2 medmob:bottom-3.5 lmob:bottom-2 right-2 px-1 pr-2 bg-white rounded-2xl shadow">
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1 text-sm text-gray-800">4.5</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isModalOpen && (
                        <AutoModal
                            isOpen={isModalOpen}
                            onClose={() => closeModal()}
                        />
                    )}
                </section>
                <div className="my-4 flex justify-center items-center">
                    <BasicPagination
                        count={Math.ceil(Total / 10)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
                <RequestNow />
                <Footer />
            </section>
        </>
    )
}

export default ListOfProfessionals;