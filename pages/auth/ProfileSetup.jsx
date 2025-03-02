import React from 'react';
import { useRouter } from "next/router";
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseUrl, validationPatterns } from "../../constants/constant";
import { useState } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { setupProfile, uploadThePhoto, getTheProfile, updateVerifyDetailsAsync, logoutApiAsync } from '../../redux/auth/authSlice';
import { selectLoginAuth } from '../../redux/auth/authSlice';
import Error from '../../components/common/Error';
import moment from 'moment-timezone';
import Spinner from '../../components/common/Spinner';
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { addYears, subYears } from 'date-fns';
import { logout } from "../../redux/auth/authSlice";
import VerifyNumber from '../../components/modals/verifyNumber';
import { TextField } from '@mui/material';
import useLoadGoogleMaps from '../../utilities/useLoadGoogleMaps';

function ProfileSetup() {
    const router = useRouter();
    // const isLoaded1 = useLoadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_KEY);
    const toastId = React.useRef(null);
    const [IsLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false)
    const dispatch = useDispatch();
    const userDetails = useSelector(selectLoginAuth);
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [phoneNo, setPhoneNo] = useState(userDetails?.phone_number ? userDetails?.phone_number : "");
    const [phoneCode, SetPhoneCode] = useState(userDetails?.phone_code ? userDetails?.phone_code : "44");
    const [isVerifyModal, setIsVerifyModal] = useState(false)
    const [loginInfo, setLoginInfo] = useState("")
    const [loginType, setLoginType] = useState("")

    const phoneSchema = yup.string()
        .required("Please enter phone number")
        .matches(validationPatterns.phone, "Invalid Phone Number")
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number cannot be more than 15 digits long");

    const Schema = () => yup.object().shape({
        firstName: yup.string().trim().required("Please enter firstname"),
        lastName: yup.string().trim().required("Please enter lastname"),
        dob: yup.date()
            .typeError("Please enter a date")
            .required("Please enter Date of Birth")
            .test(
                'dob',
                'You must be 18 years or older',
                value => dayjs().diff(dayjs(value), 'years') >= 18
            ),
        email: userDetails?.email ? yup.string().notRequired() : yup.string()
            .trim().required("Please enter email")
            .matches(validationPatterns.email, "Invalid Email"),
        // phoneNumber: userDetails?.phone_code ? yup.string().notRequired() : phoneSchema,
        phone: userDetails?.phone_code ? yup.string().notRequired() : phoneSchema,
        phoneNumber: yup.string().notRequired(),
        address: yup.string().trim().required("Please enter address"),
        city: yup.string().trim().required("Please enter city"),
        country: yup.string().trim().required("Please enter country"),
        postcode: yup.string().trim().required("Please enter postcode"),
        // longitude: yup.string().trim().required("Please select correct addresss")
    });

    const {
        control,
        register,
        setValue,
        handleSubmit,
        watch,
        trigger,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(Schema()),
        defaultValues: {
            email: userDetails?.email,
            phoneNumber: `${userDetails?.phone_code ? userDetails?.phone_code : '44'}${userDetails?.phone_number}`,
            dob: null,
            firstName: userDetails?.first_name,
            lastName: userDetails?.last_name
        },
    });

    const emailValue = watch('email');
    const phoneValue = watch("phone");


    const onChangePhoneNumber = (value, data) => {
        let phoneCode = data.dialCode;
        let phoneNumber = value.slice(data.dialCode.length);
        // setValue('phoneNumber', value);
        phoneNumber = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber

        setValue('phoneNumber', `${phoneCode}${phoneNumber}`);
        setValue('phone', `${phoneNumber}`)
        setPhoneNo(phoneNumber);
        SetPhoneCode(phoneCode);
        trigger('phone');
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setSelectedImageFile(file);
        }
    };

    const ImageEdit = (file, data) => {
        const formData = new FormData();
        formData.append("image", file);
        setIsLoading(true);
        dispatch(uploadThePhoto(formData))
            .then(unwrapResult)
            .then((obj) => {
                let params = {
                    "dob": moment(data?.dob).format('YYYY-MM-DD'),
                    "address": data?.address || undefined,
                    "city": data?.city || undefined,
                    "country": data?.country || undefined,
                    "postcode": data?.postcode || undefined,
                    "firstName": data?.firstName,
                    "lastName": data?.lastName,
                    "profilePhoto": obj?.data?.data?.link || undefined,
                    "longitude": String(data?.longitude),
                    "latitude": String(data?.latitude)
                }
                // if (userDetails?.phone_code) {
                //     params = {
                //         ...params,
                //         "email": data.email
                //     }
                // }
                // else {
                //     params = {
                //         ...params,
                //         "phoneCode": `+${phoneCode}`,
                //         "phoneNumber": Number(phoneNo),
                //     }
                // }

                setupProfileFunc(params)
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setIsLoading(false);
            });
    };


    const getProfileFunc = () => {

        dispatch(getTheProfile())
            .then(unwrapResult)
            .then((obj) => {
            })
            .catch((obj) => {
            });
    }

    const setupProfileFunc = (filteredData) => {
        dispatch(setupProfile(filteredData))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                Cookies.set("profileStatus", true);
                router.push("/Home")
                getProfileFunc();
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setIsLoading(false);
            });
    }

    const autoCompleteHandleChange = (address) => {
        if (address === "") {
            setValue('city', "")
            // setStateValue("")
            setValue('country', "")
            setValue('postcode', "")
        }
        setValue('address', address);
    };
    const autoCompleteHandleSelect = (address) => {

        geocodeByAddress(address)
            .then((results) => {
                fillAddressDetails(results);
                setValue('latitude', results[0].geometry.location.lat())
                setValue('longitude', results[0].geometry.location.lng())
            })
            .catch((error) => { });
    };
    const fillAddressDetails = (results) => {
        setValue('address', results[0].formatted_address);

        let citySet = false; // Flag to track if the city has been set

        for (let j = 0; j < results[0].address_components.length; j++) {
            const component = results[0].address_components[j];

            if (component.types.includes("postal_code")) {
                setValue("postcode", component.short_name);
            } else if (component.types.includes("locality")) {
                setValue("city", component.long_name);
                citySet = true; // Set flag to true if locality is found
            } else if (
                component.types.includes("administrative_area_level_1") ||
                component.types.includes("administrative_area_level_3")
            ) {
                // Handle administrative areas if needed
                // setStateValue(component.long_name);
                // setStateCode(component.short_name);
            } else if (component.types.includes("country")) {
                setValue("country", component.long_name);
                // setCountryCode(component.short_name);
            } else if (component.types.includes("street_number")) {
                // setApt(component.long_name);
            }
        }

        // If locality was not found, check for postal_town (if available)
        if (!citySet) {
            const postalTown = results[0].address_components.find(component =>
                component.types.includes("postal_town")
            );

            if (postalTown) {
                setValue("city", postalTown.long_name); // Set postal_town as city
            }
        }
        trigger("address")
        trigger("country")
        trigger("city")
        trigger("postcode")
    }



    const onSave = async (data) => {
        if (userDetails?.phone_code && userDetails?.email) {
            if (selectedImageFile) {
                ImageEdit(selectedImageFile, data)
            }
            else {
                let params = {
                    "dob": moment(data?.dob).format('YYYY-MM-DD'),
                    "address": data?.address || undefined,
                    "city": data?.city || undefined,
                    "country": data?.country || undefined,
                    "postcode": data?.postcode || undefined,
                    "firstName": data?.firstName,
                    "lastName": data?.lastName,
                    "longitude": String(data?.longitude),
                    "latitude": String(data?.latitude)
                }
                // if (userDetails?.phone_code) {
                //     params = {
                //         ...params,
                //         "email": data.email
                //     }
                // }
                // else {
                //     params = {
                //         ...params,
                //         "phoneCode": `+${phoneCode}`,
                //         "phoneNumber": Number(phoneNo),
                //     }
                // }

                setupProfileFunc(params)
            }
        }
        else {
            if (!userDetails?.phone_code) {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error("Please verify phone")
                }
            }
            else {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error("Please verify email")
                }
            }
        }

    };

    const fetchCurrentLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setValue('longitude', longitude)
                    setValue('latitude', latitude)
                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${BaseUrl?.GOOGLE_KEY}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.results && data.results[0]) {
                                const address = data.results[0].formatted_address;
                                setValue('address', address);
                                autoCompleteHandleSelect(address)
                            }
                        })
                        .catch(error => console.error('Error fetching location:', error))
                        .finally(() => setLoadingLocation(false));
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLoadingLocation(false);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            setLoadingLocation(false);
        }
    };
    const today = new Date();
    const maxDate = dayjs(subYears(today, 18));


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
            window.location.reload();
        })
        .catch((obj) => {
        });
    };

    const handleVerifyOtp = (params) => {
        setVerifyLoading(true)
        dispatch(updateVerifyDetailsAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                toast.success(obj?.data?.message);
                setIsVerifyModal(true)
                setVerifyLoading(false)
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setVerifyLoading(false)
            });
    }

    const handleVerify = (type) => {
        setLoginType(type)
        if (type === "phone") {
            setLoginInfo({
                "phoneCode": phoneCode,
                "phoneNumber": phoneNo
            })
            let params = {
                "phoneNumber": Number(phoneNo),
                "phoneCode": `${phoneCode}`,
            }
            handleVerifyOtp(params)

        } else {
            setLoginInfo({
                "email": emailValue
            })
            let params = {
                "email": emailValue
            }
            handleVerifyOtp(params)
        }
    }

    // useEffect(() => {
    //     const loadGoogleMapsScript = () => {
    //         if (window.google) {
    //             setIsLoaded(true);
    //             return;
    //         }
    //         const script = document.createElement('script');
    //         script.src = `https://maps.googleapis.com/maps/api/js?key=${BaseUrl?.GOOGLE_KEY}&libraries=places`;
    //         script.async = true;
    //         script.defer = true;
    //         script.onload = () => setIsLoaded(true);
    //         script.onerror = () => console.error('Error loading Google Maps API');
    //         document.head.appendChild(script);
    //     };

    //     loadGoogleMapsScript();
    // }, []);

    // if (!isLoaded) return <></>;

    // if (!isLoaded1) return <></>;


    return (
        <>
            <section className="authbg relative h-full ">
                <div className='flex justify-between flex-wrap items-center pt-8 py-3 px-6'>
                    <div>
                        <Image
                            src="/assets/logo.svg"
                            alt="Jobizz Logo"
                            height="46"
                            width="77"
                            className="mx-auto cursor-pointer"
                            onClick={() => router.push('/')}
                        />
                    </div>
                    <div className='flex items-center smob:mt-2 gap-4'>

                        <button onClick={handleLogout} className='flex items-center gap-3 border-[#EA4335] logoutshadow rounded-lg px-2 py-1 border bg-white'>
                            <Image
                                src="/assets/logoutred.svg"
                                alt="Jobizz Logo"
                                height="24"
                                width="24"
                                className='md:w-[24px] md:h-[24px] w-[20px] h-[20px]'
                            />
                            <span className='text-[#FF4242] text-sm md:text-lg'>Log Out</span>
                        </button>

                        <div className='flex gap-1 md:gap-3 items-center w-28 md:w-36 px-2 rounded-lg cursor-pointer h-8 md:h-10  bg-white border border-[#1B75BC26] dropdown'>
                            <Image
                                src="/assets/english.svg"
                                alt="Jobizz Logo"
                                height="16"
                                width="24"
                                className="mx-auto"
                            />
                            <span>English</span>
                            <Image
                                src="/assets/arrowdown.svg"
                                alt="Jobizz Logo"
                                height="16"
                                width="24"
                                className="mx-auto"
                            />
                        </div>
                    </div>
                </div>


                <div className="mx-auto p-4 flex justify-center items-center">
                    <div className="flex flex-col lg:flex-row w-full md:mx-10 shadow-lg rounded-xl blueBordermain overflow-hidden">
                        {/* <!-- Sidebar --> */}
                        <div className="w-full lg:w-1/4 bg-white p-4">
                            <div className="mb-8">
                                <h2 className="text-[32px] font-semibold">Profile Setup</h2>
                                <p className="maingray text-sm mt-2">Provide essential information like name, contact details, date of birth, and address accurately and completely.</p>
                            </div>

                        </div>
                        {/* <!-- Main Content --> */}
                        <div className="w-full lg:w-3/4 p-6">
                            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

                            <form onSubmit={handleSubmit(onSave)}>
                                <div className='profileHeight PersonalDetails pb-5 overflow-y-auto'>
                                    <div className="mt-6 mb-6 relative">
                                        <div className="w-[95px] h-[95px] bg-white border-2 border-[#1B75BC33] rounded-full flex justify-center items-center">
                                            <Image
                                                // src="/assets/profileman.png"
                                                // src={selectedImage || auth?.data?.payload?.profilePicture}
                                                src={selectedImage ? selectedImage : userDetails?.profile_photo ? userDetails?.profile_photo : "/assets/profileman.png"}
                                                alt="Selected Profile"
                                                className="rounded-full w-full h-full object-fill"
                                                width="95"
                                                height="95"
                                            />
                                        </div>

                                        <label htmlFor="image-upload">
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            <div className="absolute -bottom-1 cursor-pointer  left-16  rounded-full border border-white">
                                                <Image src="/assets/camera.svg" alt="whitePencil" width="31"
                                                    height="31" />
                                            </div>
                                        </label>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="firstName" className="block  text-sm pb-1 pl-1 font-normal text-gray-700">First Name</label>
                                                <input maxLength={35}   {...register("firstName")} placeholder='Enter first name' type="text" id="firstName" name="firstName" className='mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm' />
                                                {errors.firstName && <Error error={errors.firstName?.message} />}
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block  text-sm pb-1 pl-1 font-normal text-gray-700">Last Name</label>
                                                <input maxLength={35}  {...register("lastName")} placeholder='Enter last name' type="text" id="lastName" name="lastName" className='mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm' />
                                                {errors.lastName && <Error error={errors.lastName?.message} />}
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                            {/* const date = moment.utc(auth?.payload?.user?.user_profiles?.dob);
                                            const newDate = date.toDate() */}
                                            <div className='w-full '>
                                                <label htmlFor="dob" className="block text-sm pb-1 pl-1 font-normal text-gray-700">Date of Birth</label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="dob"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <DatePicker
                                                                    {...field}
                                                                    format="DD/MM/YYYY"
                                                                    className='outline-none pinkshadow bg-white'
                                                                    renderInput={(params) => <TextField className="newOne" {...params} error={!!errors.dob} />}
                                                                    sx={{
                                                                        width: "100%",
                                                                        background: "white",
                                                                        borderRadius: "12px",
                                                                        marginTop: "4px",
                                                                        borderColor: "transparent !important",
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            border: "none !important"
                                                                        },
                                                                        "& .MuiInputBase-input ": {
                                                                            height: "1rem !important"
                                                                        }

                                                                    }}

                                                                    maxDate={maxDate}
                                                                />
                                                            </>
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                                {errors.dob && <Error error={errors.dob.message} />}

                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block  text-sm pb-1 pl-1 font-normal text-gray-700">Email Address</label>
                                                <div className={userDetails?.email ? '' : 'flex gap-2 items-center'}>
                                                    <input   {...register("email")} placeholder='Enter email' type="text" disabled={userDetails?.email} id="email" name="email" className='mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm' />
                                                    {!(userDetails?.email) && <button type='button' onClick={() => handleVerify("email")} className={`px-12 mt-1 py-2.5 font-semibold bg-[#8DC63F] text-white shadow-lg shadow-[#8DC63F] rounded-lg`}>
                                                        {verifyLoading ? <Spinner /> : "Verify"}
                                                    </button>}

                                                </div>
                                                {errors.email && <Error error={errors.email?.message} />}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">

                                            <div>
                                                <label htmlFor="phoneNumber" className="block text-sm pb-1 pl-1 font-normal text-gray-700">Phone Number</label>
                                                <div className="flex Inprofile">
                                                    <Controller
                                                        name="phoneNumber"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <PhoneInput
                                                                country="us"
                                                                value={field.value}
                                                                onChange={(value, data, event, formattedValue) => onChangePhoneNumber(value, data, event, formattedValue)}
                                                                placeholder="Phone no."
                                                                enableSearch={true}
                                                                autoComplete="new-password"
                                                                disabled={userDetails?.phone_code}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.phone && <Error error={errors.phone?.message} />}
                                            </div>
                                            {!userDetails?.phone_code && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !!errors.phone ||
                                                        !phoneValue ||
                                                        `${userDetails?.phone_code}${userDetails?.phone_number}` ===
                                                        phoneValue
                                                    }
                                                    onClick={() => handleVerify("phone")}
                                                    className={`w-40 h-12 mt-6 block text-center font-semibold ${!!errors.phone ||
                                                        !phoneValue ||
                                                        `${userDetails?.phone_code}${userDetails?.phone_number}` ===
                                                        phoneValue
                                                        ? "bg-[#c5e29f]"
                                                        : "bg-[#8DC63F]"
                                                        } text-white shadow-lg ${!!errors.phone ||
                                                            !phoneValue ||
                                                            `${userDetails?.phone_code}${userDetails?.phone_number}` ===
                                                            phoneValue
                                                            ? ""
                                                            : "shadow-[#8DC63F]"
                                                        } rounded-xl`}
                                                >
                                                    {verifyLoading && loginType === "phone" ? (
                                                        <Spinner />
                                                    ) : (
                                                        "Verify"
                                                    )}
                                                </button>
                                            )}

                                        </div>
                                        <div>
                                            <div className='relative'>
                                                <label htmlFor="address" className="block text-sm pl-1 font-normal text-gray-700">Address</label>
                                                <Controller
                                                    name="address"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <PlacesAutocomplete
                                                            value={field.value || ''}
                                                            onChange={autoCompleteHandleChange}
                                                            onSelect={autoCompleteHandleSelect}
                                                        // searchOptions={{
                                                        //     componentRestrictions: {
                                                        //         country: ['us'],
                                                        //     }
                                                        // }}
                                                        >
                                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                                <div className='relative'>
                                                                    <input
                                                                        {...getInputProps({
                                                                            placeholder: 'Search Location',
                                                                            className: 'location-search-input customform-control countrytags_',
                                                                        })}
                                                                        className="mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                                                                    />
                                                                    <Image
                                                                        src="/assets/location.svg"
                                                                        alt="Jobizz Logo"
                                                                        height="24"
                                                                        width="24"
                                                                        className="mx-auto absolute transform -translate-y-8 right-4 cursor-pointer"
                                                                        onClick={fetchCurrentLocation}
                                                                    />
                                                                    <div className="autocomplete-dropdown-container">
                                                                        {loading && <div>Loading...</div>}
                                                                        {suggestions.map((suggestion, index) => {
                                                                            const className = suggestion.active
                                                                                ? 'suggestion-item--active'
                                                                                : 'suggestion-item';
                                                                            // inline style for demonstration purpose
                                                                            const style = suggestion.active
                                                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                            return (
                                                                                <div
                                                                                    {...getSuggestionItemProps(suggestion, {
                                                                                        className,
                                                                                        style,
                                                                                    })}
                                                                                    key={index}
                                                                                >
                                                                                    <span>{suggestion.description}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </PlacesAutocomplete>
                                                    )}
                                                />
                                            </div>
                                            {(errors.address || errors.longitude) && <Error error={errors?.address?.message ? errors?.address?.message : errors?.longitude?.message} />}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                                                <div>
                                                    <input {...register("city")} placeholder='City' type="text" id="city" name="city" className='block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm' />
                                                    {errors.city && <Error error={errors.city?.message} />}
                                                </div>

                                                <div>
                                                    <input  {...register("country")} placeholder='Country' type="text" id="country" name="country" className='block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm' />
                                                    {errors.country && <Error error={errors.country?.message} />}
                                                </div>

                                                <div>
                                                    <input maxLength="8" {...register("postcode")} placeholder='Postcode' type="text" id="postcode" name="postcode" className='block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm' />
                                                    {errors.postcode && <Error error={errors.postcode?.message} />}
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="px-12 font-semibold mainblue text-white p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl" disabled={IsLoading}>
                                        {IsLoading ? <Spinner /> : " Continue"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {isVerifyModal &&
                    <VerifyNumber setIsVerifyModal={setIsVerifyModal} isProfile={true} id={userDetails?.id} loginInfo={loginInfo} loginType={loginType} />
                }
            </section >
        </>
    )
}

export default ProfileSetup;