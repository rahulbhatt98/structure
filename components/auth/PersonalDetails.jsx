import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseUrl, validationPatterns } from "../../constants/constant";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    setupProfessionalProfile,
    uploadThePhoto,
    getTheProfile,
    updateVerifyDetailsAsync,
    getServiceStepAsync,
} from "../../redux/auth/authSlice";
import Error from "../common/Error";
import moment from "moment-timezone";
import { selectLoginAuth } from "../../redux/auth/authSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { options } from "../../utilities/helper";
import PlacesAutocomplete, {
    geocodeByAddress
} from "react-places-autocomplete";
import { subYears } from "date-fns";
import Spinner from "../common/Spinner";
import VerifyNumber from "../modals/verifyNumber";
import { emptyResponse } from "../../utilities/emptyResponse";
import { TextField } from "@mui/material";
import Multiselect from 'multiselect-react-dropdown';
import { options2 } from "../../utilities/helper";

function PersonalDetails(props) {
    const toastId = useRef(null);
    const auth = useSelector(selectLoginAuth);
    const token = Cookies.get("authToken");
    console.log(token, auth, "Saaaaaaaaaaaaaaaa");
    const dropdownRef = useRef(null)

    const scrollToBottom = () => {
        setTimeout(() => {
            dropdownRef.current?.scrollIntoView({ block: "end", inline: "nearest" })
        }, 100);
    }
    const defaultoff_days_flag = auth?.professional?.off_days_flag;
    const defaultoff_days = auth?.professional?.off_days;
    const userDetails = useSelector(selectLoginAuth);
    const [phoneNo, setPhoneNo] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [phoneCode, SetPhoneCode] = useState("44");
    const [IsLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dayserror, setdaysError] = useState(false);

    const [selectedImage, setSelectedImage] = useState(userDetails?.profile_photo);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOffDay, setSelectedOffDay] = useState(defaultoff_days_flag);
    const [selectedDays, setSelectedDays] = useState(
        defaultoff_days_flag === "other" ? defaultoff_days : []
    );
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [isVerifyModal, setIsVerifyModal] = useState(false);
    const [loginInfo, setLoginInfo] = useState("");
    const [loginType, setLoginType] = useState("");
    const [languageSelect, setLanguageSelect] = useState(auth?.professional?.language ? auth?.professional?.language : [])
    const [languageError, setLanguageError] = useState(false)
    const dispatch = useDispatch();

    const handleSelect = (selectedList) => {
        setLanguageSelect(selectedList.map(item => item.value)); // Update state with selected values
    };

    const handleRemove = (selectedList) => {
        setLanguageSelect(selectedList.map(item => item.value)); // Update state when items are removed
    };

    const phoneSchema = yup
        .string()
        .required("Phone number is required")
        .matches(validationPatterns.phone, "Invalid Phone Number")
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number cannot be more than 15 digits long");

    const Schema = () =>
        yup.object().shape({
            firstName: yup.string().trim().required("Please enter firstname"),
            lastName: yup.string().trim().required("Please enter lastname"),
            dob: yup
                .date()
                .typeError("Please enter a date")
                .required("Please enter Date of Birth")
                .test(
                    "dob",
                    "You must be 18 years or older",
                    (value) => dayjs().diff(dayjs(value), "years") >= 18
                ),
            email: userDetails?.email
                ? yup.string().notRequired()
                : yup
                    .string()
                    .trim()
                    .required("Please enter email")
                    .matches(validationPatterns.email, "Invalid Email"),
            phone: userDetails?.phone_code ? yup.string().notRequired() : phoneSchema,
            phoneNumber: yup.string().notRequired(),
            address: yup.string().trim().required("Please enter address"),
            city: yup.string().trim().required("Please enter city"),
            country: yup.string().trim().required("Please enter country"),
            postcode: yup.string().trim().required("Please enter postcode"),
            longitude: yup.string().trim().required("Please select correct addresss"),
            offDays: yup.array().min(1, "You must select at least one off day"),
        });

    const {
        control,
        register,
        setValue,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(Schema()),
        defaultValues: {
            email: userDetails?.email,
            phoneNumber: `${userDetails?.phone_code ? userDetails?.phone_code : "44"
                }${userDetails?.phone_number}`,
            firstName: emptyResponse(userDetails?.first_name),
            lastName: emptyResponse(userDetails?.last_name),
            address: emptyResponse(userDetails?.address),
            city: emptyResponse(userDetails?.city),
            country: emptyResponse(userDetails?.country),
            postcode: emptyResponse(userDetails?.postcode),
            longitude: String(userDetails?.longitude),
            latitude: String(userDetails?.latitude),
            dob: moment(userDetails?.dob),
        },
    });

    const emailValue = watch("email");
    const phoneValue = watch("phone");
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
                console.log(obj, "obj")
                let params = {
                    dob: moment(data?.dob).format("YYYY-MM-DD"),
                    address: data?.address || undefined,
                    city: data?.city || undefined,
                    country: data?.country || undefined,
                    postcode: data?.postcode || undefined,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    language: languageSelect,
                    profilePhoto: obj?.data?.data?.link || undefined,
                    longitude: String(data?.longitude),
                    latitude: String(data?.latitude),
                    offDaysFlag: selectedOffDay?.toLowerCase(),
                    "role": "professional",
                    offDays: selectedDays?.length > 0 ? selectedDays : [],
                };
                setupProfileFunc(params);
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
            .catch((obj) => { });
    };

    const setupProfileFunc = (filteredData) => {
        setIsLoading(true);
        dispatch(setupProfessionalProfile(filteredData))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                dispatch(getServiceStepAsync("1"))
                getProfileFunc();
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setIsLoading(false);
            });
    };

    const onChangePhoneNumber = (value, data) => {
        let phoneCode = data.dialCode;
        let phoneNumber = value.slice(data.dialCode.length);
        phoneNumber = phoneNumber.startsWith("0")
            ? phoneNumber.substring(1)
            : phoneNumber;

        setValue("phoneNumber", `${phoneCode}${phoneNumber}`);
        setValue("phone", `${phoneNumber}`);

        trigger("phone");
        setPhoneNo(phoneNumber);
        SetPhoneCode(phoneCode);
    };

    const handleOffDaySelection = (day) => {
        setSelectedOffDay(day);
        if (day !== "other") {
            setSelectedDays([]);
        }
    };

    const handleDayCheckboxChange = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((d) => d !== day)
                : [...prevSelectedDays, day?.toLowerCase()]
        );
        setError(false);
        setdaysError(false);
    };

    const getSelectedDaysString = () => {
        return selectedDays.length > 0 ? selectedDays.join(", ") : "Select";
    };

    const autoCompleteHandleChange = (address) => {
        if (address === "") {
            setValue("city", "");
            // setStateValue("")
            setValue("country", "");
            setValue("postcode", "");
        }
        setValue("address", address);
    };

    const autoCompleteHandleSelect = (address) => {
        geocodeByAddress(address)
            .then((results) => {
                fillAddressDetails(results);
                setValue("latitude", results[0].geometry.location.lat());
                setValue("longitude", results[0].geometry.location.lng());
            })
            .catch((error) => { });
    };

    const fillAddressDetails = (results) => {
        setValue("address", results[0].formatted_address);

        // for (let j = 0; j < results[0].address_components.length; j++) {
        //     if (results[0].address_components[j].types[0] == "postal_code") {
        //         setValue("postcode", results[0].address_components[j].short_name);
        //     } else if (results[0].address_components[j].types[0] == "locality") {
        //         setValue("city", results[0].address_components[j].long_name);
        //     } else if (
        //         results[0].address_components[j].types[0] ==
        //         "administrative_area_level_1" ||
        //         results[0].address_components[j].types[0] ===
        //         "administrative_area_level_3" ||
        //         results[0].address_components[j].types[0] === "locality"
        //     ) {
        //         // setStateValue(results[0].address_components[j].long_name);
        //         // setStateCode(results[0].address_components[j]?.short_name)
        //     } else if (results[0].address_components[j].types[0] == "country") {
        //         setValue("country", results[0].address_components[j].long_name);
        //         // setCountryCode(results[0].address_components[j]?.short_name);
        //     } else if (results[0].address_components[j].types[0] == "street_number") {
        //         // setApt(results[0].address_components[j].long_name);
        //     }
        // }
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
        trigger("address");
        trigger("country");
        trigger("city");
        trigger("postcode");
    };

    const fetchCurrentLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${BaseUrl?.GOOGLE_KEY}`
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.results && data.results[0]) {
                                const address = data.results[0].formatted_address;
                                setValue("address", address);
                                autoCompleteHandleSelect(address);
                            }
                        })
                        .catch((error) => console.error("Error fetching location:", error))
                        .finally(() => setLoadingLocation(false));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLoadingLocation(false);
        }
    };

    const onSave = (data) => {
        if (!selectedOffDay) {
            setError(true);
            return;
        } else {
            setError(false);
        }

        if ((selectedOffDay === "other" && selectedDays?.length == 0)) {
            setdaysError(true);
            return;
        }
        else {
            setdaysError(false);
        }

        if (!languageSelect) {
            setLanguageError(true)
            return
        } else {
            setLanguageError(false)
        }

        if (userDetails?.phone_code && userDetails?.email) {
            if (selectedImageFile) {
                ImageEdit(selectedImageFile, data);
            } else {
                console.log(data.offDays, "offDays");
                let params = {
                    dob: moment(data?.dob).format("YYYY-MM-DD"),
                    address: data?.address || undefined,
                    city: data?.city || undefined,
                    country: data?.country || undefined,
                    postcode: data?.postcode || undefined,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    longitude: String(data?.longitude),
                    latitude: String(data?.latitude),
                    language: languageSelect,
                    "role": "professional",
                    offDaysFlag: selectedOffDay?.toLowerCase() || defaultoff_days_flag,
                    offDays: selectedDays?.length > 0 ? selectedDays : [],
                };
                setupProfileFunc(params);
            }
        } else {
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

    const today = new Date();
    const maxDate = dayjs(subYears(today, 18));

    const handleVerifyOtp = (params) => {
        setVerifyLoading(true);
        dispatch(updateVerifyDetailsAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                toast.success(obj?.data?.message);
                setIsVerifyModal(true);
                setVerifyLoading(false);
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setVerifyLoading(false);
            });
    };

    const handleVerify = (type) => {
        setLoginType(type);
        if (type === "phone") {
            setLoginInfo({
                phoneCode: phoneCode,
                phoneNumber: phoneNo,
            });
            let params = {
                phoneNumber: Number(phoneNo),
                phoneCode: `${phoneCode}`,
            };
            handleVerifyOtp(params);
        } else {
            setLoginInfo({
                email: emailValue,
            });
            let params = {
                email: emailValue,
            };
            handleVerifyOtp(params);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <>
            <div className="w-full lg:w-3/4 p-6">
                <h2 className="text-lg text-center md:text-left font-semibold mb-4">Personal Details</h2>

                <form onSubmit={handleSubmit(onSave)}>
                    <div className="professionalProfileHeight PersonalDetails pb-5 overflow-y-auto">
                        <div className="mt-6 mb-6 flex justify-center  md:justify-normal relative">
                            <div className="w-[95px] h-[95px] bg-white border-2 border-[#1B75BC33] relative rounded-full flex justify-center items-center">
                                <Image                            
                                    src={selectedImage ? selectedImage : "/assets/profileman.png"}
                                    alt="Selected Profile"
                                    className="rounded-full w-full h-full object-cover"
                                    width="95"
                                    height="95"
                                />
                            </div>


                            <label htmlFor="image-upload" className="absolute -bottom-1 cursor-pointer  left-[132px] medmob:left-40  sm:left-16">
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <div className="  rounded-full border border-white">
                                    <Image
                                        src="/assets/camera.svg"
                                        alt="whitePencil"
                                        width="31"
                                        height="31"
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <input
                                        {...register("firstName")}
                                        placeholder="First name"
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm"
                                    />
                                    {errors.firstName && (
                                        <Error error={errors.firstName?.message} />
                                    )}
                                </div>

                                <div>
                                    <input
                                        {...register("lastName")}
                                        placeholder="Last name"
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm"
                                    />
                                    {errors.lastName && (
                                        <Error error={errors.lastName?.message} />
                                    )}
                                </div>

                                <div className="w-full dobContainer">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="dob"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <DatePicker
                                                        {...field}
                                                        format="DD/MM/YYYY"
                                                        renderInput={(params) => (
                                                            <TextField {...params} error={!!errors.dob} />
                                                        )}
                                                        className="outline-none pinkshadow bg-white"
                                                        sx={{
                                                            width: "100%",
                                                            background: "white",
                                                            marginTop: "4px",
                                                            borderColor: "transparent !important",
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                border: "2px solid #1B75BC1A !important",
                                                                borderRadius: "12px",
                                                            },
                                                            "& .MuiInputBase-input ": {
                                                                height: "1rem !important",
                                                            },
                                                        }}
                                                        maxDate={maxDate}
                                                    />
                                                </>
                                            )}
                                        />
                                    </LocalizationProvider>
                                    {errors.dob && <Error error={errors.dob.message} />}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div>
                                    <div
                                        className={
                                            userDetails?.email ? "" : "flex gap-2 items-center"
                                        }
                                    >
                                        <input
                                            disabled={userDetails?.email}
                                            {...register("email")}
                                            placeholder="Enter email"
                                            type="text"
                                            id="email"
                                            name="email"
                                            className=" pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm"
                                        />
                                        {!userDetails?.email && (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const isValid = await trigger("email");
                                                    if (isValid) {
                                                        handleVerify("email");
                                                    }
                                                }}
                                                disabled={
                                                    !emailValue || userDetails?.email === emailValue
                                                }
                                                className={`md:px-12 px-3 py-3 font-semibold ${!emailValue || userDetails?.email === emailValue
                                                    ? "bg-[#c5e29f]"
                                                    : "bg-[#8DC63F]"
                                                    } text-white shadow-lg ${!emailValue || userDetails?.email === emailValue
                                                        ? ""
                                                        : "shadow-[#8DC63F]"
                                                    } rounded-xl`}
                                            >
                                                {verifyLoading && loginType === "email" ? (
                                                    <Spinner />
                                                ) : (
                                                    "Verify"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {errors.email && <Error error={errors.email?.message} />}
                                </div>

                                <div>
                                    <div className="flex items-center flex-wrap sm:flex-nowrap xl:gap-8 InProfessionalProfile">
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    country="us"
                                                    value={field.value}
                                                    onChange={(value, data, event, formattedValue) =>
                                                        onChangePhoneNumber(
                                                            value,
                                                            data,
                                                            event,
                                                            formattedValue
                                                        )
                                                    }
                                                    placeholder="Phone Number"
                                                    enableSearch={true}
                                                    autoComplete="new-password"
                                                    className="placeholder:text-gray-500 text-sm"
                                                    disabled={userDetails?.phone_code}
                                                />
                                            )}
                                        />
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
                                                className={`w-40 h-12 block text-center mt-2 sm:mt-0 font-semibold ${!!errors.phone ||
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
                                    {errors.phone && <Error error={errors.phone?.message} />}
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <label
                                        htmlFor="address"
                                        className="block text-sm pl-1 font-normal text-gray-700"
                                    >
                                        Address
                                    </label>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <PlacesAutocomplete
                                                value={field.value || ""}
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
                                                        <input
                                                            {...getInputProps({
                                                                placeholder: "Search Location",
                                                                className:
                                                                    "location-search-input customform-control countrytags_",
                                                            })}
                                                            className="mt-1 pinkshadow block w-full text-sm font-medium p-3 pr-10 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                                                        />
                                                        <Image
                                                            src="/assets/location.svg"
                                                            alt="Jobizz Logo"
                                                            height="24"
                                                            width="24"
                                                            className="mx-auto absolute transform -translate-y-9 right-2 md:right-4 cursor-pointer"
                                                            onClick={fetchCurrentLocation}
                                                        />
                                                        <div className="autocomplete-dropdown-container">
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
                                {(errors.address || errors.longitude) && (
                                    <Error
                                        error={
                                            errors?.address?.message
                                                ? errors?.address?.message
                                                : errors?.longitude?.message
                                        }
                                    />
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                                    <div>
                                        <input
                                            {...register("city")}
                                            placeholder="City"
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                                        />
                                        {errors.city && <Error error={errors.city?.message} />}
                                    </div>

                                    <div>
                                        <input
                                            {...register("country")}
                                            placeholder="Country"
                                            type="text"
                                            id="country"
                                            name="country"
                                            className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                                        />
                                        {errors.country && (
                                            <Error error={errors.country?.message} />
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            maxLength="8"
                                            {...register("postcode")}
                                            placeholder="Postcode"
                                            type="text"
                                            id="postcode"
                                            name="postcode"
                                            className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                                        />
                                        {errors.postcode && (
                                            <Error error={errors.postcode?.message} />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
                                    <div>
                                        <label
                                            htmlFor="Offday"
                                            className="block text-lg pt-3 pl-1 font-normal"
                                        >
                                            Off Day&apos;s
                                        </label>
                                        <div className="relative mt-1">
                                            <button
                                                type="button"
                                                onClick={() => { setIsDropdownOpen(!isDropdownOpen); scrollToBottom() }}
                                                className={`w-full flex justify-between text-left text-sm font-medium p-3 capitalize bg-[#FFFFFF] rounded-xl blueBordermain outline-none ${!selectedOffDay ? "text-gray-500" : "text-black"
                                                    }`}
                                            >
                                                <span>{selectedOffDay === "other"
                                                    ? getSelectedDaysString()
                                                    : selectedOffDay || "Select"}</span>
                                                <Image alt="Jobizz Logo" width="20" height="16" src="/assets/arrowdown.svg" />

                                            </button>
                                            <div
                                                className={`absolute w-full bg-white rounded-b-xl shadow-lg z-10 ${isDropdownOpen ? "block" : "hidden"
                                                    }`}
                                                ref={dropdownRef}
                                            >
                                                <div className="p-4">
                                                    <ul>
                                                        <li className="flex items-center mb-3">
                                                            <input
                                                                id="weekend"
                                                                type="radio"
                                                                name="offday"
                                                                className="form-radio radio-custom  text-green-600"
                                                                onChange={() => {
                                                                    handleOffDaySelection("weekend");
                                                                    setError(false);
                                                                    setdaysError(false);
                                                                }}
                                                                checked={selectedOffDay === "weekend"}
                                                            />
                                                            <label
                                                                htmlFor="weekend"
                                                                className="ml-3 text-sm font-normal"
                                                            >
                                                                Weekend{" "}
                                                                <span className="text-[#919EAB] text-xs font-normal ml-1">
                                                                    {" "}
                                                                    (Saturday & Sunday)
                                                                </span>
                                                            </label>
                                                        </li>
                                                        <li className="flex items-center mb-3">
                                                            <input
                                                                id="fortnightly"
                                                                type="radio"
                                                                name="offday"
                                                                className="form-radio radio-custom  text-green-600"
                                                                onChange={() => {
                                                                    handleOffDaySelection("fortnightly");
                                                                    setError(false);
                                                                    setdaysError(false);
                                                                }}
                                                                checked={selectedOffDay === "fortnightly"}
                                                            />
                                                            <label
                                                                htmlFor="fortnightly"
                                                                className="ml-3 text-sm font-normal"
                                                            >
                                                                Fortnightly{" "}
                                                                <span className="text-[#919EAB] text-xs font-normal ml-1">
                                                                    {" "}
                                                                    (i.e. once every two weeks)
                                                                </span>
                                                            </label>
                                                        </li>
                                                        <li className="flex items-center">
                                                            <input
                                                                id="other"
                                                                type="radio"
                                                                name="offday"
                                                                className="form-radio radio-custom  text-green-600"
                                                                onChange={() => {
                                                                    handleOffDaySelection("other");
                                                                    setError(false);
                                                                }}
                                                                checked={selectedOffDay === "other"}
                                                            />
                                                            <label
                                                                htmlFor="other"
                                                                className="ml-3 text-sm font-medium text-gray-900"
                                                            >
                                                                Other
                                                            </label>
                                                        </li>
                                                    </ul>
                                                    <div className="mt-4">
                                                        <div className="flex flex-wrap gap-3">
                                                            {options.map((day, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center custom-checkbox"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-checkbox text-blue-600"
                                                                        checked={selectedDays.includes(day?.value)}
                                                                        onChange={() =>
                                                                            handleDayCheckboxChange(day?.value)
                                                                        }
                                                                        disabled={selectedOffDay !== "other"}
                                                                    />
                                                                    <span className="checkmark2"></span>
                                                                    <span className="ml-2 text-sm text-gray-900">
                                                                        {day?.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {dayserror && (
                                                            <Error className="mt-2" error="Please select days also." />
                                                        )}
                                                    </div>
                                                </div>
                                                {error && (
                                                    <Error error="Please select any one option" />
                                                )}

                                            </div>
                                            {error && <Error error="Please select any one option" />}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="Language"
                                            className="block text-lg pt-3 pl-1 font-normal"
                                        >
                                            Language preference
                                        </label>
                                        <div className="relative mt-1 w-full">

                                            <div className='flex instepOne relative items-center w-full'>
                                    
                                                <Multiselect
                                                    options={options2.filter(
                                                        (option, index, self) =>
                                                          index === self.findIndex((o) => o.value === option.value) // Filter by unique `id`
                                                      )} // Options to display in the dropdown
                                                    selectedValues={options2.filter(option => languageSelect.includes(option.value))} // Pre-select values
                                                    onSelect={handleSelect} // Function to call when a value is selected
                                                    onRemove={handleRemove} // Function to call when a value is removed
                                                    displayValue="label" // Property to display in the dropdown
                                                    className={`bg-white ${languageSelect.length === 0 ? "pb-1.5" : ""} rounded-lg w-full outline-none cursor-pointer`}
                                                    placeholder={languageSelect.length === 0 ? "Select languages" : ""} // Conditional placeholder
                                                    closeIcon
                                                    style={{
                                                        chips: {
                                                            background: '#8DC63F',
                                                            color: 'white',
                                                        },
                                                        searchBox: {
                                                            border: 'none',
                                                        },
                                                        option: {
                                                            color: 'black',
                                                        },
                                                    }}
                                                    showArrow={true}
                                                    customArrow={<span className="arrow-open2">
                                                    <Image
                                                        src="/assets/arrowdown.svg"
                                                        alt="Search Icon"
                                                        height="20"
                                                        width="20"
                                                        className="z-40 translate-y-6 mr-4 cursor-pointer"
                                                    />
                                                </span>}
                                                />
                         
                                            </div>
                                        </div>

                                        {(languageError) && (
                                            <Error
                                                error={
                                                    "Please select language"
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center sm:justify-end">
                        <button
                            type="submit"
                            className="px-16 font-semibold mainblue text-white p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl"
                            disabled={IsLoading}
                        >
                            {IsLoading ? <Spinner /> : "Next"}
                        </button>
                    </div>
                </form>
                {isVerifyModal && (
                    <VerifyNumber
                        setIsVerifyModal={setIsVerifyModal}
                        isProfile={true}
                        id={userDetails?.id}
                        loginInfo={loginInfo}
                        loginType={loginType}
                    />
                )}
            </div>
        </>
    );
}

export default PersonalDetails;
