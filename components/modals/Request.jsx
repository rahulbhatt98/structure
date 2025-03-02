import Image from 'next/image';
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Error from "../common/Error";
import moment from "moment-timezone";
import { getTheSuggestionListAsync, selectLoginAuth, uploadTheDocuments } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";
import { createPersonalRequest, getTheSuggestionList } from '../../redux/customer/customerSlice';
import { useRef } from "react";
import { toast } from "react-toastify";
import { getGlobalData } from '../../redux/customer/customerSlice';
import { PuffLoader } from 'react-spinners';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with the isSameOrBefore plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

function Request({ isOpen, onClose, selectedData }) {

    const userTimeZone = dayjs.tz.guess();
    const currentTime = dayjs().tz(userTimeZone);
    const twoHoursLater = currentTime.add(2, 'hour');
    const [priceType, setIspriceType] = useState("hourly");
    const [providers, setproviders] = useState(false);
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [UploadedUrls, setUploadedUrls] = useState([]);
    const [address, setAddress] = useState("");
    const [requestPublished, setrequestPublished] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const dropdownRef = useRef(null);
    const [serviceList, setServiceList] = useState(selectedData ? [selectedData] : []);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropdown, setIsopenDropdown] = useState(false);
    const [selectedServices, setSelectedServices] = useState(selectedData ? [selectedData] : []);
    const [RequestData, setRequestData] = useState({});
    const [suggestedList, setsuggestedList] = useState([]);
    const [formData, setformData] = useState([]);
    const [requestedProfessionals, setRequestedProfessionals] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [requestType, setRequestType] = useState("door_step")
    const minDate = dayjs();
    const auth = useSelector(selectLoginAuth)
    console.log(auth, "dataaaaaaaaaaaaaaaaaaaaaaaaaa");


    console.log(selectedServices, "seleectedddddddddddddd");
    const [time, settime] = useState("");
    const [latLng, setLatLng] = useState({});
    const toastId = useRef(null);

    const schema = yup.object().shape({
        details: yup.string().required("This is required field"),
        title: yup.string().required("This is required field"),
        date: yup
            .date()
            .nullable()
            .required("This is a required field")
            .typeError("Invalid date")
            .min(moment().startOf('day').toDate(), "Date cannot be in the past")
            .transform((value, originalValue) => {
                return originalValue === "" ? null : new Date(originalValue);
            }),
        time: yup
            .string()
            .required("This is a required field")
            .test("is-two-hours-ahead", "You can book service only two hours prior", function (value) {
                const { date } = this.parent; // Get the date from the form
                if (!date) return true; // If no date is selected, skip this validation

                const selectedDate = moment(date).startOf('day'); // Get the start of the selected date
                const currentDate = moment().startOf('day'); // Get the start of the current date

                // If the selected date is not today, skip the time validation
                if (!selectedDate.isSame(currentDate)) return true;

                // Parse the selected time in 12-hour format with AM/PM
                const selectedTime = moment(value, "h:mm A");
                const currentTime = moment(); // Current time

                console.log("Selected Time:", selectedTime.format("h:mm A"));
                console.log("Current Time + 2 hours:", currentTime.add(2, 'hours').format("h:mm A"));

                // Ensure that the selected time is at least 2 hours ahead of the current time
                if (selectedTime.isBefore(moment().add(2, 'hours'))) {
                    return false; // Fail the validation
                }

                return true; // Pass the validation
            }),
        budget: yup.string().notRequired(),
        // address: yup.string().required("This is required field"),

        serviceIds: yup
            .array()
            .min(1, "This is required field")
            .required("This is required field"),
        requestType: yup.string().required("This is required field"),
        address: requestType === "door_step" ? yup.string().required("This is required field") : yup.string().notRequired()

    });

    const {
        control,
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)

    });

    const watchDate = watch('date');
    const watchTime = watch('time')


    const totalAmount = selectedServices.reduce((total, service) => {
        const amount = service.totalAmount || Number(service.price);
        return total + amount;
    }, 0);


    const getSPList = () => {
        const ServiceIds = selectedServices.map((service) => service.id);
        let params = {
            serviceIds: ServiceIds,
            latitude: String(Number(latLng.lat)),
            longitude: String(Number(latLng.lng)),
        };
        dispatch(getTheSuggestionList(params))
            .then(unwrapResult)
            .then((obj) => {
                console.log(obj, "objobjobj")
                setsuggestedList(obj?.data?.data?.data)
                // setRequestData(obj?.data?.data)
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
            });
    }

    const getRequestData = (id) => {
        dispatch(getGlobalData(id))
            .then(unwrapResult)
            .then((obj) => {
                setRequestData(obj?.data?.data)
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
            });
    }

    const onSave = async (data, professionalId, requestType1 = "normal_request") => {
        setValue('serviceIds', selectedServices.map((service) => service.id));
        if (data.date) {
            data.date = moment(data.date).format("YYYY-MM-DD");
        }

        if (data.budget) {
            data.budget = Number(data.budget)
        } else {
            delete data.budget;
        }

        let params = {
            ...data,
            totalAmount: totalAmount,
            // address: address,
            // serviceIds: selectedServices?.map(service => service.id),
            request: requestType1,
            time: time,
                      latitude: String(Number(latLng.lat)),
          longitude: String(Number(latLng.lng))
        }
        // if (requestType === "door_step") {
        //     params = {
        //         ...params,
        //         latitude: String(Number(latLng.lat)),
        //         longitude: String(Number(latLng.lng))
        //     }
        // }
        // else{
        //     params = {
        //         ...params,
        //         address: auth?.address,
        //         latitude: String(Number(auth?.latitude)),
        //         longitude: String(Number(auth?.longitude))
        //     }
        // }

        if (requestType1 === "private_request") {
            params.professionalId = professionalId;
        }

        if (UploadedUrls && UploadedUrls.length > 0) {
            params.images = UploadedUrls;
        }
        setformData(params)
        setButtonLoading(true)
        dispatch(createPersonalRequest(params))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setButtonLoading(false)
                setrequestPublished(true);
                getRequestData(obj?.data?.data?.id);
                setRequestedProfessionals((prev) => [...prev, professionalId]);
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setButtonLoading(false)
            });
    };

    const handlePriceType = (type) => {
        setIspriceType(type)
    }

    const openRequests = () => {
        setproviders(true);
        getSPList();
    }

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        let images = uploadedFiles.filter(file => file.type.startsWith("image/")).length;
        let videos = uploadedFiles.filter(file => file.type.startsWith("video/")).length;

        const validFiles = newFiles.filter(file => {
            const fileType = file.type;
            if (fileType.startsWith("image/")) {
                images++;
                return images <= 2; // Allow up to 2 images
            } else if (fileType.startsWith("video/")) {
                videos++;
                return videos <= 1; // Allow only 1 video
            }
            return false;
        });

        if (images > 2 || videos > 1) {
            setErrorMessage("You can upload up to 2 images and 1 video.");
        } else {
            setErrorMessage("");
            const updatedFiles = [...uploadedFiles, ...validFiles];
            setUploadedFiles(updatedFiles);

            // Create previews for the updated files
            const filePreviews = updatedFiles.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type,
            }));
            setPreviews(filePreviews);
            uploadTheDocument(validFiles)
        }
    };

    const uploadTheDocument = (files) => {
        setLoading(true);
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        dispatch(uploadTheDocuments(formData))
            .then(unwrapResult)
            .then((response) => {
                const uploadedimages = response?.data?.data.map((file) => file.url);
                setUploadedUrls((prevUrls) => [...prevUrls, ...uploadedimages]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error uploading documents", error);
            });
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);

        // Update previews
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    // const onTimeChange = (event) => {

    //     const inputValue = event.target.value;
    //     if (!inputValue) return;

    //     const timeSplit = inputValue.split(':');
    //     let hours = parseInt(timeSplit[0]);
    //     const minutes = timeSplit[1];
    //     let meridian = '';

    //     // Convert 24-hour format to 12-hour format with AM/PM
    //     if (hours > 12) {
    //         meridian = 'PM';
    //         hours -= 12;
    //     } else if (hours < 12) {
    //         meridian = 'AM';
    //         if (hours === 0) {
    //             hours = 12;
    //         }
    //     } else {
    //         meridian = 'PM'; // 12 PM case
    //     }

    //     // Ensure the hours are two digits (prepend 0 if necessary)
    //     const formattedHours = hours < 10 ? `0${hours}` : hours;

    //     // Update the time in the format "HH:MM AM/PM"
    //     const formattedTime = `${formattedHours}:${minutes} ${meridian}`;
    //     settime(formattedTime);
    //     setValue("time", formattedTime || "", { shouldValidate: true });
    //     trigger("time");
    // };

    const onTimeChange = (event) => {
        const date = new Date(event);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;


        if (!formattedTime) return;

        const timeSplit = formattedTime.split(':');
        let hour = parseInt(timeSplit[0]);
        const minute = timeSplit[1];
        let meridian = '';

        // Convert 24-hour format to 12-hour format with AM/PM
        if (hour > 12) {
            meridian = 'PM';
            hour -= 12;
        } else if (hour < 12) {
            meridian = 'AM';
            if (hour === 0) {
                hour = 12;
            }
        } else {
            meridian = 'PM'; // 12 PM case
        }

        // Ensure the hours are two digits (prepend 0 if necessary)
        const formattedHours = hour < 10 ? `0${hour}` : hour;

        // Update the time in the format "HH:MM AM/PM"
        const formattedTime1 = `${formattedHours}:${minute} ${meridian}`;
        settime(formattedTime1);
        setValue("time", formattedTime1 || "", { shouldValidate: true });
        trigger("time");
        console.log(formattedTime);
        console.log(formattedTime, "ddddddddddddddddddddddddddddddddda");
    };

    const autoCompleteHandleChange = (address) => {

        setAddress(address);
        setValue("address", address);
        trigger("address")
    };

    const autoCompleteHandleSelect = (address) => {
        geocodeByAddress(address)
            .then((results) => {
                console.log(results[0].formatted_address, "addressaddress")
                setValue("address", results[0].formatted_address);
                trigger("address")
                setAddress(results[0].formatted_address);
                // setValue("latitude", results[0].geometry.location.lat());
                // setValue("longitude", results[0].geometry.location.lng());
                setLatLng({
                    lat: Number(results[0].geometry.location.lat()),
                    lng: Number(results[0].geometry.location.lng())
                })
            })
            .catch((error) => { });
    };

    const handleServiceSelect = (service) => {

        // Check if the service with the same id is already selected
        if (!selectedServices.some((selected) => selected.id === service.id)) {
            setSelectedServices([...selectedServices, service]);
        }

    };

    const handleServiceRemove = (serviceId) => {
        const updatedServices = selectedServices.filter((service) => service.id !== serviceId);

        // Update the state with the filtered services
        setSelectedServices(updatedServices);

        // Update the form value with the updated services' IDs
        setValue('serviceIds', updatedServices.map((service) => service.id));

        // Trigger validation for the serviceIds field
        trigger('serviceIds');
    };

    const getSuggestionList = () => {
        setIsLoading(true);
        dispatch(getTheSuggestionListAsync())
            .then((obj) => {
                setServiceList(obj?.payload?.data?.data || undefined)
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const toggleDropdown = () => {
        getSuggestionList()
        setIsopenDropdown(!openDropdown);
    };

    const handleWheel = (e) => {
        e.target.blur(); // Removes focus from the input
        e.preventDefault(); // Prevents the default scroll behavior
    };

    // const shouldDisableTime = (timeValue, clockType) => {
    //     const date = new Date(timeValue);
    //     const hours = date.getHours();
    //     const minutes = date.getMinutes();
    //     console.log(clockType, timeValue, hours, minutes, "dsaaaaaaaaaaaaaaaaaaaaaaaaa");
    //     if (clockType === 'hours' && timeValue < 9) {
    //         // Disable hours before 9 AM
    //         return true;
    //     }
    //     return false;
    // };

    const shouldDisableTime = (timeValue) => {
        if (!timeValue) return false;
        const timeToCheck = dayjs(timeValue).tz(userTimeZone);

        // Example usage: logging times to verify
        console.log('Current Time:', watchDate);
        console.log('Two Hours Later:', twoHoursLater.format('YYYY-MM-DD HH:mm'));
        const timeToCheckDate = timeToCheck.format('YYYY-MM-DD');
        const specificDate = watchDate.format('YYYY-MM-DD')

        console.log(specificDate, timeToCheckDate, "222222222222222222222222222");
        if (timeToCheckDate === specificDate) {
            return timeToCheck.isSameOrBefore(twoHoursLater, 'minute');
        }

        // Disable times before or equal to two hours from the current time
        return false
    };


    //1930 > 2030
    const blockInvalidChar = (e) => {
        // Allow backspace
        if (e.key === "Backspace") {
            return;
        }
        // Block alphabets and specific characters
        if (!/^\d$/.test(e.key) || ["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (selectedServices.length > 0) {
            setValue('serviceIds', selectedServices.map((service) => service.id));
            trigger('serviceIds');
        }
    }, [selectedServices, trigger]);

    useEffect(() => {
        if (watchDate) {
            clearErrors('time'); // Clear the time error when the date changes
        }
    }, [watchDate, clearErrors]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsopenDropdown(!openDropdown);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* max-w-3xl to lg when no professionals div is visible */}
                <div className={`relative bg-white p-2 rounded-xl  w-full ${providers ? "max-w-3xl" : "max-w-lg"}  mx-8 ounded-2xl shadow-lg`}>
                    <button
                        type='button'
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        &#x2715;
                    </button>

                    <div className='flex overflow-y-auto max-h-[500px] md:max-h-full flex-wrap md:flex-nowrap'>

                        <form onSubmit={handleSubmit(onSave, (errors) => console.log('Errors:', errors))} className={`h-full ${providers ? "md:border-r-2" : "w-full"}`}>

                            <div className="px-3 pt-3 pb-3 shadow-sm">
                                <h2 class="md:text-xl text-black text-left font-semibold">Request Details</h2>
                                {
                                    !requestPublished && (
                                        <p class="text-gray-600 text-left text-xs md:text-sm">
                                            Please fill out the form to book our best services on the board.
                                        </p>
                                    )
                                }
                            </div>

                            <div className={`${!requestPublished ? "" : "hidden"}`}>
                                <div className="p-3 overflow-y-auto h-[58vh]">

                                    <div className="space-y-2">
                                        <div className='text-left'>
                                            <div className='flex justify-between'>
                                                <label
                                                    htmlFor="services"
                                                    className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                                                >
                                                    Service
                                                </label>
                                                <p class="text-sm text-black text-left">
                                                    Total Amount: <span class="mainbluetext font-bold">${totalAmount}</span>
                                                </p>
                                            </div>
                                            <div onClick={toggleDropdown} class="w-full flex justify-between text-black cursor-pointer inputshadow GrayBorder outline-none rounded-md p-2.5 focus:outline-none">
                                                {selectedServices.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedServices.map((service, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center mainblue text-white rounded-lg font-semibold pl-3 pr-1 py-1 text-sm"
                                                            >
                                                                <span>{service.name}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleServiceRemove(service.id);
                                                                    }}
                                                                    className="ml-2 mainbluetext bg-white w-5 h-[18px] flex justify-center items-center rounded-md"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className='text-left textgray flex justify-start'>Select services</span>
                                                )}

                                                <Image src="/assets/blueDropdown.svg" width="10" height="10" />

                                            </div>
                                            {openDropdown && (
                                                <div ref={dropdownRef} className="absolute z-30 text-black text-left w-[90%] h-56 overflow-y-auto professionals bg-white rounded-lg shadow-lg">
                                                    {serviceList?.length > 0 ?
                                                        serviceList?.map((service, index) => (
                                                            <div className="p-4" key={index}>
                                                                <h3 className="text-xl font-normal pb-2 border-b">  {service?.name}</h3>
                                                                <ul>

                                                                    {
                                                                        service?.services?.length > 0 && service?.services?.map((val, index) =>
                                                                            <li key={index} onClick={() => {
                                                                                handleServiceSelect({ id: val?.id, name: val?.name, price: val.price });
                                                                                setIsopenDropdown(false);
                                                                            }}
                                                                                className=" py-3 flex justify-between border-b cursor-pointer maingray text-base">
                                                                                <div>
                                                                                    <span className="w-3 h-3 rounded-full maingray mr-3">●</span>
                                                                                    {val?.name}
                                                                                </div>
                                                                                <Image
                                                                                    src="/assets/lastsearcharrow.svg"
                                                                                    alt="Search Icon"
                                                                                    height="10"
                                                                                    width="10"
                                                                                />
                                                                            </li>)
                                                                    }

                                                                </ul>
                                                                {service?.subCategories?.length > 0 && service?.subCategories?.map((val, index) => <div key={index} className="px-3">
                                                                    <h3 className="text-base font-normal py-3 border-b">  {val?.name}</h3>
                                                                    <ul>

                                                                        {
                                                                            val?.services?.length > 0 && val?.services?.map((val, index) =>
                                                                                <li key={index} onClick={() => { handleServiceSelect({ id: val?.id, name: val?.name, price: val.price }); setIsopenDropdown(false) }} className=" py-3 flex justify-between border-b cursor-pointer maingray text-base">
                                                                                    <div>
                                                                                        <span className="w-3 h-3 rounded-full maingray mr-3">●</span>
                                                                                        {val?.name}
                                                                                    </div>
                                                                                    <Image
                                                                                        src="/assets/lastsearcharrow.svg"
                                                                                        alt="Search Icon"
                                                                                        height="10"
                                                                                        width="10"
                                                                                    />
                                                                                </li>)
                                                                        }

                                                                    </ul>
                                                                </div>)}
                                                            </div>
                                                        )) : <div className="pt-4 mx-4">No Service Found</div>}
                                                </div>
                                            )}
                                            {errors.serviceIds && <Error error={errors.serviceIds?.message} />}
                                        </div>

                                        <div className="text-left">
                                            <label
                                                htmlFor="title"
                                                className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                                            >
                                                Job Title
                                            </label>
                                            <input
                                                id="title"
                                                type="text"
                                                placeholder="Enter Job title"
                                                {...register("title")}
                                                class="w-full GrayBorder text-black outline-none rounded-md p-2 focus:outline-none "
                                            />
                                            {errors.title && <Error error={errors.title?.message} />}
                                        </div>

                                        <div className="text-left">
                                            <label
                                                htmlFor="details"
                                                className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                                            >
                                                Details
                                            </label>
                                            <textarea
                                                {...register("details")}
                                                name="details"
                                                placeholder="Enter service details"
                                                class="w-full GrayBorder outline-none text-black -mb-2 rounded-md p-2 focus:outline-none"
                                            ></textarea>
                                            {errors.details && <Error error={errors.details?.message} />}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="budget"
                                                className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                                            >
                                                Desired budget (Optional)
                                            </label>
                                            <div class="flex items-center gap-2">
                                                <div class="relative flex-1">
                                                    <span class="absolute left-2 top-1/2 transform -translate-y-1/2 mainbluetext">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="29"
                                                        name="budget"
                                                        id="budget"
                                                        onWheel={handleWheel}
                                                        onKeyDown={blockInvalidChar}
                                                        min={1}
                                                        {...register("budget")}
                                                        class="pl-6 pr-2 py-2 outline-none w-full GrayBorder text-black rounded-md focus:outline-none "
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className='text-left'>
                                            <label
                                                htmlFor="requestType"
                                                className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                                            >
                                                Service Type
                                            </label>
                                            <div class="flex items-center gap-2 ml-1 my-2">
                                                <div class="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="door_step"
                                                        name="requestType"
                                                        value="door_step"
                                                        {...register("requestType")}
                                                        onChange={() => setRequestType("door_step")}
                                                        class="mr-2"
                                                    />
                                                    <label htmlFor="door_step" className="text-sm text-gray-700">My location</label>
                                                </div>
                                                <div class="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="walkin"
                                                        name="requestType"
                                                        value="walkin"
                                                        {...register("requestType")}
                                                        onChange={() => setRequestType("walkin")}
                                                        class="mr-2"
                                                    />
                                                    <label htmlFor="walkin" className="text-sm text-gray-700">Professional location</label>
                                                </div>
                                            </div>
                                            {errors.requestType && <Error error={errors.requestType?.message} />}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="Service"
                                                className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                                            >
                                                Customer Place
                                            </label>
                                            <div className="relative text-left">
                                                <PlacesAutocomplete
                                                    value={address || ""}
                                                    onChange={autoCompleteHandleChange}
                                                    onSelect={autoCompleteHandleSelect}
                                                >
                                                    {({
                                                        getInputProps,
                                                        suggestions,
                                                        getSuggestionItemProps,
                                                        loading,
                                                    }) => (
                                                        <div className="relative  rounded-xl">
                                                            <input
                                                                {...getInputProps({
                                                                    placeholder: "Enter Service place address",
                                                                    className:
                                                                        "location-search-input customform-control countrytags_",
                                                                })}
                                                                className="block pinkshadow w-full GrayBorder pl-3 text-sm font-medium py-2.5 text-black rounded-md placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-500 outline-none sm:text-sm"
                                                                // disabled={requestType === "walkin"}
                                                            />
                                                            <div className="autocomplete-dropdown-container globalRequest shadow-xl">
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
                                                                            color: "black"
                                                                        }
                                                                        : {
                                                                            backgroundColor: "#ffffff",
                                                                            cursor: "pointer",
                                                                            color: "black"
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
                                                {/* {addresserror && <Error error={addresserror} />} */}
                                                {errors.address && <Error error={errors.address?.message} />}

                                            </div>
                                        </div>

                                        <div class="grid md:grid-cols-2 gap-4">
                                            <div className="text-left text-black">
                                                <label
                                                    htmlFor="date"
                                                    className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                                                >
                                                    Date
                                                </label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="date" // Change this to "date" if you're updating the date field
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <DatePicker
                                                                    {...field}
                                                                    format="DD/MM/YYYY"
                                                                    className="outline-none pinkshadow bg-white"
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...register("date")}
                                                                            className="newOne"
                                                                            {...params}
                                                                        />
                                                                    )}
                                                                    sx={{
                                                                        width: "100%",
                                                                        background: "white",
                                                                        borderColor: "transparent !important",
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            border: "2px solid #919EAB26 !important",
                                                                            borderRadius: "6px",
                                                                        },
                                                                        "& .MuiInputBase-input ": {
                                                                            height: "0.7rem !important",
                                                                        },
                                                                    }}
                                                                    minDate={minDate}

                                                                />
                                                            </>
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                                {errors.date && <Error error={errors.date?.message} />}
                                            </div>

                                            <div className="text-left text-black">
                                                <label
                                                    htmlFor="time"
                                                    className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                                                >
                                                    Time
                                                </label>
                                                <div className="relative">
                                                    {/* <input
                                                        id="time"
                                                        type="time"
                                                        onChange={(e) => onTimeChange(e)}
                                                        class="flex-1 w-full GrayBorder outline-none rounded-md p-2 focus:outline-none "
                                                    />
                                                     <span class="custom-time-input"></span> */}
                                                    {/* MuiInputBase */}
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            // placeholder="sdd"
                                                            onChange={(e) => onTimeChange(e)}
                                                            shouldDisableTime={shouldDisableTime}
                                                            // disableFuture={true}
                                                            // disablePast={true}
                                                            ampm={false}
                                                            className="flex-1 w-full GrayBorder outline-none rounded-md p-2 focus:outline-none "
                                                            disabled={!watchDate}
                                                            sx={{
                                                                width: "100%",
                                                                background: "white",
                                                                borderColor: "transparent !important",
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    border: "2px solid #919EAB26 !important",
                                                                    borderRadius: "6px",
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    height: "0.7rem !important",
                                                                },
                                                            }}

                                                        />
                                                    </LocalizationProvider>

                                                </div>

                                                {errors.time && <Error error={errors.time?.message} />}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-xs text-left maxmid:text-sm pl-1 mb-1 font-normal text-gray-700"
                                            >
                                                Attach Photos or Videos (Optional)
                                            </label>


                                            {
                                                Loading ?
                                                    <div
                                                        className="relative flex servicesShadow justify-center items-center w-28 h-28 bg-white rounded-xl p-2">
                                                        < PuffLoader
                                                            color="#4de527"
                                                            loading
                                                            size={35}
                                                            speedMultiplier={3}
                                                        />
                                                    </div>
                                                    :
                                                    <div className={`flex flex-wrap sm:flex-nowrap ${previews.length > 0 ? "gap-3" : ""}`}>
                                                        {/* Preview Section */}

                                                        <div className="flex flex-wrap sm:flex-nowrap gap-4">
                                                            {previews.map((file, index) => (
                                                                <div key={index} className="relative flex flex-col items-center">
                                                                    {file.type.startsWith("image/") ? (
                                                                        <img
                                                                            src={file.url}
                                                                            alt="Preview"
                                                                            className="w-28 h-28 object-cover rounded-lg"
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            src={file.url}
                                                                            controls
                                                                            className="w-28 h-28 object-cover rounded-lg"
                                                                        />
                                                                    )}
                                                                    <Image
                                                                        onClick={() => handleRemoveFile(index)}
                                                                        src="/assets/redcross.svg"
                                                                        width="24"
                                                                        height="24"
                                                                        alt="Remove Icon"
                                                                        className="absolute -top-1 -right-2 cursor-pointer"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>


                                                        {
                                                            previews.length !== 3 && (
                                                                <label className={`flex ${previews.length > 0 ? "py-2" : "w-full py-6"} servicesShadow bg-white cursor-pointer flex-col justify-center items-center px-6 border border-dashed border-[#8DB7DD] rounded-xl`}>
                                                                    <Image
                                                                        width="50"
                                                                        height="50"
                                                                        src="/assets/uploaddocs.svg"
                                                                        alt="Experience Certificate Icon"
                                                                    />
                                                                    <p className="text-xs maingray text-center">
                                                                        Upload Photos and Videos files.
                                                                    </p>
                                                                    <input
                                                                        type="file"
                                                                        style={{ display: "none" }}
                                                                        accept=".jpg,.png,.jpeg,.mp4,.mov,.avi"
                                                                        multiple
                                                                        onChange={handleFileChange}
                                                                    />
                                                                </label>
                                                            )
                                                        }
                                                    </div>
                                            }
                                            {errorMessage && <p className="text-red-500  mt-1 text-left text-xs">{errorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${requestPublished ? "" : "hidden"} bg-white md:p-6 mt-3 rounded-lg successfullBox  lg:mx-5`}>
                                <div class="flex justify-center mb-4">
                                    <Image src="/assets/greenTick.svg" width="76" height="76" />
                                </div>

                                <h2 class="text-center md:text-xl font-semibold text-gray-800 mb-4">Your Request has been published <br /> Successfully for</h2>

                                <div class="border border-gray-300 rounded-lg p-4 my-3">
                                    <div class="flex justify-between mb-2">
                                        <div className='mr-4'>
                                            <p class="text-gray-600 text-left text-sm ">Service</p>
                                            <p class="font-semibold text-[17px] text-left text-black">
                                                {RequestData?.request_services && RequestData.request_services.map((service) => service.services.name).join(', ')}
                                            </p>

                                        </div>

                                    </div>

                                    <div class="flex justify-between mb-2">
                                        <div>
                                            <p class="text-gray-600 text-left text-sm ">Date</p>
                                            <p class="font-medium text-[16px]  text-black">{moment(RequestData?.date).format('MMMM D, YYYY')}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-gray-600 text-left text-sm ">Time</p>
                                            <p class="font-medium  text-sm  text-black">{new Date(`1970-01-01T${RequestData?.time}`).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}</p>
                                        </div>
                                    </div>

                                    <div class="flex justify-between mb-2">
                                        <div>
                                            <p class="text-gray-600 text-left text-sm ">Service Place</p>
                                            <p class="font-normal text-left text-sm  text-black md:w-[16rem]">{RequestData?.address || 'N/A'}</p>
                                        </div>
                                        {
                                            RequestData?.budget && (
                                                <div class="text-right">
                                                    <p class="text-gray-600 text-sm">Budget</p>
                                                    <p class="font-semibold text-xl  mainbluetext">${RequestData?.budget}</p>
                                                </div>
                                            )
                                        }
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3  justify-center items-center p-1 ml-2 my-2">
                                <button type='submit' disabled={requestPublished || buttonLoading} className={`py-2 ${requestPublished ? "bg-[#8DC63F] flex gap-2" : "mainblue"} text-sm  text-white font-semibold rounded-md px-3 transition-colors`}>
                                    {
                                        requestPublished && (
                                            <Image
                                                src='/assets/checklist.svg'
                                                width="21"
                                                height="21"
                                                className="rounded-lg"
                                                alt="suggested"
                                            />
                                        )
                                    }
                                    {requestPublished ? "Request Published" : "Publish on Job Portal"}
                                </button>
                                <button type='button' onClick={openRequests} disabled={!requestPublished || providers} className={`py-1.5 text-sm bg-white ${!requestPublished ? "text-[#b0d4f0] border border-[#b0d4f0]" : "mainbluetext requestborder"}  rounded-md px-3 transition-colors`}>
                                    Send Request to Professionals
                                </button>
                            </div>
                        </form>
                        {
                            providers && (
                                <div className='w-full md:w-[21rem]'>
                                    <div className='pl-2'>
                                        <div className='flex justify-between mr-5'>
                                            <h3 className='text-black text-xl text-left py-3 font-semibold'>Suggested Professionals</h3>
                                            <button onClick={() => setproviders(false)}>
                                                <Image
                                                    src='/assets/ArrowDownCircle.svg'
                                                    width="30"
                                                    height="30"
                                                    className="rounded-lg"
                                                    alt="suggested"
                                                />
                                            </button>
                                        </div>
                                        {
                                            suggestedList.length > 0 ?
                                                <ul className="urgentprofessionals overflow-y-auto mt-3">
                                                    {suggestedList.map((professional, index) => (
                                                        <li
                                                            key={index}
                                                            // onClick={() => handleNavigation(professional)}
                                                            // key={professional.id}
                                                            className='bg-white mb-4 p-2 rounded-lg blueShadow mx-3'
                                                        >
                                                            <div className='flex flex-wrap justify-center medmob:flex-nowrap medmob:justify-between  items-center  gap-3 '>
                                                                <div className="md:ml-4 mr-3 md:mr-0 ">
                                                                    <div className="flex flex-col">
                                                                        <h3 className="text-base md:text-lg text-black text-left font-semibold">
                                                                            {professional?.user_details?.first_name} {professional?.user_details?.last_name}
                                                                        </h3>
                                                                        <div className="flex items-center">
                                                                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                                            <span className="ml-1 text-xs md:text-sm text-gray-800">
                                                                                {/* {professional.user_details.status === 'active' ? 'Online' : 'Offline'} */}
                                                                                Online
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap justify-between text-xs md:text-sm text-gray-600">
                                                                        <div className='flex gap-1 items-center pt-2'>
                                                                            <img src="/assets/locationSign.svg" alt="" width="12" height="12" />
                                                                            <span className="text-xs  mainbluetext font-semibold">
                                                                                {(professional.user_details.distance).toFixed(1)} Km{' '}
                                                                                <span className="text-[#919EAB] font-medium m">away</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-left md:text-sm mt-2 text-[#919EAB]">
                                                                        Profession:
                                                                        <span className="text-black ml-1">
                                                                            {professional.professionalUserServices.length > 0
                                                                                ?
                                                                                [...new Set(professional.professionalUserServices?.map(service => service.categories?.name))].join(', ')
                                                                                : 'N/A'}
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                <div className="relative">
                                                                    <Image
                                                                        // src='/assets/professional1.png'
                                                                        src={professional?.user_details?.profile_photo ? professional?.user_details?.profile_photo : '/assets/professional1.png'}
                                                                        // alt={`${professional.user_details.first_name} ${professional.user_details.last_name}`}
                                                                        width="600"
                                                                        height="600"
                                                                        className="rounded-lg w-[109px] sm:w-[175px] lg:w-[173px] h-[109px]"
                                                                    />
                                                                    <div class="absolute bottom-2 medmob:bottom-2 lmob:bottom-2 right-2 px-1 pr-2 bg-white rounded-2xl shadow">
                                                                        <span className="text-yellow-500">★</span>
                                                                        <span className="ml-1 text-sm text-gray-800">4.5</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button type="button" disabled={requestedProfessionals.includes(professional?.id)} onClick={() => onSave(formData, professional?.id, "private_request")} className={`py-1 w-full mt-2 ${requestedProfessionals.includes(professional?.id) ? "text-[#8DC63F] flex items-center justify-center gap-2 border border-[#8DC63F]" : "mainbluetext requestborder"} bg-white   rounded-md px-3 transition-colors`}>
                                                                {
                                                                    requestedProfessionals.includes(professional?.id) && (
                                                                        <Image
                                                                            src='/assets/greencheck.svg'
                                                                            width="10"
                                                                            height="10"
                                                                        />
                                                                    )
                                                                }
                                                                {requestedProfessionals.includes(professional?.id) ? "Request Sent" : "Send Request"}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                                :
                                                <div className='text-black flex justify-center items-center h-[28rem] font-semibold'>
                                                    No Professionals found
                                                </div>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Request;