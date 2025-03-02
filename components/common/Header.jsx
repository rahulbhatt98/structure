import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "js-cookie";
import { logout, logoutApiAsync, selectLoginAuth } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { emptyResponse } from "../../utilities/emptyResponse";
import Changepassword from "../modals/changepassword";
import PlacesAutocomplete, {
    geocodeByAddress,
} from "react-places-autocomplete";
import { BaseUrl } from "../../constants/constant";
import useLoadGoogleMaps from "../../utilities/useLoadGoogleMaps";
import Notification from "../notification/notification";
import { getAllNotifications } from "../../redux/professional/professioanlSlice";
import { unwrapResult } from "@reduxjs/toolkit";

function Header({ setHeaderSearch }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isOpenDropdown1, setIsOpenDropdown1] = useState(false);
    const [isOpenDropdown2, setIsOpenDropdown2] = useState(false);
    const roleSelected = Cookies.get("roleSelected");
    const [notificationList, setnotificationList] = useState([]);
    const [address, setAddress] = useState("")
    const [isLoaded, setLoading] = useState(true);
    // const isLoaded = useLoadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_KEY);
    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);
    const [isOpenNotif, setisOpenNotif] = useState(false);

    const toggleDropdown = () => {
        setisOpenNotif(!isOpenNotif);
        setIsOpenDropdown1(false)
        setIsOpenDropdown2(false)
    };


    const userDetails = useSelector(selectLoginAuth);
    const role = userDetails?.role;

    const handleToggleDropdown1 = () => {
        setIsOpenDropdown1(!isOpenDropdown1);
        setisOpenNotif(false)
    };

    const handleToggleDropdown2 = () => {
        setIsOpenDropdown2(!isOpenDropdown2);
        setisOpenNotif(false)
    };

    const verifiedLogin = Cookies.get("authToken");

    const handleLogout = () => {
        dispatch(logoutApiAsync())
            .then(unwrapResult)
            .then((obj) => {
                Cookies.remove("authToken");
                Cookies.remove("roleSelected");
                Cookies.remove("profileStatus");
                Cookies.remove("stepsDone");
                dispatch(logout());
                router.push('/')
            })
            .catch((obj) => {

            });

        // window.location.reload();    
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        setIsOpenDropdown1(false)
        setIsOpenDropdown2(false)
    };

    const closeModal = () => setIsModalOpen(false);

    const GotoProfile = () => {
        console.log("hi")
        if (roleSelected === "customer") {
            router.push("/Profile")
        } else {
            router.push("/professionalProfile")
        }

    }

    const autoCompleteHandleChange = (address) => {
        setAddress(address);
    };

    const autoCompleteHandleSelect = (address) => {
        geocodeByAddress(address)
            .then((results) => {
                setAddress(results[0].formatted_address);
                // setValue("latitude", results[0].geometry.location.lat());
                // setValue("longitude", results[0].geometry.location.lng());
                setHeaderSearch({
                    lat: Number(results[0].geometry.location.lat()),
                    lng: Number(results[0].geometry.location.lng())
                })
            })
            .catch((error) => { });
    };

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setHeaderSearch({
                        lat: Number(latitude),
                        lng: Number(longitude)
                    })
                    fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${BaseUrl?.GOOGLE_KEY}`
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.results && data.results[0]) {
                                const address = data.results[0].formatted_address;
                                setAddress(address);
                                autoCompleteHandleSelect(address);
                            }
                        })
                        .catch((error) => console.error("Error fetching location:", error))
                },
                (error) => {
                    console.error("Error getting location:", error);

                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");

        }
    };

    const handleRoleSwitch = () => {
        if (roleSelected === "professional") {
            Cookies.set("roleSelected", "customer");
            Cookies.remove("profileStatus");
            if (userDetails?.first_name && userDetails?.last_name) {
                Cookies.set("profileStatus", true);
                router.push('/Home');
            } else {
                router.push('/auth/ProfileSetup');
                Cookies.set("profileStatus", false);
            }
        } else if (roleSelected === "customer") {
            Cookies.set("roleSelected", "professional");
            Cookies.remove("profileStatus");
            if (!userDetails?.professional?.admin_status && userDetails?.customStep != "4") {
                router.push('/auth/ProfessionalProfileSetup');
                Cookies.set("profileStatus", false);
            }
            else if (userDetails?.professional?.admin_status === "accepted") {
                Cookies.set("profileStatus", true);
                router.push('/tasks');
            } else {
                Cookies.set("profileStatus", false);
                Cookies.set("stepsDone", true);
                router.push('/auth/professionalVefication');
            }
        }
    }

    const getNotificationList = () => {
        // setIsLoading(true);

        dispatch(getAllNotifications())
            .then((obj) => {
                setnotificationList(obj?.payload?.data?.data)
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

    useEffect(() => {
        if (verifiedLogin) {
            getNotificationList();
        }
    }, [verifiedLogin])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenDropdown1(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    useEffect(() => {
        const handleClickOutside2 = (event) => {
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setIsOpenDropdown2(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside2);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside2);
        };
    }, [dropdownRef2]);


    useEffect(() => {
        // Simulate an asynchronous delay (replace with actual authentication data fetching)
        const delay = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(delay); // Clear the timeout if the component unmounts
    }, []);

    if (isLoaded) {
        return <></>;
    }

    return (
        <>
            <section>

                {/* view above upto tab */}
                <section className="w-full hidden md:flex px-3 py-2 md:p-5 bg-white fixed top-0 z-50 shadow-md border-2 border-[#FFFFFF]  flex-col lg:flex-row justify-between items-center">
                    <div className="flex items-center justify-between md:justify-normal md:gap-5 w-full lg:w-auto mb-2 lg:mb-0">
                        <Image
                            src="/assets/logo.svg"
                            alt="Jobizz Logo"
                            height="55"
                            width="77"
                            className="cursor-pointer w-[49px] h-[35px]  md:w-[77px] md:h-[55px]"
                            onClick={() => router.push("/")}
                        />
                        <div className="relative">
                            <PlacesAutocomplete
                                value={address || ""}
                                onChange={autoCompleteHandleChange}
                                onSelect={autoCompleteHandleSelect}
                            // searchOptions={{
                            //     componentRestrictions: {
                            //         country: ['us'],
                            //     }
                            // }}
                            >
                                {({
                                    getInputProps,
                                    suggestions,
                                    getSuggestionItemProps,
                                    loading,
                                }) => (
                                    <div className="relative  rounded-xl">
                                        <Image
                                            src="/assets/pinkLocationIcon.svg"
                                            alt="Location Icon"
                                            height="24"
                                            width="24"
                                            className="absolute top-1 md:top-2 h-[20px] w-[20px] md:h-[24px] md:w-[24px] md:left-3 left-1"
                                        />
                                        <input
                                            {...getInputProps({
                                                placeholder: "Search Location",
                                                className:
                                                    "location-search-input customform-control countrytags_",
                                            })}
                                            className="block pinkshadow w-full darkblueborder sm:w-96 pl-6 md:pl-10 pr-10 text-sm font-medium py-0.5 md:py-2 bg-[#FFFFFF] rounded-xl placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-500 outline-none sm:text-sm"
                                        />
                                        <Image
                                            src="/assets/graySearch.svg"
                                            alt="Search Icon"
                                            height="24"
                                            width="24"
                                            className="absolute top-1 cursor-pointer md:top-2 right-1 h-[20px] w-[20px] md:h-[24px] md:w-[24px] md:right-3"
                                            onClick={fetchCurrentLocation}

                                        />
                                        <div className="autocomplete-dropdown-container shadow-xl">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map((suggestion, index) => {
                                                const className = suggestion.active
                                                    ? "suggestion-item--active"
                                                    : "suggestion-item";
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? {
                                                        backgroundColor: "#fafafa",
                                                        cursor: "pointer",
                                                    }
                                                    : {
                                                        backgroundColor: "#ffffff",
                                                        cursor: "pointer",
                                                    };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                        key={index}
                                                        className="inner-autocomplete"
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                        </div>
                    </div>
                    {/* flex items-center flex-wrap justify-center gap-5 md:justify-between w-full lg:w-auto md:mt-2 lg:mt-0 */}

                    <div
                        className={`${verifiedLogin
                            ? "flex items-center  justify-between w-full lmob:w-auto md:w-full lg:w-auto md:mt-2 lg:mt-0"
                            : "flex items-center justify-end gap-5 md:justify-between w-full lg:w-auto md:mt-2 lg:mt-0"
                            }`}
                    >
                        {!verifiedLogin ? (
                            <div className="space-x-4 md:space-x-3">
                                <button
                                    onClick={() => router.push("/auth/login")}
                                    className="mainblue text-sm text-white font-semibold px-2 md:px-4 py-1.5 md:py-3 rounded-xl"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => router.push("/auth/signup")}
                                    className="border-2 border-[#1B75BC] mainbluetext font-semibold text-sm  px-2 md:px-4 py-1 md:py-2.5  bg-white rounded-xl"
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="flex relative items-center gap-2 justify-start md:justify-between md:w-auto lmob:gap-3 md:gap-8">
                                <div className="flex gap-1 lmob:gap-3">

                                    {role === "professional" && (

                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" value="" className="sr-only peer" />
                                            <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759]"></div>
                                        </label>

                                    )
                                    }
                                    {/* onClick={() => router.push("/chats")} */}
                                    <button
                                        onClick={() => router.push("/chats")}
                                        className="border-2 flex justify-center items-center border-[#E2F0FC] rounded-full p-2">
                                        <Image
                                            src="/assets/chat.svg"
                                            alt="message"
                                            height="22"
                                            width="22"
                                            className="h-[15px] w-[15px] md:h-[22px] md:w-[22px]"
                                        />
                                    </button>
                                    <div >
                                        {/* smob:-left-2 medmob:left-0 lg:-left-40 */}
                                        {isOpenNotif && (
                                            <Notification toggleDropdown={toggleDropdown} />
                                        )}
                                        {/* onClick={toggleDropdown} */}
                                        <div onClick={toggleDropdown} className="border-2 cursor-pointer relative border-[#E2F0FC] rounded-full p-2">
                                            <Image
                                                src="/assets/bell.svg"
                                                alt="bell"
                                                height="22"
                                                width="22"
                                                className="h-[15px] w-[15px] md:h-[22px] md:w-[22px]"
                                            />
                                            {(notificationList?.length > 0 && notificationList?.filter(val => (val?.is_read === 0 && (roleSelected === "customer" ? val?.data?.status !== "open_for_proposals" : true)))?.length > 0) && <span className="w-3 h-3 -top-1 right-0 absolute bg-green-500 rounded-full"></span>}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={handleToggleDropdown1}
                                    className="flex items-center cursor-pointer bg-white px-1 md:px-2 py-1 rounded-full shadow-lg"
                                >
                                    <div className="relative border-2 rounded-full border-[#1B75BC]">
                                        <Image
                                            src={
                                                userDetails?.profile_photo
                                                    ? userDetails?.profile_photo
                                                    : "/assets/profileman.png"
                                            }
                                            width="38"
                                            height="38"
                                            alt="Erick"
                                            className="md:w-[38px] md:h-[38px] w-[22px] h-[22px] rounded-full border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <h3 className="text-xs g:text-xl font-medium capitalize">{`${emptyResponse(
                                            userDetails?.first_name
                                        )} ${emptyResponse(userDetails?.last_name)}`}</h3>
                                    </div>
                                    <Image
                                        src="/assets/arrowdown.svg"
                                        alt="Jobizz Logo"
                                        height="18"
                                        width="18"
                                        className="ml-2"
                                    />
                                </div>

                                {isOpenDropdown1 && (
                                    <div ref={dropdownRef} className="absolute left-4 md:right-0 top-8 md:top-14 py-3 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <ul>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                // onClick={() => router.push("/Profile")}
                                                onClick={GotoProfile}
                                            >
                                                <Image
                                                    src="/assets/profile.svg"
                                                    alt="profile"
                                                    height="25"
                                                    width="25"
                                                />
                                                <span className="text-sm font-medium">Profile</span>
                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/bookings.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Bookings</span>
                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer" onClick={() => handleRoleSwitch()}>
                                                <Image
                                                    src="/assets/switch.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Switch to {roleSelected === "professional" ? "Customer" : "Professional"}
                                                </span>
                                            </li>
                                            <li onClick={() => router.push("/paymentMethods")} className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/managePayments.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Manage Payment Methods
                                                </span>
                                            </li>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                onClick={openModal}
                                            >
                                                <Image
                                                    src="/assets/Lock.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Change Password
                                                </span>

                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/help.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Help Center</span>
                                            </li>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <Image
                                                    src="/assets/logout.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Logout</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {isModalOpen && (
                                    <Changepassword
                                        isOpen={isModalOpen}
                                        onClose={() => closeModal()}
                                    />
                                )}
                            </div>
                        )}

                        <div
                            className={`flex gap-1 ${verifiedLogin ? "ml-1 lmob:ml-3" : "mt-0"
                                } md:gap-3 lg:ml-3 sm:mt-0 items-center lmob:w-36 px-2 rounded-lg cursor-pointer  h-8 md:h-10 bg-white border border-[#1B75BC26] dropdown`}
                        >
                            <Image
                                src="/assets/english.svg"
                                alt="Jobizz Logo"
                                height="16"
                                width="24"
                                className="mx-auto"
                            />
                            <span className="text-xs md:text-sm">English</span>
                            <Image
                                src="/assets/arrowdown.svg"
                                alt="Jobizz Logo"
                                height="18"
                                width="18"
                                className="mx-auto"
                            />
                        </div>
                    </div>
                </section>


                {/* view below tab on mobile */}
                <section className="w-full shadow-md fixed top-0 z-50 bg-white md:hidden pt-3 pl-1 medmob:pl-5">

                    <div className={`${verifiedLogin ? "flex justify-between" : ""}`}>

                        {verifiedLogin && (
                            <div className="flex relative items-center gap-2">

                                <div
                                    onClick={handleToggleDropdown2}
                                    className="flex items-center cursor-pointer bg-white px-1 md:px-2 py-1 rounded-full shadow-lg"
                                >
                                    <div className="relative border-2 rounded-full border-[#1B75BC]">
                                        <Image
                                            src={
                                                userDetails?.profile_photo
                                                    ? userDetails?.profile_photo
                                                    : "/assets/profileman.png"
                                            }
                                            width="38"
                                            height="38"
                                            alt="Erick"
                                            className="md:w-[38px] md:h-[38px] w-[25px] h-[25px] rounded-full border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    <div className="ml-1">
                                        <h3 className="text-xs lg:text-xl font-medium capitalize">{`${emptyResponse(
                                            `${userDetails?.first_name?.slice(0, 3)}...`
                                        )}`}</h3>
                                    </div>
                                    <Image
                                        src="/assets/arrowdown.svg"
                                        alt="Jobizz Logo"
                                        height="12"
                                        width="12"
                                    />
                                </div>

                                {isOpenDropdown2 && (
                                    <div ref={dropdownRef2} className="absolute z-50 left-4 md:right-0 top-8 md:top-14 py-3 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <ul>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                // onClick={() => router.push("/Profile")}
                                                onClick={GotoProfile}
                                            >
                                                <Image
                                                    src="/assets/profile.svg"
                                                    alt="profile"
                                                    height="25"
                                                    width="25"
                                                />
                                                <span className="text-sm font-medium">Profile</span>
                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/bookings.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Bookings</span>
                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/switch.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Switch to Professional
                                                </span>
                                            </li>
                                            <li onClick={() => router.push("/paymentMethods")} className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/managePayments.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Manage Payment Methods
                                                </span>
                                            </li>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                onClick={openModal}
                                            >
                                                <Image
                                                    src="/assets/Lock.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">
                                                    Change Password
                                                </span>

                                            </li>
                                            <li className="flex items-center gap-5 py-2 ml-5 cursor-pointer">
                                                <Image
                                                    src="/assets/help.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Help Center</span>
                                            </li>
                                            <li
                                                className="flex items-center gap-5 py-2 ml-5 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <Image
                                                    src="/assets/logout.svg"
                                                    alt="profile"
                                                    height="23"
                                                    width="23"
                                                />
                                                <span className="text-sm font-medium">Logout</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {isModalOpen && (
                                    <Changepassword
                                        isOpen={isModalOpen}
                                        onClose={() => closeModal()}
                                    />
                                )}
                            </div>
                        )}

                        <div className={`${verifiedLogin
                            ? "flex gap-6 medmob:gap-6 lmob:gap-10" : "flex justify-between"}`}>
                            <div>
                                <Image
                                    src="/assets/logo.svg"
                                    alt="Jobizz Logo"
                                    height="55"
                                    width="77"
                                    className="cursor-pointer w-[49px] h-[35px]  md:w-[77px] md:h-[55px]"
                                    onClick={() => router.push("/")}
                                />
                            </div>

                            <div className="flex gap-1 items-center">

                                {!verifiedLogin ? (
                                    <div className="space-x-4 md:space-x-3">
                                        <button
                                            onClick={() => router.push("/auth/login")}
                                            className="mainblue text-sm text-white font-semibold px-2 md:px-4 py-1.5 md:py-3 rounded-xl"
                                        >
                                            Log In
                                        </button>
                                        <button
                                            onClick={() => router.push("/auth/signup")}
                                            className="border-2 border-[#1B75BC] mainbluetext font-semibold text-sm  px-2 md:px-4 py-1 md:py-2.5  bg-white rounded-xl"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-1">
                                        <button className="border-2 flex justify-center items-center border-[#E2F0FC] rounded-full p-2">
                                            <Image
                                                src="/assets/chat.svg"
                                                alt="message"
                                                height="22"
                                                width="22"
                                                className="h-[15px] w-[15px] md:h-[22px] md:w-[22px]"
                                            />
                                        </button>
                                        <div >
                                            {/* smob:-left-2 medmob:left-0 lg:-left-40 */}
                                            {isOpenNotif && (
                                                <Notification toggleDropdown={toggleDropdown} />
                                            )}
                                            {/* onClick={toggleDropdown} */}
                                            <div onClick={toggleDropdown} className="border-2 cursor-pointer relative border-[#E2F0FC] rounded-full p-2">
                                                <Image
                                                    src="/assets/bell.svg"
                                                    alt="bell"
                                                    height="22"
                                                    width="22"
                                                    className="h-[15px] w-[15px] md:h-[22px] md:w-[22px]"
                                                />
                                                {(notificationList?.length > 0 && notificationList?.filter(val => val?.is_read === 0)?.length > 0) && <span className="w-3 h-3 -top-1 right-0 absolute bg-green-500 rounded-full"></span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`flex gap-1 ${verifiedLogin ? "mr-2" : "mt-0 mr-2"
                                        }  items-center  px-2 rounded-lg cursor-pointer  h-8 md:h-10 bg-white border border-[#1B75BC26] dropdown`}
                                >
                                    <Image
                                        src="/assets/english.svg"
                                        alt="Jobizz Logo"
                                        height="16"
                                        width="24"
                                        className="mx-auto"
                                    />
                                    <span className="text-xs md:text-sm">Eng</span>
                                    <Image
                                        src="/assets/arrowdown.svg"
                                        alt="Jobizz Logo"
                                        height="18"
                                        width="18"
                                        className="mx-auto"
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className={`flex relative ${role === "professional" ? "justify-between" : "justify-center"}  mt-3 pb-2`}>

                        <PlacesAutocomplete
                            value={address || ""}
                            onChange={autoCompleteHandleChange}
                            onSelect={autoCompleteHandleSelect}
                        // searchOptions={{
                        //     componentRestrictions: {
                        //         country: ['us'],
                        //     }
                        // }}
                        >
                            {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                            }) => (
                                <div className="relative">
                                    <div className=" darkblueborder rounded-xl">
                                        <Image
                                            src="/assets/pinkLocationIcon.svg"
                                            alt="Location Icon"
                                            height="24"
                                            width="24"
                                            className="absolute top-1 md:top-2 h-[20px] w-[20px] md:h-[24px] md:w-[24px] md:left-3 left-1"
                                        />
                                        <input
                                            {...getInputProps({
                                                placeholder: "Search Location",
                                                className:
                                                    "location-search-input customform-control countrytags_",
                                            })}
                                            className="block pinkshadow w-full sm:w-96 pl-6 md:pl-10 pr-10 text-sm font-medium py-0.5 md:py-2 bg-[#FFFFFF] rounded-xl border-2 border-[#FFFFFF] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-500 outline-none sm:text-sm"
                                        />
                                        <Image
                                            src="/assets/graySearch.svg"
                                            alt="Search Icon"
                                            height="24"
                                            width="24"
                                            className="absolute top-1 cursor-pointer md:top-2 right-1 h-[20px] w-[20px] md:h-[24px] md:w-[24px] md:right-3"
                                            onClick={fetchCurrentLocation}

                                        />
                                    </div>
                                    <div className="autocomplete-dropdown-container shadow-xl">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map((suggestion, index) => {
                                            const className = suggestion.active
                                                ? "suggestion-item--active"
                                                : "suggestion-item";
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? {
                                                    backgroundColor: "#fafafa",
                                                    cursor: "pointer",
                                                }
                                                : {
                                                    backgroundColor: "#ffffff",
                                                    cursor: "pointer",
                                                };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                    key={index}
                                                    className="inner-autocomplete"
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                        {role === "professional" && (
                            <label className="inline-flex items-center cursor-pointer pr-3">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759]"></div>
                            </label>
                        )
                        }

                    </div>
                </section>

            </section>
        </>
    );
}

export default Header;
